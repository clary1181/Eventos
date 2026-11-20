import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { alternarFavorito, escucharFavoritos } from '../servicios/servicioFavoritos';

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
        Alert.alert('No se pudo guardar', 'Revisa tu conexión e inténtalo de nuevo.');
      }
    },
    [uid, ids]
  );

  return { ids, alternar };
}
