import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colores } from '@/compartido/tema';

interface Propiedades {
  icono: React.ReactNode;
  valor: number | null;
  etiqueta: string;
  fondo: string;
}

export const formatearConteo = (valor: number | null) => (valor === null ? '—' : valor.toLocaleString('es-MX'));

// Tarjeta de color suave con icono, cifra grande y etiqueta
export function TarjetaResumen({ icono, valor, etiqueta, fondo }: Propiedades) {
  return (
    <View style={[estilos.tarjeta, { backgroundColor: fondo }]}>
      {icono}
      <Text style={estilos.valor} adjustsFontSizeToFit numberOfLines={1}>{formatearConteo(valor)}</Text>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1, minHeight: 106, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 4,
    shadowColor: '#4B1D8F', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  valor: { fontSize: 22, fontWeight: '800', color: Colores.texto, marginTop: 6, maxWidth: '100%' },
  etiqueta: { fontSize: 12, color: Colores.textoSuave, textAlign: 'center', marginTop: 2, lineHeight: 15 },
});
