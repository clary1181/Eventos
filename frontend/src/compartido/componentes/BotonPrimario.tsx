import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { Colores } from '@/compartido/tema';
import { estilos } from './BotonPrimario.estilos';

type Propiedades = {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  deshabilitado?: boolean;
};

export function BotonPrimario({ titulo, onPress, cargando = false, deshabilitado = false }: Propiedades) {
  const inactivo = cargando || deshabilitado;
  return (
    <Pressable
      style={({ pressed }) => [estilos.boton, (inactivo || pressed) && estilos.inactivo]}
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      {cargando ? (
        <ActivityIndicator color={Colores.textoSobrePrimario} />
      ) : (
        <Text style={estilos.texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}
