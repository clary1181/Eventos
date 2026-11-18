import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { ALTO_ONDA, estilos } from './EncabezadoAuth.estilos';
import { IconoTicket } from './IconoTicket';

// Foto de Ensenada (frontend/assets/imagenes/ensenada.jpg), proporción 1600x1066
const FOTO_ENSENADA = require('../../../../assets/imagenes/ensenada.jpg');
const RELACION_FOTO = 1600 / 1066;

// Parte superior de las pantallas de acceso: foto completa, degradado morado, marca y onda blanca
export function EncabezadoAuth({ compacto = false }: { compacto?: boolean }) {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [fuentesListas] = useFonts({ Montserrat_400Regular, Montserrat_800ExtraBold });

  // Factor según el alto del teléfono (800 = referencia)
  const escala = Math.min(Math.max(height / 800, 0.8), 1.1);
  const altoFoto = width / RELACION_FOTO;
  const altura = Math.min(altoFoto * 1.2 + top, height * (compacto ? 0.3 : 0.33));

  return (
    <View style={[estilos.cabecera, { height: altura }]}>
      <Image
        source={FOTO_ENSENADA}
        style={{ position: 'absolute', left: 0, bottom: 0, width, height: altoFoto }}
        resizeMode="cover"
      />

      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="velo" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colores.primarioOscuro} stopOpacity="1" />
            <Stop offset="0.4" stopColor="#481B8C" stopOpacity="0.88" />
            <Stop offset="1" stopColor="#481B8C" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#velo)" />
      </Svg>

      <View style={[estilos.contenido, { paddingTop: top + 4 }]}>
        <IconoTicket ancho={(compacto ? 84 : 112) * escala} />
        <Text
          style={[
            estilos.marca,
            { fontSize: 36 * escala, fontFamily: fuentesListas ? 'Montserrat_800ExtraBold' : undefined },
          ]}
        >
          MR-Eventos
        </Text>
        {!compacto && (
          <Text
            style={[
              estilos.lema,
              {
                fontSize: 15 * escala,
                lineHeight: 22 * escala,
                fontFamily: fuentesListas ? 'Montserrat_400Regular' : undefined,
              },
            ]}
          >
            Descubre y vive los mejores{'\n'}eventos de Ensenada
          </Text>
        )}
      </View>

      <Svg style={estilos.onda} width="100%" height={ALTO_ONDA} viewBox="0 0 400 60" preserveAspectRatio="none">
        <Path d="M0 36 C 90 68, 210 4, 400 32 L400 60 L0 60 Z" fill={Colores.fondo} />
      </Svg>
    </View>
  );
}