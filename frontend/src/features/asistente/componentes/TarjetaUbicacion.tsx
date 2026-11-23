import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { EventoPublico } from '../tipos';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

const abrirMapa = (e: EventoPublico) => {
  const consulta = encodeURIComponent(`${e.lugar}, ${e.direccion}, Ensenada, Baja California`);
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${consulta}`).catch(() =>
    mostrarAviso({ titulo: 'No se pudo abrir el mapa', mensaje: 'Instala o actualiza una aplicación de mapas.', tipo: 'error' })
  );
};

export function TarjetaUbicacion({ evento: e }: { evento: EventoPublico }) {
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.mapa}>
        <Ionicons name="map-outline" size={44} color="#9B7CD6" />
        <Ionicons name="location" size={30} color="#E53935" style={estilos.pin} />
      </View>
      <View style={estilos.info}>
        <View style={estilos.filaLugar}>
          <Ionicons name="location-outline" size={20} color={Colores.primarioOscuro} />
          <Text style={estilos.lugar} numberOfLines={2}>{e.lugar}</Text>
        </View>
        <Text style={estilos.direccion} numberOfLines={2}>{e.direccion}</Text>
        <Pressable onPress={() => abrirMapa(e)} style={estilos.boton} accessibilityRole="button">
          <Ionicons name="map-outline" size={20} color={Colores.primario} />
          <Text style={estilos.textoBoton}>Ver en el mapa</Text>
          <Ionicons name="chevron-forward" size={18} color={Colores.primario} />
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', backgroundColor: '#F6F2FD', borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  mapa: { width: 130, backgroundColor: '#E6DBF8', alignItems: 'center', justifyContent: 'center' },
  pin: { position: 'absolute', top: '32%' },
  info: { flex: 1, padding: 14, gap: 4 },
  filaLugar: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lugar: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1F1B2E' },
  direccion: { fontSize: 14, color: Colores.textoSuave, marginLeft: 26 },
  boton: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, marginTop: 8,
    borderWidth: 1.5, borderColor: Colores.primario, borderRadius: 22, paddingHorizontal: 14, height: 44,
  },
  textoBoton: { fontSize: 15, fontWeight: '700', color: Colores.primario },
});
