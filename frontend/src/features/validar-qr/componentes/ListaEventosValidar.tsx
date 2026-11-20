import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { ventanaQR } from '@/features/asistente/utilidades/entradas';
import { formatearFechaHora } from '@/features/asistente/utilidades/formato';
import type { EventoValidable } from '../tipos';

interface Propiedades { eventos: EventoValidable[]; cargando: boolean; alElegir: (e: EventoValidable) => void }

export function ListaEventosValidar({ eventos, cargando, alElegir }: Propiedades) {
  if (cargando) return <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>;
  if (eventos.length === 0) {
    return (
      <View style={estilos.centro}>
        <Ionicons name="calendar-outline" size={52} color={Colores.acento} />
        <Text style={estilos.vacio}>No tienes eventos aprobados para validar.{'\n'}Aquí aparecerán cuando uno sea aprobado.</Text>
      </View>
    );
  }
  const ahora = Date.now();
  return (
    <View style={{ gap: 12 }}>
      {eventos.map((e) => {
        const abierto = ahora >= ventanaQR(e.fechaInicio).desde.getTime();
        return (
          <Pressable key={e.id} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.9 }]} onPress={() => alElegir(e)} accessibilityRole="button">
            <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={estilos.titulo} numberOfLines={2}>{e.titulo}</Text>
              <Text style={estilos.dato} numberOfLines={1}>{formatearFechaHora(e.fechaInicio)}</Text>
              <Text style={estilos.dato} numberOfLines={1}>{e.vendidas} de {e.capacidad} entradas vendidas</Text>
              <View style={[estilos.etiqueta, { backgroundColor: abierto ? '#D9F2DE' : '#FDE8D4' }]}>
                <Text style={[estilos.textoEtiqueta, { color: abierto ? '#1B7F3B' : '#B4530A' }]}>{abierto ? 'Acceso abierto' : 'Aún no abre'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colores.primario} />
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#ECE6F7' },
  imagen: { width: 76, height: 76, borderRadius: 12, backgroundColor: '#EFE8FB' },
  titulo: { fontSize: 16, fontWeight: '800', color: '#1F1B2E' },
  dato: { fontSize: 13, color: Colores.textoSuave },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 2 },
  textoEtiqueta: { fontSize: 12, fontWeight: '700' },
});
