import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS_EVENTO } from '@/features/crear-evento/categorias';
import { ICONO_CATEGORIA } from '../utilidades/categorias';

const OPCIONES = ['Todos', ...CATEGORIAS_EVENTO];

interface Propiedades { seleccionada: string; alCambiar: (c: string) => void }

export function ChipsCategoria({ seleccionada, alCambiar }: Propiedades) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.contenido} style={{ flexGrow: 0 }}>
      {OPCIONES.map((c) => {
        const activa = c === seleccionada;
        return (
          <Pressable key={c} onPress={() => alCambiar(c)} style={[estilos.chip, activa && estilos.activo]} accessibilityRole="button">
            <Ionicons name={ICONO_CATEGORIA[c] ?? 'ellipse-outline'} size={22} color={activa ? '#FFFFFF' : '#5E1F9C'} />
            <Text style={[estilos.texto, activa && { color: '#FFFFFF' }]}>{c}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: 20, gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 16, borderRadius: 23, backgroundColor: '#F1EAFC' },
  activo: { backgroundColor: '#5E1F9C' },
  texto: { fontSize: 16, fontWeight: '500', color: '#2A1560' },
});
