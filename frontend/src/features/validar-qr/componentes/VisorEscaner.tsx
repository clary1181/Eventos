import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEscaner } from '../hooks/useEscaner';
import type { EventoValidable } from '../tipos';
import { ResultadoEscaneo } from './ResultadoEscaneo';

interface Propiedades { evento: EventoValidable; uid: string; alCambiarEvento: () => void }

export function VisorEscaner({ evento, uid, alCambiarEvento }: Propiedades) {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const topMarco = Math.round(height / 2 - 125 - 30);
  const esc = useEscaner(evento.id, uid);
  const bloqueado = esc.procesando || !!esc.resultado;

  return (
    <View style={estilos.raiz}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={bloqueado ? undefined : ({ data }) => esc.alEscanear(data)}
      />

      <View style={[estilos.barra, { paddingTop: top + 8 }]}>
        <Pressable style={estilos.cambiar} onPress={alCambiarEvento} accessibilityRole="button" accessibilityLabel="Cambiar evento">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo} numberOfLines={1}>{evento.titulo}</Text>
          <Text style={estilos.subtitulo}>Accesos en esta sesión: {esc.aceptadas}</Text>
        </View>
      </View>

      <View style={[estilos.centro, { top: topMarco }]} pointerEvents="none">
        <View style={estilos.marco}>
          <View style={[estilos.esquina, { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 22 }]} />
          <View style={[estilos.esquina, { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 22 }]} />
          <View style={[estilos.esquina, { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 22 }]} />
          <View style={[estilos.esquina, { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 22 }]} />
        </View>
        <Text style={estilos.ayuda}>{esc.procesando ? 'Validando…' : 'Apunta al código QR de la entrada'}</Text>
        {esc.procesando && <ActivityIndicator color="#FFFFFF" style={{ marginTop: 8 }} />}
      </View>

      {esc.resultado && <ResultadoEscaneo resultado={esc.resultado} alSiguiente={esc.siguiente} />}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#000000' },
  barra: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, backgroundColor: 'rgba(30,10,60,0.72)' },
  cambiar: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  subtitulo: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  centro: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  marco: { width: 250, height: 250 },
  esquina: { position: 'absolute', width: 54, height: 54, borderColor: '#FFFFFF' },
  ayuda: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginTop: 22, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 },
});