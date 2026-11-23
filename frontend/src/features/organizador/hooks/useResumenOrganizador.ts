import { useMemo } from 'react';
import type { Evento } from '@/features/eventos';

export function useResumenOrganizador(eventos: Evento[]) {
  return useMemo(() => {
    const ahora = Date.now();
    return {
      publicados: eventos.filter((e) => e.estado === 'aprobado').length,
      activos: eventos.filter((e) => e.estado === 'aprobado' && e.fechaFin.getTime() >= ahora).length,
      entradasVendidas: eventos.reduce((suma, e) => suma + e.vendidas, 0),
      ingresos: eventos.reduce((suma, e) => suma + e.vendidas * e.precio, 0),
    };
  }, [eventos]);
}
