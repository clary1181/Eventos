import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSesion } from '@/features/auth';
import { useSuspensionOrganizador } from '../hooks/useSuspensionOrganizador';

export const fechaSuspension = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

// Aviso rojo en el Inicio del organizador mientras su cuenta esté suspendida
export function AvisoSuspension() {
  const { perfil } = useSesion();
  const s = useSuspensionOrganizador(perfil?.uid);
  if (!s) return null;
  return (
    <View style={estilos.caja}>
      <Ionicons name="alert-circle" size={28} color="#B3261E" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={estilos.titulo}>Tu cuenta está suspendida</Text>
        <Text style={estilos.texto}>No puedes crear ni editar eventos hasta el {fechaSuspension(s.hasta)}.</Text>
        {!!s.motivo && <Text style={estilos.texto}>Motivo: {s.motivo}</Text>}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FDE4E4', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#F3B8B5' },
  titulo: { fontSize: 15.5, fontWeight: '800', color: '#B3261E' },
  texto: { fontSize: 13.5, color: '#5A1A17', lineHeight: 19 },
});
