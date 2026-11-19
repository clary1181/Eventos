export type EstadoEvento =
  | 'pendiente_aprobacion'
  | 'aprobado'
  | 'requiere_correccion'
  | 'rechazado'
  | 'suspendido';

// Documento eventos/{id} (ver docs/modelo-datos.md, sección 3.5)
export interface Evento {
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
  imagenUrl?: string;
  estado: EstadoEvento;
  observaciones?: string;
  motivoRechazo?: string;
  promedioCalificacion?: number;
  totalCalificaciones?: number;
}
