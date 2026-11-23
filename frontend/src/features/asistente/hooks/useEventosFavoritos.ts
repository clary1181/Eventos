import { useEffect, useMemo, useState } from 'react';
import { escucharEventosPublicos } from '../servicios/servicioCatalogo';
import type { EventoPublico } from '../tipos';
import { useFavoritos } from './useFavoritos';

export function useEventosFavoritos(uid: string | undefined) {
  const { ids, alternar } = useFavoritos(uid);
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(
    () => escucharEventosPublicos((l) => { setEventos(l); setCargando(false); }, () => setCargando(false)),
    []
  );

  const favoritos = useMemo(
    () => eventos.filter((e) => ids.has(e.id)).sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime()),
    [eventos, ids]
  );
  const proximos = useMemo(() => favoritos.filter((e) => e.fechaFin.getTime() > Date.now()), [favoritos]);

  return { ids, alternar, favoritos, proximos, cargando };
}
