import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { TarjetaEventoAsistente } from '../componentes/TarjetaEventoAsistente';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useEventosFavoritos } from '../hooks/useEventosFavoritos';
import { estilos } from './PantallaMisEntradas.estilos';

export function PantallaFavoritos() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const f = useEventosFavoritos(perfil?.uid);

  return (
    <View style={estilos.raiz}>
      <View style={[estilos.encabezado, { paddingTop: top + 16 }]}>
        <Text style={estilos.titulo}>Favoritos</Text>
        <Text style={estilos.subtitulo}>Los eventos que guardaste</Text>
      </View>
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {f.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : f.favoritos.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="heart-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>Aún no tienes favoritos.{'\n'}Toca el corazón de un evento para guardarlo aquí.</Text>
          </View>
        ) : (
          f.favoritos.map((e) => (
            <TarjetaEventoAsistente
              key={e.id}
              evento={e}
              esFavorito
              alPulsar={() => router.push(`/asistente/evento/${e.id}` as Href)}
              alFavorito={() => f.alternar(e.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
