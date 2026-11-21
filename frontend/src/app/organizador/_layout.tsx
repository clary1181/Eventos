import React from 'react';
import { Stack } from 'expo-router';
import { GuardiaRol } from '@/features/auth';
import { ProveedorPerfilOrganizador } from '@/features/organizador';

// Raíz del organizador: las pestañas viven en "(pestanas)" y el resto (perfil, reportes, estadísticas de un evento,
// verificación, editar evento) se abren encima, a pantalla completa y con su propio botón de volver
export default function LayoutOrganizador() {
  return (
    <GuardiaRol rol="organizador">
      <ProveedorPerfilOrganizador>
        <Stack screenOptions={{ headerShown: false }} />
      </ProveedorPerfilOrganizador>
    </GuardiaRol>
  );
}
