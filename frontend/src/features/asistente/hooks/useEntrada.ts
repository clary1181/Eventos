import { useEffect, useState } from 'react';
import { escucharEntrada } from '../servicios/servicioMisEntradas';
import type { EntradaAsistente } from '../utilidades/entradas';

export function useEntrada(id: string | undefined) {
  const [entrada, setEntrada] = useState<EntradaAsistente | null>(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    if (!id) { setCargando(false); return; }
    return escucharEntrada(id, (e) => { setEntrada(e); setCargando(false); }, () => { setEntrada(null); setCargando(false); });
  }, [id]);
  return { entrada, cargando };
}
