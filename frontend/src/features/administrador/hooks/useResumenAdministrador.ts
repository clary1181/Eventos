import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { obtenerResumenAdministrador } from '../servicios/servicioResumenAdmin';
import type { ResumenAdministrador } from '../tipos';

// Carga los conteos cada vez que la pantalla recupera el foco (al volver de revisar algo se actualizan)
export function useResumenAdministrador() {
  const [resumen, setResumen] = useState<ResumenAdministrador | null>(null);
  const [actualizando, setActualizando] = useState(false);

  const cargar = useCallback(async () => {
    setActualizando(true);
    try {
      setResumen(await obtenerResumenAdministrador());
    } finally {
      setActualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar])
  );

  return { resumen, actualizando, recargar: cargar };
}
