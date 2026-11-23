import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';

interface Propiedades {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  acento: string;
  alPulsar: () => void;
}

export function FilaTarea({ icono, titulo, descripcion, acento, alPulsar }: Propiedades) {
  return (
    <Pressable
      onPress={alPulsar}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [estilos.fila, pressed && { opacity: 0.85 }]}
    >
      <View style={[estilos.franja, { backgroundColor: acento }]} />
      <View style={estilos.icono}>{icono}</View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo} numberOfLines={1}>{titulo}</Text>
        <Text style={estilos.descripcion} numberOfLines={2}>{descripcion}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={Colores.primarioMedio} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18,
    minHeight: 78, paddingRight: 16, overflow: 'hidden',
    shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  franja: { width: 5, alignSelf: 'stretch' },
  icono: { width: 56, alignItems: 'center' },
  textos: { flex: 1, paddingVertical: 12 },
  titulo: { fontSize: 16, fontWeight: '800', color: Colores.texto },
  descripcion: { fontSize: 13, color: Colores.textoSuave, marginTop: 2, lineHeight: 18 },
});
