import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, Timestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { avisarAdministradores } from '@/features/notificaciones/servicios/servicioNotificaciones';

export type MotivoReporte = 'informacion_falsa' | 'spam' | 'fraude' | 'contenido_inapropiado' | 'otro';

export const MOTIVOS_REPORTE: { id: MotivoReporte; titulo: string }[] = [
  { id: 'informacion_falsa', titulo: 'Información falsa' },
  { id: 'spam', titulo: 'Spam' },
  { id: 'fraude', titulo: 'Posible fraude' },
  { id: 'contenido_inapropiado', titulo: 'Contenido inapropiado' },
  { id: 'otro', titulo: 'Otro' },
];

export interface ReporteEnviado {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  motivo: MotivoReporte;
  descripcion: string;
  estado: string;
  creadoEn: Date;
}

export function escucharMisReportes(uid: string, alCambiar: (l: ReporteEnviado[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'reportes'), where('reportanteId', '==', uid)),
    (s) =>
      alCambiar(
        s.docs
          .map((d): ReporteEnviado => {
            const x = d.data();
            return {
              id: d.id,
              eventoId: String(x.eventoId ?? ''),
              eventoTitulo: String(x.eventoTitulo ?? ''),
              motivo: x.motivo as MotivoReporte,
              descripcion: String(x.descripcion ?? ''),
              estado: String(x.estado ?? ''),
              creadoEn: x.creadoEn instanceof Timestamp ? x.creadoEn.toDate() : new Date(),
            };
          })
          .sort((a, b) => b.creadoEn.getTime() - a.creadoEn.getTime())
      ),
    alError
  );
}

// ID {uid}_{eventoId}: un solo reporte por persona y evento (lo exigen las reglas)
export async function enviarReporte(uid: string, evento: { id: string; organizadorId: string; titulo: string }, motivo: MotivoReporte, descripcion: string): Promise<void> {
  await setDoc(doc(db, 'reportes', `${uid}_${evento.id}`), {
    eventoId: evento.id,
    organizadorId: evento.organizadorId,
    reportanteId: uid,
    eventoTitulo: evento.titulo,
    motivo,
    descripcion: descripcion.trim(),
    estado: 'pendiente_moderacion',
    creadoEn: serverTimestamp(),
  });
  await avisarAdministradores({
    tipo: 'reporte_nuevo',
    titulo: 'Nuevo reporte',
    mensaje: `Reportaron "${evento.titulo}" por ${MOTIVOS_REPORTE.find((m) => m.id === motivo)?.titulo.toLowerCase() ?? 'otro motivo'}.`,
    ruta: '/administrador/reportes',
    eventoId: evento.id,
  });
}
