import { collection, onSnapshot, orderBy, query, Timestamp, where, type DocumentData } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { Evento, EstadoEvento } from '../tipos';

const aFecha = (valor: unknown): Date => (valor instanceof Timestamp ? valor.toDate() : new Date(0));

const aEvento = (id: string, d: DocumentData): Evento => ({
  id,
  organizadorId: d.organizadorId,
  organizadorNombre: d.organizadorNombre ?? '',
  titulo: d.titulo ?? '',
  descripcion: d.descripcion ?? '',
  categoria: d.categoria ?? '',
  fechaInicio: aFecha(d.fechaInicio),
  fechaFin: aFecha(d.fechaFin),
  lugar: d.lugar ?? '',
  direccion: d.direccion ?? '',
  precio: Number(d.precio ?? 0),
  capacidad: Number(d.capacidad ?? 0),
  vendidas: Number(d.vendidas ?? 0),
  imagenUrl: d.imagenUrl,
  estado: (d.estado ?? 'pendiente_aprobacion') as EstadoEvento,
  observaciones: d.observaciones,
  motivoRechazo: d.motivoRechazo,
  promedioCalificacion: d.promedioCalificacion,
  totalCalificaciones: d.totalCalificaciones,
});

// Eventos de un organizador, del más reciente al más antiguo. Devuelve la función para dejar de escuchar.
// Usa el índice (organizadorId ASC, creadoEn DESC) de firestore.indexes.json.
// Eventos de un organizador, del más reciente al más antiguo. Se ordena aquí, así la consulta no necesita índice.
export const escucharEventosDeOrganizador = (
  organizadorId: string,
  alCambiar: (eventos: Evento[]) => void,
  alError: (error: Error) => void,
) => {
  // Un evento recién creado aún no tiene el sello de hora del servidor: se trata como el más nuevo
  const instante = (d: DocumentData) => (d.creadoEn instanceof Timestamp ? d.creadoEn.toMillis() : Number.MAX_SAFE_INTEGER);

  return onSnapshot(
    query(collection(db, 'eventos'), where('organizadorId', '==', organizadorId)),
    (instantanea) =>
      alCambiar(
        instantanea.docs
          .map((d) => ({ id: d.id, datos: d.data() }))
          .sort((a, b) => instante(b.datos) - instante(a.datos))
          .map(({ id, datos }) => aEvento(id, datos)),
      ),
    alError,
  );
};