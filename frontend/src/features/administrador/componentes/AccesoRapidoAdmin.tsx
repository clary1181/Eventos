import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colores } from '@/compartido/tema';

interface Propiedades {
  icono: React.ReactNode;
  etiqueta: string;
  alPulsar: () => void;
}

export function AccesoRapidoAdmin({ icono, etiqueta, alPulsar }: Propiedades) {
  return (
    <Pressable
      onPress={alPulsar}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.8 }]}
    >
      {icono}
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1, minHeight: 92, borderRadius: 20, backgroundColor: '#F1EAFC', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 4, gap: 6,
    shadowColor: '#4B1D8F', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  etiqueta: { fontSize: 13, color: Colores.texto, textAlign: 'center', lineHeight: 17, fontWeight: '500' },
});
