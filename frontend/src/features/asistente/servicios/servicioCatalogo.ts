import { collection, doc, onSnapshot, query, Timestamp, where, type DocumentData, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { EventoPublico } from '../tipos';

const aFecha = (v: unknown): Date => (v instanceof Timestamp ? v.toDate() : new Date(0));

const aEvento = (id: string, d: DocumentData): EventoPublico => ({
  id,
  organizadorId: String(d.organizadorId ?? ''),
  organizadorNombre: String(d.organizadorNombre ?? ''),
  titulo: String(d.titulo ?? ''),
  descripcion: String(d.descripcion ?? ''),
  categoria: String(d.categoria ?? 'Otros'),
  fechaInicio: aFecha(d.fechaInicio),
  fechaFin: aFecha(d.fechaFin),
  lugar: String(d.lugar ?? ''),
  direccion: String(d.direccion ?? ''),
  precio: Number(d.precio ?? 0),
  capacidad: Number(d.capacidad ?? 0),
  vendidas: Number(d.vendidas ?? 0),
  imagenUrl: String(d.imagenUrl ?? ''),
  creadoEn: d.creadoEn instanceof Timestamp ? d.creadoEn.toDate() : null,
});

export function escucharEventosPublicos(alCambiar: (l: EventoPublico[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'eventos'), where('estado', '==', 'aprobado')),
    (s) => alCambiar(s.docs.map((d) => aEvento(d.id, d.data()))),
    alError
  );
}

export function escucharEventoPublico(id: string, alCambiar: (e: EventoPublico | null) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'eventos', id),
    (s) => alCambiar(s.exists() && s.data().estado === 'aprobado' ? aEvento(s.id, s.data()) : null),
    alError
  );
}
