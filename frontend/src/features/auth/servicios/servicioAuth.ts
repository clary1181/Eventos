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

// Los correos de Firebase (verificación y recuperación) salen en español
auth.languageCode = 'es';

// Web client ID de Google (el de tipo 3 en google-services.json). Es público, no es un secreto.
// Debe ser del MISMO proyecto de Firebase que usa la app.
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

// Mientras se registra, la sesión recién creada no debe tratarse como "sesión iniciada"
let registrando = false;
export const estaRegistrando = (): boolean => registrando;

// ---------- Carga perezosa de Google Sign-In ----------
// El módulo es nativo: en Expo Go (o en un build sin el plugin) no existe y, si se importara
// al inicio del archivo, la app se caería al arrancar. Aquí se carga solo al usarlo
// y, si falta, se lanza un error controlado.
type ModuloGoogle = typeof import('@react-native-google-signin/google-signin');

let moduloGoogle: ModuloGoogle | null = null;

// ¿Está el módulo nativo dentro de este binario? (false en Expo Go)
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

// ---------- Correo y contraseña ----------

// Crea la cuenta, guarda el perfil y envía el correo de verificación.
// Al terminar cierra la sesión: la persona debe verificar su correo antes de entrar.
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
      // No dejar una cuenta de Auth sin perfil
      await user.delete().catch(() => undefined);
      throw error;
    }

    let correoEnviado = true;
    try {
      await sendEmailVerification(user);
    } catch {
      correoEnviado = false; // desde el login se puede pedir el reenvío
    }

    await signOut(auth);
    return { correoEnviado };
  } finally {
    registrando = false;
  }
};

// Inicia sesión. Si el correo no está verificado, cierra la sesión y lanza 'auth/correo-no-verificado'.
// El perfil y la redirección los resuelve SesionProvider al detectar la sesión.
export const iniciarSesion = async (correo: string, contrasenia: string): Promise<void> => {
  const { user } = await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), contrasenia);
  await user.reload();
  if (Entorno.exigirCorreoVerificado && !user.emailVerified) {
    await signOut(auth);
    throw errorConCodigo('Correo sin verificar.', 'auth/correo-no-verificado');
  }
};

// Reenvía el correo de verificación (inicia sesión un momento para poder enviarlo)
export const reenviarCorreoVerificacion = async (correo: string, contrasenia: string): Promise<void> => {
  const { user } = await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), contrasenia);
  try {
    await sendEmailVerification(user);
  } finally {
    await signOut(auth);
  }
};

// Envía el enlace para crear una nueva contraseña. Si el correo no existe no lanza error,
// así no se revela qué cuentas están registradas.
export const recuperarContrasenia = async (correo: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, correo.trim().toLowerCase());
  } catch (error) {
    if (codigoDeError(error) === 'auth/user-not-found') return;
    throw error;
  }
};

// ---------- Google ----------

// Abre el selector de cuentas de Google e inicia sesión en Firebase.
// No decide a dónde ir: SesionProvider detecta la sesión y
//  - si la cuenta ya tiene perfil, la ruta (auth) redirige a la pantalla del rol;
//  - si no lo tiene, la ruta (auth) lleva a "Completar perfil".
export const iniciarSesionConGoogle = async (): Promise<'completado' | 'cancelado'> => {
  const { GoogleSignin, isSuccessResponse, statusCodes } = obtenerGoogle();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const respuesta = await GoogleSignin.signIn();
    if (!isSuccessResponse(respuesta)) return 'cancelado';

    const idToken = respuesta.data.idToken;
    if (!idToken) throw errorConCodigo('Google no devolvió credenciales.', 'google/sin-token');

    const { user } = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    await user.getIdToken(true); // el token trae email_verified (lo usan las reglas)
    return 'completado';
  } catch (error) {
    if (codigoDeError(error) === statusCodes.SIGN_IN_CANCELLED) return 'cancelado';
    throw error;
  }
};

// Crea el perfil de quien entró con Google (la sesión de Auth ya está abierta).
// El correo sale de la cuenta de Google: las reglas exigen que coincida con el del token.
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

// ---------- Sesión ----------

export const cerrarSesion = async (): Promise<void> => {
  // Cierra también la sesión de Google para que la próxima vez deje elegir cuenta.
  // Si el módulo nativo no existe (Expo Go), no hay sesión de Google que cerrar.
  if (googleDisponible() && WEB_CLIENT_ID) {
    try {
      await obtenerGoogle().GoogleSignin.signOut();
    } catch {
      // ignorado a propósito
    }
  }
  await signOut(auth);
};

// Las cuentas que entren solo con Google no tienen contraseña que cambiar
export const usaContrasenia = (): boolean =>
  !!auth.currentUser?.providerData.some((p) => p.providerId === 'password');

// Firebase exige una sesión reciente para cambiar la contraseña: se reautentica con la actual
export const cambiarContrasenia = async (actual: string, nueva: string): Promise<void> => {
  const usuario = auth.currentUser;
  if (!usuario || !usuario.email) {
    throw errorConCodigo('No hay una sesión activa.', 'auth/sin-sesion');
  }
  await reauthenticateWithCredential(usuario, EmailAuthProvider.credential(usuario.email, actual));
  await updatePassword(usuario, nueva);
};
