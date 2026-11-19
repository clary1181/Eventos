import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

// Iconos blancos en la barra de estado mientras el encabezado con foto está visible
export function useBarraClara() {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
    }, [])
  );
}
