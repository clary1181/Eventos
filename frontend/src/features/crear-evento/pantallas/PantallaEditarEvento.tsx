import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { FormularioEvento } from '../componentes/FormularioEvento';
import { useEventoParaEditar } from '../hooks/useEventoParaEditar';
import { useFormularioEvento } from '../hooks/useFormularioEvento';
import { ESTADOS_EDITABLES, type EventoEditable } from '../tipos';

function BotonVolver({ alPulsar }: { alPulsar: () => void }) {
  return (
    <Pressable onPress={alPulsar} style={estilos.volver} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8}>
      <Ionicons name="chevron-back" size={22} color={Colores.primario} />
      <Text style={estilos.textoVolver}>Volver</Text>
    </Pressable>
  );
}

function ContenidoEdicion({ evento }: { evento: EventoEditable }) {
  const router = useRouter();
  const formulario = useFormularioEvento(evento);
  const piden = evento.estado === 'requiere_correccion' && evento.observaciones !== '';

  return (
    <FormularioEvento
      formulario={formulario}
      titulo="Corregir evento"
      subtitulo="Haz los ajustes y vuelve a enviarlo a revisión."
      textoBoton="Guardar y reenviar a revisión"
      superior={<BotonVolver alPulsar={() => router.back()} />}
      avisos={
        piden ? (
          <View style={estilos.correcciones}>
            <Text style={estilos.tituloCorrecciones}>El administrador pidió correcciones</Text>
            <Text style={estilos.textoCorrecciones}>{evento.observaciones}</Text>
          </View>
        ) : undefined
      }
    />
  );
}

export function PantallaEditarEvento() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { evento, cargando, error } = useEventoParaEditar(id);
  useFocusEffect(useCallback(() => { setStatusBarStyle('dark'); }, []));

  let mensaje: string | null = error;
  if (!mensaje && evento) {
    if (!ESTADOS_EDITABLES.includes(evento.estado)) {
      mensaje = 'Este evento ya no se puede editar desde aquí (publicado, rechazado o suspendido).';
    } else if (evento.fechaFin.getTime() <= Date.now()) {
      mensaje = 'Este evento ya terminó y no se puede editar.';
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {cargando ? (
        <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
      ) : mensaje || !evento ? (
        <View style={[estilos.centro, { paddingTop: top }]}>
          <Ionicons name="alert-circle-outline" size={44} color={Colores.primario} />
          <Text style={estilos.mensaje}>{mensaje ?? 'No se pudo cargar el evento.'}</Text>
          <BotonVolver alPulsar={() => router.back()} />
        </View>
      ) : (
        <ContenidoEdicion evento={evento} />
      )}
    </>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, backgroundColor: '#FCFAFF' },
  mensaje: { fontSize: 15, color: Colores.texto, textAlign: 'center', lineHeight: 21 },
  volver: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginLeft: -6, marginBottom: 8 },
  textoVolver: { fontSize: 15, fontWeight: '700', color: Colores.primario },
  correcciones: { backgroundColor: '#FDE8D4', borderRadius: 16, padding: 14, marginTop: 16 },
  tituloCorrecciones: { fontSize: 13, fontWeight: '800', color: '#B4530A' },
  textoCorrecciones: { fontSize: 14, color: Colores.texto, marginTop: 4, lineHeight: 20 },
});
