import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colores } from '@/compartido/tema';
import { formatearMoneda } from '@/features/eventos';
import type { ItemRanking } from '../utilidades/calculosPlataforma';

export function TarjetaRanking({ titulo, items }: { titulo: string; items: ItemRanking[] }) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {items.length === 0 ? (
        <Text style={estilos.vacio}>Sin ventas en este periodo.</Text>
      ) : (
        items.map((i, n) => (
          <View key={`${i.nombre}-${n}`} style={estilos.fila}>
            <View style={estilos.posicion}><Text style={estilos.numero}>{n + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.nombre} numberOfLines={1}>{i.nombre}</Text>
              <Text style={estilos.detalle}>{i.entradas} {i.entradas === 1 ? 'entrada' : 'entradas'}</Text>
            </View>
            <Text style={estilos.ingresos}>{formatearMoneda(i.ingresos)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: '#ECE6F7' },
  titulo: { fontSize: 16, fontWeight: '800', color: Colores.primarioOscuro },
  vacio: { fontSize: 14, color: Colores.textoSuave },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  posicion: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colores.tonoMorado, alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: 13, fontWeight: '800', color: Colores.primario },
  nombre: { fontSize: 15, fontWeight: '700', color: Colores.texto },
  detalle: { fontSize: 12.5, color: Colores.textoSuave },
  ingresos: { fontSize: 14, fontWeight: '800', color: Colores.exitoTexto },
});
