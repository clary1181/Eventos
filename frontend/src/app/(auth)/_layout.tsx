import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useSesion } from '@/features/auth';

// Si ya hay sesión, las pantallas de acceso no se muestran
export default function LayoutAuth() {
  const { perfil } = useSesion();
  if (perfil) return <Redirect href="/inicio" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
