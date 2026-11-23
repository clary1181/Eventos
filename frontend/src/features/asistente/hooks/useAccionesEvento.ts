import { useCallback, useState } from 'react';
import { enviarCalificacion } from '../servicios/servicioCalificaciones';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { enviarReporte, type MotivoReporte } from '../servicios/servicioReportes';
import type { EventoPublico } from '../tipos';

const codigoDe = (e: unknown) => (e as { code?: string })?.code ?? '';

export function useAccionesEvento(evento: EventoPublico | null, uid: string | undefined, nombre: string | undefined) {
  const [enviando, setEnviando] = useState(false);

  const calificar = useCallback(
    async (estrellas: number, comentario: string): Promise<boolean> => {
      if (!evento || !uid) return false;
      setEnviando(true);
      try {
        await enviarCalificacion(uid, (nombre || 'Asistente').slice(0, 50), evento, estrellas, comentario);
        mostrarAviso({ titulo: '¡Gracias!', mensaje: 'Tu calificación se publicó.', tipo: 'exito' });
        return true;
      } catch (e) {
        console.error('Error al calificar:', e);
        mostrarAviso({
          titulo: 'No se pudo calificar',
          mensaje: codigoDe(e) === 'permission-denied'
            ? 'Solo puedes calificar eventos que ya terminaron y para los que compraste entrada. Cada evento se califica una sola vez.'
            : 'Revisa tu conexión e inténtalo de nuevo.',
          tipo: 'error',
        });
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
        mostrarAviso({ titulo: 'Reporte enviado', mensaje: 'Gracias por ayudar a mantener segura la comunidad.', tipo: 'exito' });
        return true;
      } catch (e) {
        console.error('Error al reportar:', e);
        mostrarAviso({
          titulo: 'No se pudo enviar',
          mensaje: codigoDe(e) === 'permission-denied' ? 'Ya reportaste este evento o no se puede reportar en este momento.' : 'Revisa tu conexión e inténtalo de nuevo.',
          tipo: 'error',
        });
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [evento, uid]
  );

  return { enviando, calificar, reportar };
}
