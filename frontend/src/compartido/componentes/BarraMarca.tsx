import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { BotonIcono } from './BotonIcono';
import { IconoTicket } from './IconoTicket';
import { estilos } from './BarraMarca.estilos';

type Propiedades = { alAtras?: () => void; derecha?: ReactNode };

export function BarraMarca({ alAtras, derecha }: Propiedades) {
  return (
    <View style={estilos.fila}>
      <View style={estilos.izquierda}>
        {alAtras && <BotonIcono icono="chevron-back" onPress={alAtras} etiqueta="Volver" />}
        <IconoTicket ancho={alAtras ? 54 : 62} />
        <Text style={estilos.nombre} numberOfLines={1}>MR-Eventos</Text>
      </View>
      <View style={estilos.derecha}>{derecha}</View>
    </View>
  );
}
