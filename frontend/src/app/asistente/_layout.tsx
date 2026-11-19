import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GuardiaRol } from '@/features/auth';
import { useOpcionesPestanas } from '@/compartido/navegacion/useOpcionesPestanas';

type Icono = React.ComponentProps<typeof Ionicons>['name'];
const icono = (nombre: Icono) =>
  function Pestana({ color, size }: { color: string; size: number }) {
    return <Ionicons name={nombre} color={color} size={size} />;
  };

export default function LayoutAsistente() {
  const opciones = useOpcionesPestanas();
  return (
    <GuardiaRol rol="asistente">
      <Tabs screenOptions={opciones}>
        <Tabs.Screen name="explorar" options={{ title: 'Explorar', tabBarIcon: icono('compass-outline') }} />
        <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: icono('heart-outline') }} />
        <Tabs.Screen name="entradas" options={{ title: 'Mis entradas', tabBarIcon: icono('ticket-outline') }} />
        <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person-outline') }} />
      </Tabs>
    </GuardiaRol>
  );
}
