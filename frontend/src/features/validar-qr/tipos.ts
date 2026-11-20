import type { EntradaAsistente } from '@/features/asistente/utilidades/entradas';

// Evento que el organizador puede atender en la puerta
export interface EventoValidable {
  id: string;
  titulo: string;
  lugar: string;
  imagenUrl: string;
  fechaInicio: Date;
  vendidas: number;
  capacidad: number;
}

export type TipoResultado = 'ok' | 'usada' | 'otro_evento' | 'invalida' | 'temprano' | 'expirada';

export interface ResultadoValidacion {
  tipo: TipoResultado;
  titulo: string;
  detalle: string;
  entrada?: EntradaAsistente;
}
