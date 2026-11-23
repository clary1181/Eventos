import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export type ClaveContenido = 'ayuda' | 'legal';
export interface ItemContenido { titulo: string; texto: string }

export const MAX_ITEMS = 30;
export const MAX_TITULO = 120;
export const MAX_TEXTO = 1500;

export function escucharContenido(
  clave: ClaveContenido,
  alCambiar: (items: ItemContenido[] | null) => void,
  alError: (e: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'contenidoApp', clave),
    (s) => {
      const d = s.data();
      if (!d || !Array.isArray(d.items)) return alCambiar(null);
      alCambiar(
        (d.items as { titulo?: unknown; texto?: unknown }[])
          .map((i) => ({ titulo: String(i?.titulo ?? ''), texto: String(i?.texto ?? '') }))
          .filter((i) => i.titulo !== '')
      );
    },
    alError
  );
}

export const guardarContenido = (clave: ClaveContenido, items: ItemContenido[], uid: string) =>
  setDoc(doc(db, 'contenidoApp', clave), {
    items: items.map((i) => ({ titulo: i.titulo.trim(), texto: i.texto.trim() })),
    actualizadoEn: serverTimestamp(),
    actualizadoPor: uid,
  });
