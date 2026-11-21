import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { CalificacionAdmin } from '../tipos';
import { formatearFechaCorta } from './TarjetaReporte';

export function TarjetaCalificacionAdmin({ calificacion: c, alAlternar }: { calificacion: CalificacionAdmin; alAlternar: () => void }) {
  return (
    <View style={[estilos.tarjeta, c.oculta && { opacity: 0.65 }]}>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={estilos.titulo} numberOfLines={1}>{c.eventoTitulo || 'Evento'}</Text>
        <View style={estilos.fila}>
          <Ionicons name="star" size={16} color="#F5B301" />
          <Text style={estilos.estrellas}>{c.estrellas}/5</Text>
          <Text style={estilos.autor} numberOfLines={1}>· {c.asistenteNombre || 'Asistente'} · {formatearFechaCorta(c.creadaEn)}</Text>
        </View>
        {!!c.comentario && <Text style={estilos.comentario}>{c.comentario}</Text>}
        {c.oculta && <Text style={estilos.oculta}>Oculta para el público</Text>}
      </View>
      <Pressable style={[estilos.boton, c.oculta && { backgroundColor: '#EFE8FB' }]} onPress={alAlternar} accessibilityRole="button" accessibilityLabel={c.oculta ? 'Mostrar' : 'Ocultar'}>
        <Ionicons name={c.oculta ? 'eye-outline' : 'eye-off-outline'} size={20} color={c.oculta ? Colores.primario : '#B3261E'} />
        <Text style={[estilos.textoBoton, { color: c.oculta ? Colores.primario : '#B3261E' }]}>{c.oculta ? 'Mostrar' : 'Ocultar'}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14,
    shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  titulo: { fontSize: 15, fontWeight: '800', color: Colores.texto },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  estrellas: { fontSize: 13, fontWeight: '700', color: Colores.texto },
  autor: { flex: 1, fontSize: 12, color: Colores.textoSuave },
  comentario: { fontSize: 13, color: '#3D3852', lineHeight: 18 },
  oculta: { fontSize: 12, fontWeight: '700', color: '#B3261E' },
  boton: { alignItems: 'center', gap: 2, backgroundColor: '#FDE4E4', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  textoBoton: { fontSize: 11, fontWeight: '700' },
});
