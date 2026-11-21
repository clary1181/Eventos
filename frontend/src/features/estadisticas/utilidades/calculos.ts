import type { Evento } from '@/features/eventos';
import type { CalificacionResumen, EntradaResumen, Periodo, PuntoVenta } from '../tipos';

const DIA = 24 * 60 * 60 * 1000;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const LETRAS_DIA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const suma = (l: number[]) => l.reduce((a, b) => a + b, 0);
const inicioDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const diasEntre = (a: Date, b: Date) => Math.round((inicioDia(b).getTime() - inicioDia(a).getTime()) / DIA);

export const desdePeriodo = (p: Periodo, ahora: number) => {
  if (p === 'todo') return 0;
  const hoy = new Date(ahora);
  return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - ((p === '7d' ? 7 : 30) - 1)).getTime();
};

export const NOMBRE_PERIODO: Record<Periodo, string> = { '7d': 'Últimos 7 días', '30d': 'Últimos 30 días', todo: 'Todo el tiempo' };

// Serie diaria de n días a partir de "inicio" (una barra por día)
function serieDiaria(entradas: EntradaResumen[], inicio: Date, n: number, etiquetaCorta: boolean): PuntoVenta[] {
  const puntos: PuntoVenta[] = Array.from({ length: n }, (_, i) => {
    const d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    const etiqueta = etiquetaCorta ? LETRAS_DIA[d.getDay()] : i % 5 === 0 ? String(d.getDate()) : '';
    return { etiqueta, entradas: 0, ingresos: 0 };
  });
  entradas.forEach((e) => {
    const i = diasEntre(inicio, e.creadaEn);
    if (i >= 0 && i < n) { puntos[i].entradas += 1; puntos[i].ingresos += e.precio; }
  });
  return puntos;
}

// Ventas del organizador: 7 o 30 días en barras diarias; "todo" agrupa por mes (últimos 6)
export function serieVentas(entradas: EntradaResumen[], periodo: Periodo, ahora: number): PuntoVenta[] {
  const hoy = new Date(ahora);
  if (periodo === 'todo') {
    const base = hoy.getFullYear() * 12 + hoy.getMonth();
    const puntos: PuntoVenta[] = Array.from({ length: 6 }, (_, i) => ({ etiqueta: MESES[(base - 5 + i) % 12], entradas: 0, ingresos: 0 }));
    entradas.forEach((e) => {
      const i = e.creadaEn.getFullYear() * 12 + e.creadaEn.getMonth() - (base - 5);
      if (i >= 0 && i < 6) { puntos[i].entradas += 1; puntos[i].ingresos += e.precio; }
    });
    return puntos;
  }
  const n = periodo === '7d' ? 7 : 30;
  return serieDiaria(entradas, new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (n - 1)), n, periodo === '7d');
}

// Ventas de un evento: desde la primera venta (máx. 30 días atrás) hasta hoy
export function serieEvento(entradas: EntradaResumen[], ahora: number): PuntoVenta[] {
  if (entradas.length === 0) return [];
  const hoy = new Date(ahora);
  const primera = new Date(Math.min(...entradas.map((e) => e.creadaEn.getTime())));
  const n = Math.min(30, Math.max(7, diasEntre(primera, hoy) + 1));
  return serieDiaria(entradas, new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (n - 1)), n, n <= 7);
}

export interface ResumenGeneral {
  ingresos: number;
  entradas: number;
  asistencia: number | null;   // 0..1, solo eventos ya finalizados
  ocupacion: number | null;    // 0..1, vendidas / capacidad de los eventos publicados
  activos: number;
  promedio: number | null;
  totalCalificaciones: number;
}

export function calcularResumen(eventos: Evento[], entradas: EntradaResumen[], calificaciones: CalificacionResumen[], periodo: Periodo, ahora = Date.now()): ResumenGeneral {
  const desde = desdePeriodo(periodo, ahora);
  const delPeriodo = entradas.filter((e) => e.creadaEn.getTime() >= desde);
  const aprobados = eventos.filter((e) => e.estado === 'aprobado');
  const finalizados = new Set(aprobados.filter((e) => e.fechaFin.getTime() < ahora).map((e) => e.id));
  const deFinalizados = entradas.filter((e) => finalizados.has(e.eventoId));
  const capacidad = suma(aprobados.map((e) => e.capacidad));
  return {
    ingresos: suma(delPeriodo.map((e) => e.precio)),
    entradas: delPeriodo.length,
    asistencia: deFinalizados.length ? deFinalizados.filter((e) => e.usada).length / deFinalizados.length : null,
    ocupacion: capacidad ? suma(aprobados.map((e) => e.vendidas)) / capacidad : null,
    activos: aprobados.filter((e) => e.fechaFin.getTime() >= ahora).length,
    promedio: calificaciones.length ? suma(calificaciones.map((c) => c.estrellas)) / calificaciones.length : null,
    totalCalificaciones: calificaciones.length,
  };
}

export interface RendimientoEvento { evento: Evento; vendidas: number; ingresos: number; usadas: number }

// Una fila por evento con ventas o publicado, del que más ingresos genera al que menos
export function rendimientoPorEvento(eventos: Evento[], entradas: EntradaResumen[]): RendimientoEvento[] {
  const porEvento = new Map<string, EntradaResumen[]>();
  entradas.forEach((e) => porEvento.set(e.eventoId, [...(porEvento.get(e.eventoId) ?? []), e]));
  return eventos
    .filter((e) => e.estado === 'aprobado' || e.vendidas > 0)
    .map((evento) => {
      const l = porEvento.get(evento.id) ?? [];
      return { evento, vendidas: Math.max(evento.vendidas, l.length), ingresos: suma(l.map((x) => x.precio)), usadas: l.filter((x) => x.usada).length };
    })
    .sort((a, b) => b.ingresos - a.ingresos || b.vendidas - a.vendidas);
}

export const distribucionEstrellas = (cals: CalificacionResumen[]) =>
  [5, 4, 3, 2, 1].map((n) => ({ estrellas: n, total: cals.filter((c) => c.estrellas === n).length }));

export const porcentaje = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);
