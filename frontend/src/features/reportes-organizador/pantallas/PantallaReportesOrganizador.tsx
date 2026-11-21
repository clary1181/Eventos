import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { ListaReportesOrganizador } from '../componentes/ListaReportesOrganizador';
import { useReportesOrganizador } from '../hooks/useReportesOrganizador';

export function PantallaReportesOrganizador() {
  useBarraEstado('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const r = useReportesOrganizador(perfil?.uid);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/organizador/inicio' as Href));

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla titulo="Reportes" subtitulo={r.pendientes > 0 ? `${r.pendientes} por responder` : 'Reportes revisados por un administrador'} alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <ListaReportesOrganizador lista={r.lista} cargando={r.cargando} error={r.error} responder={r.responder} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  contenido: { padding: 20, paddingBottom: 40 },
});
