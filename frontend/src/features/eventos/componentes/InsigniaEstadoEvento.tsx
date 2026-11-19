import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRESENTACION_ESTADO } from '../constantes';
import type { EstadoEvento } from '../tipos';
import { estilos } from './InsigniaEstadoEvento.estilos';

export function InsigniaEstadoEvento({ estado }: { estado: EstadoEvento }) {
  const p = PRESENTACION_ESTADO[estado];
  return (
    <View style={[estilos.insignia, { backgroundColor: p.fondo }]}>
      <Ionicons name={p.icono} size={14} color={p.color} />
      <Text style={[estilos.texto, { color: p.color }]} numberOfLines={1}>{p.etiqueta}</Text>
    </View>
  );
}
