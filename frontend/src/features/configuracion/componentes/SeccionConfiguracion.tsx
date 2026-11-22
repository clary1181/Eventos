import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import type { SeccionConfig } from '../tipos';
import { FilaConfiguracion } from './FilaConfiguracion';

export function SeccionConfiguracion({ seccion }: { seccion: SeccionConfig }) {
  return (
    <View style={{ gap: Espaciado.sm }}>
      <Text style={estilos.titulo}>{seccion.titulo}</Text>
      <View style={estilos.tarjeta}>
        {seccion.filas.map((f, i) => (
          <FilaConfiguracion key={f.titulo} fila={f} ultima={i === seccion.filas.length - 1} />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: Tipografia.subtitulo, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, marginLeft: Espaciado.xs },
  tarjeta: { backgroundColor: Colores.fondoSuave, borderRadius: Radios.tarjeta, overflow: 'hidden' },
});
