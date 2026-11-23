import React from 'react';
import { Redirect, Stack, useSegments, type Href } from 'expo-router';
import { rutaInicialPorRol, useSesion } from '@/features/auth';

export default function LayoutAuth() {
  const sesion = useSesion();
  const perfil = sesion.perfil;
  const perfilPendiente =
    'perfilPendiente' in sesion && sesion.perfilPendiente === true;
  const segmentos = useSegments() as string[];
  if (perfil) return <Redirect href={rutaInicialPorRol(perfil.rol)} />;
  if (perfilPendiente && segmentos[segmentos.length - 1] !== 'completar-perfil') {
    return <Redirect href={'/completar-perfil' as Href} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}