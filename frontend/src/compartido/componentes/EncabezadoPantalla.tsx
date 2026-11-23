import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fuentes } from '@/compartido/tema';

interface Propiedades { titulo: string; subtitulo?: string; alVolver?: () => void; derecha?: ReactNode }

export function EncabezadoPantalla({ titulo, subtitulo, alVolver, derecha }: Propiedades) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[estilos.caja, { paddingTop: top + 14 }]}>
      {alVolver && (
        <Pressable style={estilos.volver} onPress={alVolver} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text style={estilos.titulo} numberOfLines={2}>{titulo}</Text>
        {!!subtitulo && <Text style={estilos.subtitulo} numberOfLines={2}>{subtitulo}</Text>}
      </View>
      {derecha}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { backgroundColor: '#4B1D8F', paddingHorizontal: 18, paddingBottom: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 12 },
  volver: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  titulo: { color: '#FFFFFF', fontSize: 25, fontFamily: Fuentes.negrita, letterSpacing: -0.4 },
  subtitulo: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 2 },
});
