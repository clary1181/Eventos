import { collection, doc, getDoc, onSnapshot, query, Timestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export interface EntradaVendida {
  id: string;
  asistenteId: string;
  numero: number;
  precio: number;
  usada: boolean;
  usadaEn: Date | null;
  creadaEn: Date;
}

export interface NombreComprador { nombre: string; usuario: string }

// Las reglas dejan leer las entradas con organizadorId == uid; el filtro por evento es adicional (sin índice compuesto)
export function escucharEntradasDeEvento(uid: string, eventoId: string, alCambiar: (l: EntradaVendida[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'entradas'), where('organizadorId', '==', uid), where('eventoId', '==', eventoId)),
    (s) =>
      alCambiar(
        s.docs.map((d): EntradaVendida => {
          const x = d.data();
          return {
            id: d.id,
            asistenteId: String(x.asistenteId ?? ''),
            numero: Number(x.numero ?? 1),
            precio: Number(x.precio ?? 0),
            usada: x.usada === true,
            usadaEn: x.usadaEn instanceof Timestamp ? x.usadaEn.toDate() : null,
            creadaEn: x.creadaEn instanceof Timestamp ? x.creadaEn.toDate() : new Date(), // serverTimestamp pendiente = ahora
          };
        })
      ),
    alError
  );
}

const cache = new Map<string, NombreComprador>();

// Solo nombre y usuario del comprador (no se muestra correo ni otros datos)
export async function obtenerNombreComprador(uid: string): Promise<NombreComprador> {
  const guardado = cache.get(uid);
  if (guardado) return guardado;
  try {
    const d = (await getDoc(doc(db, 'usuarios', uid))).data();
    const r = { nombre: d ? `${d.nombre ?? ''} ${d.apellidos ?? ''}`.trim() || 'Asistente' : 'Usuario eliminado', usuario: String(d?.nombreUsuario ?? '') };
    cache.set(uid, r);
    return r;
  } catch {
    return { nombre: 'Asistente', usuario: '' };
  }
}
