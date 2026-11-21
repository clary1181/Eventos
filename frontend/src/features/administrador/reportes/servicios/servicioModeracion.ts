import { collection, doc, getDoc, onSnapshot, serverTimestamp, Timestamp, updateDoc, writeBatch, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { AccionReporte, CalificacionAdmin, ContextoReporte, ReporteAdmin } from '../tipos';

const fecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);
const tiempo = (d: Date | null) => d?.getTime() ?? Number.MAX_SAFE_INTEGER; // serverTimestamp pendiente = más nuevo

export function escucharReportes(alCambiar: (l: ReporteAdmin[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'reportes'),
    (s) =>
      alCambiar(
        s.docs
          .map((d): ReporteAdmin => {
            const x = d.data();
            return {
              id: d.id,
              eventoId: String(x.eventoId ?? ''),
              eventoTitulo: String(x.eventoTitulo ?? ''),
              organizadorId: String(x.organizadorId ?? ''),
              reportanteId: String(x.reportanteId ?? ''),
              motivo: x.motivo,
              descripcion: String(x.descripcion ?? ''),
              estado: x.estado,
              resolucion: String(x.resolucion ?? ''),
              creadoEn: fecha(x.creadoEn),
            };
          })
          .sort((a, b) => tiempo(b.creadoEn) - tiempo(a.creadoEn))
      ),
    alError
  );
}

export function escucharCalificacionesAdmin(alCambiar: (l: CalificacionAdmin[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'calificaciones'),
    (s) =>
      alCambiar(
        s.docs
          .map((d): CalificacionAdmin => {
            const x = d.data();
            return {
              id: d.id,
              eventoTitulo: String(x.eventoTitulo ?? ''),
              asistenteNombre: String(x.asistenteNombre ?? ''),
              estrellas: Number(x.estrellas ?? 0),
              comentario: String(x.comentario ?? ''),
              oculta: x.oculta === true,
              creadaEn: fecha(x.creadaEn),
            };
          })
          .sort((a, b) => tiempo(b.creadaEn) - tiempo(a.creadaEn))
      ),
    alError
  );
}

const nombreDe = async (uid: string) => {
  try {
    const d = (await getDoc(doc(db, 'usuarios', uid))).data();
    return d ? `${d.nombre ?? ''} ${d.apellidos ?? ''}`.trim() || 'Sin nombre' : 'Usuario eliminado';
  } catch {
    return 'No disponible';
  }
};

export async function obtenerContextoReporte(r: ReporteAdmin): Promise<ContextoReporte> {
  const [reportante, organizador] = await Promise.all([nombreDe(r.reportanteId), nombreDe(r.organizadorId)]);
  let estadoEvento = 'desconocido';
  try {
    const e = (await getDoc(doc(db, 'eventos', r.eventoId))).data();
    estadoEvento = e ? String(e.estado ?? 'desconocido') : 'eliminado';
  } catch { /* se deja "desconocido" */ }
  return { reportante, organizador, estadoEvento };
}

// Cierra el reporte; con "suspender" también retira el evento del catálogo (solo si está aprobado)
export async function resolverReporte(adminUid: string, r: ReporteAdmin, accion: AccionReporte, nota: string): Promise<void> {
  const lote = writeBatch(db);
  if (accion === 'suspender') {
    lote.update(doc(db, 'eventos', r.eventoId), { estado: 'suspendido', motivoRechazo: nota, actualizadoEn: serverTimestamp() });
  }
  // Reporte fundado: el organizador recibe una copia anónima (sin quién reportó) para poder responder
  if (accion !== 'desestimar') {
    lote.set(doc(collection(db, 'reportesOrganizador')), {
      eventoId: r.eventoId,
      eventoTitulo: r.eventoTitulo,
      organizadorId: r.organizadorId,
      motivo: r.motivo,
      descripcion: r.descripcion,
      resolucion: nota || 'Reporte atendido por el administrador',
      creadoEn: serverTimestamp(),
    });
  }
  lote.update(doc(db, 'reportes', r.id), {
    estado: accion === 'desestimar' ? 'desestimado' : 'resuelto',
    resolucion: nota || 'Sin infracción',
    resueltoPor: adminUid,
    resueltoEn: serverTimestamp(),
  });
  await lote.commit();
}

export const cambiarVisibilidadCalificacion = (id: string, oculta: boolean) => updateDoc(doc(db, 'calificaciones', id), { oculta });
