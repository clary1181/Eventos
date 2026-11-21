import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { EncabezadoSimple } from '../componentes/EncabezadoSimple';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useHistorialEventos } from '../hooks/useHistorialEventos';
import { formatearDiaMes } from '../utilidades/formato';

export function PantallaHistorialEventos() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const h = useHistorialEventos(perfil?.uid);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/perfil' as Href));

  return (
    <View style={estilos.raiz}>
      <EncabezadoSimple titulo="Historial de eventos" subtitulo="Eventos pasados con entradas tuyas" alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {h.cargando ? (
          <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
        ) : h.error ? (
          <Text style={estilos.vacio}>{h.error}</Text>
        ) : h.eventos.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="time-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>Aún no tienes eventos pasados.{'\n'}Aquí aparecerán los eventos a los que compraste entrada cuando terminen.</Text>
          </View>
        ) : (
          h.eventos.map((e) => (
            <Pressable key={e.eventoId} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.9 }]} onPress={() => router.push(`/asistente/evento/${e.eventoId}` as Href)} accessibilityRole="button">
              <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={estilos.titulo} numberOfLines={2}>{e.titulo}</Text>
                <View style={estilos.fila}>
                  <Ionicons name="calendar-outline" size={15} color={Colores.primarioOscuro} />
                  <Text style={estilos.dato}>{formatearDiaMes(e.fecha)}</Text>
                </View>
                <View style={estilos.fila}>
                  <Ionicons name="location-outline" size={15} color={Colores.primarioOscuro} />
                  <Text style={estilos.dato} numberOfLines={1}>{e.lugar}</Text>
                </View>
                <View style={estilos.pie}>
                  <View style={[estilos.insignia, { backgroundColor: e.asistio ? '#DDF3E4' : '#ECE6F7' }]}>
                    <Text style={[estilos.textoInsignia, { color: e.asistio ? '#1B7F3B' : Colores.primarioOscuro }]}>{e.asistio ? 'Asististe' : 'No se validó tu entrada'}</Text>
                  </View>
                  <Text style={estilos.dato}>{e.entradas} {e.entradas === 1 ? 'entrada' : 'entradas'}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  lista: { padding: 20, gap: 12, paddingBottom: 40 },
  centro: { alignItems: 'center', padding: 40, gap: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
  tarjeta: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#ECE6F7' },
  imagen: { width: 92, height: 92, borderRadius: 14, backgroundColor: '#EFE8FB' },
  titulo: { fontSize: 16, fontWeight: '800', color: '#1F1B2E' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dato: { fontSize: 13, color: Colores.textoSuave, flexShrink: 1 },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  insignia: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  textoInsignia: { fontSize: 12, fontWeight: '700' },
});
