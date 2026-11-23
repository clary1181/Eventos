import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { rutaInicialPorRol, useSesion } from '@/features/auth';
import { Colores } from '@/compartido/tema';

export default function Arranque() {
  const { perfil, cargando } = useSesion();

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colores.fondo }}>
        <ActivityIndicator size="large" color={Colores.primario} />
      </View>
    );
  }
  return <Redirect href={perfil ? rutaInicialPorRol(perfil.rol) : '/iniciar-sesion'} />;
}