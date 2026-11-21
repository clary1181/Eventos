import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';
import type { CalificacionResumen } from '../tipos';
import { distribucionEstrellas } from '../utilidades/calculos';
import { BarraProgreso } from './BarraProgreso';

// Promedio grande + cuántas reseñas hay de 5 a 1 estrellas
export function DistribucionEstrellas({ calificaciones }: { calificaciones: CalificacionResumen[] }) {
  const total = calificaciones.length;
  const promedio = total ? calificaciones.reduce((a, c) => a + c.estrellas, 0) / total : 0;
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.resumen}>
        <Text style={estilos.promedio}>{total ? promedio.toFixed(1) : '—'}</Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((n) => <Ionicons key={n} name={n <= Math.round(promedio) ? 'star' : 'star-outline'} size={15} color={Colores.estrella} />)}
        </View>
        <Text style={estilos.cuantas}>{total} {total === 1 ? 'reseña' : 'reseñas'}</Text>
      </View>
      <View style={{ flex: 1, gap: 7 }}>
        {distribucionEstrellas(calificaciones).map((d) => (
          <View key={d.estrellas} style={estilos.fila}>
            <Text style={estilos.numero}>{d.estrellas}</Text>
            <Ionicons name="star" size={12} color={Colores.estrella} />
            <View style={{ flex: 1 }}><BarraProgreso valor={total ? d.total / total : 0} color={Colores.estrella} alto={7} /></View>
            <Text style={estilos.cantidad}>{d.total}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 18, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#ECE6F7' },
  resumen: { alignItems: 'center', gap: 4, minWidth: 84 },
  promedio: { fontSize: 38, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  cuantas: { fontSize: 12.5, color: Colores.textoSuave },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numero: { width: 10, fontSize: 12.5, color: Colores.texto },
  cantidad: { width: 22, fontSize: 12.5, color: Colores.textoSuave, textAlign: 'right' },
});
