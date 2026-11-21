import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Propiedades {
  valor: number; // 0 a 5 (admite decimales al mostrar)
  tamano?: number;
  alCambiar?: (n: number) => void; // si existe, las estrellas se pueden tocar
}

export function Estrellas({ valor, tamano = 20, alCambiar }: Propiedades) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const nombre = valor >= n - 0.25 ? 'star' : valor >= n - 0.75 ? 'star-half' : 'star-outline';
        const icono = <Ionicons name={nombre} size={tamano} color="#F5B301" />;
        return alCambiar ? (
          <Pressable key={n} onPress={() => alCambiar(n)} hitSlop={4} accessibilityRole="button" accessibilityLabel={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}>
            {icono}
          </Pressable>
        ) : (
          <View key={n}>{icono}</View>
        );
      })}
    </View>
  );
}
