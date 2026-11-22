import { doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { subirImagen } from '@/infraestructura/cloudinary/subirImagen';
import type { DatosFormularioEvento, EventoEditable } from '../tipos';
import { aNumeroPrecio, limpiarTexto } from '../utilidades/validaciones';
import { avisarAdministradores } from '@/features/notificaciones/servicios/servicioNotificaciones';

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
    estadoCambio: String(x.estadoCambio ?? 'ninguno'),
    observacionesCambio: String(x.observacionesCambio ?? ''),
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
  await avisarAdministradores({
    tipo: 'evento_nuevo',
    titulo: 'Evento corregido por revisar',
    mensaje: `El organizador reenvió "${limpiarTexto(d.titulo)}" con correcciones.`,
    ruta: '/administrador/eventos',
    eventoId: id,
  });
}

// ---------- Eventos ya publicados (aprobados) ----------

export interface CambiosDetectados {
  sensibles: string[]; // fecha, lugar, dirección, precio o foto: requieren revisión del administrador
  simples: string[];   // título, descripción, categoría, capacidad: se aplican de inmediato
}

const errorEdicion = (mensaje: string) => Object.assign(new Error(mensaje), { esEdicion: true });

export function analizarCambios(o: EventoEditable, d: DatosFormularioEvento): CambiosDetectados {
  const sensibles: string[] = [];
  const simples: string[] = [];
  if (d.fechaInicio?.getTime() !== o.fechaInicio.getTime() || d.fechaFin?.getTime() !== o.fechaFin.getTime()) sensibles.push('Fecha u hora');
  if (limpiarTexto(d.lugar) !== o.lugar) sensibles.push('Lugar');
  if (limpiarTexto(d.direccion) !== o.direccion) sensibles.push('Dirección');
  if (aNumeroPrecio(d.precio) !== o.precio) sensibles.push('Precio');
  if (d.fotoUri && !esRemota(d.fotoUri)) sensibles.push('Foto de portada');
  if (limpiarTexto(d.titulo) !== o.titulo) simples.push('Título');
  if (limpiarTexto(d.descripcion, true) !== o.descripcion) simples.push('Descripción');
  if (d.categoria !== o.categoria) simples.push('Categoría');
  if (Number(d.capacidad) !== o.capacidad) simples.push('Capacidad');
  return { sensibles, simples };
}

// Edita un evento aprobado (reglas B y C de firestore.rules):
//  - Cambios simples: se aplican de inmediato.
//  - Cambios sensibles SIN ventas: el evento vuelve a "pendiente de aprobación".
//  - Cambios sensibles CON ventas: se guardan como propuesta (cambioPropuesto); el evento sigue publicado hasta que el administrador la apruebe.
export async function editarEventoPublicado(o: EventoEditable, d: DatosFormularioEvento): Promise<CambiosDetectados> {
  const cambios = analizarCambios(o, d);
  if (cambios.sensibles.length === 0 && cambios.simples.length === 0) throw errorEdicion('No hiciste ningún cambio.');
  if (o.vendidas > 0 && cambios.sensibles.length > 0 && o.estadoCambio === 'pendiente') {
    throw errorEdicion('Ya tienes cambios en revisión. Espera la respuesta del administrador antes de proponer otros de fecha, lugar, dirección, precio o foto.');
  }

  const campos: Record<string, unknown> = { actualizadoEn: serverTimestamp() };
  if (cambios.simples.includes('Título')) campos.titulo = limpiarTexto(d.titulo);
  if (cambios.simples.includes('Descripción')) campos.descripcion = limpiarTexto(d.descripcion, true);
  if (cambios.simples.includes('Categoría')) campos.categoria = d.categoria;
  if (cambios.simples.includes('Capacidad')) campos.capacidad = Number(d.capacidad);

  if (cambios.sensibles.length > 0) {
    const sensibles: Record<string, unknown> = {};
    if (cambios.sensibles.includes('Fecha u hora')) {
      sensibles.fechaInicio = Timestamp.fromDate(d.fechaInicio as Date);
      sensibles.fechaFin = Timestamp.fromDate(d.fechaFin as Date);
    }
    if (cambios.sensibles.includes('Lugar')) sensibles.lugar = limpiarTexto(d.lugar);
    if (cambios.sensibles.includes('Dirección')) sensibles.direccion = limpiarTexto(d.direccion);
    if (cambios.sensibles.includes('Precio')) sensibles.precio = aNumeroPrecio(d.precio);
    if (cambios.sensibles.includes('Foto de portada')) {
      if (!PRESET_PORTADAS) throw new Error('Falta EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS en el archivo .env.');
      const imagen = await subirImagen(d.fotoUri as string, PRESET_PORTADAS);
      sensibles.imagenUrl = imagen.url;
      sensibles.imagenPublicId = imagen.publicId;
    }

    if (o.vendidas === 0) {
      Object.assign(campos, sensibles);
      campos.estado = 'pendiente_aprobacion'; // vuelve a revisión
    } else {
      campos.estadoCambio = 'pendiente';
      campos.cambioPropuesto = { ...sensibles, solicitadoEn: serverTimestamp() };
    }
  }

  await updateDoc(doc(db, 'eventos', o.id), campos);

  if (cambios.sensibles.length > 0) {
    const enRevision = o.vendidas === 0;
    await avisarAdministradores({
      tipo: enRevision ? 'evento_nuevo' : 'cambios_pendientes',
      titulo: enRevision ? 'Evento editado por revisar' : 'Cambios por revisar',
      mensaje: `"${limpiarTexto(d.titulo)}": ${cambios.sensibles.join(', ').toLowerCase()}.`,
      ruta: '/administrador/eventos',
      eventoId: o.id,
    });
  }
  return cambios;
}
