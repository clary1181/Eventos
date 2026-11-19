import React from 'react';
import { Stack } from 'expo-router';
import { Colores, Fuentes } from '@/compartido/tema';
import { GuardiaRol } from '@/features/auth';
import { ProveedorPerfilOrganizador } from '@/features/organizador';

// Encabezado de las pantallas secundarias (tienen botón de volver)
const encabezado = {
  headerShown: true,
  headerTintColor: Colores.primario,
  headerTitleStyle: { fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Colores.fondo },
} as const;

// Raíz del organizador: las pestañas viven en "(pestanas)" y estas pantallas se abren encima, a pantalla completa
export default function LayoutOrganizador() {
  return (
    <GuardiaRol rol="organizador">
      <ProveedorPerfilOrganizador>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="validar-qr" options={{ ...encabezado, title: 'Validar QR' }} />
          <Stack.Screen name="reportes" options={{ ...encabezado, title: 'Reportes' }} />
        </Stack>
      </ProveedorPerfilOrganizador>
    </GuardiaRol>
  );
}
