import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';

type Icono = React.ComponentProps<typeof Ionicons>['name'];

const icono = (activo: Icono, inactivo: Icono) =>
  function IconoPestana({ color, focused }: { color: string; focused: boolean }) {
    return <Ionicons name={focused ? activo : inactivo} size={28} color={color} />;
  };

export default function PestanasAsistente() {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colores.primario,
        tabBarInactiveTintColor: Colores.textoSuave,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF', borderTopWidth: 0, height: 64 + bottom, paddingTop: 8,
          paddingBottom: bottom > 0 ? bottom : 8, borderTopLeftRadius: 26, borderTopRightRadius: 26,
          shadowColor: '#4B1D8F', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 12,
        },
      }}
    >
      <Tabs.Screen name="explorar" options={{ title: 'Inicio', tabBarIcon: icono('home', 'home-outline') }} />
      <Tabs.Screen name="entradas" options={{ title: 'Mis eventos', tabBarIcon: icono('calendar', 'calendar-outline') }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: icono('heart', 'heart-outline') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person', 'person-outline') }} />
    </Tabs>
  );
}
