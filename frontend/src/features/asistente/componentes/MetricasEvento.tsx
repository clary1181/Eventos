import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { EventoPublico } from '../tipos';
import { formatearDiaMes, formatearPrecio } from '../utilidades/formato';

function Casilla({ icono, etiqueta, children }: { icono: React.ComponentProps<typeof Ionicons>['name']; etiqueta: string; children: React.ReactNode }) {
  return (
    <View style={estilos.casilla}>
      <Ionicons name={icono} size={34} color={Colores.primarioOscuro} />
      <Text style={estilos.etiqueta} numberOfLines={2}>{etiqueta}</Text>
      {children}
    </View>
  );
}

// Cuatro casillas: precio, capacidad, estatus y fecha de registro
export function MetricasEvento({ evento: e }: { evento: EventoPublico }) {
  return (
    <View style={estilos.fila}>
      <Casilla icono="pricetag-outline" etiqueta="Precio de entrada">
        <Text style={estilos.valor} adjustsFontSizeToFit numberOfLines={1}>{formatearPrecio(e.precio)}</Text>
      </Casilla>
      <Casilla icono="people-outline" etiqueta="Capacidad máxima">
        <Text style={estilos.valor} adjustsFontSizeToFit numberOfLines={1}>{e.capacidad.toLocaleString('es-MX')} personas</Text>
      </Casilla>
      <Casilla icono="shield-checkmark-outline" etiqueta="Estatus del evento">
        <View style={estilos.estatus}><Text style={estilos.textoEstatus}>Verificado</Text></View>
      </Casilla>
      <Casilla icono="calendar-outline" etiqueta="Fecha de registro">
        <Text style={estilos.valor} adjustsFontSizeToFit numberOfLines={1}>{e.creadoEn ? formatearDiaMes(e.creadoEn) : '—'}</Text>
      </Casilla>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 8, marginTop: 18 },
  casilla: { flex: 1, minHeight: 128, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F2FD', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 4, gap: 6 },
  etiqueta: { fontSize: 12.5, color: Colores.textoSuave, textAlign: 'center', lineHeight: 16 },
  valor: { fontSize: 15, fontWeight: '800', color: '#1F1B2E', textAlign: 'center', maxWidth: '100%' },
  estatus: { backgroundColor: '#D9F2DE', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  textoEstatus: { fontSize: 14, fontWeight: '700', color: '#1B7F3B' },
});
