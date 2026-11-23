import React, { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useRouter, type Href } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { ListaEventosValidar } from '../componentes/ListaEventosValidar';
import { VisorEscaner } from '../componentes/VisorEscaner';
import { useEventosValidables } from '../hooks/useEventosValidables';
import type { EventoValidable } from '../tipos';
import { estilos } from './PantallaValidarQR.estilos';

export function PantallaValidarQR() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const { eventos, cargando } = useEventosValidables(perfil?.uid);
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [elegido, setElegido] = useState<EventoValidable | null>(null);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/organizador/inicio' as Href));

  if (!perfil) return null;

  if (elegido) {
    if (!permiso) return <View style={estilos.centro}><Stack.Screen options={{ headerShown: false }} /><ActivityIndicator color={Colores.primario} /></View>;
    if (!permiso.granted) {
      return (
        <View style={estilos.centro}>
          <Stack.Screen options={{ headerShown: false }} />
          <Ionicons name="camera-outline" size={56} color={Colores.acento} />
          <Text style={estilos.mensaje}>Necesitamos la cámara para leer los códigos QR de las entradas.</Text>
          <Pressable
            style={estilos.boton}
            onPress={async () => {
              try {
                if (permiso.canAskAgain) await pedirPermiso();
                else await Linking.openSettings();
              } catch {
              }
            }}
          >
            <Text style={estilos.textoBoton}>{permiso.canAskAgain ? 'Permitir cámara' : 'Abrir ajustes'}</Text>
          </Pressable>
          <Text style={{ color: Colores.primario, fontWeight: '700' }} onPress={() => setElegido(null)}>Elegir otro evento</Text>
        </View>
      );
    }
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <VisorEscaner evento={elegido} uid={perfil.uid} alCambiarEvento={() => setElegido(null)} />
      </>
    );
  }

  return (
    <View style={estilos.raiz}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[estilos.encabezado, { paddingTop: top + 12 }]}>
        <Pressable style={estilos.volver} onPress={volver} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>Validar QR</Text>
          <Text style={estilos.subtitulo}>Elige el evento que vas a atender</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <ListaEventosValidar eventos={eventos} cargando={cargando} alElegir={setElegido} />
      </ScrollView>
    </View>
  );
}
