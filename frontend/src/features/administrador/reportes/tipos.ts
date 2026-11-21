export type MotivoReporte = 'informacion_falsa' | 'spam' | 'fraude' | 'contenido_inapropiado' | 'otro';

export const TITULO_MOTIVO: Record<MotivoReporte, string> = {
  informacion_falsa: 'Información falsa',
  spam: 'Spam',
  fraude: 'Posible fraude',
  contenido_inapropiado: 'Contenido inapropiado',
  otro: 'Otro',
};

export type EstadoReporte = 'pendiente_moderacion' | 'resuelto' | 'desestimado';
export type AccionReporte = 'desestimar' | 'resolver' | 'suspender';

export interface ReporteAdmin {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  organizadorId: string;
  reportanteId: string;
  motivo: MotivoReporte;
  descripcion: string;
  estado: EstadoReporte;
  resolucion: string;
  creadoEn: Date | null;
}

export interface CalificacionAdmin {
  id: string;
  eventoTitulo: string;
  asistenteNombre: string;
  estrellas: number;
  comentario: string;
  oculta: boolean;
  creadaEn: Date | null;
}

// Datos extra que se cargan al abrir un reporte
export interface ContextoReporte {
  reportante: string;
  organizador: string;
  estadoEvento: string;
}
