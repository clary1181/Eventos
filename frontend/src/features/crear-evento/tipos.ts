export interface DatosFormularioEvento {
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  lugar: string;
  direccion: string;
  precio: string;
  capacidad: string;
  fotoUri: string | null; // ruta local si se eligió una foto nueva; URL remota si es la que ya tenía
}

export const FORMULARIO_VACIO: DatosFormularioEvento = {
  titulo: '', descripcion: '', categoria: '', fechaInicio: null, fechaFin: null,
  lugar: '', direccion: '', precio: '', capacidad: '', fotoUri: null,
};

// Evento tal como se carga para corregirlo
export interface EventoEditable {
  id: string;
  estado: string;
  observaciones: string;
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
}

// Las reglas solo dejan al organizador editar directamente eventos que aún no son públicos
export const ESTADOS_EDITABLES = ['pendiente_aprobacion', 'requiere_correccion'];

export const desdeEvento = (e: EventoEditable): DatosFormularioEvento => ({
  titulo: e.titulo,
  descripcion: e.descripcion,
  categoria: e.categoria,
  fechaInicio: e.fechaInicio,
  fechaFin: e.fechaFin,
  lugar: e.lugar,
  direccion: e.direccion,
  precio: String(e.precio),
  capacidad: String(e.capacidad),
  fotoUri: e.imagenUrl,
});
