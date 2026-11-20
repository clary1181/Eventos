import { useEffect, useState } from 'react';
import { escucharEventosValidables } from '../servicios/servicioValidacion';
import type { EventoValidable } from '../tipos';

export function useEventosValidables(uid: string | undefined) {
  const [eventos, setEventos] = useState<EventoValidable[]>([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    if (!uid) return;
    return escucharEventosValidables(uid, (l) => { setEventos(l); setCargando(false); }, (e) => { console.error('Error al cargar eventos:', e); setCargando(false); });
  }, [uid]);
  return { eventos, cargando };
}
