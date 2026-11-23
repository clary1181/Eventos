import React from 'react';
import { Stack } from 'expo-router';
import { GuardiaRol } from '@/features/auth';
import { ProveedorPerfilOrganizador } from '@/features/organizador';

export const unstable_settings = { initialRouteName: '(pestanas)' };

export default function LayoutOrganizador() {
  return (
    <GuardiaRol rol="organizador">
      <ProveedorPerfilOrganizador>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(pestanas)" />
        </Stack>
      </ProveedorPerfilOrganizador>
    </GuardiaRol>
  );
}