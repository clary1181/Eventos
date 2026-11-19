import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOTO_ENSENADA = require('../../../../assets/imagenes/ensenada.jpg');

interface Propiedades { titulo: string; subtitulo: string }

// Encabezado compacto con la foto de Ensenada para las pestañas del administrador
export function EncabezadoSeccionAdmin({ titulo, subtitulo }: Propiedades) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ height: 128 + top, backgroundColor: '#4B1D8F' }}>
      <Image source={FOTO_ENSENADA} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="veloSeccion" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4B1D8F" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#6A2FB0" stopOpacity="0.35" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#veloSeccion)" />
      </Svg>
      <View style={{ paddingTop: top + 14, paddingHorizontal: 20 }}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.subtitulo}>{subtitulo}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  titulo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subtitulo: { color: 'rgba(255,255,255,0.92)', fontSize: 14, marginTop: 4, maxWidth: '80%' },
});
