import { collection, doc, onSnapshot, query, Timestamp, where, type DocumentData, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { EntradaAsistente } from '../utilidades/entradas';

const aFecha = (v: unknown, respaldo: Date) => (v instanceof Timestamp ? v.toDate() : respaldo);

const aEntrada = (id: string, d: DocumentData): EntradaAsistente => ({
  id,
  eventoId: String(d.eventoId ?? ''),
  organizadorId: String(d.organizadorId ?? ''),
  ordenId: String(d.ordenId ?? ''),
  numero: Number(d.numero ?? 1),
  precio: Number(d.precio ?? 0),
  token: String(d.token ?? ''),
  usada: d.usada === true,
  usadaEn: d.usadaEn instanceof Timestamp ? d.usadaEn.toDate() : null,
  eventoTitulo: String(d.eventoTitulo ?? ''),
  eventoFechaInicio: aFecha(d.eventoFechaInicio, new Date(0)),
  lugar: String(d.lugar ?? ''),
  imagenUrl: String(d.imagenUrl ?? ''),
  creadaEn: aFecha(d.creadaEn, new Date()),
});

export function escucharMisEntradas(uid: string, alCambiar: (l: EntradaAsistente[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'entradas'), where('asistenteId', '==', uid)),
    (s) => alCambiar(s.docs.map((d) => aEntrada(d.id, d.data()))),
    alError
  );
}

export function escucharEntrada(id: string, alCambiar: (e: EntradaAsistente | null) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(doc(db, 'entradas', id), (s) => alCambiar(s.exists() ? aEntrada(s.id, s.data()) : null), alError);
}
