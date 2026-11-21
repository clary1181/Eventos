import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { OrganizadorPublico } from '../servicios/servicioOrganizador';

interface Propiedades { nombreRespaldo: string; organizador: OrganizadorPublico | null; alPulsar?: () => void }

export function TarjetaOrganizadorDetalle({ nombreRespaldo, organizador, alPulsar }: Propiedades) {
  const nombre = organizador?.nombre || nombreRespaldo || 'Organizador';
  return (
    <Pressable onPress={alPulsar} disabled={!alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.9 }]} accessibilityRole="button" accessibilityLabel={`Ver perfil de ${nombre}`}>
      {organizador?.fotoUrl ? (
        <Image source={{ uri: organizador.fotoUrl }} style={estilos.avatar} />
      ) : (
        <View style={[estilos.avatar, estilos.avatarVacio]}>
          <Text style={estilos.inicial}>{nombre.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={estilos.etiqueta}>Organizador</Text>
        <View style={estilos.filaNombre}>
          <Text style={estilos.nombre} numberOfLines={1}>{nombre}</Text>
          <MaterialCommunityIcons name="check-decagram" size={20} color={Colores.primario} />
        </View>
        {!!organizador?.instagram && (
          <View style={estilos.filaDato}>
            <Ionicons name="logo-instagram" size={18} color={Colores.primarioOscuro} />
            <Text style={estilos.dato} numberOfLines={1}>{organizador.instagram}</Text>
          </View>
        )}
      </View>
      {!!alPulsar && <Ionicons name="chevron-forward" size={22} color={Colores.primarioOscuro} />}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#F6F2FD', borderRadius: 20, padding: 16, marginTop: 20 },
  avatar: { width: 68, height: 68, borderRadius: 34 },
  avatarVacio: { backgroundColor: '#E4D7F8', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 28, fontWeight: '800', color: Colores.primario },
  etiqueta: { fontSize: 14, color: Colores.textoSuave },
  filaNombre: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nombre: { flexShrink: 1, fontSize: 19, fontWeight: '800', color: '#1F1B2E' },
  filaDato: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dato: { fontSize: 15, color: '#1F1B2E', flexShrink: 1 },
});
