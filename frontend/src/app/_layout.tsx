import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colores } from '@/compartido/tema';
import { useFuentes } from '@/compartido/tema/useFuentes';
import { SesionProvider } from '@/features/auth';

export default function LayoutRaiz() {
  // Montserrat se carga una sola vez para toda la app
  const fuentesListas = useFuentes();
  if (!fuentesListas) return <View style={{ flex: 1, backgroundColor: Colores.fondo }} />;

  return (
    <SesionProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SesionProvider>
  );
}
