import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores, Fuentes } from '@/compartido/tema';

export interface AccionEvento {
  icono: React.ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  detalle?: string;
  peligro?: boolean;
  deshabilitada?: boolean;
  alPulsar: () => void;
}

interface Propiedades { visible: boolean; titulo: string; acciones: AccionEvento[]; alCerrar: () => void }

// Menú inferior con las acciones de un evento (el botón de los tres puntos)
export function HojaAccionesEvento({ visible, titulo, acciones, alCerrar }: Propiedades) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={alCerrar} statusBarTranslucent>
      <Pressable style={estilos.fondo} onPress={alCerrar}>
        <Pressable style={[estilos.hoja, { paddingBottom: bottom + 16 }]} onPress={() => {}}>
          <View style={estilos.asa} />
          <Text style={estilos.titulo} numberOfLines={2}>{titulo}</Text>
          {acciones.map((a) => {
            const color = a.peligro ? Colores.error : Colores.primarioOscuro;
            return (
              <Pressable key={a.titulo} style={({ pressed }) => [estilos.accion, pressed && { backgroundColor: '#F6F2FD' }, a.deshabilitada && { opacity: 0.55 }]} onPress={a.alPulsar} accessibilityRole="button">
                <View style={[estilos.icono, { backgroundColor: a.peligro ? Colores.errorFondo : Colores.tonoMorado }]}>
                  <Ionicons name={a.icono} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[estilos.textoAccion, { color: a.peligro ? Colores.error : Colores.texto }]}>{a.titulo}</Text>
                  {!!a.detalle && <Text style={estilos.detalle}>{a.detalle}</Text>}
                </View>
              </Pressable>
            );
          })}
          <Pressable style={estilos.cancelar} onPress={alCerrar} accessibilityRole="button"><Text style={estilos.textoCancelar}>Cancelar</Text></Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 16, paddingTop: 10, gap: 4 },
  asa: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E1DAF0', marginBottom: 10 },
  titulo: { fontSize: 17, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro, marginBottom: 8, paddingHorizontal: 4 },
  accion: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 6, borderRadius: 14 },
  icono: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  textoAccion: { fontSize: 16, fontFamily: Fuentes.seminegrita },
  detalle: { fontSize: 12.5, color: Colores.textoSuave, marginTop: 1 },
  cancelar: { alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 14, backgroundColor: '#F1EBFB', marginTop: 8 },
  textoCancelar: { fontSize: 16, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
});
