export interface EntradaResumen {
  eventoId: string;
  precio: number;
  usada: boolean;
  creadaEn: Date;
}

export interface CalificacionResumen {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  asistenteNombre: string;
  estrellas: number;
  comentario: string;
  creadaEn: Date;
}

export type Periodo = '7d' | '30d' | 'todo';
export type Metrica = 'entradas' | 'ingresos';

export interface PuntoVenta { etiqueta: string; entradas: number; ingresos: number }
