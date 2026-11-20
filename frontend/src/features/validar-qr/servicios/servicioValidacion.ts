import { collection, doc, getDoc, onSnapshot, query, runTransaction, serverTimestamp, Timestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { ventanaQR, type EntradaAsistente } from '@/features/asistente/utilidades/entradas';
import { formatearFechaHora } from '@/features/asistente/utilidades/formato';
import type { EventoValidable, ResultadoValidacion } from '../tipos';
import { leerPayloadQR } from '../utilidades/qr';

// Eventos aprobados del organizador cuya ventana de acceso aún no termina. Filtro y orden en la app (sin índices).
export function escucharEventosValidables(uid: string, alCambiar: (l: EventoValidable[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'eventos'), where('organizadorId', '==', uid)),
    (s) => {
      const ahora = Date.now();
      const lista = s.docs
        .filter((d) => d.data().estado === 'aprobado')
        .map((d): EventoValidable => {
          const x = d.data();
          return {
            id: d.id,
            titulo: String(x.titulo ?? ''),
            lugar: String(x.lugar ?? ''),
            imagenUrl: String(x.imagenUrl ?? ''),
            fechaInicio: x.fechaInicio instanceof Timestamp ? x.fechaInicio.toDate() : new Date(0),
            vendidas: Number(x.vendidas ?? 0),
            capacidad: Number(x.capacidad ?? 0),
          };
        })
        .filter((e) => ventanaQR(e.fechaInicio).hasta.getTime() > ahora)
        .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
      alCambiar(lista);
    },
    alError
  );
}

class Usada extends Error {}

// Valida el texto leído del QR contra el evento que el organizador atiende y marca la entrada como usada
export async function validarEntradaQR(texto: string, eventoActivoId: string, organizadorUid: string): Promise<ResultadoValidacion> {
  const datos = leerPayloadQR(texto);
  if (!datos) return { tipo: 'invalida', titulo: 'Entrada no válida', detalle: 'Este código no pertenece a MR-Eventos.' };
  if (datos.idEvento !== eventoActivoId) {
    return { tipo: 'otro_evento', titulo: 'Entrada de otro evento', detalle: 'Esta entrada no corresponde al evento que estás validando.' };
  }

  const refEntrada = doc(db, 'entradas', datos.idEntrada);
  let entrada: EntradaAsistente;
  try {
    const snap = await getDoc(refEntrada);
    if (!snap.exists()) return { tipo: 'invalida', titulo: 'Entrada no válida', detalle: 'No se encontró esta entrada.' };
    const d = snap.data();
    entrada = {
      id: snap.id,
      eventoId: String(d.eventoId ?? ''),
      organizadorId: String(d.organizadorId ?? ''),
      ordenId: String(d.ordenId ?? ''),
      numero: Number(d.numero ?? 1),
      precio: Number(d.precio ?? 0),
      token: String(d.token ?? ''),
      usada: d.usada === true,
      usadaEn: d.usadaEn instanceof Timestamp ? d.usadaEn.toDate() : null,
      eventoTitulo: String(d.eventoTitulo ?? ''),
      eventoFechaInicio: d.eventoFechaInicio instanceof Timestamp ? d.eventoFechaInicio.toDate() : new Date(0),
      lugar: String(d.lugar ?? ''),
      imagenUrl: String(d.imagenUrl ?? ''),
      creadaEn: d.creadaEn instanceof Timestamp ? d.creadaEn.toDate() : new Date(0),
    };
  } catch {
    // Las reglas no dejan leer entradas ajenas ni inexistentes
    return { tipo: 'invalida', titulo: 'No se pudo leer la entrada', detalle: 'La entrada no existe o no es de uno de tus eventos.' };
  }

  if (entrada.token !== datos.token || entrada.eventoId !== eventoActivoId) {
    return { tipo: 'invalida', titulo: 'Entrada no válida', detalle: 'El código de seguridad no coincide.', entrada };
  }
  if (entrada.usada) {
    return {
      tipo: 'usada', titulo: 'Entrada ya utilizada',
      detalle: entrada.usadaEn ? `Se usó el ${formatearFechaHora(entrada.usadaEn)}.` : 'Esta entrada ya fue escaneada.', entrada,
    };
  }

  // Manda la fecha vigente del evento (pudo cambiar después de la venta)
  let inicio = entrada.eventoFechaInicio;
  try {
    const ev = (await getDoc(doc(db, 'eventos', eventoActivoId))).data();
    if (ev?.fechaInicio instanceof Timestamp) inicio = ev.fechaInicio.toDate();
  } catch { /* se usa la fecha guardada en la entrada */ }

  const ventana = ventanaQR(inicio);
  const ahora = Date.now();
  if (ahora < ventana.desde.getTime()) {
    return { tipo: 'temprano', titulo: 'Aún no es hora', detalle: `El acceso se habilita el ${formatearFechaHora(ventana.desde)}.`, entrada };
  }
  if (ahora > ventana.hasta.getTime()) {
    return { tipo: 'expirada', titulo: 'Entrada expirada', detalle: `El acceso terminó el ${formatearFechaHora(ventana.hasta)}.`, entrada };
  }

  try {
    await runTransaction(db, async (tx) => {
      const s = await tx.get(refEntrada);
      if (s.data()?.usada) throw new Usada();
      tx.update(refEntrada, { usada: true, usadaEn: serverTimestamp(), validadaPor: organizadorUid });
    });
  } catch (e) {
    if (e instanceof Usada) return { tipo: 'usada', titulo: 'Entrada ya utilizada', detalle: 'Esta entrada acaba de ser escaneada.', entrada };
    console.error('Error al registrar el acceso:', e);
    return { tipo: 'invalida', titulo: 'No se pudo registrar el acceso', detalle: 'Revisa tu conexión e inténtalo de nuevo.', entrada };
  }

  return { tipo: 'ok', titulo: 'Acceso concedido', detalle: `${entrada.eventoTitulo} · Entrada ${entrada.numero}`, entrada };
}
