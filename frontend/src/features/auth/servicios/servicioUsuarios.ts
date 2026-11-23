import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { DatosRegistro, PerfilPublico } from '../tipos';

export const obtenerPerfil = async (uid: string): Promise<PerfilPublico | null> => {
  const instantanea = await getDoc(doc(db, 'usuarios', uid));
  if (!instantanea.exists()) return null;
  const d = instantanea.data();
  return {
    uid,
    nombreUsuario: d.nombreUsuario,
    nombre: d.nombre,
    apellidos: d.apellidos,
    rol: d.rol,
    ciudad: d.ciudad,
    fotoUrl: d.fotoUrl,
    biografia: d.biografia,
    estadoVerificacion: d.estadoVerificacion,
    estaVerificado: d.estaVerificado,
    estadoCuenta: d.estadoCuenta,
  };
};

export const nombreUsuarioDisponible = async (nombreUsuario: string): Promise<boolean> => {
  const clave = nombreUsuario.trim().toLowerCase();
  const instantanea = await getDoc(doc(db, 'nombresUsuario', clave));
  return !instantanea.exists();
};

export const crearPerfilCompleto = async (
  uid: string,
  correo: string,
  datos: DatosRegistro
): Promise<void> => {
  const nombreUsuario = datos.nombreUsuario.trim();
  const lote = writeBatch(db);

  lote.set(doc(db, 'nombresUsuario', nombreUsuario.toLowerCase()), { uid });

  lote.set(doc(db, 'usuarios', uid), {
    nombreUsuario,
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    rol: datos.rol,
    ciudad: datos.ciudad,
    estadoVerificacion: 'sin_solicitud',
    estaVerificado: false,
    estadoCuenta: 'activa',
    promedioCalificacion: 0,
    totalCalificaciones: 0,
    creadoEn: serverTimestamp(),
  });

  lote.set(doc(db, 'usuarios', uid, 'privado', 'perfil'), {
    correo,
    fechaNacimiento: datos.fechaNacimiento,
  });

  await lote.commit();
};
