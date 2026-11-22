import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSesion } from '@/features/auth';
import { cambiarVisibilidadCalificacion, escucharCalificacionesAdmin } from '../../reportes/servicios/servicioModeracion';
import type { CalificacionAdmin } from '../../reportes/tipos';
import { UMBRAL_REINCIDENCIA } from '../constantes';
import {
  escucharEventosModerables, escucharOrganizadores, levantarSuspension, reactivarEvento, suspenderCuenta, suspenderEvento,
  type EventoModerable, type OrganizadorModeracion,
} from '../servicios/servicioModerarContenido';

export type SeccionContenido = 'eventos' | 'calificaciones' | 'organizadores';
export type FiltroOrganizadores = 'pendientes' | 'suspendidos';

// Organizador con eventos suspendidos que requiere atención o ya está sancionado
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

  // Organizadores que llegaron al umbral de eventos suspendidos (o ya tienen una suspensión vigente)
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
    if (motivo.trim().length === 0) { Alert.alert('Motivo requerido', 'Explica el motivo de la suspensión; el organizador lo verá.'); return; }
    setProcesando(true);
    try {
      await suspenderCuenta(perfil.uid, aSancionar.organizador.uid, dias, motivo);
      setASancionar(null);
    } catch (e) {
      console.error('Error al suspender la cuenta:', e);
      Alert.alert('No se pudo suspender', 'Revisa tu conexión y que hayas publicado las reglas nuevas.');
    } finally {
      setProcesando(false);
    }
  }, [aSancionar, perfil]);

  const quitarSancion = useCallback((r: Reincidente) => {
    Alert.alert('Levantar suspensión', `${r.organizador.nombre} podrá volver a crear y editar eventos de inmediato.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Levantar',
        onPress: () => levantarSuspension(r.organizador.uid).catch((err) => {
          console.error('Error al levantar la suspensión:', err);
          Alert.alert('No se pudo levantar', 'Revisa tu conexión y que hayas publicado las reglas nuevas.');
        }),
      },
    ]);
  }, []);

  const confirmarSuspension = useCallback(async (motivo: string) => {
    if (!aSuspender) return;
    if (motivo.trim().length === 0) { Alert.alert('Motivo requerido', 'Explica por qué se suspende el evento; el organizador lo verá.'); return; }
    setProcesando(true);
    try {
      await suspenderEvento(aSuspender, motivo);
      setASuspender(null);
    } catch (e) {
      console.error('Error al suspender:', e);
      Alert.alert('No se pudo suspender', 'Revisa tu conexión y que hayas publicado las reglas nuevas.');
    } finally {
      setProcesando(false);
    }
  }, [aSuspender]);

  const reactivar = useCallback((e: EventoModerable) => {
    Alert.alert('Reactivar evento', `"${e.titulo}" volverá a mostrarse en el catálogo.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reactivar',
        onPress: () => reactivarEvento(e).catch((err) => {
          console.error('Error al reactivar:', err);
          Alert.alert('No se pudo reactivar', 'Revisa tu conexión y que hayas publicado las reglas nuevas.');
        }),
      },
    ]);
  }, []);

  const alternarOculta = useCallback(async (c: CalificacionAdmin) => {
    try { await cambiarVisibilidadCalificacion(c.id, !c.oculta); }
    catch (e) { console.error('Error al cambiar la calificación:', e); Alert.alert('No se pudo actualizar', 'Revisa tu conexión e inténtalo de nuevo.'); }
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
