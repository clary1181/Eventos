import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';

interface Propiedades { siguiendo: boolean; alPulsar: () => void; compacto?: boolean }

export function BotonSeguir({ siguiendo, alPulsar, compacto }: Propiedades) {
  return (
    <Pressable
      onPress={alPulsar}
      accessibilityRole="button"
      accessibilityLabel={siguiendo ? 'Dejar de seguir' : 'Seguir organizador'}
      style={({ pressed }) => [estilos.boton, compacto && estilos.compacto, siguiendo ? estilos.siguiendo : estilos.seguir, pressed && { opacity: 0.85 }]}
    >
      <Ionicons name={siguiendo ? 'checkmark' : 'add'} size={compacto ? 16 : 20} color={siguiendo ? Colores.primario : '#FFFFFF'} />
      <Text style={[estilos.texto, compacto && { fontSize: 13 }, { color: siguiendo ? Colores.primario : '#FFFFFF' }]}>{siguiendo ? 'Siguiendo' : 'Seguir'}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, paddingHorizontal: 22, borderRadius: 23 },
  compacto: { height: 36, paddingHorizontal: 14, borderRadius: 18 },
  seguir: { backgroundColor: Colores.primario },
  siguiendo: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colores.primario },
  texto: { fontSize: 16, fontWeight: '800' },
});
