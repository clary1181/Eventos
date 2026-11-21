import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { EncabezadoSimple } from '../componentes/EncabezadoSimple';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useMisReportes } from '../hooks/useMisCalificacionesYReportes';
import { MOTIVOS_REPORTE } from '../servicios/servicioReportes';
import { formatearDiaMes } from '../utilidades/formato';

export function PantallaMisReportes() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const { lista, cargando } = useMisReportes(perfil?.uid);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/perfil' as Href));

  return (
    <View style={estilos.raiz}>
      <EncabezadoSimple titulo="Mis reportes" subtitulo="Eventos que reportaste" alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {cargando ? (
          <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
        ) : lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="document-text-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>No has enviado reportes.{'\n'}Si ves algo raro en un evento, puedes reportarlo desde su detalle.</Text>
          </View>
        ) : (
          lista.map((r) => (
            <View key={r.id} style={estilos.tarjeta}>
              <Text style={estilos.titulo} numberOfLines={2}>{r.eventoTitulo || 'Evento'}</Text>
              <Text style={estilos.motivo}>{MOTIVOS_REPORTE.find((m) => m.id === r.motivo)?.titulo ?? r.motivo}</Text>
              <Text style={estilos.descripcion}>{r.descripcion}</Text>
              <View style={estilos.pie}>
                <View style={estilos.estado}><Text style={estilos.textoEstado}>{r.estado === 'pendiente_moderacion' ? 'En revisión' : r.estado === 'resuelto' ? 'Atendido' : 'Sin infracción'}</Text></View>
                <Text style={estilos.fecha}>{formatearDiaMes(r.creadoEn)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  lista: { padding: 20, gap: 12, paddingBottom: 40 },
  centro: { alignItems: 'center', padding: 40, gap: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, gap: 6, borderWidth: 1, borderColor: '#ECE6F7' },
  titulo: { fontSize: 17, fontWeight: '800', color: '#1F1B2E' },
  motivo: { fontSize: 14, fontWeight: '700', color: Colores.primario },
  descripcion: { fontSize: 14, color: '#3D3852', lineHeight: 20 },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  estado: { backgroundColor: '#FDE8D4', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  textoEstado: { fontSize: 13, fontWeight: '700', color: '#B4530A' },
  fecha: { fontSize: 12.5, color: Colores.textoSuave },
});