import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import type { Periodo } from '@/features/estadisticas';

const OPCIONES: { id: Periodo; titulo: string; corto: string }[] = [
  { id: 'todo', titulo: 'Acumulado (todo el tiempo)', corto: 'Acumulado' },
  { id: '30d', titulo: 'Últimos 30 días', corto: '30 días' },
  { id: '7d', titulo: 'Últimos 7 días', corto: '7 días' },
];

// Botón "Acumulado ⌄" que abre un menú para elegir el periodo
export function SelectorPeriodoAdmin({ periodo, alCambiar }: { periodo: Periodo; alCambiar: (p: Periodo) => void }) {
  const [abierto, setAbierto] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const actual = OPCIONES.find((o) => o.id === periodo) ?? OPCIONES[0];

  return (
    <>
      <Pressable style={estilos.boton} onPress={() => setAbierto(true)} accessibilityRole="button" accessibilityLabel="Cambiar periodo">
        <Text style={estilos.texto}>{actual.corto}</Text>
        <Ionicons name="chevron-down" size={16} color={Colores.texto} />
      </Pressable>

      <Modal visible={abierto} transparent animationType="fade" onRequestClose={() => setAbierto(false)} statusBarTranslucent>
        <Pressable style={estilos.fondo} onPress={() => setAbierto(false)}>
          <Pressable style={[estilos.hoja, { paddingBottom: bottom + 16 }]} onPress={() => {}}>
            <View style={estilos.asa} />
            <Text style={estilos.titulo}>Periodo</Text>
            {OPCIONES.map((o) => {
              const activa = o.id === periodo;
              return (
                <Pressable key={o.id} style={[estilos.opcion, activa && { backgroundColor: '#F1EBFB' }]} onPress={() => { alCambiar(o.id); setAbierto(false); }} accessibilityRole="button">
                  <Text style={[estilos.textoOpcion, activa && { color: Colores.primario }]}>{o.titulo}</Text>
                  {activa && <Ionicons name="checkmark" size={22} color={Colores.primario} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  boton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  texto: { fontSize: 13, color: Colores.texto },
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 16, paddingTop: 10, gap: 4 },
  asa: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E1DAF0', marginBottom: 10 },
  titulo: { fontSize: 17, fontWeight: '800', color: Colores.primarioOscuro, marginBottom: 6, paddingHorizontal: 4 },
  opcion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14 },
  textoOpcion: { fontSize: 16, color: Colores.texto, fontWeight: '600' },
});
