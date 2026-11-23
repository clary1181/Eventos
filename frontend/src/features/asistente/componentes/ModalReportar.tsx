import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { MOTIVOS_REPORTE, type MotivoReporte } from '../servicios/servicioReportes';
import { CampoPago } from './CampoPago';

interface Propiedades {
  visible: boolean;
  eventoTitulo: string;
  enviando: boolean;
  alCerrar: () => void;
  alEnviar: (motivo: MotivoReporte, descripcion: string) => Promise<boolean>;
}

export function ModalReportar({ visible, eventoTitulo, enviando, alCerrar, alEnviar }: Propiedades) {
  const inset = useSafeAreaInsets();
  const [motivo, setMotivo] = useState<MotivoReporte | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState<{ motivo?: string; descripcion?: string }>({});

  useEffect(() => { if (visible) { setMotivo(null); setDescripcion(''); setErrores({}); } }, [visible]);

  const enviar = async () => {
    const e: typeof errores = {};
    if (!motivo) e.motivo = 'Selecciona un motivo.';
    if (descripcion.trim().length < 5) e.descripcion = 'Describe el problema (mínimo 5 caracteres).';
    setErrores(e);
    if (Object.keys(e).length > 0 || !motivo) return;
    if (await alEnviar(motivo, descripcion)) alCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => !enviando && alCerrar()}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={{ flex: 1 }} onPress={() => !enviando && alCerrar()} />
        <View style={[estilos.hoja, { paddingBottom: Math.max(20, inset.bottom + 12), maxHeight: '88%' }]}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Reportar evento</Text>
            <Pressable onPress={alCerrar} disabled={enviando} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={estilos.evento} numberOfLines={2}>{eventoTitulo}</Text>
            <Text style={estilos.etiqueta}>Motivo</Text>
            <View style={estilos.motivos}>
              {MOTIVOS_REPORTE.map((m) => {
                const activo = motivo === m.id;
                return (
                  <Pressable key={m.id} style={[estilos.chip, activo && estilos.chipActivo]} onPress={() => { setMotivo(m.id); setErrores((x) => ({ ...x, motivo: undefined })); }} accessibilityRole="button">
                    <Text style={[estilos.textoChip, activo && { color: '#FFFFFF' }]}>{m.titulo}</Text>
                  </Pressable>
                );
              })}
            </View>
            {!!errores.motivo && <Text style={estilos.error}>{errores.motivo}</Text>}
            <CampoPago
              etiqueta="Descripción" value={descripcion} onChangeText={(t) => { setDescripcion(t); setErrores((x) => ({ ...x, descripcion: undefined })); }}
              maxLength={1000} multiline placeholder="Cuéntanos qué está mal en este evento" error={errores.descripcion}
              style={{ height: 110, textAlignVertical: 'top', paddingTop: 12 }}
            />
            <Pressable style={[estilos.boton, enviando && { opacity: 0.7 }]} onPress={enviar} disabled={enviando} accessibilityRole="button">
              {enviando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Enviar reporte</Text>}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28, maxHeight: '92%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro },
  evento: { fontSize: 15, fontWeight: '700', color: '#1F1B2E' },
  etiqueta: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginTop: 14, marginBottom: 8 },
  motivos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, height: 40, borderRadius: 20, backgroundColor: '#F1EAFC', alignItems: 'center', justifyContent: 'center' },
  chipActivo: { backgroundColor: Colores.primario },
  textoChip: { fontSize: 14, fontWeight: '600', color: Colores.primarioOscuro },
  error: { fontSize: 12, color: Colores.error, marginTop: 6 },
  boton: { height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
