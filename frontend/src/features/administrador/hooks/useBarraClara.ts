import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';

export function useBarraClara() {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
    }, [])
  );
}
