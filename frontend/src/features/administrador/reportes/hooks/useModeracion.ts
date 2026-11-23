import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSesion } from '@/features/auth';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import {
  cambiarVisibilidadCalificacion, escucharCalificacionesAdmin, escucharReportes, obtenerContextoReporte, resolverReporte,
} from '../servicios/servicioModeracion';
import type { AccionReporte, CalificacionAdmin, ContextoReporte, ReporteAdmin } from '../tipos';

export type Seccion = 'reportes' | 'calificaciones';
export type PestanaReportes = 'pendientes' | 'atendidos';

export function useModeracion() {
  const { perfil } = useSesion();
  const [reportes, setReportes] = useState<ReporteAdmin[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seccion, setSeccion] = useState<Seccion>('reportes');
  const [pestana, setPestana] = useState<PestanaReportes>('pendientes');
  const [seleccionado, setSeleccionado] = useState<ReporteAdmin | null>(null);
  const [contexto, setContexto] = useState<ContextoReporte | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const a = escucharReportes(
      (l) => { setReportes(l); setCargando(false); setError(null); },
      (e) => { console.error('Error al cargar reportes:', e); setError('No se pudieron cargar los reportes.'); setCargando(false); }
    );
    const b = escucharCalificacionesAdmin(setCalificaciones, (e) => console.warn('Error al cargar calificaciones:', e));
    return () => { a(); b(); };
  }, []);

  const pendientes = useMemo(() => reportes.filter((r) => r.estado === 'pendiente_moderacion'), [reportes]);
  const atendidos = useMemo(() => reportes.filter((r) => r.estado !== 'pendiente_moderacion'), [reportes]);

  const abrir = useCallback((r: ReporteAdmin) => {
    setSeleccionado(r);
    setContexto(null);
    obtenerContextoReporte(r).then(setContexto).catch((e) => {
      console.warn('No se pudo cargar el contexto del reporte:', e);
      setContexto(null);
    });
  }, []);
  const cerrar = useCallback(() => { if (!procesando) setSeleccionado(null); }, [procesando]);

  const resolver = useCallback(
    async (accion: AccionReporte, nota: string) => {
      if (!seleccionado || !perfil) return;
      setProcesando(true);
      try {
        await resolverReporte(perfil.uid, seleccionado, accion, nota.trim());
        setSeleccionado(null);
      } catch (e) {
        console.error('Error al resolver el reporte:', e);
        mostrarAviso({
          titulo: 'No se pudo completar',
          mensaje: accion === 'suspender'
            ? 'No se pudo suspender el evento. Solo se pueden suspender eventos aprobados; revisa que hayas publicado las reglas nuevas.'
            : 'Revisa tu conexión y que hayas publicado las reglas nuevas.',
          tipo: 'error',
        });
      } finally {
        setProcesando(false);
      }
    },
    [seleccionado, perfil]
  );

  const alternarOculta = useCallback(async (c: CalificacionAdmin) => {
    try {
      await cambiarVisibilidadCalificacion(c.id, !c.oculta);
    } catch (e) {
      console.error('Error al cambiar la calificación:', e);
      mostrarAviso({ titulo: 'No se pudo actualizar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.', tipo: 'error' });
    }
  }, []);

  return {
    cargando, error, seccion, setSeccion, pestana, setPestana, pendientes, atendidos,
    lista: pestana === 'pendientes' ? pendientes : atendidos, calificaciones,
    seleccionado, contexto, procesando, abrir, cerrar, resolver, alternarOculta,
  };
}
