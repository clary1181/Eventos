import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colores } from '@/compartido/tema';
import { formatearFecha } from '../../verificaciones/componentes/TarjetaSolicitud';
import type { EventoAdmin } from '../tipos';

export function TarjetaEventoAdmin({ evento: e, alPulsar }: { evento: EventoAdmin; alPulsar: () => void }) {
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.85 }]} accessibilityRole="button">
      <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} resizeMode="cover" />
      <View style={estilos.cuerpo}>
        <Text style={estilos.titulo} numberOfLines={1}>{e.titulo}</Text>
        <Text style={estilos.detalle} numberOfLines={1}>Por {e.organizadorNombre}</Text>
        <Text style={estilos.detalle}>{formatearFecha(e.fechaInicio)}</Text>
        <Text style={estilos.detalle} numberOfLines={1}>{e.lugar}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  imagen: { width: '100%', height: 130, backgroundColor: '#EFE8FB' },
  cuerpo: { padding: 14 },
  titulo: { fontSize: 17, fontWeight: '800', color: Colores.texto },
  detalle: { fontSize: 13, color: Colores.textoSuave, marginTop: 2 },
});
