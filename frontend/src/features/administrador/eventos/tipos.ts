export type EstadoEvento = 'pendiente_aprobacion' | 'requiere_correccion' | 'aprobado' | 'rechazado' | 'suspendido';

export interface EventoAdmin {
  id: string;
  organizadorId: string;
  organizadorNombre: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  lugar: string;
  direccion: string;
  precio: number;
  capacidad: number;
  vendidas: number;
  imagenUrl: string;
  estado: EstadoEvento;
  observaciones: string;
  motivoRechazo: string;
  creadoEn: Date | null;
  actualizadoEn: Date | null;
  estadoCambio: 'ninguno' | 'pendiente' | 'requiere_correccion';
  observacionesCambio: string;
  propuesta: PropuestaCambio | null; // cambios de fecha, lugar, dirección, precio o foto de un evento con ventas
}

export interface PropuestaCambio {
  fechaInicio?: Date;
  fechaFin?: Date;
  lugar?: string;
  direccion?: string;
  precio?: number;
  imagenUrl?: string;
  imagenPublicId?: string;
  solicitadoEn: Date | null;
}

export type PestanaEventoId = EstadoEvento | 'cambios';

export interface PestanaEventos { estado: PestanaEventoId; etiqueta: string; color: string }

export const PESTANAS_EVENTOS: PestanaEventos[] = [
  { estado: 'pendiente_aprobacion', etiqueta: 'Pendientes', color: '#6A2FB0' },
  { estado: 'requiere_correccion', etiqueta: 'Observados', color: '#E8871A' },
  { estado: 'cambios', etiqueta: 'Cambios', color: '#1D5FA8' },
  { estado: 'aprobado', etiqueta: 'Aprobados', color: '#1B7F3B' },
  { estado: 'rechazado', etiqueta: 'Rechazados', color: '#C62828' },
  { estado: 'suspendido', etiqueta: 'Suspendidos', color: '#6B6778' },
];

export const ETIQUETA_ESTADO_EVENTO: Record<EstadoEvento, string> = {
  pendiente_aprobacion: 'Pendiente',
  requiere_correccion: 'Observado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  suspendido: 'Suspendido',
};
