export type EstadoSolicitud = 'pendiente' | 'correccion_requerida' | 'aprobada' | 'rechazada';

export interface DocumentoSubido {
  url: string;
  publicId: string;
}

export interface SolicitudVerificacion {
  organizadorId: string;
  estado: EstadoSolicitud;
  telefono: string;
  redes: string[];
  descripcionActividad: string;
  documentos: { identificacion?: DocumentoSubido; selfie?: DocumentoSubido };
  observaciones?: string;
  reenvios: number;
  creadaEn?: Date;
  actualizadaEn?: Date;
}

export interface DatosVerificacion {
  telefono: string;
  instagram: string | null;
  sitioWeb: string | null;
  descripcionActividad: string;
  selfie: string;
  identificacion: string;
}
