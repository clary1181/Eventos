import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { useSesion } from '@/features/auth';
import { escucharEventosPublicos } from '@/features/asistente/servicios/servicioCatalogo';
import { escucharFavoritos } from '@/features/asistente/servicios/servicioFavoritos';
import { escucharMisEntradas } from '@/features/asistente/servicios/servicioMisEntradas';
import type { EventoPublico } from '@/features/asistente/tipos';
import { cancelarRecordatorios, prepararNotificaciones, sincronizarRecordatorios } from '../servicios/servicioRecordatorios';

// No dibuja nada: mantiene al día los recordatorios locales de los favoritos y las entradas del asistente
export function RecordatoriosAsistente() {
  const router = useRouter();
  const { perfil } = useSesion();
  const uid = perfil?.uid;
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [conEntrada, setConEntrada] = useState<Set<string>>(new Set());
  const permitido = useRef<boolean | null>(null);

  useEffect(() => {
    if (!uid) return;
    const a = escucharEventosPublicos(setEventos, () => {});
    const b = escucharFavoritos(uid, setFavoritos, () => {});
    const c = escucharMisEntradas(uid, (l) => setConEntrada(new Set(l.filter((e) => !e.usada).map((e) => e.eventoId))), () => {});
    return () => { a(); b(); c(); };
  }, [uid]);

  // Reprograma cuando cambian los eventos, los favoritos o las entradas
  useEffect(() => {
    if (!uid) return;
    let activo = true;
    (async () => {
      try {
        if (permitido.current === null) permitido.current = await prepararNotificaciones();
        if (!permitido.current || !activo) return;
        const relevantes = eventos
          .filter((e) => favoritos.has(e.id) || conEntrada.has(e.id))
          .map((e) => ({ id: e.id, titulo: e.titulo, lugar: e.lugar, fechaInicio: e.fechaInicio, tieneEntrada: conEntrada.has(e.id) }));
        await sincronizarRecordatorios(relevantes);
      } catch (e) {
        console.warn('No se pudieron programar los recordatorios:', e);
      }
    })();
    return () => { activo = false; };
  }, [uid, eventos, favoritos, conEntrada]);

  // Al tocar un recordatorio se abre el evento
  useEffect(() => {
    const s = Notifications.addNotificationResponseReceivedListener((r) => {
      const id = r.notification.request.content.data?.eventoId;
      if (typeof id === 'string') router.push(`/asistente/evento/${id}` as Href);
    });
    return () => s.remove();
  }, [router]);

  // Al cerrar sesión se quitan, para que no suenen en el teléfono de otra persona
  useEffect(() => () => { void cancelarRecordatorios().catch(() => {}); }, []);

  return null;
}
