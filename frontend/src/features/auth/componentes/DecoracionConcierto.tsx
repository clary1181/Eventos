import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';

// frontend/assets/imagenes/concierto.jpg
const CONCIERTO = require('../../../../assets/imagenes/concierto.jpg');
const { width: anchoOriginal, height: altoOriginal } = Image.resolveAssetSource(CONCIERTO);
const RELACION = anchoOriginal / altoOriginal;

// Color del público en la parte baja de la imagen, para rellenar bajo la barra de Android
const COLOR_RELLENO_INFERIOR = '#CBBAEE';

// Escenario y público al pie de la pantalla: tu imagen a todo el ancho, sin deformarse
export function DecoracionConcierto() {
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const alto = width / RELACION;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: alto + bottom, backgroundColor: Colores.fondo }}
    >
      <Image source={CONCIERTO} style={{ width, height: alto }} resizeMode="stretch" />

      {/* Difumina el borde superior para que no se note el corte de la foto */}
      <Svg width={width} height={alto * 0.3} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <LinearGradient id="fundido" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colores.fondo} stopOpacity="1" />
            <Stop offset="1" stopColor={Colores.fondo} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fundido)" />
      </Svg>

      {/* Relleno bajo la barra de navegación de Android */}
      {bottom > 0 && <View style={{ height: bottom, backgroundColor: COLOR_RELLENO_INFERIOR }} />}
    </View>
  );
}