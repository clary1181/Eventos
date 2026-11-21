import { collection, onSnapshot, query, Timestamp, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { CalificacionResumen, EntradaResumen } from '../tipos';

const fecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : new Date());

// Entradas vendidas de los eventos del organizador (las reglas dejan leer las que tienen su organizadorId)
export function escucharEntradasOrganizador(uid: string, alCambiar: (l: EntradaResumen[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'entradas'), where('organizadorId', '==', uid)),
    (s) =>
      alCambiar(
        s.docs.map((d) => {
          const x = d.data();
          return { eventoId: String(x.eventoId ?? ''), precio: Number(x.precio ?? 0), usada: x.usada === true, creadaEn: fecha(x.creadaEn) };
        })
      ),
    alError
  );
}

// Solo calificaciones visibles: las reglas exigen filtrar oculta == false
export function escucharCalificacionesOrganizador(uid: string, alCambiar: (l: CalificacionResumen[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'calificaciones'), where('organizadorId', '==', uid), where('oculta', '==', false)),
    (s) =>
      alCambiar(
        s.docs
          .map((d): CalificacionResumen => {
            const x = d.data();
            return {
              id: d.id,
              eventoId: String(x.eventoId ?? ''),
              eventoTitulo: String(x.eventoTitulo ?? ''),
              asistenteNombre: String(x.asistenteNombre ?? 'Asistente'),
              estrellas: Number(x.estrellas ?? 0),
              comentario: String(x.comentario ?? ''),
              creadaEn: fecha(x.creadaEn),
            };
          })
          .sort((a, b) => b.creadaEn.getTime() - a.creadaEn.getTime())
      ),
    alError
  );
}
