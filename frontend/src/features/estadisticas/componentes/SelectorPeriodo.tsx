import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';
import type { Periodo } from '../tipos';

const OPCIONES: { id: Periodo; titulo: string }[] = [
  { id: '7d', titulo: '7 días' },
  { id: '30d', titulo: '30 días' },
  { id: 'todo', titulo: 'Todo' },
];

export function SelectorPeriodo({ periodo, alCambiar }: { periodo: Periodo; alCambiar: (p: Periodo) => void }) {
  return (
    <View style={estilos.fila}>
      {OPCIONES.map((o) => (
        <Pressable key={o.id} style={[estilos.opcion, periodo === o.id && estilos.activa]} onPress={() => alCambiar(o.id)} accessibilityRole="button">
          <Text style={[estilos.texto, periodo === o.id && { color: '#FFFFFF' }]}>{o.titulo}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', backgroundColor: '#F1EBFB', borderRadius: 14, padding: 4 },
  opcion: { flex: 1, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activa: { backgroundColor: Colores.primario },
  texto: { fontSize: 14, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
});
