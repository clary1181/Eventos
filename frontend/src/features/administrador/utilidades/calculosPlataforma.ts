import { desdePeriodo, type Periodo } from '@/features/estadisticas';
import type { DatosPlataforma } from '../servicios/servicioResumenAdmin';
import type { ResumenAdministrador } from '../tipos';

const enPeriodo = (d: Date | null, desde: number) => desde === 0 || !d || d.getTime() >= desde;
const suma = (l: number[]) => l.reduce((a, b) => a + b, 0);

export function resumenInicio(d: DatosPlataforma, periodo: Periodo, ahora = Date.now()): ResumenAdministrador {
  const desde = desdePeriodo(periodo, ahora);
  return {
    plataforma: {
      usuarios: d.usuarios ? d.usuarios.filter((u) => enPeriodo(u.creadoEn, desde)).length : null,
      eventosTotales: d.eventos ? d.eventos.filter((e) => enPeriodo(e.creadoEn, desde)).length : null,
      eventosVerificados: d.eventos ? d.eventos.filter((e) => e.estado === 'aprobado' && enPeriodo(e.creadoEn, desde)).length : null,
      entradas: d.entradas ? d.entradas.filter((e) => enPeriodo(e.creadaEn, desde)).length : null,
    },
    tareas: {
      organizadoresPorVerificar: d.solicitudesPendientes,

      eventosPorRevisar: d.eventos ? d.eventos.filter((e) => e.estado === 'pendiente_aprobacion' || (e.estado === 'aprobado' && e.estadoCambio === 'pendiente')).length : null,
      reportesSinRevisar: d.reportes ? d.reportes.filter((r) => r.estado === 'pendiente_moderacion').length : null,
    },
  };
}

export interface ItemDistribucion { etiqueta: string; valor: number; color: string }
export interface ItemRanking { nombre: string; entradas: number; ingresos: number }

const ESTADOS: { id: string; etiqueta: string; color: string }[] = [
  { id: 'aprobado', etiqueta: 'Aprobados', color: '#1B7F3B' },
  { id: 'pendiente_aprobacion', etiqueta: 'Pendientes', color: '#E8871A' },
  { id: 'requiere_correccion', etiqueta: 'Por corregir', color: '#1D5FA8' },
  { id: 'rechazado', etiqueta: 'Rechazados', color: '#C62828' },
  { id: 'suspendido', etiqueta: 'Suspendidos', color: '#6B6778' },
];

export function estadisticasPlataforma(d: DatosPlataforma, periodo: Periodo, ahora = Date.now()) {
  const desde = desdePeriodo(periodo, ahora);
  const usuarios = d.usuarios?.filter((u) => enPeriodo(u.creadoEn, desde)) ?? null;
  const eventos = d.eventos?.filter((e) => enPeriodo(e.creadoEn, desde)) ?? null;
  const entradas = d.entradas?.filter((e) => enPeriodo(e.creadaEn, desde)) ?? null;
  const reportes = d.reportes?.filter((r) => enPeriodo(r.creadoEn, desde)) ?? null;

  let asistencia: number | null = null;
  if (entradas && d.eventos) {
    const terminados = new Set(d.eventos.filter((e) => e.fechaFin && e.fechaFin.getTime() < ahora).map((e) => e.id));
    const deTerminados = entradas.filter((e) => terminados.has(e.eventoId));
    asistencia = deTerminados.length ? deTerminados.filter((e) => e.usada).length / deTerminados.length : null;
  }

  const contar = (l: string[]) => l.reduce<Record<string, number>>((m, k) => ({ ...m, [k]: (m[k] ?? 0) + 1 }), {});
  const porEstado: ItemDistribucion[] | null = eventos
    ? ESTADOS.map((s) => ({ etiqueta: s.etiqueta, color: s.color, valor: eventos.filter((e) => e.estado === s.id).length })).filter((i) => i.valor > 0)
    : null;
  const porCategoria: ItemDistribucion[] | null = eventos
    ? Object.entries(contar(eventos.map((e) => e.categoria || 'Otros'))).map(([etiqueta, valor]) => ({ etiqueta, valor, color: '#5E1F9C' })).sort((a, b) => b.valor - a.valor).slice(0, 6)
    : null;
  const porRol: ItemDistribucion[] | null = usuarios
    ? [
        { etiqueta: 'Asistentes', color: '#5E1F9C', valor: usuarios.filter((u) => u.rol === 'asistente').length },
        { etiqueta: 'Organizadores', color: '#E8871A', valor: usuarios.filter((u) => u.rol === 'organizador').length },
        { etiqueta: 'Administradores', color: '#6B6778', valor: usuarios.filter((u) => u.rol === 'administrador').length },
      ].filter((i) => i.valor > 0)
    : null;
  const reportesPorEstado: ItemDistribucion[] | null = reportes
    ? [
        { etiqueta: 'Pendientes', color: '#E8871A', valor: reportes.filter((r) => r.estado === 'pendiente_moderacion').length },
        { etiqueta: 'Resueltos', color: '#1B7F3B', valor: reportes.filter((r) => r.estado === 'resuelto').length },
        { etiqueta: 'Desestimados', color: '#6B6778', valor: reportes.filter((r) => r.estado === 'desestimado').length },
      ].filter((i) => i.valor > 0)
    : null;

  const titulos = new Map((d.eventos ?? []).map((e) => [e.id, e.titulo]));
  const organizadores = new Map((d.eventos ?? []).map((e) => [e.organizadorId, e.organizadorNombre]));
  const ranking = (clave: (e: { eventoId: string; organizadorId: string }) => string, nombre: (k: string) => string): ItemRanking[] => {
    const m = new Map<string, ItemRanking>();
    (entradas ?? []).forEach((e) => {
      const k = clave(e);
      const a = m.get(k) ?? { nombre: nombre(k), entradas: 0, ingresos: 0 };
      a.entradas += 1; a.ingresos += e.precio; m.set(k, a);
    });
    return [...m.values()].sort((a, b) => b.entradas - a.entradas || b.ingresos - a.ingresos).slice(0, 5);
  };

  return {
    usuariosNuevos: usuarios?.length ?? null,
    organizadoresVerificados: d.usuarios ? d.usuarios.filter((u) => u.rol === 'organizador' && u.estaVerificado).length : null,
    eventosCreados: eventos?.length ?? null,
    eventosPublicados: eventos ? eventos.filter((e) => e.estado === 'aprobado').length : null,
    entradas: entradas?.length ?? null,
    ingresos: entradas ? suma(entradas.map((e) => e.precio)) : null,
    asistencia,
    reportes: reportes?.length ?? null,
    porEstado, porCategoria, porRol, reportesPorEstado,
    topEventos: ranking((e) => e.eventoId, (k) => titulos.get(k) || 'Evento eliminado'),
    topOrganizadores: ranking((e) => e.organizadorId, (k) => organizadores.get(k) || 'Organizador'),
    serieEntradas: (d.entradas ?? []).map((e) => ({ eventoId: e.eventoId, precio: e.precio, usada: e.usada, creadaEn: e.creadaEn ?? new Date() })),
  };
}
