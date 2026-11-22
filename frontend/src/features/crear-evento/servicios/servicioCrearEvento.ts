import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { subirImagen } from '@/infraestructura/cloudinary/subirImagen';
import type { DatosFormularioEvento } from '../tipos';
import { aNumeroPrecio, limpiarTexto } from '../utilidades/validaciones';
import { avisarAdministradores } from '@/features/notificaciones/servicios/servicioNotificaciones';

// Preset sin firma SOLO para portadas (carpeta eventos/portadas). Ver .env.example
const PRESET_PORTADAS = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS ?? '';

interface Organizador {
  uid: string;
  nombre: string;
  apellidos: string;
}

export async function crearEvento(organizador: Organizador, d: DatosFormularioEvento): Promise<string> {
  if (!PRESET_PORTADAS) throw new Error('Falta EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS en el archivo .env.');

  const imagen = await subirImagen(d.fotoUri as string, PRESET_PORTADAS);

  // Los campos son EXACTAMENTE los que permiten las reglas al crear (no agregar otros)
  const referencia = await addDoc(collection(db, 'eventos'), {
    organizadorId: organizador.uid,
    organizadorNombre: `${organizador.nombre} ${organizador.apellidos}`, // las reglas lo comparan con el perfil
    organizadorVerificado: true,
    titulo: limpiarTexto(d.titulo),
    descripcion: limpiarTexto(d.descripcion, true),
    categoria: d.categoria,
    fechaInicio: Timestamp.fromDate(d.fechaInicio as Date),
    fechaFin: Timestamp.fromDate(d.fechaFin as Date),
    lugar: limpiarTexto(d.lugar),
    direccion: limpiarTexto(d.direccion),
    precio: aNumeroPrecio(d.precio),
    capacidad: Number(d.capacidad),
    vendidas: 0,
    imagenUrl: imagen.url,
    imagenPublicId: imagen.publicId,
    estado: 'pendiente_aprobacion',
    estadoCambio: 'ninguno',
    promedioCalificacion: 0,
    totalCalificaciones: 0,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  await avisarAdministradores({
    tipo: 'evento_nuevo',
    titulo: 'Evento nuevo por revisar',
    mensaje: `${organizador.nombre} ${organizador.apellidos} envió "${limpiarTexto(d.titulo)}" para aprobación.`,
    ruta: '/administrador/eventos',
    eventoId: referencia.id,
  });
  return referencia.id;
}
