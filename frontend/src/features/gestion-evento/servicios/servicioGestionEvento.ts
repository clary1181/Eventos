import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

// Las reglas solo permiten borrar un evento propio sin entradas vendidas
export const eliminarEvento = (id: string) => deleteDoc(doc(db, 'eventos', id));
