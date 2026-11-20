import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Propiedades {
  activo: boolean;
  alPulsar: () => void;
  tamano?: number;
  traslucido?: boolean; // sobre una foto oscura (detalle)
}

export function BotonCorazon({ activo, alPulsar, tamano = 36, traslucido = false }: Propiedades) {
  return (
    <Pressable
      onPress={alPulsar}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      style={[
        estilos.boton,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
        traslucido ? estilos.traslucido : estilos.blanco,
      ]}
    >
      <Ionicons
        name={activo ? 'heart' : 'heart-outline'}
        size={tamano * 0.58}
        color={activo ? '#E53935' : traslucido ? '#FFFFFF' : '#2A1560'}
      />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: { alignItems: 'center', justifyContent: 'center' },
  blanco: { backgroundColor: 'rgba(255,255,255,0.95)' },
  traslucido: { backgroundColor: 'rgba(42,21,96,0.45)' },
});
