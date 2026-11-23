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
  fotoUri: string | null;
}

export const FORMULARIO_VACIO: DatosFormularioEvento = {
  titulo: '', descripcion: '', categoria: '', fechaInicio: null, fechaFin: null,
  lugar: '', direccion: '', precio: '', capacidad: '', fotoUri: null,
};

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
