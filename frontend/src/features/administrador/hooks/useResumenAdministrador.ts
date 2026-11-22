import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { Periodo } from '@/features/estadisticas';
import { obtenerDatosPlataforma, type DatosPlataforma } from '../servicios/servicioResumenAdmin';
import { estadisticasPlataforma, resumenInicio } from '../utilidades/calculosPlataforma';

// Carga los datos al recuperar el foco (al volver de revisar algo se actualizan). El periodo se aplica sin volver a consultar.
export function useResumenAdministrador(periodo: Periodo = 'todo') {
  const [datos, setDatos] = useState<DatosPlataforma | null>(null);
  const [actualizando, setActualizando] = useState(false);

  const cargar = useCallback(async () => {
    setActualizando(true);
    try {
      setDatos(await obtenerDatosPlataforma());
    } finally {
      setActualizando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void cargar(); }, [cargar]));

  const resumen = useMemo(() => (datos ? resumenInicio(datos, periodo) : null), [datos, periodo]);
  const estadisticas = useMemo(() => (datos ? estadisticasPlataforma(datos, periodo) : null), [datos, periodo]);

  return { resumen, estadisticas, actualizando, recargar: cargar };
}
