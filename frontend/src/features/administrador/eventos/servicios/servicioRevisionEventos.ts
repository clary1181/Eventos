import { collection, deleteField, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { EstadoEvento, EventoAdmin, PropuestaCambio } from '../tipos';
import { avisar, avisarVarios, compradoresDeEvento, seguidoresDe } from '@/features/notificaciones/servicios/servicioNotificaciones';

const aFecha = (v: unknown): Date | null =>
  v && typeof (v as { toDate?: unknown }).toDate === 'function' ? (v as { toDate: () => Date }).toDate() : null;

const aPropuesta = (v: unknown): PropuestaCambio | null => {
  if (!v || typeof v !== 'object') return null;
  const p = v as Record<string, unknown>;
  const r: PropuestaCambio = { solicitadoEn: aFecha(p.solicitadoEn) };
  const fi = aFecha(p.fechaInicio);
  const ff = aFecha(p.fechaFin);
  if (fi) r.fechaInicio = fi;
  if (ff) r.fechaFin = ff;
  if (typeof p.lugar === 'string') r.lugar = p.lugar;
  if (typeof p.direccion === 'string') r.direccion = p.direccion;
  if (typeof p.precio === 'number') r.precio = p.precio;
  if (typeof p.imagenUrl === 'string') r.imagenUrl = p.imagenUrl;
  if (typeof p.imagenPublicId === 'string') r.imagenPublicId = p.imagenPublicId;
  return r;
};

export function escucharEventos(alCambiar: (l: EventoAdmin[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'eventos'),
    (s) =>
      alCambiar(
        s.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            organizadorId: String(x.organizadorId ?? ''),
            organizadorNombre: String(x.organizadorNombre ?? ''),
            titulo: String(x.titulo ?? ''),
            descripcion: String(x.descripcion ?? ''),
            categoria: String(x.categoria ?? ''),
            fechaInicio: aFecha(x.fechaInicio),
            fechaFin: aFecha(x.fechaFin),
            lugar: String(x.lugar ?? ''),
            direccion: String(x.direccion ?? ''),
            precio: Number(x.precio ?? 0),
            capacidad: Number(x.capacidad ?? 0),
            vendidas: Number(x.vendidas ?? 0),
            imagenUrl: String(x.imagenUrl ?? ''),
            estado: x.estado as EstadoEvento,
            observaciones: String(x.observaciones ?? ''),
            motivoRechazo: String(x.motivoRechazo ?? ''),
            creadoEn: aFecha(x.creadoEn),
            actualizadoEn: aFecha(x.actualizadoEn),
            estadoCambio: (x.estadoCambio ?? 'ninguno') as EventoAdmin['estadoCambio'],
            observacionesCambio: String(x.observacionesCambio ?? ''),
            propuesta: aPropuesta(x.cambioPropuesto),
          };
        })
      ),
    alError
  );
}

export async function dictaminarEvento(
  id: string,
  estado: 'aprobado' | 'requiere_correccion' | 'rechazado',
  texto: string,
  evento: { organizadorId: string; titulo: string; organizadorNombre?: string }
): Promise<void> {
  const cambios: Record<string, unknown> = { estado, actualizadoEn: serverTimestamp() };
  if (estado === 'requiere_correccion') cambios.observaciones = texto.trim();
  if (estado === 'rechazado') cambios.motivoRechazo = texto.trim();
  await updateDoc(doc(db, 'eventos', id), cambios);

  const textos = {
    aprobado: { titulo: '¡Evento aprobado!', mensaje: `"${evento.titulo}" ya está publicado con la etiqueta de evento verificado.` },
    requiere_correccion: { titulo: 'Tu evento necesita correcciones', mensaje: `"${evento.titulo}": ${texto.trim()}` },
    rechazado: { titulo: 'Evento rechazado', mensaje: `"${evento.titulo}": ${texto.trim()}` },
  }[estado];
  await avisar({
    destinatarioId: evento.organizadorId,
    tipo: estado === 'aprobado' ? 'evento_aprobado' : estado === 'rechazado' ? 'evento_rechazado' : 'evento_correccion',
    ...textos,
    ruta: '/organizador/mis-eventos',
    eventoId: id,
  });

  if (estado === 'aprobado') {
    await avisarVarios(await seguidoresDe(evento.organizadorId), {
      tipo: 'organizador_nuevo_evento',
      titulo: `${evento.organizadorNombre || 'Un organizador que sigues'} publicó un evento`,
      mensaje: `Nuevo evento: "${evento.titulo}". ¡Échale un vistazo!`,
      ruta: `/asistente/evento/${id}`,
      eventoId: id,
    });
  }
}

export async function aprobarCambios(e: EventoAdmin): Promise<void> {
  const p = e.propuesta;
  if (!p) throw new Error('El evento no tiene cambios propuestos.');
  const cambios: Record<string, unknown> = { estadoCambio: 'ninguno', cambioPropuesto: deleteField(), actualizadoEn: serverTimestamp() };
  if (p.fechaInicio) cambios.fechaInicio = Timestamp.fromDate(p.fechaInicio);
  if (p.fechaFin) cambios.fechaFin = Timestamp.fromDate(p.fechaFin);
  if (p.lugar !== undefined) cambios.lugar = p.lugar;
  if (p.direccion !== undefined) cambios.direccion = p.direccion;
  if (p.precio !== undefined) cambios.precio = p.precio;
  if (p.imagenUrl !== undefined) cambios.imagenUrl = p.imagenUrl;
  if (p.imagenPublicId !== undefined) cambios.imagenPublicId = p.imagenPublicId;
  await updateDoc(doc(db, 'eventos', e.id), cambios);

  await avisar({
    destinatarioId: e.organizadorId,
    tipo: 'cambios_aprobados',
    titulo: 'Cambios aprobados',
    mensaje: `Los cambios de "${e.titulo}" ya están publicados.`,
    ruta: '/organizador/mis-eventos',
    eventoId: e.id,
  });

  const compradores = await compradoresDeEvento(e.id);
  await avisarVarios(compradores, {
    tipo: 'evento_actualizado',
    titulo: 'Un evento cambió',
    mensaje: `"${e.titulo}" actualizó ${[p.fechaInicio && 'la fecha', p.lugar !== undefined && 'el lugar', p.direccion !== undefined && 'la dirección', p.precio !== undefined && 'el precio', p.imagenUrl !== undefined && 'la foto'].filter(Boolean).join(', ')}. Revisa los detalles.`,
    ruta: `/asistente/evento/${e.id}`,
    eventoId: e.id,
  });
}

export async function rechazarCambios(id: string, motivo: string, evento: { organizadorId: string; titulo: string }): Promise<void> {
  await updateDoc(doc(db, 'eventos', id), { estadoCambio: 'requiere_correccion', observacionesCambio: motivo.trim(), actualizadoEn: serverTimestamp() });
  await avisar({
    destinatarioId: evento.organizadorId,
    tipo: 'cambios_rechazados',
    titulo: 'Cambios rechazados',
    mensaje: `"${evento.titulo}": ${motivo.trim()}`,
    ruta: '/organizador/mis-eventos',
    eventoId: id,
  });
}
