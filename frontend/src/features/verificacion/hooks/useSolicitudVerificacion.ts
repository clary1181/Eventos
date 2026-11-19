import { useEffect, useState } from 'react';
import { escucharSolicitud } from '../servicios/servicioVerificacion';
import type { SolicitudVerificacion } from '../tipos';

// La solicitud del organizador en tiempo real (null = todavía no ha enviado ninguna)
export function useSolicitudVerificacion(uid: string | undefined) {
  const [solicitud, establecerSolicitud] = useState<SolicitudVerificacion | null>(null);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    return escucharSolicitud(
      uid,
      (s) => {
        establecerSolicitud(s);
        establecerError(null);
        establecerCargando(false);
      },
      () => {
        establecerError('No se pudo cargar tu solicitud. Revisa tu conexión.');
        establecerCargando(false);
      },
    );
  }, [uid]);

  return { solicitud, cargando, error };
}
