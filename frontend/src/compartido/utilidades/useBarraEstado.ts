import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

export function useBarraEstado(estilo: 'light' | 'dark') {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(estilo);
    }, [estilo]),
  );
}
