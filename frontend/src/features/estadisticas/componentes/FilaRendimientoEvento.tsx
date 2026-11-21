import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';
import { formatearMoneda } from '@/features/eventos';
import type { RendimientoEvento } from '../utilidades/calculos';
import { BarraProgreso } from './BarraProgreso';

export function FilaRendimientoEvento({ item, alPulsar }: { item: RendimientoEvento; alPulsar: () => void }) {
  const { evento: e } = item;
  const ocupacion = e.capacidad > 0 ? item.vendidas / e.capacidad : 0;
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.fila, pressed && { opacity: 0.9 }]} accessibilityRole="button">
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={estilos.titulo} numberOfLines={1}>{e.titulo}</Text>
        <BarraProgreso valor={ocupacion} color={ocupacion >= 1 ? Colores.exitoTexto : Colores.primario} />
        <Text style={estilos.detalle}>{item.vendidas}/{e.capacidad} entradas · {Math.round(ocupacion * 100)}% de ocupación</Text>
      </View>
      <View style={estilos.derecha}>
        <Text style={estilos.ingresos}>{formatearMoneda(item.ingresos)}</Text>
        <Ionicons name="chevron-forward" size={18} color={Colores.textoSuave} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#ECE6F7' },
  titulo: { fontSize: 15.5, fontFamily: Fuentes.negrita, color: Colores.texto },
  detalle: { fontSize: 12.5, color: Colores.textoSuave },
  derecha: { alignItems: 'flex-end', gap: 4 },
  ingresos: { fontSize: 15, fontFamily: Fuentes.negrita, color: Colores.exitoTexto },
});
