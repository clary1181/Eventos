import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entorno } from '@/config/entorno';

if (!Entorno.firebase.projectId) {
  throw new Error('Falta EXPO_PUBLIC_FIREBASE_PROJECT_ID. Copia .env.example como .env y reinicia con: npx expo start --clear');
}

const app = getApps().length ? getApp() : initializeApp(Entorno.firebase);

// getReactNativePersistence no siempre aparece en los tipos públicos, por eso se carga con require
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth');

function crearAuth(): Auth {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // En recarga rápida (fast refresh) Auth ya estaba inicializado
    return getAuth(app);
  }
}

export const auth = crearAuth();
export const db = getFirestore(app);
export { app };

// Conexión a emuladores (solo desarrollo). La marca evita conectar dos veces al recargar.
const ambiente = globalThis as typeof globalThis & { __emuladoresConectados?: boolean };
if (Entorno.usarEmuladores && !ambiente.__emuladoresConectados) {
  connectAuthEmulator(auth, `http://${Entorno.hostEmuladores}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, Entorno.hostEmuladores, 8080);
  ambiente.__emuladoresConectados = true;
}
