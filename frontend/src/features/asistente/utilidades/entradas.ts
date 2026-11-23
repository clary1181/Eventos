export interface EntradaAsistente {
  id: string;
  eventoId: string;
  organizadorId: string;
  ordenId: string;
  numero: number;
  precio: number;
  token: string;
  usada: boolean;
  usadaEn: Date | null;
  eventoTitulo: string;
  eventoFechaInicio: Date;
  lugar: string;
  imagenUrl: string;
  creadaEn: Date;
}

export type EstadoEntrada = 'valida' | 'usada' | 'vencida';

export const ANTES_INICIO_MS = 2 * 60 * 60 * 1000;
export const DESPUES_INICIO_MS = 6 * 60 * 60 * 1000;

export const ventanaQR = (inicio: Date) => ({
  desde: new Date(inicio.getTime() - ANTES_INICIO_MS),
  hasta: new Date(inicio.getTime() + DESPUES_INICIO_MS),
});

export function estadoEntrada(e: EntradaAsistente, ahora = Date.now()): EstadoEntrada {
  if (e.usada) return 'usada';
  return ahora > ventanaQR(e.eventoFechaInicio).hasta.getTime() ? 'vencida' : 'valida';
}

export const construirPayloadQR = (e: Pick<EntradaAsistente, 'id' | 'eventoId' | 'token'>) => `MREV|${e.id}|${e.eventoId}|${e.token}`;
