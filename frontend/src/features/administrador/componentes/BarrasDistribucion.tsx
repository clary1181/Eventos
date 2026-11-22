import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colores } from '@/compartido/tema';
import { BarraProgreso } from '@/features/estadisticas';
import type { ItemDistribucion } from '../utilidades/calculosPlataforma';

interface Propiedades { titulo: string; items: ItemDistribucion[] | null; vacio?: string }

// Tarjeta con una barra por categoría (cada una con su porcentaje sobre el total)
export function BarrasDistribucion({ titulo, items, vacio = 'Sin datos en este periodo.' }: Propiedades) {
  const total = items ? items.reduce((a, i) => a + i.valor, 0) : 0;
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {items === null ? (
        <Text style={estilos.vacio}>No se pudo cargar este dato.</Text>
      ) : items.length === 0 ? (
        <Text style={estilos.vacio}>{vacio}</Text>
      ) : (
        items.map((i) => (
          <View key={i.etiqueta} style={{ gap: 5 }}>
            <View style={estilos.fila}>
              <Text style={estilos.etiqueta}>{i.etiqueta}</Text>
              <Text style={estilos.valor}>{i.valor} · {Math.round((i.valor / total) * 100)}%</Text>
            </View>
            <BarraProgreso valor={i.valor / total} color={i.color} />
          </View>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: '#ECE6F7' },
  titulo: { fontSize: 16, fontWeight: '800', color: Colores.primarioOscuro },
  fila: { flexDirection: 'row', justifyContent: 'space-between' },
  etiqueta: { fontSize: 14, color: Colores.texto },
  valor: { fontSize: 13, color: Colores.textoSuave },
  vacio: { fontSize: 14, color: Colores.textoSuave },
});
