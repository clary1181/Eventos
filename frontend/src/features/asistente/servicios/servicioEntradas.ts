import { collection, doc, getDocs, onSnapshot, query, runTransaction, serverTimestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { MAX_ENTRADAS_POR_EVENTO } from '../tipos';
import { avisar } from '@/features/notificaciones/servicios/servicioNotificaciones';

export interface ResultadoCompra {
  ordenId: string;
  entradas: string[];
  total: number;
}

function generarToken(): string {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let t = '';
  for (let i = 0; i < 24; i++) t += letras[Math.floor(Math.random() * letras.length)];
  return t;
}

export async function comprarEntradas(uid: string, eventoId: string, cantidad: number): Promise<ResultadoCompra> {
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_ENTRADAS_POR_EVENTO) {
    throw new Error(`Elige entre 1 y ${MAX_ENTRADAS_POR_EVENTO} entradas.`);
  }

  const previas = await getDocs(query(collection(db, 'entradas'), where('asistenteId', '==', uid), where('eventoId', '==', eventoId)));
  const usados = new Set(previas.docs.map((d) => Number(d.data().numero)));
  const libres = [1, 2, 3, 4, 5].filter((n) => !usados.has(n));
  if (cantidad > libres.length) {
    throw new Error(`El máximo es ${MAX_ENTRADAS_POR_EVENTO} entradas por persona en cada evento (ya tienes ${usados.size}).`);
  }
  const numeros = libres.slice(0, cantidad);

  const refEvento = doc(db, 'eventos', eventoId);
  const ordenId = `orden_${Date.now()}`;

  let titulo = 'tu evento';
  let organizadorId = '';
  const resultado = await runTransaction(db, async (tx) => {
    const snap = await tx.get(refEvento);
    if (!snap.exists() || snap.data().estado !== 'aprobado') throw new Error('Este evento ya no está disponible.');
    const e = snap.data();
    titulo = String(e.titulo ?? titulo);
    organizadorId = String(e.organizadorId ?? '');

    const fin = typeof e.fechaFin?.toMillis === 'function' ? e.fechaFin.toMillis() : 0;
    if (Date.now() >= fin) throw new Error('Este evento ya terminó.');

    const vendidas = Number(e.vendidas ?? 0);
    const disponibles = Number(e.capacidad ?? 0) - vendidas;
    if (disponibles <= 0) throw new Error('El cupo de este evento está agotado.');
    if (cantidad > disponibles) throw new Error(`Solo quedan ${disponibles} ${disponibles === 1 ? 'entrada' : 'entradas'} disponibles.`);

    const precio = Number(e.precio ?? 0);
    tx.update(refEvento, { vendidas: vendidas + cantidad });

    const ids: string[] = [];
    for (const numero of numeros) {
      const id = `${uid}_${eventoId}_${numero}`;
      tx.set(doc(db, 'entradas', id), {
        eventoId,
        asistenteId: uid,
        organizadorId: e.organizadorId,
        ordenId,
        numero,
        precio,
        pago: 'simulado_exitoso',
        token: generarToken(),
        usada: false,
        eventoTitulo: e.titulo,
        eventoFechaInicio: e.fechaInicio,
        lugar: e.lugar,
        imagenUrl: e.imagenUrl,
        creadaEn: serverTimestamp(),
      });
      ids.push(id);
    }
    return { ordenId, entradas: ids, total: precio * cantidad };
  });

  if (organizadorId) {
    await avisar({
      destinatarioId: organizadorId,
      tipo: 'entradas_compradas',
      titulo: 'Nueva compra de entradas',
      mensaje: `Compraron ${cantidad} ${cantidad === 1 ? 'entrada' : 'entradas'} para "${titulo}".`,
      ruta: `/organizador/estadisticas-evento?id=${eventoId}`,
      eventoId,
    });
  }
  return resultado;
}

export function escucharCantidadEntradas(uid: string, eventoId: string, alCambiar: (n: number) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'entradas'), where('asistenteId', '==', uid), where('eventoId', '==', eventoId)),
    (s) => alCambiar(s.size),
    alError
  );
}
