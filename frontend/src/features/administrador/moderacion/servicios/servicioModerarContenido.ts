import { collection, deleteField, doc, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { avisar, avisarVarios, compradoresDeEvento } from '@/features/notificaciones/servicios/servicioNotificaciones';

export interface EventoModerable {
  id: string;
  titulo: string;
  organizadorId: string;
  organizadorNombre: string;
  estado: 'aprobado' | 'suspendido';
  fechaInicio: Date | null;
  imagenUrl: string;
  vendidas: number;
  motivo: string; // motivo de la suspensión
}

const fecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);

// Eventos que están (o estuvieron) publicados: aprobados y suspendidos
export function escucharEventosModerables(alCambiar: (l: EventoModerable[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'eventos'), where('estado', 'in', ['aprobado', 'suspendido'])),
    (s) =>
      alCambiar(
        s.docs
          .map((d): EventoModerable => {
            const x = d.data();
            return {
              id: d.id,
              titulo: String(x.titulo ?? ''),
              organizadorId: String(x.organizadorId ?? ''),
              organizadorNombre: String(x.organizadorNombre ?? ''),
              estado: x.estado === 'suspendido' ? 'suspendido' : 'aprobado',
              fechaInicio: fecha(x.fechaInicio),
              imagenUrl: String(x.imagenUrl ?? ''),
              vendidas: Number(x.vendidas ?? 0),
              motivo: String(x.motivoRechazo ?? ''),
            };
          })
          .sort((a, b) => (b.fechaInicio?.getTime() ?? 0) - (a.fechaInicio?.getTime() ?? 0))
      ),
    alError
  );
}

export async function suspenderEvento(e: EventoModerable, motivo: string): Promise<void> {
  await updateDoc(doc(db, 'eventos', e.id), { estado: 'suspendido', motivoRechazo: motivo.trim(), actualizadoEn: serverTimestamp() });
  await avisar({
    destinatarioId: e.organizadorId,
    tipo: 'evento_suspendido',
    titulo: 'Tu evento fue suspendido',
    mensaje: `"${e.titulo}" se retiró del catálogo: ${motivo.trim()}`,
    ruta: '/organizador/mis-eventos',
    eventoId: e.id,
  });
  await avisarVarios(await compradoresDeEvento(e.id), {
    tipo: 'evento_suspendido',
    titulo: 'Evento suspendido',
    mensaje: `"${e.titulo}" fue suspendido por la plataforma.`,
    ruta: '/asistente/entradas',
    eventoId: e.id,
  });
}

export async function reactivarEvento(e: EventoModerable): Promise<void> {
  await updateDoc(doc(db, 'eventos', e.id), { estado: 'aprobado', actualizadoEn: serverTimestamp() });
  await avisar({
    destinatarioId: e.organizadorId,
    tipo: 'evento_reactivado',
    titulo: 'Tu evento fue reactivado',
    mensaje: `"${e.titulo}" volvió a mostrarse en el catálogo.`,
    ruta: '/organizador/mis-eventos',
    eventoId: e.id,
  });
}

// ---------- Organizadores y suspensión de cuenta ----------
export interface OrganizadorModeracion {
  uid: string;
  nombre: string;
  fotoUrl: string;
  suspensionHasta: Date | null;
  motivoSuspension: string;
}

export function escucharOrganizadores(alCambiar: (l: OrganizadorModeracion[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'usuarios'), where('rol', '==', 'organizador')),
    (s) =>
      alCambiar(
        s.docs.map((d): OrganizadorModeracion => {
          const x = d.data();
          return {
            uid: d.id,
            nombre: `${x.nombre ?? ''} ${x.apellidos ?? ''}`.trim() || 'Organizador',
            fotoUrl: String(x.fotoUrl ?? ''),
            suspensionHasta: fecha(x.suspensionHasta),
            motivoSuspension: String(x.motivoSuspension ?? ''),
          };
        })
      ),
    alError
  );
}

// Suspensión temporal: mientras dure no puede crear ni editar eventos (lo exigen las reglas)
export async function suspenderCuenta(adminUid: string, uid: string, dias: number, motivo: string): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), {
    suspensionHasta: Timestamp.fromDate(new Date(Date.now() + dias * 24 * 60 * 60 * 1000)),
    motivoSuspension: motivo.trim(),
    suspendidoPor: adminUid,
    suspendidoEn: serverTimestamp(),
  });
  await avisar({
    destinatarioId: uid,
    tipo: 'cuenta_suspendida',
    titulo: 'Tu cuenta fue suspendida',
    mensaje: `No podrás crear ni editar eventos durante ${dias} ${dias === 1 ? 'día' : 'días'}: ${motivo.trim()}`,
    ruta: '/organizador/inicio',
  });
}

export async function levantarSuspension(uid: string): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), {
    suspensionHasta: deleteField(),
    motivoSuspension: deleteField(),
    suspendidoPor: deleteField(),
    suspendidoEn: deleteField(),
  });
  await avisar({
    destinatarioId: uid,
    tipo: 'suspension_levantada',
    titulo: 'Suspensión levantada',
    mensaje: 'Ya puedes volver a crear y editar eventos.',
    ruta: '/organizador/inicio',
  });
}
