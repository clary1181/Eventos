import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BotonCrearPestana, useAccionCrearEvento } from '@/features/organizador';
import { useOpcionesPestanas } from '@/compartido/navegacion/useOpcionesPestanas';

type Icono = React.ComponentProps<typeof Ionicons>['name'];
const icono = (activo: Icono, inactivo: Icono) =>
  function Pestana({ color, size, focused }: { color: string; size: number; focused: boolean }) {
    return <Ionicons name={focused ? activo : inactivo} color={color} size={size} />;
  };

// Barra inferior del organizador: Inicio, Mis eventos, Crear (botón central), Estadísticas y Perfil
export default function PestanasOrganizador() {
  const opciones = useOpcionesPestanas();
  const crear = useAccionCrearEvento();

  return (
    <Tabs screenOptions={opciones}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: icono('home', 'home-outline') }} />
      <Tabs.Screen name="mis-eventos" options={{ title: 'Mis eventos', tabBarIcon: icono('calendar', 'calendar-outline') }} />
      <Tabs.Screen name="crear" options={{ title: 'Crear', tabBarButton: () => <BotonCrearPestana alPresionar={crear} /> }} />
      <Tabs.Screen name="estadisticas" options={{ title: 'Estadísticas', tabBarIcon: icono('stats-chart', 'stats-chart-outline') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person', 'person-outline') }} />
    </Tabs>
  );
}
