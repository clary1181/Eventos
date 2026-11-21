import { useMemo } from 'react';
import { useMisEntradas } from './useMisEntradas';

export interface EventoHistorial {
  eventoId: string;
  titulo: string;
  imagenUrl: string;
  lugar: string;
  fecha: Date;
  entradas: number;
  asistio: boolean; // alguna de sus entradas se validó con QR
}

// Eventos pasados de los que el asistente compró entradas (una fila por evento)
export function useHistorialEventos(uid: string | undefined) {
  const e = useMisEntradas(uid);
  const eventos = useMemo(() => {
    const mapa = new Map<string, EventoHistorial>();
    e.anteriores.forEach((x) => {
      const actual = mapa.get(x.eventoId);
      if (actual) {
        actual.entradas += 1;
        actual.asistio = actual.asistio || x.usada;
      } else {
        mapa.set(x.eventoId, { eventoId: x.eventoId, titulo: x.eventoTitulo, imagenUrl: x.imagenUrl, lugar: x.lugar, fecha: x.eventoFechaInicio, entradas: 1, asistio: x.usada });
      }
    });
    return [...mapa.values()].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }, [e.anteriores]);
  return { eventos, cargando: e.cargando, error: e.error };
}
