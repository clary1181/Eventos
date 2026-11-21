import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { aprobarCambios, dictaminarEvento, escucharEventos, rechazarCambios } from '../servicios/servicioRevisionEventos';
import type { EventoAdmin, PestanaEventoId } from '../tipos';

export function useRevisionEventos() {
  const [eventos, setEventos] = useState<EventoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<PestanaEventoId>('pendiente_aprobacion');
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
    const c: Record<PestanaEventoId, number> = { pendiente_aprobacion: 0, requiere_correccion: 0, aprobado: 0, rechazado: 0, suspendido: 0, cambios: 0 };
    eventos.forEach((e) => {
      if (c[e.estado] !== undefined) c[e.estado] += 1;
      if (e.estado === 'aprobado' && e.estadoCambio === 'pendiente') c.cambios += 1;
    });
    return c;
  }, [eventos]);

  // Pendientes: el más antiguo primero (cola); el resto: el más reciente primero
  const lista = useMemo(() => {
    const t = (d: Date | null) => d?.getTime() ?? 0;
    if (pestana === 'cambios') {
      return eventos
        .filter((e) => e.estado === 'aprobado' && e.estadoCambio === 'pendiente')
        .sort((a, b) => t(a.propuesta?.solicitadoEn ?? null) - t(b.propuesta?.solicitadoEn ?? null));
    }
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

  const resolverCambios = useCallback(
    async (accion: 'aprobar' | 'rechazar', texto: string) => {
      if (!seleccionado) return;
      if (accion === 'rechazar' && texto.trim().length === 0) {
        Alert.alert('Texto requerido', 'Escribe el motivo por el que rechazas los cambios.');
        return;
      }
      setProcesando(true);
      try {
        if (accion === 'aprobar') await aprobarCambios(seleccionado);
        else await rechazarCambios(seleccionado.id, texto);
        setSeleccionadoId(null);
      } catch (e) {
        console.error('Error al resolver los cambios:', e);
        Alert.alert('Error', 'No se pudo guardar la decisión. Revisa tu conexión y que hayas publicado las reglas nuevas.');
      } finally {
        setProcesando(false);
      }
    },
    [seleccionado]
  );

  return { lista, conteos, cargando, error, pestana, setPestana, seleccionado, abrir: setSeleccionadoId, cerrar: () => setSeleccionadoId(null), procesando, dictaminar, resolverCambios };
}
