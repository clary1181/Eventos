import React from 'react';
import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './AccesoRapido.estilos';

type Propiedades = {
  icono: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  titulo: string;
  alPresionar: () => void;
};

export function AccesoRapido({ icono, titulo, alPresionar }: Propiedades) {
  return (
    <Pressable style={({ pressed }) => [estilos.tile, pressed && estilos.presionado]} onPress={alPresionar} accessibilityRole="button">
      <MaterialCommunityIcons name={icono} size={34} color={Colores.primarioOscuro} />
      <Text style={estilos.texto} numberOfLines={2}>{titulo}</Text>
    </Pressable>
  );
}
