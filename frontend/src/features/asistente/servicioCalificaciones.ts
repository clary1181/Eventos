import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, Timestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export interface Calificacion {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  asistenteId: string;
  asistenteNombre: string;
  estrellas: number;
  comentario: string;
  creadaEn: Date;
}

const aCalificacion = (id: string, d: Record<string, unknown>): Calificacion => ({
  id,
  eventoId: String(d.eventoId ?? ''),
  eventoTitulo: String(d.eventoTitulo ?? ''),
  asistenteId: String(d.asistenteId ?? ''),
  asistenteNombre: String(d.asistenteNombre ?? ''),
  estrellas: Number(d.estrellas ?? 0),
  comentario: String(d.comentario ?? ''),
  creadaEn: d.creadaEn instanceof Timestamp ? d.creadaEn.toDate() : new Date(),
});

const masNuevasPrimero = (l: Calificacion[]) => l.sort((a, b) => b.creadaEn.getTime() - a.creadaEn.getTime());

// Calificaciones visibles de un evento (las ocultas por un admin no se piden)
export function escucharCalificacionesEvento(eventoId: string, alCambiar: (l: Calificacion[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'calificaciones'), where('eventoId', '==', eventoId), where('oculta', '==', false)),
    (s) => alCambiar(masNuevasPrimero(s.docs.map((d) => aCalificacion(d.id, d.data())))),
    alError
  );
}

export function escucharMisCalificaciones(uid: string, alCambiar: (l: Calificacion[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'calificaciones'), where('asistenteId', '==', uid)),
    (s) => alCambiar(masNuevasPrimero(s.docs.map((d) => aCalificacion(d.id, d.data())))),
    alError
  );
}

// ID {uid}_{eventoId}: una sola calificación por persona y evento
export const enviarCalificacion = (uid: string, nombre: string, evento: { id: string; organizadorId: string; titulo: string }, estrellas: number, comentario: string) =>
  setDoc(doc(db, 'calificaciones', `${uid}_${evento.id}`), {
    eventoId: evento.id,
    organizadorId: evento.organizadorId,
    eventoTitulo: evento.titulo,
    asistenteId: uid,
    asistenteNombre: nombre,
    estrellas,
    ...(comentario.trim() ? { comentario: comentario.trim() } : {}),
    oculta: false,
    creadaEn: serverTimestamp(),
  });
