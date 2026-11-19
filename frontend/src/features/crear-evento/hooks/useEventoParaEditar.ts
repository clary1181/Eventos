import { useEffect, useState } from 'react';
import { obtenerEventoParaEditar } from '../servicios/servicioEditarEvento';
import type { EventoEditable } from '../tipos';

export function useEventoParaEditar(id: string | undefined) {
  const [evento, setEvento] = useState<EventoEditable | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError('No se indicó qué evento editar.'); setCargando(false); return; }
    let activo = true;
    obtenerEventoParaEditar(id)
      .then((e) => { if (activo) { setEvento(e); setError(e ? null : 'El evento no existe.'); } })
      .catch((e) => { console.error('Error al cargar el evento:', e); if (activo) setError('No se pudo cargar el evento.'); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [id]);

  return { evento, cargando, error };
}
