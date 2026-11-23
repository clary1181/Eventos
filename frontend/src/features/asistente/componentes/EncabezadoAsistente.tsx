import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOTO_ENSENADA = require('../../../../assets/imagenes/ensenada.jpg');

export const ALTO_ENCABEZADO_ASISTENTE = 236;

interface Propiedades {
  nombre: string;
  alAvisos: () => void;
  alPerfil: () => void;
}

export function EncabezadoAsistente({ nombre, alAvisos, alPerfil }: Propiedades) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ height: ALTO_ENCABEZADO_ASISTENTE + top, backgroundColor: '#4B1D8F' }}>
      <Image source={FOTO_ENSENADA} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="veloAsistente" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4B1D8F" stopOpacity="0.88" />
            <Stop offset="0.55" stopColor="#6A2FB0" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#6A2FB0" stopOpacity="0.12" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#veloAsistente)" />
      </Svg>

      <View style={{ paddingTop: top + 10 }}>
        <View style={estilos.fila}>
          <View style={estilos.marca}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={36} color="#FFFFFF" />
            <Text style={estilos.textoMarca}>MR-Eventos</Text>
          </View>
          <View style={estilos.acciones}>
            <Pressable style={estilos.boton} onPress={alAvisos} accessibilityLabel="Avisos" hitSlop={6}>
              <Ionicons name="notifications-outline" size={30} color="#FFFFFF" />
            </Pressable>
            <Pressable style={estilos.boton} onPress={alPerfil} accessibilityLabel="Mi perfil" hitSlop={6}>
              <Ionicons name="person-circle-outline" size={36} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <Text style={estilos.saludo} numberOfLines={1}>¡Hola, {nombre}! 👋</Text>
        <Text style={estilos.subtitulo}>Descubre los mejores eventos de Ensenada</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoMarca: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  boton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  saludo: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', letterSpacing: -0.5, paddingHorizontal: 20, marginTop: 16 },
  subtitulo: { color: 'rgba(255,255,255,0.92)', fontSize: 16, paddingHorizontal: 20, marginTop: 4, maxWidth: '70%', lineHeight: 22 },
});
