import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { EncabezadoSimple } from '../componentes/EncabezadoSimple';
import { FilaOrganizador } from '../componentes/FilaOrganizador';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useSeguidos } from '../hooks/useSeguidos';

export function PantallaOrganizadoresSeguidos() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const s = useSeguidos(perfil?.uid);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/perfil' as Href));

  return (
    <View style={estilos.raiz}>
      <EncabezadoSimple titulo="Organizadores que sigo" subtitulo={`${s.lista.length} ${s.lista.length === 1 ? 'organizador' : 'organizadores'}`} alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        {s.cargando ? (
          <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
        ) : s.lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="people-outline" size={52} color={Colores.acento} />
            <Text style={estilos.vacio}>Aún no sigues a ningún organizador.{'\n'}Búscalos por nombre en Inicio o desde el detalle de un evento.</Text>
          </View>
        ) : (
          s.lista.map((oid) => (
            <FilaOrganizador
              key={oid}
              organizadorId={oid}
              siguiendo
              alAbrir={() => router.push(`/asistente/organizador/${oid}` as Href)}
              alSeguir={() => s.alternar(oid)}
            />
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
});
