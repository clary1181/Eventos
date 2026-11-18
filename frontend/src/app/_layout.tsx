import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SesionProvider } from '@/features/auth';

export default function LayoutRaiz() {
  return (
    <SesionProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SesionProvider>
  );
}
