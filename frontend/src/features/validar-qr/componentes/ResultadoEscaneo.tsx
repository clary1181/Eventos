import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ResultadoValidacion, TipoResultado } from '../tipos';

const ESTILO: Record<TipoResultado, { color: string; icono: React.ComponentProps<typeof Ionicons>['name'] }> = {
  ok: { color: '#1B9E4B', icono: 'checkmark-circle' },
  usada: { color: '#D97706', icono: 'alert-circle' },
  temprano: { color: '#D97706', icono: 'time' },
  expirada: { color: '#B3261E', icono: 'close-circle' },
  otro_evento: { color: '#B3261E', icono: 'swap-horizontal' },
  invalida: { color: '#B3261E', icono: 'close-circle' },
};

export function ResultadoEscaneo({ resultado, alSiguiente }: { resultado: ResultadoValidacion; alSiguiente: () => void }) {
  const { bottom } = useSafeAreaInsets();
  const e = ESTILO[resultado.tipo];
  return (
    <View style={[estilos.hoja, { paddingBottom: Math.max(bottom, 16) + 8 }]}>
      <Ionicons name={e.icono} size={72} color={e.color} />
      <Text style={[estilos.titulo, { color: e.color }]}>{resultado.titulo}</Text>
      <Text style={estilos.detalle}>{resultado.detalle}</Text>
      <Pressable style={[estilos.boton, { backgroundColor: e.color }]} onPress={alSiguiente} accessibilityRole="button">
        <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
        <Text style={estilos.textoBoton}>Escanear siguiente</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  hoja: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, alignItems: 'center', padding: 24, gap: 6 },
  titulo: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  detalle: { fontSize: 15, color: '#3D3852', textAlign: 'center', lineHeight: 21, marginBottom: 12 },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 56, borderRadius: 28, alignSelf: 'stretch' },
  textoBoton: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});
