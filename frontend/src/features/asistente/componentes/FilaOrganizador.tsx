import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useOrganizadorPublico } from '../hooks/useOrganizadorPublico';
import { BotonSeguir } from './BotonSeguir';

interface Propiedades {
  organizadorId: string;
  nombreRespaldo?: string;
  detalle?: string;
  siguiendo: boolean;
  alAbrir: () => void;
  alSeguir: () => void;
}

export function FilaOrganizador({ organizadorId, nombreRespaldo, detalle, siguiendo, alAbrir, alSeguir }: Propiedades) {
  const o = useOrganizadorPublico(organizadorId);
  const nombre = o?.nombre || nombreRespaldo || 'Organizador';
  return (
    <Pressable onPress={alAbrir} style={({ pressed }) => [estilos.fila, pressed && { opacity: 0.9 }]} accessibilityRole="button">
      {o?.fotoUrl ? (
        <Image source={{ uri: o.fotoUrl }} style={estilos.avatar} />
      ) : (
        <View style={[estilos.avatar, estilos.avatarVacio]}><Text style={estilos.inicial}>{nombre.charAt(0).toUpperCase()}</Text></View>
      )}
      <View style={{ flex: 1 }}>
        <View style={estilos.filaNombre}>
          <Text style={estilos.nombre} numberOfLines={1}>{nombre}</Text>
          <MaterialCommunityIcons name="check-decagram" size={18} color={Colores.primario} />
        </View>
        {!!detalle && <Text style={estilos.detalle} numberOfLines={1}>{detalle}</Text>}
      </View>
      <BotonSeguir compacto siguiendo={siguiendo} alPulsar={alSeguir} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#ECE6F7' },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarVacio: { backgroundColor: '#E4D7F8', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 22, fontWeight: '800', color: Colores.primario },
  filaNombre: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  nombre: { flexShrink: 1, fontSize: 16, fontWeight: '800', color: '#1F1B2E' },
  detalle: { fontSize: 13, color: Colores.textoSuave, marginTop: 2 },
});
