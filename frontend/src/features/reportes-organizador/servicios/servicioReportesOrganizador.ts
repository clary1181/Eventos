import { collection, doc, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { ReporteOrganizador } from '../tipos';

const fecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);

export function escucharReportesOrganizador(uid: string, alCambiar: (l: ReporteOrganizador[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'reportesOrganizador'), where('organizadorId', '==', uid)),
    (s) =>
      alCambiar(
        s.docs
          .map((d): ReporteOrganizador => {
            const x = d.data();
            return {
              id: d.id,
              eventoId: String(x.eventoId ?? ''),
              eventoTitulo: String(x.eventoTitulo ?? ''),
              motivo: String(x.motivo ?? 'otro'),
              descripcion: String(x.descripcion ?? ''),
              resolucion: String(x.resolucion ?? ''),
              creadoEn: fecha(x.creadoEn),
              respuesta: String(x.respuestaOrganizador ?? ''),
              respondidoEn: fecha(x.respondidoEn),
            };
          })
          .sort((a, b) => (b.creadoEn?.getTime() ?? 0) - (a.creadoEn?.getTime() ?? 0))
      ),
    alError
  );
}

// Una sola respuesta por reporte (lo exigen las reglas)
export const responderReporte = (id: string, texto: string) =>
  updateDoc(doc(db, 'reportesOrganizador', id), { respuestaOrganizador: texto.trim(), respondidoEn: serverTimestamp() });
