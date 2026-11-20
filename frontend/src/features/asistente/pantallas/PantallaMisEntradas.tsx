import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { TarjetaEntrada } from '../componentes/TarjetaEntrada';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useMisEntradas } from '../hooks/useMisEntradas';
import { estilos } from './PantallaMisEntradas.estilos';

export function PantallaMisEntradas() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const m = useMisEntradas(perfil?.uid);

  return (
    <View style={estilos.raiz}>
      <View style={[estilos.encabezado, { paddingTop: top + 16 }]}>
        <Text style={estilos.titulo}>Mis eventos</Text>
        <Text style={estilos.subtitulo}>Tus entradas y códigos QR</Text>
      </View>

      <View style={estilos.pestanas}>
        {(['proximas', 'anteriores'] as const).map((p) => (
          <Pressable key={p} style={[estilos.pestana, m.pestana === p && estilos.pestanaActiva]} onPress={() => m.setPestana(p)} accessibilityRole="tab">
            <Text style={[estilos.textoPestana, m.pestana === p && { color: '#FFFFFF' }]}>
              {p === 'proximas' ? `Próximas (${m.proximas.length})` : `Anteriores (${m.anteriores.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {m.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : m.error ? (
          <View style={estilos.centro}><Text style={estilos.vacio}>{m.error}</Text></View>
        ) : m.lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="ticket-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>
              {m.pestana === 'proximas' ? 'No tienes entradas compradas aún.\nExplora los eventos y consigue la tuya.' : 'Aquí aparecerán tus entradas usadas o vencidas.'}
            </Text>
          </View>
        ) : (
          m.lista.map((e) => <TarjetaEntrada key={e.id} entrada={e} alPulsar={() => router.push(`/asistente/entrada/${e.id}` as Href)} />)
        )}
      </ScrollView>
    </View>
  );
}
