import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

// 'light' sobre la foto del encabezado, 'dark' sobre fondo blanco
export function useBarraEstadoAsistente(estilo: 'light' | 'dark') {
  useFocusEffect(useCallback(() => { setStatusBarStyle(estilo); }, [estilo]));
}
