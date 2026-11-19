import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { estilos } from './EncabezadoAdmin.estilos';

// Misma foto de Ensenada que el inicio de sesión (frontend/assets/imagenes/ensenada.jpg)
const FOTO_ENSENADA = require('../../../../assets/imagenes/ensenada.jpg');

export const ALTO_ENCABEZADO_ADMIN = 232;

interface Propiedades {
  hayPendientes: boolean;
  alAvisos: () => void;
  alPerfil: () => void;
}

// Encabezado del panel: foto con velo morado, marca, campana, perfil y título
export function EncabezadoAdmin({ hayPendientes, alAvisos, alPerfil }: Propiedades) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ height: ALTO_ENCABEZADO_ADMIN + top, backgroundColor: '#4B1D8F' }}>
      <Image source={FOTO_ENSENADA} style={estilos.imagen} resizeMode="cover" />
      <Svg style={estilos.imagen} width="100%" height="100%">
        <Defs>
          <LinearGradient id="veloAdmin" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4B1D8F" stopOpacity="0.88" />
            <Stop offset="0.55" stopColor="#6A2FB0" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#6A2FB0" stopOpacity="0.12" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#veloAdmin)" />
      </Svg>

      <View style={{ paddingTop: top + 10 }}>
        <View style={estilos.fila}>
          <View style={estilos.marca}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={36} color="#FFFFFF" />
            <Text style={estilos.textoMarca}>MR-Eventos</Text>
          </View>
          <View style={estilos.acciones}>
            <Pressable style={estilos.boton} onPress={alAvisos} accessibilityLabel="Avisos" hitSlop={6}>
              <Ionicons name="notifications-outline" size={30} color="#FFFFFF" />
              {hayPendientes && <View style={estilos.punto} />}
            </Pressable>
            <Pressable style={estilos.boton} onPress={alPerfil} accessibilityLabel="Mi perfil" hitSlop={6}>
              <Ionicons name="person-circle-outline" size={36} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={estilos.titulo}>
          <Ionicons name="shield-checkmark-outline" size={34} color="#FFFFFF" />
          <Text style={estilos.textoTitulo}>Panel de Administración</Text>
        </View>
        <Text style={estilos.subtitulo}>Modera, verifica y supervisa la actividad de la plataforma.</Text>
      </View>
    </View>
  );
}
