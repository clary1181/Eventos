import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './AvisoObservaciones.estilos';

// Lo que el administrador pidió corregir
export function AvisoObservaciones({ texto }: { texto: string }) {
  return (
    <View style={estilos.caja}>
      <View style={estilos.cabecera}>
        <Ionicons name="alert-circle" size={20} color={Colores.advertencia} />
        <Text style={estilos.titulo}>El administrador pidió correcciones</Text>
      </View>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}
