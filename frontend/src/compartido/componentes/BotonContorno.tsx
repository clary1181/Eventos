import React, { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { estilos } from './BotonContorno.estilos';

type Propiedades = {
  titulo: string;
  onPress: () => void;
  icono?: ReactNode;
  deshabilitado?: boolean;
};

export function BotonContorno({ titulo, onPress, icono, deshabilitado = false }: Propiedades) {
  return (
    <Pressable
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      {icono}
      <Text style={estilos.texto}>{titulo}</Text>
    </Pressable>
  );
}
