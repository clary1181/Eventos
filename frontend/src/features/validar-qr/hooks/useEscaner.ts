import { useCallback, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { validarEntradaQR } from '../servicios/servicioValidacion';
import type { ResultadoValidacion } from '../tipos';

export function useEscaner(eventoId: string, uid: string) {
  const ocupado = useRef(false);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoValidacion | null>(null);
  const [aceptadas, setAceptadas] = useState(0);

  const alEscanear = useCallback(
    async (texto: string) => {
      if (ocupado.current) return;
      ocupado.current = true;
      setProcesando(true);
      const r = await validarEntradaQR(texto, eventoId, uid);
      Vibration.vibrate(r.tipo === 'ok' ? 80 : [0, 120, 80, 120]);
      if (r.tipo === 'ok') setAceptadas((n) => n + 1);
      setResultado(r);
      setProcesando(false);
    },
    [eventoId, uid]
  );

  const siguiente = useCallback(() => {
    setResultado(null);
    setTimeout(() => { ocupado.current = false; }, 400);
  }, []);

  return { procesando, resultado, aceptadas, alEscanear, siguiente };
}
