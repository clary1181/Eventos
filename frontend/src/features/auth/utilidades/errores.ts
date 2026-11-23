export const errorConCodigo = (mensaje: string, code: string) =>
  Object.assign(new Error(mensaje), { code });

export const codigoDeError = (error: unknown): string | undefined =>
  (error as { code?: string } | null)?.code;

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
      return 'No hay conexión a internet. Revisa tu red y vuelve a intentarlo.';
    case 'unavailable':
    case 'deadline-exceeded':
      return 'No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.';
    case 'auth/operation-not-allowed':
      return 'Este método de acceso no está disponible en este momento.';
    case 'auth/user-disabled':
      return 'Esta cuenta está desactivada. Contacta al administrador.';
    case 'auth/correo-no-verificado':
      return 'Aún no has verificado tu correo electrónico.';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con ese correo. Inicia sesión con tu contraseña.';
    case 'auth/sin-sesion':
      return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    case 'google/no-disponible':
      return 'El acceso con Google no está disponible en esta versión. Usa tu correo y contraseña.';
    case 'google/sin-configuracion':
      return 'El acceso con Google no está configurado. Usa tu correo y contraseña.';
    case 'google/sin-token':
      return 'No se pudo obtener la cuenta de Google. Inténtalo de nuevo.';
    case '10':
    case 'DEVELOPER_ERROR':
      return 'No se pudo configurar el acceso con Google. Inténtalo de nuevo o usa tu correo.';
    case 'usuarios/nombre-en-uso':
      return 'Este nombre de usuario ya está registrado.';
    case 'permission-denied':
      return 'No se pudo completar la operación. Si estás registrándote, prueba con otro nombre de usuario.';
    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
};
