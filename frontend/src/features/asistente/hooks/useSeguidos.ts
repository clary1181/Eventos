import { useCallback, useEffect, useMemo, useState } from 'react';
import { alternarSeguido, escucharSeguidos } from '../servicios/servicioSeguidos';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

export function useSeguidos(uid: string | undefined) {
  const [lista, setLista] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const ids = useMemo(() => new Set(lista), [lista]);

  useEffect(() => {
    if (!uid) return;
    return escucharSeguidos(uid, (l) => { setLista(l); setCargando(false); }, (e) => { console.warn('Error al escuchar seguidos:', e); setCargando(false); });
  }, [uid]);

  const alternar = useCallback(
    async (organizadorId: string) => {
      if (!uid) return;
      try {
        await alternarSeguido(uid, organizadorId, ids.has(organizadorId));
      } catch (e) {
        console.error('Error al seguir/dejar de seguir:', e);
        mostrarAviso({ titulo: 'No se pudo guardar', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas.', tipo: 'error' });
      }
    },
    [uid, ids]
  );

  return { ids, lista, cargando, alternar };
}
