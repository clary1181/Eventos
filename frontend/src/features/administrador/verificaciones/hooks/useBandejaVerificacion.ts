import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSesion } from '@/features/auth';
import {
  escucharSolicitudes, obtenerPerfilResumido, resolverSolicitud,
} from '../servicios/servicioBandeja';
import type { EstadoSolicitud, PerfilResumido, SolicitudAdmin } from '../tipos';

export function useBandejaVerificacion() {
  const { perfil } = useSesion();
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [perfiles, setPerfiles] = useState<Record<string, PerfilResumido>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<EstadoSolicitud>('pendiente');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    return escucharSolicitudes(
      (lista) => { setSolicitudes(lista); setCargando(false); setError(null); },
      (e) => { console.error('Error al escuchar solicitudes:', e); setError('No se pudieron cargar las solicitudes.'); setCargando(false); }
    );
  }, []);

  // Trae el nombre de cada organizador una sola vez
  useEffect(() => {
    solicitudes.forEach((s) => {
      if (perfiles[s.id]) return;
      obtenerPerfilResumido(s.id).then((p) => setPerfiles((previos) => ({ ...previos, [s.id]: p })));
    });
  }, [solicitudes, perfiles]);

  const conteos = useMemo(() => {
    const c: Record<EstadoSolicitud, number> = { pendiente: 0, correccion_requerida: 0, aprobada: 0, rechazada: 0 };
    solicitudes.forEach((s) => { if (c[s.estado] !== undefined) c[s.estado] += 1; });
    return c;
  }, [solicitudes]);

  // Pendientes: la más antigua primero; el resto, la revisada más reciente primero
  const lista = useMemo(() => {
    const t = (d: Date | null) => d?.getTime() ?? 0;
    return solicitudes
      .filter((s) => s.estado === pestana)
      .sort((a, b) => (pestana === 'pendiente' ? t(a.actualizadaEn) - t(b.actualizadaEn) : t(b.revisadaEn) - t(a.revisadaEn)));
  }, [solicitudes, pestana]);

  const seleccionada = solicitudes.find((s) => s.id === seleccionadaId) ?? null;

  const resolver = useCallback(
    async (nuevoEstado: Exclude<EstadoSolicitud, 'pendiente'>, observaciones: string) => {
      if (!seleccionada || !perfil) return;
      if (nuevoEstado !== 'aprobada' && observaciones.trim().length === 0) {
        Alert.alert(
          'Observaciones requeridas',
          nuevoEstado === 'rechazada' ? 'Escribe el motivo del rechazo.' : 'Indica qué debe corregir el organizador.'
        );
        return;
      }
      setProcesando(true);
      try {
        await resolverSolicitud(seleccionada.id, nuevoEstado, observaciones, perfil.uid);
        setSeleccionadaId(null);
      } catch (e) {
        console.error('Error al resolver la solicitud:', e);
        Alert.alert('Error', 'No se pudo guardar la decisión. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        setProcesando(false);
      }
    },
    [seleccionada, perfil]
  );

  return {
    lista, conteos, perfiles, cargando, error, pestana, setPestana,
    seleccionada, abrir: setSeleccionadaId, cerrar: () => setSeleccionadaId(null), procesando, resolver,
  };
}
