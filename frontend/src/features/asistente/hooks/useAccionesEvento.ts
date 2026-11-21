import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { enviarCalificacion } from '../servicios/servicioCalificaciones';
import { enviarReporte, type MotivoReporte } from '../servicios/servicioReportes';
import type { EventoPublico } from '../tipos';

const codigoDe = (e: unknown) => (e as { code?: string })?.code ?? '';

// Calificar y reportar un evento desde el detalle
export function useAccionesEvento(evento: EventoPublico | null, uid: string | undefined, nombre: string | undefined) {
  const [enviando, setEnviando] = useState(false);

  const calificar = useCallback(
    async (estrellas: number, comentario: string): Promise<boolean> => {
      if (!evento || !uid) return false;
      setEnviando(true);
      try {
        await enviarCalificacion(uid, (nombre || 'Asistente').slice(0, 50), evento, estrellas, comentario);
        Alert.alert('¡Gracias!', 'Tu calificación se publicó.');
        return true;
      } catch (e) {
        console.error('Error al calificar:', e);
        Alert.alert(
          'No se pudo calificar',
          codigoDe(e) === 'permission-denied'
            ? 'Solo puedes calificar eventos que ya terminaron y para los que compraste entrada. Cada evento se califica una sola vez.'
            : 'Revisa tu conexión e inténtalo de nuevo.'
        );
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [evento, uid, nombre]
  );

  const reportar = useCallback(
    async (motivo: MotivoReporte, descripcion: string): Promise<boolean> => {
      if (!evento || !uid) return false;
      setEnviando(true);
      try {
        await enviarReporte(uid, evento, motivo, descripcion);
        Alert.alert('Reporte enviado', 'Gracias por ayudar a mantener segura la comunidad.');
        return true;
      } catch (e) {
        console.error('Error al reportar:', e);
        Alert.alert(
          'No se pudo enviar',
          codigoDe(e) === 'permission-denied' ? 'Ya reportaste este evento o no se puede reportar en este momento.' : 'Revisa tu conexión e inténtalo de nuevo.'
        );
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [evento, uid]
  );

  return { enviando, calificar, reportar };
}
