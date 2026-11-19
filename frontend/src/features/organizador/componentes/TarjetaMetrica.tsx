import React from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './TarjetaMetrica.estilos';

const TONOS = {
  morado: { fondo: Colores.tonoMorado, icono: Colores.primario },
  verde: { fondo: Colores.tonoVerde, icono: Colores.exitoTexto },
  naranja: { fondo: Colores.tonoNaranja, icono: Colores.advertencia },
} as const;

type Propiedades = {
  icono: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  valor: string;
  etiqueta: string;
  tono?: keyof typeof TONOS;
  disposicion?: 'vertical' | 'horizontal';
};

// Cifra destacada con su icono. "vertical" = icono arriba (Inicio); "horizontal" = icono al lado (Perfil)
export function TarjetaMetrica({ icono, valor, etiqueta, tono = 'morado', disposicion = 'vertical' }: Propiedades) {
  const horizontal = disposicion === 'horizontal';
  return (
    <View style={[estilos.tarjeta, horizontal ? estilos.horizontal : estilos.vertical, { backgroundColor: TONOS[tono].fondo }]}>
      <MaterialCommunityIcons name={icono} size={horizontal ? 28 : 32} color={TONOS[tono].icono} />
      <View style={estilos.textos}>
        <Text style={[estilos.valor, horizontal && estilos.valorHorizontal]} numberOfLines={1} adjustsFontSizeToFit>{valor}</Text>
        <Text style={estilos.etiqueta} numberOfLines={2}>{etiqueta}</Text>
      </View>
    </View>
  );
}
