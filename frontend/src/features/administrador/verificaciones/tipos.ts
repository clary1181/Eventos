export type EstadoSolicitud = 'pendiente' | 'correccion_requerida' | 'aprobada' | 'rechazada';

export interface DocumentoAdmin {
  clave: string;
  etiqueta: string;
  url: string;
}

export interface SolicitudAdmin {
  id: string; // = uid del organizador
  estado: EstadoSolicitud;
  telefono: string;
  redes: string[];
  descripcionActividad: string;
  rfc: string;
  documentos: DocumentoAdmin[];
  reenvios: number;
  observaciones: string;
  creadaEn: Date | null;
  actualizadaEn: Date | null;
  revisadaEn: Date | null;
}

export interface PerfilResumido {
  nombreCompleto: string;
  nombreUsuario: string;
  ciudad: string;
}

export interface PestanaBandeja {
  estado: EstadoSolicitud;
  etiqueta: string;
  color: string;
}

export const PESTANAS_BANDEJA: PestanaBandeja[] = [
  { estado: 'pendiente', etiqueta: 'Pendientes', color: '#6A2FB0' },
  { estado: 'correccion_requerida', etiqueta: 'Devueltas', color: '#E8871A' },
  { estado: 'aprobada', etiqueta: 'Aceptadas', color: '#1B7F3B' },
  { estado: 'rechazada', etiqueta: 'Rechazadas', color: '#C62828' },
];

export const ETIQUETA_ESTADO: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  correccion_requerida: 'Devuelta',
  aprobada: 'Aceptada',
  rechazada: 'Rechazada',
};
