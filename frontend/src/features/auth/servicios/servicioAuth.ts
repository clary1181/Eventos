import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { auth } from '@/infraestructura/firebase';
import { Entorno } from '@/config/entorno';
import { DatosRegistro } from '../tipos';
import { errorConCodigo } from '../utilidades/errores';
import { crearPerfilCompleto, nombreUsuarioDisponible } from './servicioUsuarios';

// Mientras se registra, la sesión recién creada no debe tratarse como "sesión iniciada"
let registrando = false;
export const estaRegistrando = (): boolean => registrando;

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

export const recuperarContrasenia = async (correo: string): Promise<void> => {
  await sendPasswordResetEmail(auth, correo.trim().toLowerCase());
};

export const cerrarSesion = async (): Promise<void> => {
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
