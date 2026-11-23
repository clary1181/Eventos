import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { EventoPublico } from '../tipos';
import { coloresCategoria, ICONO_CATEGORIA } from '../utilidades/categorias';
import { formatearFechaCorta, formatearHora } from '../utilidades/formato';

export function DatosPrincipalesEvento({ evento: e }: { evento: EventoPublico }) {
  const [fondo, texto] = coloresCategoria(e.categoria);
  return (
    <View style={estilos.fila}>
      <View style={[estilos.bloque, { flex: 1.15 }]}>
        <Ionicons name="calendar-outline" size={34} color={Colores.primarioOscuro} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.principal}>{formatearFechaCorta(e.fechaInicio)}</Text>
          <Text style={estilos.secundario}>{formatearHora(e.fechaInicio)}</Text>
        </View>
      </View>
      <View style={estilos.separador} />
      <View style={[estilos.bloque, { flex: 1.2 }]}>
        <Ionicons name="location-outline" size={34} color={Colores.primarioOscuro} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.principal} numberOfLines={2}>{e.lugar}</Text>
          <Text style={estilos.secundario}>Ensenada, B.C.</Text>
        </View>
      </View>
      <View style={estilos.separador} />
      <View style={[estilos.bloque, { flex: 0.9, flexDirection: 'column', alignItems: 'flex-start', gap: 6 }]}>
        <Ionicons name={ICONO_CATEGORIA[e.categoria] ?? 'pricetag-outline'} size={30} color={Colores.primarioOscuro} />
        <View style={[estilos.etiqueta, { backgroundColor: fondo }]}>
          <Text style={[estilos.textoEtiqueta, { color: texto }]} numberOfLines={1}>{e.categoria}</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  bloque: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  separador: { width: 1, alignSelf: 'stretch', backgroundColor: '#E4DEF0', marginHorizontal: 6 },
  principal: { fontSize: 15, fontWeight: '700', color: '#1F1B2E', lineHeight: 20 },
  secundario: { fontSize: 14, color: Colores.textoSuave, marginTop: 2 },
  etiqueta: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  textoEtiqueta: { fontSize: 14, fontWeight: '700' },
});
