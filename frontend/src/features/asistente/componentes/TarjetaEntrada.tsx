import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estadoEntrada, type EntradaAsistente } from '../utilidades/entradas';
import { formatearFechaHora } from '../utilidades/formato';
import { InsigniaEntrada } from './InsigniaEntrada';

export function TarjetaEntrada({ entrada: e, alPulsar }: { entrada: EntradaAsistente; alPulsar: () => void }) {
  const estado = estadoEntrada(e);
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.9 }]} accessibilityRole="button">
      <Image source={{ uri: e.imagenUrl }} style={[estilos.imagen, estado !== 'valida' && { opacity: 0.55 }]} resizeMode="cover" />
      <View style={estilos.cuerpo}>
        <Text style={estilos.titulo} numberOfLines={2}>{e.eventoTitulo}</Text>
        <View style={estilos.fila}>
          <Ionicons name="calendar-outline" size={17} color={Colores.primarioOscuro} />
          <Text style={estilos.dato} numberOfLines={1}>{formatearFechaHora(e.eventoFechaInicio)}</Text>
        </View>
        <View style={estilos.fila}>
          <Ionicons name="location-outline" size={17} color={Colores.primarioOscuro} />
          <Text style={estilos.dato} numberOfLines={1}>{e.lugar}</Text>
        </View>
        <View style={estilos.pie}>
          <InsigniaEntrada estado={estado} />
          <View style={estilos.fila}>
            <MaterialCommunityIcons name="qrcode" size={20} color={Colores.primario} />
            <Text style={estilos.numero}>Entrada {e.numero}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', gap: 14, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#ECE6F7',
    shadowColor: '#4B1D8F', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  imagen: { width: 104, height: 128, borderRadius: 14, backgroundColor: '#EFE8FB' },
  cuerpo: { flex: 1, gap: 4 },
  titulo: { fontSize: 17, fontWeight: '800', color: '#1F1B2E', lineHeight: 22 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dato: { flex: 1, fontSize: 13.5, color: '#1F1B2E' },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 },
  numero: { fontSize: 13.5, fontWeight: '700', color: Colores.primario },
});
