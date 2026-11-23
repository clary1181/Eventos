import { doc, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { Cloudinary } from '@/config/cloudinary';
import { subirImagen } from '@/infraestructura/cloudinary';
import type { DatosVerificacion, DocumentoSubido, SolicitudVerificacion } from '../tipos';
import { esUrlRemota } from '../utilidades/validaciones';
import { avisarAdministradores } from '@/features/notificaciones/servicios/servicioNotificaciones';

const aFecha = (valor: unknown) => (valor instanceof Timestamp ? valor.toDate() : undefined);

export const escucharSolicitud = (
  uid: string,
  alCambiar: (solicitud: SolicitudVerificacion | null) => void,
  alError: (error: Error) => void,
) =>
  onSnapshot(
    doc(db, 'solicitudesVerificacion', uid),
    (instantanea) => {
      if (!instantanea.exists()) return alCambiar(null);
      const d = instantanea.data();
      alCambiar({
        organizadorId: d.organizadorId,
        estado: d.estado,
        telefono: d.telefono ?? '',
        redes: Array.isArray(d.redes) ? d.redes : [],
        descripcionActividad: d.descripcionActividad ?? '',
        documentos: d.documentos ?? {},
        observaciones: d.observaciones,
        reenvios: Number(d.reenvios ?? 0),
        creadaEn: aFecha(d.creadaEn),
        actualizadaEn: aFecha(d.actualizadaEn),
      });
    },
    alError,
  );

const subirSiHaceFalta = (imagen: string, anterior?: DocumentoSubido): Promise<DocumentoSubido> =>
  esUrlRemota(imagen) && anterior?.url === imagen
    ? Promise.resolve(anterior)
    : subirImagen(imagen, Cloudinary.presetVerificacion);

export async function enviarSolicitud(uid: string, datos: DatosVerificacion, previa: SolicitudVerificacion | null) {
  const [selfie, identificacion] = await Promise.all([
    subirSiHaceFalta(datos.selfie, previa?.documentos.selfie),
    subirSiHaceFalta(datos.identificacion, previa?.documentos.identificacion),
  ]);

  const redes = [datos.instagram ? `https://instagram.com/${datos.instagram}` : null, datos.sitioWeb].filter(
    (r): r is string => !!r,
  );
  const campos = {
    telefono: datos.telefono,
    redes,
    descripcionActividad: datos.descripcionActividad,
    documentos: { identificacion, selfie },
  };

  if (previa) {
    await updateDoc(doc(db, 'solicitudesVerificacion', uid), {
      ...campos,
      estado: 'pendiente',
      reenvios: previa.reenvios + 1,
      actualizadaEn: serverTimestamp(),
    });
  } else {
    await setDoc(doc(db, 'solicitudesVerificacion', uid), {
      ...campos,
      organizadorId: uid,
      estado: 'pendiente',
      reenvios: 0,
      creadaEn: serverTimestamp(),
      actualizadaEn: serverTimestamp(),
    });
  }

  try {
    const redesPerfil: Record<string, string> = {};
    if (datos.instagram) redesPerfil.instagram = datos.instagram;
    if (datos.sitioWeb) redesPerfil.sitioWeb = datos.sitioWeb;
    await Promise.all([
      updateDoc(doc(db, 'usuarios', uid), { redes: redesPerfil }),
      updateDoc(doc(db, 'usuarios', uid, 'privado', 'perfil'), { telefono: datos.telefono }),
    ]);
  } catch (error) {
    console.warn('No se pudo copiar el contacto al perfil:', error);
  }

  await avisarAdministradores({
    tipo: 'verificacion_nueva',
    titulo: previa ? 'Verificación reenviada' : 'Nueva solicitud de verificación',
    mensaje: previa
      ? 'Un organizador corrigió y reenvió su solicitud de verificación.'
      : 'Un organizador envió una nueva solicitud de verificación.',
    ruta: '/administrador/organizadores',
  });
}
