import React from 'react';
import { View } from 'react-native';
import { Colores } from '@/compartido/tema';

// Barra horizontal; "valor" va de 0 a 1
export function BarraProgreso({ valor, color = Colores.primario, alto = 8 }: { valor: number; color?: string; alto?: number }) {
  const v = Math.max(0, Math.min(1, Number.isFinite(valor) ? valor : 0));
  return (
    <View style={{ height: alto, borderRadius: alto / 2, backgroundColor: '#ECE6F7', overflow: 'hidden' }}>
      <View style={{ width: `${v * 100}%`, height: '100%', borderRadius: alto / 2, backgroundColor: color }} />
    </View>
  );
}
