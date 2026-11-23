import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSesion } from '@/features/auth';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { cambiarVisibilidadCalificacion, escucharCalificacionesAdmin } from '../../reportes/servicios/servicioModeracion';
import type { CalificacionAdmin } from '../../reportes/tipos';
import { UMBRAL_REINCIDENCIA } from '../constantes';
import {
  escucharEventosModerables, escucharOrganizadores, levantarSuspension, reactivarEvento, suspenderCuenta, suspenderEvento,
  type EventoModerable, type OrganizadorModeracion,
} from '../servicios/servicioModerarContenido';

export type SeccionContenido = 'eventos' | 'calificaciones' | 'organizadores';
export type FiltroOrganizadores = 'pendientes' | 'suspendidos';

export interface Reincidente { organizador: OrganizadorModeracion; suspendidos: EventoModerable[]; suspensionActiva: boolean }
export type FiltroEventos = 'publicados' | 'suspendidos';
export type FiltroCalificaciones = 'todas' | 'ocultas';

const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function useModerarContenido() {
  const { perfil } = useSesion();
  const [organizadores, setOrganizadores] = useState<OrganizadorModeracion[]>([]);
  const [filtroOrgs, setFiltroOrgs] = useState<FiltroOrganizadores>('pendientes');
  const [aSancionar, setASancionar] = useState<Reincidente | null>(null);
  const [eventos, setEventos] = useState<EventoModerable[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seccion, setSeccion] = useState<SeccionContenido>('eventos');
  const [filtroEventos, setFiltroEventos] = useState<FiltroEventos>('publicados');
  const [filtroCals, setFiltroCals] = useState<FiltroCalificaciones>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [aSuspender, setASuspender] = useState<EventoModerable | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const a = escucharEventosModerables(
      (l) => { setEventos(l); setCargando(false); setError(null); },
      (e) => { console.error('Error al cargar eventos:', e); setError('No se pudieron cargar los eventos.'); setCargando(false); }
    );
    const b = escucharCalificacionesAdmin(setCalificaciones, (e) => console.warn('Error al cargar calificaciones:', e));
    const c = escucharOrganizadores(setOrganizadores, (e) => console.warn('Error al cargar organizadores:', e));
    return () => { a(); b(); c(); };
  }, []);

  const eventosFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return eventos
      .filter((e) => e.estado === (filtroEventos === 'publicados' ? 'aprobado' : 'suspendido'))
      .filter((e) => texto === '' || normalizar(`${e.titulo} ${e.organizadorNombre}`).includes(texto));
  }, [eventos, filtroEventos, busqueda]);

  const calsFiltradas = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return calificaciones
      .filter((c) => filtroCals === 'todas' || c.oculta)
      .filter((c) => texto === '' || normalizar(`${c.eventoTitulo} ${c.asistenteNombre} ${c.comentario}`).includes(texto));
  }, [calificaciones, filtroCals, busqueda]);

  const reincidentes = useMemo<Reincidente[]>(() => {
    const ahora = Date.now();
    return organizadores
      .map((o): Reincidente => ({
        organizador: o,
        suspendidos: eventos.filter((e) => e.estado === 'suspendido' && e.organizadorId === o.uid),
        suspensionActiva: !!o.suspensionHasta && o.suspensionHasta.getTime() > ahora,
      }))
      .filter((r) => r.suspendidos.length >= UMBRAL_REINCIDENCIA || r.suspensionActiva)
      .sort((a, b) => b.suspendidos.length - a.suspendidos.length);
  }, [organizadores, eventos]);

  const orgsPendientes = useMemo(() => reincidentes.filter((r) => !r.suspensionActiva), [reincidentes]);
  const orgsSuspendidos = useMemo(() => reincidentes.filter((r) => r.suspensionActiva), [reincidentes]);
  const orgsFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return (filtroOrgs === 'pendientes' ? orgsPendientes : orgsSuspendidos).filter((r) => texto === '' || normalizar(r.organizador.nombre).includes(texto));
  }, [filtroOrgs, orgsPendientes, orgsSuspendidos, busqueda]);

  const confirmarSancion = useCallback(async (dias: number, motivo: string) => {
    if (!aSancionar || !perfil) return;
    if (motivo.trim().length === 0) { mostrarAviso({ titulo: 'Motivo requerido', mensaje: 'Explica el motivo de la suspensión; el organizador lo verá.', tipo: 'error' }); return; }
    setProcesando(true);
    try {
      await suspenderCuenta(perfil.uid, aSancionar.organizador.uid, dias, motivo);
      setASancionar(null);
    } catch (e) {
      console.error('Error al suspender la cuenta:', e);
      mostrarAviso({ titulo: 'No se pudo suspender', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas.', tipo: 'error' });
    } finally {
      setProcesando(false);
    }
  }, [aSancionar, perfil]);

  const quitarSancion = useCallback((r: Reincidente) => {
    mostrarAviso({
      titulo: 'Levantar suspensión',
      mensaje: `${r.organizador.nombre} podrá volver a crear y editar eventos de inmediato.`,
      tipo: 'info',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Levantar',
      alConfirmar: () => { void levantarSuspension(r.organizador.uid).catch((err) => {
          console.error('Error al levantar la suspensión:', err);
          mostrarAviso({ titulo: 'No se pudo levantar', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas.', tipo: 'error' });
        }); },
    });
  }, []);

  const confirmarSuspension = useCallback(async (motivo: string) => {
    if (!aSuspender) return;
    if (motivo.trim().length === 0) { mostrarAviso({ titulo: 'Motivo requerido', mensaje: 'Explica por qué se suspende el evento; el organizador lo verá.', tipo: 'error' }); return; }
    setProcesando(true);
    try {
      await suspenderEvento(aSuspender, motivo);
      setASuspender(null);
    } catch (e) {
      console.error('Error al suspender:', e);
      mostrarAviso({ titulo: 'No se pudo suspender', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas.', tipo: 'error' });
    } finally {
      setProcesando(false);
    }
  }, [aSuspender]);

  const reactivar = useCallback((e: EventoModerable) => {
    mostrarAviso({
      titulo: 'Reactivar evento',
      mensaje: `"${e.titulo}" volverá a mostrarse en el catálogo.`,
      tipo: 'info',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Reactivar',
      alConfirmar: () => { void reactivarEvento(e).catch((err) => {
          console.error('Error al reactivar:', err);
          mostrarAviso({ titulo: 'No se pudo reactivar', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas.', tipo: 'error' });
        }); },
    });
  }, []);

  const alternarOculta = useCallback(async (c: CalificacionAdmin) => {
    try { await cambiarVisibilidadCalificacion(c.id, !c.oculta); }
    catch (e) { console.error('Error al cambiar la calificación:', e); mostrarAviso({ titulo: 'No se pudo actualizar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.', tipo: 'error' }); }
  }, []);

  return {
    cargando, error, seccion, setSeccion, busqueda, setBusqueda,
    filtroEventos, setFiltroEventos, filtroCals, setFiltroCals,
    eventos: eventosFiltrados, calificaciones: calsFiltradas,
    totalPublicados: eventos.filter((e) => e.estado === 'aprobado').length,
    totalSuspendidos: eventos.filter((e) => e.estado === 'suspendido').length,
    totalOcultas: calificaciones.filter((c) => c.oculta).length,
    filtroOrgs, setFiltroOrgs, organizadoresLista: orgsFiltrados, totalOrgsPendientes: orgsPendientes.length, totalOrgsSuspendidos: orgsSuspendidos.length,
    aSancionar, setASancionar, confirmarSancion, quitarSancion,
    aSuspender, setASuspender, confirmarSuspension, reactivar, alternarOculta, procesando,
  };
}
