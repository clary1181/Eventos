import { doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { subirImagen } from '@/infraestructura/cloudinary/subirImagen';
import type { DatosFormularioEvento, EventoEditable } from '../tipos';
import { aNumeroPrecio, limpiarTexto } from '../utilidades/validaciones';

const PRESET_PORTADAS = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS ?? '';
const esRemota = (uri: string) => /^https?:\/\//i.test(uri);
const aFecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : new Date(0));

export async function obtenerEventoParaEditar(id: string): Promise<EventoEditable | null> {
  const instantanea = await getDoc(doc(db, 'eventos', id));
  if (!instantanea.exists()) return null;
  const x = instantanea.data();
  return {
    id: instantanea.id,
    estado: String(x.estado ?? ''),
    observaciones: String(x.observaciones ?? ''),
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
  };
}

// Corrige un evento aún no público y lo devuelve a revisión (regla A de firestore.rules).
// Solo se envían los campos que las reglas permiten; la foto solo si se eligió una nueva.
export async function editarEvento(id: string, d: DatosFormularioEvento): Promise<void> {
  const campos: Record<string, unknown> = {
    titulo: limpiarTexto(d.titulo),
    descripcion: limpiarTexto(d.descripcion, true),
    categoria: d.categoria,
    fechaInicio: Timestamp.fromDate(d.fechaInicio as Date),
    fechaFin: Timestamp.fromDate(d.fechaFin as Date),
    lugar: limpiarTexto(d.lugar),
    direccion: limpiarTexto(d.direccion),
    precio: aNumeroPrecio(d.precio),
    capacidad: Number(d.capacidad),
    estado: 'pendiente_aprobacion',
    actualizadoEn: serverTimestamp(),
  };

  if (d.fotoUri && !esRemota(d.fotoUri)) {
    if (!PRESET_PORTADAS) throw new Error('Falta EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS en el archivo .env.');
    const imagen = await subirImagen(d.fotoUri, PRESET_PORTADAS);
    campos.imagenUrl = imagen.url;
    campos.imagenPublicId = imagen.publicId;
  }

  await updateDoc(doc(db, 'eventos', id), campos);
}
