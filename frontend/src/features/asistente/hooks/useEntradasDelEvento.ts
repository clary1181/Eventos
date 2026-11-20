import { useEffect, useState } from 'react';
import { escucharCantidadEntradas } from '../servicios/servicioEntradas';

export function useEntradasDelEvento(uid: string | undefined, eventoId: string | undefined) {
  const [cantidad, setCantidad] = useState(0);
  useEffect(() => {
    if (!uid || !eventoId) return;
    return escucharCantidadEntradas(uid, eventoId, setCantidad, () => {});
  }, [uid, eventoId]);
  return cantidad;
}
