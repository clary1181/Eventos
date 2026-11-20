import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { EstadoEntrada } from '../utilidades/entradas';

const ESTILO: Record<EstadoEntrada, { texto: string; fondo: string; color: string }> = {
  valida: { texto: 'Válida', fondo: '#D9F2DE', color: '#1B7F3B' },
  usada: { texto: 'Usada', fondo: '#EEEDF2', color: '#55516B' },
  vencida: { texto: 'Vencida', fondo: '#FDE4E4', color: '#B3261E' },
};

export function InsigniaEntrada({ estado }: { estado: EstadoEntrada }) {
  const e = ESTILO[estado];
  return (
    <View style={[estilos.caja, { backgroundColor: e.fondo }]}>
      <Text style={[estilos.texto, { color: e.color }]}>{e.texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  texto: { fontSize: 13, fontWeight: '700' },
});
