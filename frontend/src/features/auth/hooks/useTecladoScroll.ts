import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, TextInput } from 'react-native';

// Evita que el teclado tape el campo que se está escribiendo
export function useTecladoScroll(margen = 24) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollY = useRef(0);
  const topeTeclado = useRef<number | null>(null);
  const [altoTeclado, establecerAltoTeclado] = useState(0);

  const asegurarVisible = useCallback(() => {
    const campo = TextInput.State.currentlyFocusedInput?.();
    if (!campo || topeTeclado.current === null) return;
    campo.measureInWindow((_x, y, _ancho, alto) => {
      const exceso = y + alto + margen - (topeTeclado.current ?? Infinity);
      if (exceso > 0) scrollRef.current?.scrollTo({ y: scrollY.current + exceso, animated: true });
    });
  }, [margen]);

  useEffect(() => {
    const mostrar = Keyboard.addListener('keyboardDidShow', (e) => {
      topeTeclado.current = e.endCoordinates.screenY;
      establecerAltoTeclado(e.endCoordinates.height);
      setTimeout(asegurarVisible, 120);
    });
    const ocultar = Keyboard.addListener('keyboardDidHide', () => {
      topeTeclado.current = null;
      establecerAltoTeclado(0);
    });
    return () => { mostrar.remove(); ocultar.remove(); };
  }, [asegurarVisible]);

  return {
    scrollRef,
    alScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => { scrollY.current = e.nativeEvent.contentOffset.y; },
    // Se llama al enfocar otro campo con el teclado ya abierto
    alEnfocar: () => { setTimeout(asegurarVisible, 120); },
    // Espacio extra al final para poder desplazar hasta el último campo (en iOS lo resuelve KeyboardAvoidingView)
    rellenoTeclado: Platform.OS === 'android' ? altoTeclado : 0,
  };
}