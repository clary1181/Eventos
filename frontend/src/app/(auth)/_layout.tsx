import React from 'react';
import { Redirect, Stack, useSegments, type Href } from 'expo-router';
import { useSesion } from '@/features/auth';

// Si ya hay sesión, las pantallas de acceso no se muestran.
// Quien entró con Google y aún no tiene perfil debe pasar por "completar-perfil".
export default function LayoutAuth() {
  const { perfil, pendientePerfil, cargando } = useSesion();
  const segmentos = useSegments() as string[];
  const enCompletarPerfil = segmentos.includes('completar-perfil');

  if (perfil) return <Redirect href="/inicio" />;
  if (pendientePerfil && !enCompletarPerfil) return <Redirect href={'/completar-perfil' as Href} />;
  // Si cancela (cierra sesión) estando en "completar perfil", vuelve al inicio de sesión
  if (!cargando && !pendientePerfil && enCompletarPerfil) return <Redirect href="/iniciar-sesion" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
