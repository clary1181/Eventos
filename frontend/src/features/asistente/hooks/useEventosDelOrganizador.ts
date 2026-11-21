import { useEffect, useMemo, useState } from 'react';
import { escucharEventosPublicos } from '../servicios/servicioCatalogo';
import type { EventoPublico } from '../tipos';

// Eventos aprobados de un organizador, separados en próximos y realizados
export function useEventosDelOrganizador(organizadorId: string | undefined) {
  const [todos, setTodos] = useState<EventoPublico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(
    () => escucharEventosPublicos((l) => { setTodos(l); setCargando(false); }, () => setCargando(false)),
    []
  );

  return useMemo(() => {
    const ahora = Date.now();
    const suyos = todos.filter((e) => e.organizadorId === organizadorId);
    const proximos = suyos.filter((e) => e.fechaFin.getTime() > ahora).sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
    const realizados = suyos.filter((e) => e.fechaFin.getTime() <= ahora).sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());
    return { cargando, proximos, realizados };
  }, [todos, organizadorId, cargando]);
}
