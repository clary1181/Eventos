import React from 'react';
import { Text, View } from 'react-native';
import { estilos } from './SeparadorO.estilos';

export function SeparadorO({ texto = 'o' }: { texto?: string }) {
  return (
    <View style={estilos.fila}>
      <View style={estilos.linea} />
      <Text style={estilos.texto}>{texto}</Text>
      <View style={estilos.linea} />
    </View>
  );
}
