import { doc, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { Cloudinary } from '@/config/cloudinary';
import { subirImagen } from '@/infraestructura/cloudinary';
import type { DatosVerificacion, DocumentoSubido, SolicitudVerificacion } from '../tipos';
import { esUrlRemota } from '../utilidades/validaciones';

const aFecha = (valor: unknown) => (valor instanceof Timestamp ? valor.toDate() : undefined);

// Escucha la solicitud del organizador (solicitudesVerificacion/{uid}); null si aún no envió ninguna
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

// Si la imagen ya estaba subida (reenvío) se reutiliza; si es local, se sube a Cloudinary
const subirSiHaceFalta = (imagen: string, anterior?: DocumentoSubido): Promise<DocumentoSubido> =>
  esUrlRemota(imagen) && anterior?.url === imagen
    ? Promise.resolve(anterior)
    : subirImagen(imagen, Cloudinary.presetVerificacion);

// Envía la solicitud por primera vez (create) o la reenvía tras una corrección (update).
// Las reglas de Firestore validan los campos; el trigger del backend sincroniza el perfil.
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

  // Con la solicitud ya enviada, el contacto se copia al perfil para que se vea en "Perfil".
  // Es secundario: si falla, la solicitud no se ve afectada.
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
}
