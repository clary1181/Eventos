import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Colores } from '@/compartido/tema';

interface Propiedades extends TextInputProps {
  etiqueta: string;
  ayuda?: string;
  contador?: number; // límite de caracteres mostrado a la derecha
}

export function CampoFormulario({ etiqueta, ayuda, contador, style, value, ...resto }: Propiedades) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.fila}>
        <Text style={estilos.etiqueta}>{etiqueta}</Text>
        {contador !== undefined && <Text style={estilos.contador}>{(value ?? '').length}/{contador}</Text>}
      </View>
      <TextInput
        value={value}
        placeholderTextColor={Colores.textoSuave}
        maxLength={contador}
        style={[estilos.entrada, style]}
        {...resto}
      />
      {!!ayuda && <Text style={estilos.ayuda}>{ayuda}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginTop: 14 },
  fila: { flexDirection: 'row', justifyContent: 'space-between' },
  etiqueta: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginBottom: 6 },
  contador: { fontSize: 12, color: Colores.textoSuave },
  entrada: {
    minHeight: 48, borderWidth: 1, borderColor: Colores.borde, borderRadius: 16, backgroundColor: '#FFFFFF',
    paddingHorizontal: 14, fontSize: 15, color: Colores.texto,
  },
  ayuda: { fontSize: 12, color: Colores.textoSuave, marginTop: 4 },
});
