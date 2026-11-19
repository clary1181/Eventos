import React, { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useSesion } from '../hooks/useSesion';
import { rutaInicialPorRol } from '../utilidades/rutas';
import type { RolUsuario } from '../tipos';

// Protege una carpeta de rutas: solo entra quien tiene el rol indicado
export function GuardiaRol({ rol, children }: { rol: RolUsuario; children: ReactNode }) {
  const { perfil } = useSesion();
  if (!perfil) return <Redirect href="/iniciar-sesion" />;
  if (perfil.rol !== rol) return <Redirect href={rutaInicialPorRol(perfil.rol)} />;
  return <>{children}</>;
}
