import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { InsigniaEntrada } from '../componentes/InsigniaEntrada';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useEntrada } from '../hooks/useEntrada';
import { construirPayloadQR, estadoEntrada, ventanaQR } from '../utilidades/entradas';
import { formatearFechaHora } from '../utilidades/formato';
import { estilos } from './PantallaEntradaQR.estilos';

export function PantallaEntradaQR() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entrada, cargando } = useEntrada(id);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/entradas' as Href));

  if (cargando) {
    return <View style={estilos.centro}><Stack.Screen options={{ headerShown: false }} /><ActivityIndicator size="large" color={Colores.primario} /></View>;
  }
  if (!entrada) {
    return (
      <View style={estilos.centro}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="ticket-outline" size={52} color={Colores.acento} />
        <Text style={estilos.mensaje}>No se encontró esta entrada.</Text>
        <Text style={{ color: Colores.primario, fontWeight: '700' }} onPress={volver}>Volver</Text>
      </View>
    );
  }

  const estado = estadoEntrada(entrada);
  const ventana = ventanaQR(entrada.eventoFechaInicio);
  const aviso =
    estado === 'usada'
      ? `Esta entrada ya se usó${entrada.usadaEn ? ` el ${formatearFechaHora(entrada.usadaEn)}` : ''}.`
      : estado === 'vencida'
        ? 'Esta entrada ya venció.'
        : Date.now() < ventana.desde.getTime()
          ? `El acceso se habilita el ${formatearFechaHora(ventana.desde)}. Muestra este código en la entrada del evento.`
          : 'Muestra este código en la entrada del evento.';

  return (
    <View style={estilos.raiz}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[estilos.barra, { paddingTop: top + 8 }]}>
        <Pressable style={estilos.volver} onPress={volver} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        <Text style={estilos.tituloBarra}>Mi entrada</Text>
      </View>

      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <View style={estilos.boleto}>
          <Image source={{ uri: entrada.imagenUrl }} style={estilos.imagen} resizeMode="cover" />
          <View style={estilos.info}>
            <Text style={estilos.titulo}>{entrada.eventoTitulo}</Text>
            <View style={estilos.fila}>
              <Ionicons name="calendar-outline" size={20} color={Colores.primarioOscuro} />
              <Text style={estilos.dato}>{formatearFechaHora(entrada.eventoFechaInicio)}</Text>
            </View>
            <View style={estilos.fila}>
              <Ionicons name="location-outline" size={20} color={Colores.primarioOscuro} />
              <Text style={estilos.dato}>{entrada.lugar}</Text>
            </View>
          </View>

          <View style={estilos.corte}>
            <View style={[estilos.muesca, { marginLeft: -12 }]} />
            <View style={estilos.linea} />
            <View style={[estilos.muesca, { marginRight: -12 }]} />
          </View>

          <View style={estilos.zonaQR}>
            <InsigniaEntrada estado={estado} />
            <View style={[estilos.marcoQR, estado !== 'valida' && { opacity: 0.35 }]}>
              <QRCode value={construirPayloadQR(entrada)} size={230} color="#1F1B2E" backgroundColor="#FFFFFF" />
            </View>
            <Text style={estilos.numero}>Entrada {entrada.numero}</Text>
            <Text style={estilos.aviso}>{aviso}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
