import React from 'react';
import { Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { BotonContorno } from '@/compartido/componentes';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { estilos } from './PantallaPerfil.estilos';

const NOMBRE_ROL = { asistente: 'Asistente', organizador: 'Organizador', administrador: 'Administrador' } as const;
const RUTA_CONFIG = {
  asistente: '/asistente/configuracion',
  organizador: '/organizador/configuracion',
  administrador: '/administrador/configuracion',
} as const;

// Perfil básico para asistente y administrador (el del organizador tiene su propia pantalla)
export function PantallaPerfil() {
  useBarraEstado('dark');
  const router = useRouter();
  const { perfil } = useSesion();
  if (!perfil) return null;

  return (
    <View style={estilos.raiz}>
      <View style={estilos.cabecera}>
        <View style={estilos.avatar}>
          <Text style={estilos.inicial}>{perfil.nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={estilos.nombre}>{perfil.nombre} {perfil.apellidos}</Text>
        <Text style={estilos.usuario}>@{perfil.nombreUsuario} · {perfil.ciudad}</Text>
        <View style={estilos.etiqueta}>
          <Text style={estilos.textoEtiqueta}>{NOMBRE_ROL[perfil.rol]}</Text>
        </View>
      </View>
      <BotonContorno titulo="Configuración" onPress={() => router.push(RUTA_CONFIG[perfil.rol] as Href)} />
    </View>
  );
}
