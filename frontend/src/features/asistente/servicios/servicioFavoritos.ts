import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

const idFavorito = (uid: string, eventoId: string) => `${uid}_${eventoId}`;

export function escucharFavoritos(uid: string, alCambiar: (ids: Set<string>) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'favoritos'), where('asistenteId', '==', uid)),
    (s) => alCambiar(new Set(s.docs.map((d) => String(d.data().eventoId)))),
    alError
  );
}

export async function alternarFavorito(uid: string, eventoId: string, esFavorito: boolean): Promise<void> {
  const ref = doc(db, 'favoritos', idFavorito(uid, eventoId));
  if (esFavorito) await deleteDoc(ref);
  else await setDoc(ref, { asistenteId: uid, eventoId, creadoEn: serverTimestamp() });
}
