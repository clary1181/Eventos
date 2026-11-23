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
    <Pressable
      onPress={alPulsar}
      style={({ pressed }) => [estilos.volver, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
      accessibilityRole="button"
      accessibilityLabel="Volver"
      hitSlop={10}
    >
      <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
      <Text style={estilos.textoVolver}>Volver</Text>
    </Pressable>
  );
}

function ContenidoEdicion({ evento }: { evento: EventoEditable }) {
  const router = useRouter();
  const formulario = useFormularioEvento(evento);
  const piden = evento.estado === 'requiere_correccion' && evento.observaciones !== '';
  const moderado = evento.estado === 'suspendido' || evento.estado === 'rechazado';
  const etiquetaMotivo = evento.estado === 'suspendido' ? 'Tu evento fue suspendido' : 'Tu evento fue rechazado';

  return (
    <FormularioEvento
      formulario={formulario}
      titulo="Corregir evento"
      subtitulo="Haz los ajustes y vuelve a enviarlo a revisión."
      textoBoton="Guardar y reenviar a revisión"
      superior={<BotonVolver alPulsar={() => router.back()} />}
      avisos={
        piden || moderado ? (
          <View style={estilos.correcciones}>
            <Text style={estilos.tituloCorrecciones}>{piden ? 'El administrador pidió correcciones' : etiquetaMotivo}</Text>
            <Text style={estilos.textoCorrecciones}>
              {piden ? evento.observaciones : evento.motivoRechazo || 'El administrador no indicó un motivo.'}
            </Text>
            {moderado && (
              <Text style={[estilos.textoCorrecciones, { marginTop: 8 }]}>
                Corrígelo y envíalo a revisión: el administrador decidirá si vuelve a publicarse.
                {evento.vendidas > 0 ? ' Como ya vendió entradas, no se pueden cambiar la fecha, el lugar, la dirección, el precio ni la foto.' : ''}
              </Text>
            )}
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
      mensaje = 'Este evento ya no se puede editar desde aquí. Por favor, contacta al administrador si necesitas hacer cambios.';
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
  volver: {
  flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 6, marginBottom: 12,
  height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colores.primario,
  elevation: 3, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  textoVolver: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  correcciones: { backgroundColor: '#FDE8D4', borderRadius: 16, padding: 14, marginTop: 16 },
  tituloCorrecciones: { fontSize: 13, fontWeight: '800', color: '#B4530A' },
  textoCorrecciones: { fontSize: 14, color: Colores.texto, marginTop: 4, lineHeight: 20 },
});