export const errorConCodigo = (mensaje: string, code: string) =>
  Object.assign(new Error(mensaje), { code });

export const codigoDeError = (error: unknown): string | undefined =>
  (error as { code?: string } | null)?.code;

// Convierte los errores de Firebase en mensajes comprensibles
export const mensajeDeError = (error: unknown): string => {
  switch (codigoDeError(error)) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
      return 'Correo electrónico o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Este correo ya está vinculado a otra cuenta.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    case 'auth/network-request-failed':
      return 'No hay conexión con el servidor. Revisa tu internet (o la IP de los emuladores).';
    case 'auth/operation-not-allowed':
      return 'Este método de acceso no está habilitado en Firebase.';
    case 'auth/user-disabled':
      return 'Esta cuenta está desactivada. Contacta al administrador.';
    case 'auth/correo-no-verificado':
      return 'Aún no has verificado tu correo electrónico.';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con ese correo. Inicia sesión con tu contraseña.';
    case 'auth/sin-sesion':
      return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    case 'google/no-disponible':
      return 'Google Sign-In requiere el build de desarrollo (no funciona en Expo Go).';
    case 'google/sin-configuracion':
      return 'Falta configurar EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en el archivo .env.';
    case 'google/sin-token':
      return 'No se pudo obtener la cuenta de Google. Inténtalo de nuevo.';
    case '10':
    case 'DEVELOPER_ERROR':
      return 'Configuración de Google incorrecta (revisa el SHA-1, el paquete y el webClientId).';
    case 'usuarios/nombre-en-uso':
      return 'Este nombre de usuario ya está registrado.';
    case 'permission-denied':
      return 'No se pudo completar la operación. Si estás registrándote, prueba con otro nombre de usuario.';
    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
};
