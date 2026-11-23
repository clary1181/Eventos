import { useCallback, useEffect, useState } from 'react';
import { alternarFavorito, escucharFavoritos } from '../servicios/servicioFavoritos';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

export function useFavoritos(uid: string | undefined) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!uid) return;
    return escucharFavoritos(uid, setIds, (e) => console.warn('Error al escuchar favoritos:', e));
  }, [uid]);

  const alternar = useCallback(
    async (eventoId: string) => {
      if (!uid) return;
      try {
        await alternarFavorito(uid, eventoId, ids.has(eventoId));
      } catch (e) {
        console.error('Error al actualizar favorito:', e);
        mostrarAviso({ titulo: 'No se pudo guardar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.', tipo: 'error' });
      }
    },
    [uid, ids]
  );

  return { ids, alternar };
}
