import React, { ReactNode } from 'react';
import { Image, View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Colores } from '@/compartido/tema';

const FOTO_ENSENADA = require('../../../assets/imagenes/ensenada.jpg');
const RELACION_FOTO = 1600 / 1066;

type Propiedades = { alto: number; children?: ReactNode };

export function FondoHero({ alto, children }: Propiedades) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ height: alto, overflow: 'hidden', backgroundColor: Colores.primarioOscuro }}>
      <Image
        source={FOTO_ENSENADA}
        style={{ position: 'absolute', left: 0, bottom: 0, width, height: width / RELACION_FOTO }}
        resizeMode="cover"
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="veloHero" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colores.primarioOscuro} stopOpacity="0.9" />
            <Stop offset="0.5" stopColor="#481B8C" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#481B8C" stopOpacity="0.15" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#veloHero)" />
      </Svg>
      {children}
    </View>
  );
}
