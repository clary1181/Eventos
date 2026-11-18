// Variables de entorno de la app (archivo .env).
// Expo solo sustituye accesos directos con punto: process.env.EXPO_PUBLIC_NOMBRE.
const usarEmuladores = process.env.EXPO_PUBLIC_USAR_EMULADORES === 'true';

export const Entorno = {
  usarEmuladores,
  hostEmuladores: process.env.EXPO_PUBLIC_EMULADOR_HOST ?? '127.0.0.1',
  exigirCorreoVerificado: process.env.EXPO_PUBLIC_EXIGIR_CORREO_VERIFICADO !== 'false',
  firebase: {
    // Con emuladores basta una clave cualquiera
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? (usarEmuladores ? 'demo-api-key' : ''),
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  },
} as const;
