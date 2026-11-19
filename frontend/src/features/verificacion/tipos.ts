export type EstadoSolicitud = 'pendiente' | 'correccion_requerida' | 'aprobada' | 'rechazada';

export interface DocumentoSubido {
  url: string;
  publicId: string;
}

// Documento solicitudesVerificacion/{uid} (ver docs/modelo-datos.md, sección 3.4)
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

// Lo que captura el formulario, ya validado. Las imágenes son rutas locales o URLs ya subidas.
export interface DatosVerificacion {
  telefono: string;          // 10 dígitos
  instagram: string | null;  // solo el usuario, sin @
  sitioWeb: string | null;   // URL completa
  descripcionActividad: string;
  selfie: string;
  identificacion: string;
}
