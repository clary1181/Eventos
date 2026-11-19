import { useEffect, useState } from 'react';
import { escucharEventosDeOrganizador } from '../servicios/servicioEventos';
import type { Evento } from '../tipos';

// Eventos del organizador en tiempo real
export function useEventosOrganizador(uid: string | undefined) {
  const [eventos, establecerEventos] = useState<Evento[]>([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    establecerCargando(true);
    return escucharEventosDeOrganizador(
      uid,
      (lista) => {
        establecerEventos(lista);
        establecerError(null);
        establecerCargando(false);
      },
      () => {
        establecerError('No se pudieron cargar tus eventos. Revisa tu conexión.');
        establecerCargando(false);
      },
    );
  }, [uid]);

  return { eventos, cargando, error };
}
