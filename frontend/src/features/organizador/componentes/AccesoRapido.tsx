import React from 'react';
import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './AccesoRapido.estilos';

type Icono = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Propiedades {
  icono: Icono;
  titulo: string;
  alPresionar: () => void;
}

export function AccesoRapido({ icono, titulo, alPresionar }: Propiedades) {
  return (
    <Pressable
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      <MaterialCommunityIcons name={icono} size={24} color={Colores.primario} />
      <Text style={estilos.titulo} numberOfLines={2}>{titulo}</Text>
    </Pressable>
  );
}