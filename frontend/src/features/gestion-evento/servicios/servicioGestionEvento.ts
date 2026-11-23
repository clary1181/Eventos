import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export const eliminarEvento = (id: string) => deleteDoc(doc(db, 'eventos', id));
