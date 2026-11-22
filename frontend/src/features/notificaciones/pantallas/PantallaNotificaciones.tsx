import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { Colores } from '@/compartido/tema';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { useAvisos } from '../hooks/useAvisos';
import type { Aviso } from '../tipos';
import { PRESENTACION, tiempoRelativo } from '../utilidades/presentacion';

function FilaAviso({ a, alPulsar }: { a: Aviso; alPulsar: () => void }) {
  const p = PRESENTACION[a.tipo] ?? PRESENTACION.evento_nuevo;
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.fila, !a.leida && estilos.sinLeer, pressed && { opacity: 0.9 }]} accessibilityRole="button">
      <View style={[estilos.icono, { backgroundColor: p.fondo }]}><Ionicons name={p.icono} size={24} color={p.color} /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[estilos.titulo, !a.leida && { fontWeight: '800' }]}>{a.titulo}</Text>
        <Text style={estilos.mensaje}>{a.mensaje}</Text>
        <Text style={estilos.tiempo}>{tiempoRelativo(a.creadaEn)}</Text>
      </View>
      {!a.leida && <View style={estilos.punto} />}
    </Pressable>
  );
}

export function PantallaNotificaciones() {
  useBarraEstado('light');
  const router = useRouter();
  const { perfil } = useSesion();
  const n = useAvisos(perfil?.uid, perfil?.rol === 'administrador');
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/' as Href));

  const abrir = (a: Aviso) => {
    if (!a.leida) n.leer(a.id);
    if (a.ruta) router.push(a.ruta as Href);
  };

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla
        titulo="Avisos"
        subtitulo={n.sinLeer > 0 ? `${n.sinLeer} sin leer` : 'Estás al día'}
        alVolver={volver}
        derecha={n.sinLeer > 0 ? (
          <Pressable style={estilos.marcar} onPress={n.leerTodos} accessibilityRole="button">
            <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
            <Text style={estilos.textoMarcar}>Leer todo</Text>
          </Pressable>
        ) : undefined}
      />
      {n.cargando ? (
        <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
      ) : n.error ? (
        <Text style={estilos.vacio}>{n.error}</Text>
      ) : n.avisos.length === 0 ? (
        <View style={estilos.centro}>
          <Ionicons name="notifications-off-outline" size={52} color={Colores.acento} />
          <Text style={estilos.vacio}>Todavía no tienes avisos.{'\n'}Aquí aparecerán las novedades de tus eventos, entradas y reportes.</Text>
        </View>
      ) : (
        <FlatList
          data={n.avisos.slice(0, 60)}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          renderItem={({ item }) => <FilaAviso a={item} alPulsar={() => abrir(item)} />}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  centro: { alignItems: 'center', padding: 40, gap: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
  marcar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 16, paddingHorizontal: 12, height: 36 },
  textoMarcar: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#ECE6F7' },
  sinLeer: { borderColor: '#CDB8F0', backgroundColor: '#F9F5FF' },
  icono: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 15, fontWeight: '700', color: Colores.texto },
  mensaje: { fontSize: 13.5, color: '#3D3852', lineHeight: 19 },
  tiempo: { fontSize: 12, color: Colores.textoSuave, marginTop: 2 },
  punto: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E53935' },
});
