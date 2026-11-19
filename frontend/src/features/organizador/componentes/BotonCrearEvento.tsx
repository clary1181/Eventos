import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './BotonCrearEvento.estilos';

export function BotonCrearEvento({ alPresionar }: { alPresionar: () => void }) {
  return (
    <Pressable style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]} onPress={alPresionar} accessibilityRole="button">
      <Ionicons name="add" size={22} color={Colores.primario} />
      <Text style={estilos.texto}>Crear evento</Text>
    </Pressable>
  );
}
