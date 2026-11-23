import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';

const TONOS = {
  morado: { fondo: Colores.tonoMorado, icono: Colores.primario },
  verde: { fondo: Colores.tonoVerde, icono: Colores.exitoTexto },
  naranja: { fondo: Colores.tonoNaranja, icono: Colores.advertencia },
  azul: { fondo: '#E3EEFB', icono: '#1D5FA8' },
} as const;

interface Propiedades {
  icono: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  valor: string;
  etiqueta: string;
  nota?: string;
  tono?: keyof typeof TONOS;
}

export function TarjetaKpi({ icono, valor, etiqueta, nota, tono = 'morado' }: Propiedades) {
  return (
    <View style={[estilos.tarjeta, { backgroundColor: TONOS[tono].fondo }]}>
      <MaterialCommunityIcons name={icono} size={26} color={TONOS[tono].icono} />
      <Text style={estilos.valor} numberOfLines={1} adjustsFontSizeToFit>{valor}</Text>
      <Text style={estilos.etiqueta} numberOfLines={1}>{etiqueta}</Text>
      {!!nota && <Text style={estilos.nota} numberOfLines={2}>{nota}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexGrow: 1, flexBasis: '47%', borderRadius: 20, padding: 14, gap: 2 },
  valor: { fontSize: 26, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro, marginTop: 6 },
  etiqueta: { fontSize: 14, fontFamily: Fuentes.seminegrita, color: Colores.texto },
  nota: { fontSize: 12, color: Colores.textoSuave, marginTop: 2 },
});
