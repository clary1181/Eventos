import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { EncabezadoSimple } from '../componentes/EncabezadoSimple';
import { Estrellas } from '../componentes/Estrellas';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useMisCalificaciones } from '../hooks/useMisCalificacionesYReportes';
import { formatearDiaMes } from '../utilidades/formato';

export function PantallaMisCalificaciones() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const { lista, cargando } = useMisCalificaciones(perfil?.uid);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/perfil' as Href));

  return (
    <View style={estilos.raiz}>
      <EncabezadoSimple titulo="Mis calificaciones" subtitulo="Lo que opinaste de los eventos" alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {cargando ? (
          <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
        ) : lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="star-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>Aún no has calificado ningún evento.{'\n'}Puedes hacerlo cuando termine un evento al que compraste entrada.</Text>
          </View>
        ) : (
          lista.map((c) => (
            <View key={c.id} style={estilos.tarjeta}>
              <Text style={estilos.titulo} numberOfLines={2} onPress={() => router.push(`/asistente/evento/${c.eventoId}` as Href)}>{c.eventoTitulo || 'Evento'}</Text>
              <Estrellas valor={c.estrellas} tamano={20} />
              {!!c.comentario && <Text style={estilos.comentario}>{c.comentario}</Text>}
              <Text style={estilos.fecha}>{formatearDiaMes(c.creadaEn)}</Text>
            </View>
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
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 6, borderWidth: 1, borderColor: '#ECE6F7' },
  titulo: { fontSize: 17, fontWeight: '800', color: '#1F1B2E' },
  comentario: { fontSize: 14, color: '#3D3852', lineHeight: 20 },
  fecha: { fontSize: 12.5, color: Colores.textoSuave },
});
