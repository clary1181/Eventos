import { useEffect, useState } from 'react';
import { escucharEventoPublico } from '../servicios/servicioCatalogo';
import type { EventoPublico } from '../tipos';

export function useEventoPublico(id: string | undefined) {
  const [evento, setEvento] = useState<EventoPublico | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) { setCargando(false); return; }
    return escucharEventoPublico(
      id,
      (e) => { setEvento(e); setCargando(false); },
      () => { setEvento(null); setCargando(false); } // sin permiso = no es público
    );
  }, [id]);

  return { evento, cargando };
}
