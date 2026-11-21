import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { useEventosOrganizador } from '@/features/eventos';
import { useDatosOrganizador } from '../hooks/useDatosOrganizador';
import { PanelEstadisticas } from '../componentes/PanelEstadisticas';

export function PantallaEstadisticas() {
  useBarraEstado('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const { eventos } = useEventosOrganizador(perfil?.uid);
  const datos = useDatosOrganizador(perfil?.uid);

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla titulo="Estadísticas" subtitulo="Ventas, asistencia y calificaciones de tus eventos" />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <PanelEstadisticas
          eventos={eventos}
          entradas={datos.entradas}
          calificaciones={datos.calificaciones}
          cargando={datos.cargando}
          error={datos.error}
          alAbrirEvento={(e) => router.push(`/organizador/estadisticas-evento?id=${e.id}` as Href)}
        />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  contenido: { padding: 20, paddingBottom: 40 },
});
