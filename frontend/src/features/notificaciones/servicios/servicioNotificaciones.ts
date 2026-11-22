import { getAuth } from 'firebase/auth';
import {
  addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where, writeBatch, type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { ADMINISTRADORES, type Aviso, type NuevoAviso } from '../tipos';
import { enviarPush } from './servicioPush';

const armar = (a: Omit<NuevoAviso, 'destinatarioId'> & { destinatarioId: string }, origenId: string) => ({
  destinatarioId: a.destinatarioId,
  origenId,
  tipo: a.tipo,
  titulo: a.titulo.slice(0, 120),
  mensaje: a.mensaje.length > 500 ? `${a.mensaje.slice(0, 497)}...` : a.mensaje,
  leida: false,
  creadaEn: serverTimestamp(),
  ...(a.ruta ? { ruta: a.ruta } : {}),
  ...(a.eventoId ? { eventoId: a.eventoId } : {}),
});

// Crea un aviso. Nunca lanza error: un aviso fallido no debe romper la acción principal (compra, aprobación, etc.)
export async function avisar(a: NuevoAviso): Promise<void> {
  try {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;
    await addDoc(collection(db, 'notificaciones'), armar(a, uid));
    await enviarPush([a.destinatarioId], a.titulo, a.mensaje, a.ruta, uid);
  } catch (e) {
    console.warn('No se pudo crear el aviso:', e);
  }
}

// El mismo aviso para varios destinatarios (en lotes)
export async function avisarVarios(destinatarios: string[], base: Omit<NuevoAviso, 'destinatarioId'>): Promise<void> {
  try {
    const uid = getAuth().currentUser?.uid;
    if (!uid || destinatarios.length === 0) return;
    for (let i = 0; i < destinatarios.length; i += 200) {
      const lote = writeBatch(db);
      destinatarios.slice(i, i + 200).forEach((d) => lote.set(doc(collection(db, 'notificaciones')), armar({ ...base, destinatarioId: d }, uid)));
      await lote.commit();
    }
    await enviarPush(destinatarios, base.titulo, base.mensaje, base.ruta, uid);
  } catch (e) {
    console.warn('No se pudieron crear los avisos:', e);
  }
}

export const avisarAdministradores = (a: Omit<NuevoAviso, 'destinatarioId'>) => avisar({ ...a, destinatarioId: ADMINISTRADORES });

// Datos mínimos de un evento (para saber a quién avisar y cómo se llama)
export async function datosEvento(id: string): Promise<{ organizadorId: string; titulo: string } | null> {
  try {
    const d = (await getDoc(doc(db, 'eventos', id))).data();
    return d ? { organizadorId: String(d.organizadorId ?? ''), titulo: String(d.titulo ?? 'Evento') } : null;
  } catch {
    return null;
  }
}

// Asistentes que siguen a un organizador (solo lo puede consultar un administrador)
export async function seguidoresDe(organizadorId: string): Promise<string[]> {
  try {
    const s = await getDocs(query(collection(db, 'seguidos'), where('organizadorId', '==', organizadorId)));
    return Array.from(new Set<string>(s.docs.map((d) => String(d.data().asistenteId ?? '')).filter(Boolean)));
  } catch (e) {
    console.warn('No se pudieron consultar los seguidores:', e);
    return [];
  }
}

// Asistentes con entradas de un evento (solo lo puede consultar un administrador)
export async function compradoresDeEvento(eventoId: string): Promise<string[]> {
  try {
    const s = await getDocs(query(collection(db, 'entradas'), where('eventoId', '==', eventoId)));
    return Array.from(new Set<string>(s.docs.map((d) => String(d.data().asistenteId ?? '')).filter(Boolean)));
  } catch (e) {
    console.warn('No se pudieron consultar los compradores:', e);
    return [];
  }
}

const aAviso = (id: string, x: Record<string, unknown>): Aviso => ({
  id,
  tipo: x.tipo as Aviso['tipo'],
  titulo: String(x.titulo ?? ''),
  mensaje: String(x.mensaje ?? ''),
  ruta: String(x.ruta ?? ''),
  leida: x.leida === true,
  creadaEn: x.creadaEn instanceof Timestamp ? x.creadaEn.toDate() : new Date(), // serverTimestamp pendiente = ahora
});

// Avisos de la persona; el administrador también recibe los dirigidos a "administradores"
export function escucharAvisos(uid: string, esAdmin: boolean, alCambiar: (l: Aviso[]) => void, alError: (e: Error) => void): Unsubscribe {
  const porDestino = new Map<string, Aviso[]>();
  const emitir = () => alCambiar([...porDestino.values()].flat().sort((a, b) => b.creadaEn.getTime() - a.creadaEn.getTime()));
  const suscribir = (destino: string) =>
    onSnapshot(
      query(collection(db, 'notificaciones'), where('destinatarioId', '==', destino)),
      (s) => { porDestino.set(destino, s.docs.map((d) => aAviso(d.id, d.data()))); emitir(); },
      alError
    );
  const bajas = [suscribir(uid), ...(esAdmin ? [suscribir(ADMINISTRADORES)] : [])];
  return () => bajas.forEach((b) => b());
}

export const marcarLeida = (id: string) => updateDoc(doc(db, 'notificaciones', id), { leida: true });

export async function marcarTodasLeidas(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += 400) {
    const lote = writeBatch(db);
    ids.slice(i, i + 400).forEach((id) => lote.update(doc(db, 'notificaciones', id), { leida: true }));
    await lote.commit();
  }
}
