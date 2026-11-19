import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { dictaminarEvento, escucharEventos } from '../servicios/servicioRevisionEventos';
import type { EstadoEvento, EventoAdmin } from '../tipos';

export function useRevisionEventos() {
  const [eventos, setEventos] = useState<EventoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<EstadoEvento>('pendiente_aprobacion');
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(
    () =>
      escucharEventos(
        (l) => { setEventos(l); setCargando(false); setError(null); },
        (e) => { console.error('Error al escuchar eventos:', e); setError('No se pudieron cargar los eventos.'); setCargando(false); }
      ),
    []
  );

  const conteos = useMemo(() => {
    const c: Record<EstadoEvento, number> = { pendiente_aprobacion: 0, requiere_correccion: 0, aprobado: 0, rechazado: 0, suspendido: 0 };
    eventos.forEach((e) => { if (c[e.estado] !== undefined) c[e.estado] += 1; });
    return c;
  }, [eventos]);

  // Pendientes: el más antiguo primero (cola); el resto: el más reciente primero
  const lista = useMemo(() => {
    const t = (d: Date | null) => d?.getTime() ?? 0;
    return eventos
      .filter((e) => e.estado === pestana)
      .sort((a, b) => (pestana === 'pendiente_aprobacion' ? t(a.creadoEn) - t(b.creadoEn) : t(b.actualizadoEn) - t(a.actualizadoEn)));
  }, [eventos, pestana]);

  const seleccionado = eventos.find((e) => e.id === seleccionadoId) ?? null;

  const dictaminar = useCallback(
    async (estado: 'aprobado' | 'requiere_correccion' | 'rechazado', texto: string) => {
      if (!seleccionado) return;
      if (estado !== 'aprobado' && texto.trim().length === 0) {
        Alert.alert('Texto requerido', estado === 'rechazado' ? 'Escribe el motivo del rechazo.' : 'Indica qué debe corregir el organizador.');
        return;
      }
      setProcesando(true);
      try {
        await dictaminarEvento(seleccionado.id, estado, texto);
        setSeleccionadoId(null);
      } catch (e) {
        console.error('Error al dictaminar el evento:', e);
        Alert.alert('Error', 'No se pudo guardar la decisión. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        setProcesando(false);
      }
    },
    [seleccionado]
  );

  return { lista, conteos, cargando, error, pestana, setPestana, seleccionado, abrir: setSeleccionadoId, cerrar: () => setSeleccionadoId(null), procesando, dictaminar };
}
