import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colores } from '@/compartido/tema';
import { useFuentes } from '@/compartido/tema/useFuentes';
import { SesionProvider } from '@/features/auth';
import { AvisosProvider } from '@/compartido/avisos/AvisosProvider';

export default function LayoutRaiz() {
  const fuentesListas = useFuentes();
  if (!fuentesListas) return <View style={{ flex: 1, backgroundColor: Colores.fondo }} />;

  return (
    <AvisosProvider>
      <SesionProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SesionProvider>
    </AvisosProvider>
  );
}
