import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import { ADMINISTRADORES } from '../tipos';

const CANAL = 'avisos';
const URL_EXPO = 'https://exp.host/--/api/v2/push/send';

// Expo Go (Android) ya no soporta push remoto: solo funciona en el APK / build de desarrollo
const esExpoGo = () => Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let registradoPara: string | null = null;
let escuchando = false;

// Guarda el token de este teléfono para que otros usuarios (o el administrador) puedan enviarle push
export async function registrarTokenPush(uid: string, rol: string): Promise<void> {
  if (registradoPara === uid || esExpoGo()) return;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL, { name: 'Avisos', importance: Notifications.AndroidImportance.HIGH });
    }
    let permiso = await Notifications.getPermissionsAsync();
    if (!permiso.granted && permiso.canAskAgain) permiso = await Notifications.requestPermissionsAsync();
    if (!permiso.granted) return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) { console.warn('Push: falta extra.eas.projectId en app.json (corre "eas init").'); return; }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await setDoc(doc(db, 'tokensPush', uid), { token, rol, actualizadoEn: serverTimestamp() });
    registradoPara = uid;
  } catch (e) {
    console.warn('No se pudo registrar el token de push:', e);
  }
}

// Al cerrar sesión: este teléfono deja de recibir los avisos de esa cuenta
export async function quitarTokenPush(uid: string): Promise<void> {
  registradoPara = null;
  try { await deleteDoc(doc(db, 'tokensPush', uid)); } catch { /* no crítico */ }
}

// Abre la pantalla del aviso al tocar la notificación (también si la app estaba cerrada)
export function escucharToquesPush(): void {
  if (escuchando) return;
  escuchando = true;
  const abrir = (r: Notifications.NotificationResponse | null) => {
    const ruta = r?.notification.request.content.data?.ruta;
    if (typeof ruta === 'string' && ruta.startsWith('/')) setTimeout(() => router.push(ruta as Href), 300);
  };
  Notifications.addNotificationResponseReceivedListener(abrir);
  Notifications.getLastNotificationResponseAsync().then(abrir).catch(() => {});
}

async function tokensDe(destinatarios: string[], excluirUid?: string): Promise<string[]> {
  const tokens = new Set<string>();
  const ids = destinatarios.filter((d) => d !== ADMINISTRADORES && d !== excluirUid);
  if (destinatarios.includes(ADMINISTRADORES)) {
    const s = await getDocs(query(collection(db, 'tokensPush'), where('rol', '==', 'administrador')));
    s.docs.forEach((d) => { if (d.id !== excluirUid && d.data().token) tokens.add(String(d.data().token)); });
  }
  const docs = await Promise.all(ids.map((id) => getDoc(doc(db, 'tokensPush', id)).catch(() => null)));
  docs.forEach((d) => { if (d?.exists() && d.data().token) tokens.add(String(d.data().token)); });
  return [...tokens];
}

// Envía el push desde el teléfono con el servicio de Expo (no requiere Cloud Functions). Nunca lanza error.
export async function enviarPush(destinatarios: string[], titulo: string, mensaje: string, ruta?: string, origenUid?: string): Promise<void> {
  try {
    const tokens = await tokensDe(destinatarios, origenUid);
    for (let i = 0; i < tokens.length; i += 100) {
      await fetch(URL_EXPO, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(tokens.slice(i, i + 100).map((to) => ({ to, title: titulo, body: mensaje.slice(0, 200), sound: 'default', channelId: CANAL, data: { ruta: ruta ?? '' } }))),
      });
    }
  } catch (e) {
    console.warn('No se pudo enviar el push:', e);
  }
}
