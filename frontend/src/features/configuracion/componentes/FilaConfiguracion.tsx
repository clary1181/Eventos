import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';
import type { FilaConfig } from '../tipos';

interface Propiedades { fila: FilaConfig; ultima: boolean }

export function FilaConfiguracion({ fila, ultima }: Propiedades) {
  return (
    <Pressable
      onPress={fila.alPulsar}
      accessibilityRole="button"
      accessibilityLabel={fila.titulo}
      style={({ pressed }) => [estilos.fila, !ultima && estilos.divisor, pressed && { opacity: 0.7 }]}
    >
      <View style={estilos.icono}>
        <Ionicons name={fila.icono} size={20} color={Colores.primario} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={estilos.titulo}>{fila.titulo}</Text>
        {!!fila.descripcion && <Text style={estilos.descripcion}>{fila.descripcion}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colores.textoSuave} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.md, paddingVertical: Espaciado.md, paddingHorizontal: Espaciado.lg },
  divisor: { borderBottomWidth: 1, borderBottomColor: Colores.neutroFondo },
  icono: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colores.tonoMorado, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.seminegrita, color: Colores.texto },
  descripcion: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: 2 },
});
