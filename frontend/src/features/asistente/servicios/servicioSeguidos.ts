import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

// ID determinista exigido por las reglas: {asistenteId}_{organizadorId}
const idSeguido = (uid: string, organizadorId: string) => `${uid}_${organizadorId}`;

export function escucharSeguidos(uid: string, alCambiar: (ids: string[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'seguidos'), where('asistenteId', '==', uid)),
    (s) => alCambiar(s.docs.map((d) => String(d.data().organizadorId))),
    alError
  );
}

export async function alternarSeguido(uid: string, organizadorId: string, yaSigue: boolean): Promise<void> {
  const ref = doc(db, 'seguidos', idSeguido(uid, organizadorId));
  if (yaSigue) await deleteDoc(ref);
  else await setDoc(ref, { asistenteId: uid, organizadorId, creadoEn: serverTimestamp() });
}
