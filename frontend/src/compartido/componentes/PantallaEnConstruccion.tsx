import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { estilos } from './PantallaEnConstruccion.estilos';

type Propiedades = {
  titulo: string;
  descripcion: string;
  icono: React.ComponentProps<typeof Ionicons>['name'];
};

export function PantallaEnConstruccion({ titulo, descripcion, icono }: Propiedades) {
  useBarraEstado('dark');
  return (
    <View style={estilos.raiz}>
      <View style={estilos.circulo}>
        <Ionicons name={icono} size={44} color={Colores.primario} />
      </View>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descripcion}>{descripcion}</Text>
    </View>
  );
}
