import { collection, doc, onSnapshot, serverTimestamp, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { EstadoEvento, EventoAdmin } from '../tipos';

const aFecha = (v: unknown): Date | null =>
  v && typeof (v as { toDate?: unknown }).toDate === 'function' ? (v as { toDate: () => Date }).toDate() : null;

// El administrador puede leer los eventos en cualquier estado (reglas)
export function escucharEventos(alCambiar: (l: EventoAdmin[]) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'eventos'),
    (s) =>
      alCambiar(
        s.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            organizadorId: String(x.organizadorId ?? ''),
            organizadorNombre: String(x.organizadorNombre ?? ''),
            titulo: String(x.titulo ?? ''),
            descripcion: String(x.descripcion ?? ''),
            categoria: String(x.categoria ?? ''),
            fechaInicio: aFecha(x.fechaInicio),
            fechaFin: aFecha(x.fechaFin),
            lugar: String(x.lugar ?? ''),
            direccion: String(x.direccion ?? ''),
            precio: Number(x.precio ?? 0),
            capacidad: Number(x.capacidad ?? 0),
            vendidas: Number(x.vendidas ?? 0),
            imagenUrl: String(x.imagenUrl ?? ''),
            estado: x.estado as EstadoEvento,
            observaciones: String(x.observaciones ?? ''),
            motivoRechazo: String(x.motivoRechazo ?? ''),
            creadoEn: aFecha(x.creadoEn),
            actualizadoEn: aFecha(x.actualizadoEn),
          };
        })
      ),
    alError
  );
}

// Solo estado/observaciones/motivoRechazo/actualizadoEn, y solo desde "pendiente_aprobacion" (reglas)
export async function dictaminarEvento(
  id: string,
  estado: 'aprobado' | 'requiere_correccion' | 'rechazado',
  texto: string
): Promise<void> {
  const cambios: Record<string, unknown> = { estado, actualizadoEn: serverTimestamp() };
  if (estado === 'requiere_correccion') cambios.observaciones = texto.trim();
  if (estado === 'rechazado') cambios.motivoRechazo = texto.trim();
  await updateDoc(doc(db, 'eventos', id), cambios);
}
