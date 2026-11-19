import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { PerfilOrganizador } from '../tipos';

// Escucha usuarios/{uid}: así la insignia y el estado de verificación se actualizan solos
// cuando un administrador resuelve la solicitud.
export const escucharPerfilOrganizador = (
  uid: string,
  alCambiar: (perfil: PerfilOrganizador | null) => void,
  alError: (error: Error) => void,
) =>
  onSnapshot(
    doc(db, 'usuarios', uid),
    (instantanea) => {
      if (!instantanea.exists()) return alCambiar(null);
      const d = instantanea.data();
      alCambiar({
        uid,
        nombre: d.nombre ?? '',
        apellidos: d.apellidos ?? '',
        nombreUsuario: d.nombreUsuario ?? '',
        ciudad: d.ciudad ?? '',
        fotoUrl: d.fotoUrl,
        biografia: d.biografia,
        redes: { instagram: d.redes?.instagram, sitioWeb: d.redes?.sitioWeb },
        estadoVerificacion: d.estadoVerificacion ?? 'sin_solicitud',
        estaVerificado: d.estaVerificado === true,
        promedioCalificacion: Number(d.promedioCalificacion ?? 0),
        totalCalificaciones: Number(d.totalCalificaciones ?? 0),
      });
    },
    alError,
  );

// El teléfono es privado: usuarios/{uid}/privado/perfil (solo lo lee su dueño)
export const obtenerTelefono = async (uid: string): Promise<string | undefined> => {
  const instantanea = await getDoc(doc(db, 'usuarios', uid, 'privado', 'perfil'));
  const telefono = instantanea.exists() ? instantanea.data().telefono : undefined;
  return typeof telefono === 'string' && telefono ? telefono : undefined;
};
