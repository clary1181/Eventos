import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Colores } from '@/compartido/tema';

interface Propiedades extends TextInputProps { etiqueta: string; error?: string }

export function CampoPago({ etiqueta, error, style, ...resto }: Propiedades) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={Colores.textoSuave}
        style={[estilos.entrada, !!error && estilos.conError, style]}
        {...resto}
      />
      {!!error && <Text style={estilos.error}>{error}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginBottom: 6 },
  entrada: { height: 50, borderWidth: 1, borderColor: Colores.borde, borderRadius: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 14, fontSize: 16, color: Colores.texto },
  conError: { borderColor: Colores.error },
  error: { fontSize: 12, color: Colores.error, marginTop: 4 },
});
