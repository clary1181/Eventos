import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';

interface Propiedades {
  texto: string;
  aviso?: string; // p. ej. "Quedan 12 entradas"
  habilitado: boolean;
  alPulsar: () => void;
}

// Botón fijo al pie de la pantalla de detalle
export function BarraCompra({ texto, aviso, habilitado, alPulsar }: Propiedades) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[estilos.barra, { paddingBottom: Math.max(bottom, 12) }]}>
      {!!aviso && <Text style={estilos.aviso}>{aviso}</Text>}
      <Pressable
        onPress={alPulsar}
        disabled={!habilitado}
        accessibilityRole="button"
        style={({ pressed }) => [estilos.boton, !habilitado && estilos.deshabilitado, pressed && { opacity: 0.9 }]}
      >
        <MaterialCommunityIcons name="ticket-confirmation-outline" size={30} color="#FFFFFF" />
        <Text style={estilos.texto}>{texto}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', paddingTop: 10, paddingHorizontal: 20,
    shadowColor: '#4B1D8F', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 12,
  },
  aviso: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#B4530A', marginBottom: 6 },
  boton: { height: 62, borderRadius: 31, backgroundColor: Colores.primario, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  deshabilitado: { backgroundColor: '#B9A8D6' },
  texto: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
});
