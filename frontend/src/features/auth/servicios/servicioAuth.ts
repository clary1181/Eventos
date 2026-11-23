import { NativeModules, TurboModuleRegistry } from 'react-native';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { auth } from '@/infraestructura/firebase';
import { Entorno } from '@/config/entorno';
import { DatosRegistro } from '../tipos';
import { codigoDeError, errorConCodigo } from '../utilidades/errores';
import { crearPerfilCompleto, nombreUsuarioDisponible } from './servicioUsuarios';
import { quitarTokenPush } from '@/features/notificaciones/servicios/servicioPush';

auth.languageCode = 'es';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

let registrando = false;
export const estaRegistrando = (): boolean => registrando;

type ModuloGoogle = typeof import('@react-native-google-signin/google-signin');

let moduloGoogle: ModuloGoogle | null = null;

const googleDisponible = (): boolean => {
  try {
    return !!TurboModuleRegistry.get('RNGoogleSignin') || !!NativeModules.RNGoogleSignin;
  } catch {
    return false;
  }
};

const obtenerGoogle = (): ModuloGoogle => {
  if (moduloGoogle) return moduloGoogle;
  if (!googleDisponible()) {
    throw errorConCodigo('Google Sign-In no está disponible en este build.', 'google/no-disponible');
  }
  if (!WEB_CLIENT_ID) {
    throw errorConCodigo('Falta el webClientId de Google.', 'google/sin-configuracion');
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const modulo: ModuloGoogle = require('@react-native-google-signin/google-signin');
    modulo.GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
    moduloGoogle = modulo;
    return modulo;
  } catch {
    throw errorConCodigo('Google Sign-In no está disponible en este build.', 'google/no-disponible');
  }
};

export const registrarCuenta = async (
  datos: DatosRegistro,
  contrasenia: string
): Promise<{ correoEnviado: boolean }> => {
  const correo = datos.correo.trim().toLowerCase();
  registrando = true;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, correo, contrasenia);

    try {
      if (!(await nombreUsuarioDisponible(datos.nombreUsuario))) {
        throw errorConCodigo('El nombre de usuario ya está en uso.', 'usuarios/nombre-en-uso');
      }
      await crearPerfilCompleto(user.uid, correo, datos);
    } catch (error) {

      await user.delete().catch(() => undefined);
      throw error;
    }

    let correoEnviado = true;
    try {
      await sendEmailVerification(user);
    } catch {
      correoEnviado = false;
    }

    await signOut(auth);
    return { correoEnviado };
  } finally {
    registrando = false;
  }
};

export const iniciarSesion = async (correo: string, contrasenia: string): Promise<void> => {
  const { user } = await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), contrasenia);
  await user.reload();
  if (Entorno.exigirCorreoVerificado && !user.emailVerified) {
    await signOut(auth);
    throw errorConCodigo('Correo sin verificar.', 'auth/correo-no-verificado');
  }
};

export const reenviarCorreoVerificacion = async (correo: string, contrasenia: string): Promise<void> => {
  const { user } = await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), contrasenia);
  try {
    await sendEmailVerification(user);
  } finally {
    await signOut(auth);
  }
};

export const recuperarContrasenia = async (correo: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, correo.trim().toLowerCase());
  } catch (error) {
    if (codigoDeError(error) === 'auth/user-not-found') return;
    throw error;
  }
};

export const iniciarSesionConGoogle = async (): Promise<'completado' | 'cancelado'> => {
  const { GoogleSignin, isSuccessResponse, statusCodes } = obtenerGoogle();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const respuesta = await GoogleSignin.signIn();
    if (!isSuccessResponse(respuesta)) return 'cancelado';

    const idToken = respuesta.data.idToken;
    if (!idToken) throw errorConCodigo('Google no devolvió credenciales.', 'google/sin-token');

    const { user } = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    await user.getIdToken(true);
    return 'completado';
  } catch (error) {
    if (codigoDeError(error) === statusCodes.SIGN_IN_CANCELLED) return 'cancelado';
    throw error;
  }
};

export const completarPerfilGoogle = async (datos: Omit<DatosRegistro, 'correo'>): Promise<void> => {
  const usuario = auth.currentUser;
  if (!usuario || !usuario.email) {
    throw errorConCodigo('No hay una sesión activa.', 'auth/sin-sesion');
  }
  if (!(await nombreUsuarioDisponible(datos.nombreUsuario))) {
    throw errorConCodigo('El nombre de usuario ya está en uso.', 'usuarios/nombre-en-uso');
  }
  await crearPerfilCompleto(usuario.uid, usuario.email, { ...datos, correo: usuario.email });
};

export const cerrarSesion = async (): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (uid) await quitarTokenPush(uid);

  if (googleDisponible() && WEB_CLIENT_ID) {
    try {
      await obtenerGoogle().GoogleSignin.signOut();
    } catch {

    }
  }
  try {
    await signOut(auth);
  } catch (error) {
    throw errorConCodigo('No se pudo cerrar la sesión. Revisa tu conexión e inténtalo de nuevo.', 'auth/cerrar-sesion');
  }
};

export const usaContrasenia = (): boolean =>
  !!auth.currentUser?.providerData.some((p) => p.providerId === 'password');

export const cambiarContrasenia = async (actual: string, nueva: string): Promise<void> => {
  const usuario = auth.currentUser;
  if (!usuario || !usuario.email) {
    throw errorConCodigo('No hay una sesión activa.', 'auth/sin-sesion');
  }
  await reauthenticateWithCredential(usuario, EmailAuthProvider.credential(usuario.email, actual));
  await updatePassword(usuario, nueva);
};
