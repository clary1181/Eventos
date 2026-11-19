import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

// Pone la barra de estado clara u oscura mientras la pantalla está enfocada.
// 'light' = iconos blancos (para pantallas con la foto morada arriba).
export function useBarraEstado(estilo: 'light' | 'dark') {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(estilo);
    }, [estilo]),
  );
}
