import React from 'react';
import { Stack } from 'expo-router';
import { GuardiaRol } from '@/features/auth';
import { Colores } from '@/compartido/tema';

export default function LayoutAdministrador() {
  return (
    <GuardiaRol rol="administrador">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(pestanas)" />
        <Stack.Screen
          name="perfil"
          options={{
            headerShown: true,
            title: 'Mi perfil',
            headerTintColor: Colores.primarioOscuro,
            headerStyle: { backgroundColor: Colores.fondo },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </GuardiaRol>
  );
}
