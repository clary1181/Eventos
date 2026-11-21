import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';
import { formatearFechaCorta } from '@/features/eventos';
import type { CalificacionResumen } from '../tipos';

interface Propiedades { calificaciones: CalificacionResumen[]; limite?: number; mostrarEvento?: boolean }

export function ListaCalificaciones({ calificaciones, limite, mostrarEvento = true }: Propiedades) {
  if (calificaciones.length === 0) {
    return (
      <View style={estilos.vacio}>
        <Ionicons name="star-outline" size={34} color={Colores.acento} />
        <Text style={estilos.textoVacio}>Todavía no tienes calificaciones.{'\n'}Los asistentes pueden calificar cuando termina el evento.</Text>
      </View>
    );
  }
  return (
    <View style={{ gap: 10 }}>
      {(limite ? calificaciones.slice(0, limite) : calificaciones).map((c) => (
        <View key={c.id} style={estilos.tarjeta}>
          <View style={estilos.fila}>
            <Text style={estilos.nombre} numberOfLines={1}>{c.asistenteNombre}</Text>
            <View style={{ flexDirection: 'row', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((n) => <Ionicons key={n} name={n <= c.estrellas ? 'star' : 'star-outline'} size={14} color={Colores.estrella} />)}
            </View>
          </View>
          {mostrarEvento && !!c.eventoTitulo && <Text style={estilos.evento} numberOfLines={1}>{c.eventoTitulo}</Text>}
          {!!c.comentario && <Text style={estilos.comentario}>{c.comentario}</Text>}
          <Text style={estilos.fecha}>{formatearFechaCorta(c.creadaEn)}</Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  vacio: { alignItems: 'center', gap: 8, padding: 24 },
  textoVacio: { fontSize: 14, color: Colores.textoSuave, textAlign: 'center', lineHeight: 20 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, gap: 4, borderWidth: 1, borderColor: '#ECE6F7' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  nombre: { flex: 1, fontSize: 15, fontFamily: Fuentes.negrita, color: Colores.texto },
  evento: { fontSize: 13, color: Colores.primario, fontFamily: Fuentes.seminegrita },
  comentario: { fontSize: 14, color: '#3D3852', lineHeight: 20, marginTop: 2 },
  fecha: { fontSize: 12, color: Colores.textoSuave, marginTop: 2 },
});
