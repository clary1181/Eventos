import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const PREFIJO = 'rec_';
const CANAL = 'recordatorios';
const HORA = 60 * 60 * 1000;

export interface EventoRecordable {
  id: string;
  titulo: string;
  lugar: string;
  fechaInicio: Date;
  tieneEntrada: boolean;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function prepararNotificaciones(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL, { name: 'Recordatorios de eventos', importance: Notifications.AndroidImportance.HIGH });
    }
    const actual = await Notifications.getPermissionsAsync();
    if (actual.granted) return true;
    if (!actual.canAskAgain) return false;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

const hora = (d: Date) => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
const dia = (d: Date) => d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

export async function sincronizarRecordatorios(eventos: EventoRecordable[], ahora = Date.now()): Promise<void> {
  const deseados = new Map<string, { fecha: Date; titulo: string; cuerpo: string; eventoId: string }>();
  eventos.forEach((e) => {
    const inicio = e.fechaInicio.getTime();
    const dondeCuando = `${dia(e.fechaInicio)}, ${hora(e.fechaInicio)} h · ${e.lugar}`;
    const antes24 = new Date(inicio - 24 * HORA);
    const antes2 = new Date(inicio - 2 * HORA);
    if (antes24.getTime() > ahora) deseados.set(`${PREFIJO}${e.id}_24h_${inicio}`, { fecha: antes24, eventoId: e.id, titulo: `Mañana: ${e.titulo}`, cuerpo: dondeCuando });
    if (antes2.getTime() > ahora) {
      deseados.set(`${PREFIJO}${e.id}_2h_${inicio}`, {
        fecha: antes2, eventoId: e.id, titulo: `Empieza en 2 horas: ${e.titulo}`,
        cuerpo: e.tieneEntrada ? `${hora(e.fechaInicio)} h · ${e.lugar}. Ten listo el QR de tu entrada.` : `${hora(e.fechaInicio)} h · ${e.lugar}`,
      });
    }
  });

  const programadas = await Notifications.getAllScheduledNotificationsAsync();
  const ids = new Set(programadas.map((p) => p.identifier));
  for (const p of programadas) {
    if (p.identifier.startsWith(PREFIJO) && !deseados.has(p.identifier)) await Notifications.cancelScheduledNotificationAsync(p.identifier);
  }
  for (const [identifier, r] of deseados) {
    if (ids.has(identifier)) continue;
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: { title: r.titulo, body: r.cuerpo, data: { eventoId: r.eventoId } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.fecha, channelId: CANAL },
    });
  }
}

export async function cancelarRecordatorios(): Promise<void> {
  const programadas = await Notifications.getAllScheduledNotificationsAsync();
  for (const p of programadas) if (p.identifier.startsWith(PREFIJO)) await Notifications.cancelScheduledNotificationAsync(p.identifier);
}
