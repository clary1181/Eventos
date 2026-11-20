import { useEffect, useMemo, useState } from 'react';
import { escucharMisEntradas } from '../servicios/servicioMisEntradas';
import { estadoEntrada, type EntradaAsistente } from '../utilidades/entradas';

export type PestanaEntradas = 'proximas' | 'anteriores';

export function useMisEntradas(uid: string | undefined) {
  const [todas, setTodas] = useState<EntradaAsistente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<PestanaEntradas>('proximas');

  useEffect(() => {
    if (!uid) return;
    return escucharMisEntradas(
      uid,
      (l) => { setTodas(l); setCargando(false); setError(null); },
      (e) => { console.error('Error al cargar entradas:', e); setError('No se pudieron cargar tus entradas.'); setCargando(false); }
    );
  }, [uid]);

  const { proximas, anteriores } = useMemo(() => {
    const ahora = Date.now();
    const p = todas.filter((e) => estadoEntrada(e, ahora) === 'valida')
      .sort((a, b) => a.eventoFechaInicio.getTime() - b.eventoFechaInicio.getTime() || a.numero - b.numero);
    const a = todas.filter((e) => estadoEntrada(e, ahora) !== 'valida')
      .sort((x, y) => y.eventoFechaInicio.getTime() - x.eventoFechaInicio.getTime() || x.numero - y.numero);
    return { proximas: p, anteriores: a };
  }, [todas]);

  return { cargando, error, pestana, setPestana, proximas, anteriores, lista: pestana === 'proximas' ? proximas : anteriores };
}
