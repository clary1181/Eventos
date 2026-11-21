import { useEffect, useMemo, useState } from 'react';
import { escucharCalificacionesEvento, type Calificacion } from '../servicios/servicioCalificaciones';

export function useCalificaciones(eventoId: string | undefined, uid: string | undefined) {
  const [lista, setLista] = useState<Calificacion[]>([]);
  useEffect(() => {
    if (!eventoId) return;
    return escucharCalificacionesEvento(eventoId, setLista, () => setLista([]));
  }, [eventoId]);

  return useMemo(() => {
    const total = lista.length;
    const promedio = total > 0 ? lista.reduce((s, c) => s + c.estrellas, 0) / total : 0;
    return { lista, total, promedio, mia: lista.find((c) => c.asistenteId === uid) ?? null };
  }, [lista, uid]);
}
