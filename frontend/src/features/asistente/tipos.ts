// Evento aprobado tal como lo ve un asistente
export interface EventoPublico {
  id: string;
  organizadorId: string;
  organizadorNombre: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaInicio: Date;
  fechaFin: Date;
  lugar: string;
  direccion: string;
  precio: number;
  capacidad: number;
  vendidas: number;
  imagenUrl: string;
  creadoEn: Date | null;
}

export const MAX_ENTRADAS_POR_EVENTO = 5; // debe coincidir con el backend (D3)
