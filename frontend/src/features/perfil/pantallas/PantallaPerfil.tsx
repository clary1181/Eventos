import React from 'react';
import { Text, View } from 'react-native';
import { BotonContorno } from '@/compartido/componentes';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { cerrarSesion, useSesion } from '@/features/auth';
import { estilos } from './PantallaPerfil.estilos';

const NOMBRE_ROL = { asistente: 'Asistente', organizador: 'Organizador', administrador: 'Administrador' } as const;

// Perfil básico para asistente y administrador (el del organizador tiene su propia pantalla)
export function PantallaPerfil() {
  useBarraEstado('dark');
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
      <BotonContorno titulo="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
}
