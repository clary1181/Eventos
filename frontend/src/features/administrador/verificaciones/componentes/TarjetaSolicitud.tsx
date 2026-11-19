import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { PerfilResumido, SolicitudAdmin } from '../tipos';

export const formatearFecha = (d: Date | null) =>
  d ? d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

interface Propiedades { solicitud: SolicitudAdmin; perfil?: PerfilResumido; alPulsar: () => void }

export function TarjetaSolicitud({ solicitud, perfil, alPulsar }: Propiedades) {
  const nombre = perfil?.nombreCompleto ?? 'Cargando…';
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.85 }]} accessibilityRole="button">
      <View style={estilos.avatar}>
        <Text style={estilos.inicial}>{nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.nombre} numberOfLines={1}>{nombre}</Text>
        {!!perfil?.nombreUsuario && <Text style={estilos.detalle}>@{perfil.nombreUsuario}</Text>}
        <Text style={estilos.detalle}>Enviada: {formatearFecha(solicitud.actualizadaEn ?? solicitud.creadaEn)}</Text>
        {solicitud.reenvios > 0 && <Text style={estilos.reenvio}>Reenviada {solicitud.reenvios} {solicitud.reenvios === 1 ? 'vez' : 'veces'}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={22} color={Colores.primarioMedio} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14,
    shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EFE8FB', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 20, fontWeight: '800', color: Colores.primario },
  textos: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: '800', color: Colores.texto },
  detalle: { fontSize: 13, color: Colores.textoSuave, marginTop: 1 },
  reenvio: { fontSize: 12, fontWeight: '700', color: '#E8871A', marginTop: 3 },
});
