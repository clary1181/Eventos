import { useCallback, useEffect, useMemo, useState } from 'react';
import { escucharAvisos, marcarLeida, marcarTodasLeidas } from '../servicios/servicioNotificaciones';
import type { Aviso } from '../tipos';

export function useAvisos(uid: string | undefined, esAdmin: boolean) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    return escucharAvisos(
      uid,
      esAdmin,
      (l) => { setAvisos(l); setCargando(false); setError(null); },
      (e) => { console.warn('Error al cargar avisos:', e); setError('No se pudieron cargar los avisos. Revisa que hayas publicado las reglas.'); setCargando(false); }
    );
  }, [uid, esAdmin]);

  const sinLeer = useMemo(() => avisos.filter((a) => !a.leida), [avisos]);
  const leer = useCallback((id: string) => { marcarLeida(id).catch((e) => console.warn('No se pudo marcar como leído:', e)); }, []);
  const leerTodos = useCallback(() => { marcarTodasLeidas(sinLeer.map((a) => a.id)).catch((e) => console.warn('No se pudieron marcar como leídos:', e)); }, [sinLeer]);

  return { avisos, cargando, error, sinLeer: sinLeer.length, leer, leerTodos };
}
