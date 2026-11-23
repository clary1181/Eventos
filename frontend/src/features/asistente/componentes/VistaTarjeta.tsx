import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { marcaTarjeta, type DatosTarjeta } from '../utilidades/tarjeta';

export function VistaTarjeta({ datos }: { datos: DatosTarjeta }) {
  const digitos = datos.numero.replace(/\D/g, '').padEnd(16, '•');
  const numero = digitos.replace(/(.{4})(?=.)/g, '$1 ');
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.circuloGrande} />
      <View style={estilos.circuloChico} />
      <View style={estilos.filaSuperior}>
        <MaterialCommunityIcons name="integrated-circuit-chip" size={38} color="#F3D98B" />
        <Text style={estilos.marca}>{marcaTarjeta(datos.numero)}</Text>
      </View>
      <Text style={estilos.numero} adjustsFontSizeToFit numberOfLines={1}>{numero}</Text>
      <View style={estilos.filaInferior}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.etiqueta}>TITULAR</Text>
          <Text style={estilos.valor} numberOfLines={1}>{datos.titular.trim() ? datos.titular.toUpperCase() : 'NOMBRE APELLIDO'}</Text>
        </View>
        <View>
          <Text style={estilos.etiqueta}>VENCE</Text>
          <Text style={estilos.valor}>{datos.vencimiento || 'MM/AA'}</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { aspectRatio: 1.62, borderRadius: 20, backgroundColor: '#4B1D8F', padding: 18, justifyContent: 'space-between', overflow: 'hidden' },
  circuloGrande: { position: 'absolute', right: -50, top: -60, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.08)' },
  circuloChico: { position: 'absolute', left: -40, bottom: -70, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.06)' },
  filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marca: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  numero: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', letterSpacing: 2 },
  filaInferior: { flexDirection: 'row', gap: 12 },
  etiqueta: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  valor: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 2 },
});
