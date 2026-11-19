import { CATEGORIAS_EVENTO } from '../categorias';
import type { DatosFormularioEvento } from '../tipos';

// Quita < > y caracteres de control; conserva los saltos de línea de la descripción
export const limpiarTexto = (t: string, conSaltos = false): string => {
  const base = t.replace(/[<>]/g, '').replace(conSaltos ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ');
  return (conSaltos ? base.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : base.replace(/\s+/g, ' ')).trim();
};

export const aNumeroPrecio = (t: string) => Number(t.trim().replace(',', '.'));

const MARGEN_INICIO_MS = 2 * 60 * 1000;

interface Opciones {
  inicioSinCambios?: boolean; // al editar: si el inicio no cambió, no se exige que sea futuro (las reglas tampoco)
  vendidas?: number;          // al editar: la capacidad no puede bajar de lo ya vendido
}

// Mismos límites que las reglas de Firestore (eventoValido). Devuelve el primer error o null.
export function validarEvento(d: DatosFormularioEvento, opciones: Opciones = {}): string | null {
  const titulo = limpiarTexto(d.titulo);
  if (titulo.length < 3 || titulo.length > 100) return 'El título debe tener entre 3 y 100 caracteres.';

  const descripcion = limpiarTexto(d.descripcion, true);
  if (descripcion.length < 10) return 'La descripción debe tener al menos 10 caracteres.';
  if (descripcion.length > 2000) return 'La descripción no puede pasar de 2000 caracteres.';

  if (!(CATEGORIAS_EVENTO as readonly string[]).includes(d.categoria)) return 'Elige una categoría.';

  if (!d.fechaInicio) return 'Escribe una fecha y hora de inicio válidas.';
  if (!opciones.inicioSinCambios && d.fechaInicio.getTime() <= Date.now() + MARGEN_INICIO_MS) {
    return 'El inicio debe ser una fecha y hora futuras.';
  }
  if (!d.fechaFin) return 'Escribe una fecha y hora de fin válidas.';
  if (d.fechaFin.getTime() <= d.fechaInicio.getTime()) return 'El fin debe ser posterior al inicio.';

  const lugar = limpiarTexto(d.lugar);
  if (lugar.length < 2 || lugar.length > 100) return 'El nombre del lugar debe tener entre 2 y 100 caracteres.';
  const direccion = limpiarTexto(d.direccion);
  if (direccion.length < 5 || direccion.length > 200) return 'La dirección debe tener entre 5 y 200 caracteres.';

  const precio = aNumeroPrecio(d.precio);
  if (d.precio.trim() === '' || !Number.isFinite(precio) || precio < 0 || precio > 100000) {
    return 'El precio debe ser un número entre 0 y 100,000 (usa 0 si es gratuito).';
  }
  if (!/^\d+$/.test(d.capacidad.trim()) || Number(d.capacidad) < 1 || Number(d.capacidad) > 100000) {
    return 'La capacidad debe ser un entero entre 1 y 100,000.';
  }
  if (opciones.vendidas !== undefined && Number(d.capacidad) < opciones.vendidas) {
    return `La capacidad no puede ser menor a las entradas ya vendidas (${opciones.vendidas}).`;
  }
  if (!d.fotoUri) return 'Elige una foto de portada.';
  return null;
}
