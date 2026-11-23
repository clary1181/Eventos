export const TITULO_MOTIVO: Record<string, string> = {
  informacion_falsa: 'Información falsa',
  spam: 'Spam',
  fraude: 'Posible fraude',
  contenido_inapropiado: 'Contenido inapropiado',
  otro: 'Otro',
};

export interface ReporteOrganizador {
  id: string;
  eventoId: string;
  eventoTitulo: string;
  motivo: string;
  descripcion: string;
  resolucion: string;
  creadoEn: Date | null;
  respuesta: string;
  respondidoEn: Date | null;
}
