import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonCorazon } from './BotonCorazon';

export const ALTO_CABECERA = 330;

interface Propiedades {
  imagenUrl: string;
  esFavorito: boolean;
  alVolver: () => void;
  alFavorito: () => void;
  alCompartir: () => void;
}

export function CabeceraDetalle({ imagenUrl, esFavorito, alVolver, alFavorito, alCompartir }: Propiedades) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ height: ALTO_CABECERA + top, backgroundColor: '#2A1560' }}>
      <Image source={{ uri: imagenUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={[estilos.barra, { top: top + 10 }]}>
        <Pressable onPress={alVolver} style={estilos.circulo} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={6}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        <View style={estilos.derecha}>
          <BotonCorazon activo={esFavorito} alPulsar={alFavorito} tamano={46} traslucido />
          <Pressable onPress={alCompartir} style={estilos.circulo} accessibilityRole="button" accessibilityLabel="Compartir" hitSlop={6}>
            <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
      <View style={estilos.insignia}>
        <MaterialCommunityIcons name="check-circle" size={22} color="#FFFFFF" />
        <Text style={estilos.textoInsignia}>Verificado</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  derecha: { flexDirection: 'row', gap: 10 },
  circulo: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(42,21,96,0.45)', alignItems: 'center', justifyContent: 'center' },
  insignia: {
    position: 'absolute', right: 16, bottom: 44, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0FA98A', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  textoInsignia: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
