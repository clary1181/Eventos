import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { EventoPublico } from '../tipos';
import { coloresCategoria } from '../utilidades/categorias';
import { formatearFechaHora } from '../utilidades/formato';
import { BotonCorazon } from './BotonCorazon';

interface Propiedades {
  evento: EventoPublico;
  esFavorito: boolean;
  alPulsar: () => void;
  alFavorito: () => void;
}

export function TarjetaEventoAsistente({ evento: e, esFavorito, alPulsar, alFavorito }: Propiedades) {
  const [fondo, texto] = coloresCategoria(e.categoria);
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.9 }]} accessibilityRole="button">
      <View style={estilos.contenedorImagen}>
        <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} resizeMode="cover" />
        <View style={estilos.corazon}><BotonCorazon activo={esFavorito} alPulsar={alFavorito} /></View>
      </View>

      <View style={estilos.cuerpo}>
        <Text style={estilos.titulo} numberOfLines={2}>{e.titulo}</Text>
        <View style={estilos.fila}>
          <MaterialCommunityIcons name="check-circle" size={20} color={Colores.primario} />
          <Text style={estilos.verificado}>Verificado</Text>
        </View>
        <View style={estilos.fila}>
          <Ionicons name="calendar-outline" size={18} color={Colores.primarioOscuro} />
          <Text style={estilos.dato} numberOfLines={1}>{formatearFechaHora(e.fechaInicio)}</Text>
        </View>
        <View style={estilos.fila}>
          <Ionicons name="location-outline" size={18} color={Colores.primarioOscuro} />
          <Text style={estilos.dato} numberOfLines={1}>{e.lugar}</Text>
        </View>
        <View style={[estilos.etiqueta, { backgroundColor: fondo }]}>
          <Text style={[estilos.textoEtiqueta, { color: texto }]}>{e.categoria}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', gap: 14, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12,
    borderWidth: 1, borderColor: '#ECE6F7',
    shadowColor: '#4B1D8F', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  contenedorImagen: { width: 138, height: 138 },
  imagen: { width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#EFE8FB' },
  corazon: { position: 'absolute', top: 8, right: 8 },
  cuerpo: { flex: 1, gap: 4 },
  titulo: { fontSize: 18, fontWeight: '800', color: '#1F1B2E', lineHeight: 23 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verificado: { fontSize: 14, fontWeight: '700', color: Colores.primario },
  dato: { flex: 1, fontSize: 14, color: '#1F1B2E' },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, marginTop: 2 },
  textoEtiqueta: { fontSize: 14, fontWeight: '700' },
});
