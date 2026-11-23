import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { CampoPago } from './CampoPago';
import { Estrellas } from './Estrellas';

interface Propiedades {
  visible: boolean;
  eventoTitulo: string;
  enviando: boolean;
  alCerrar: () => void;
  alEnviar: (estrellas: number, comentario: string) => Promise<boolean>;
}

const TEXTO = ['Toca una estrella', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

export function ModalCalificar({ visible, eventoTitulo, enviando, alCerrar, alEnviar }: Propiedades) {
  const inset = useSafeAreaInsets();
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (visible) { setEstrellas(0); setComentario(''); setError(''); } }, [visible]);

  const enviar = async () => {
    if (estrellas < 1) { setError('Elige de 1 a 5 estrellas.'); return; }
    if (await alEnviar(estrellas, comentario)) alCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => !enviando && alCerrar()}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={{ flex: 1 }} onPress={() => !enviando && alCerrar()} />
        <View style={[estilos.hoja, { paddingBottom: Math.max(20, inset.bottom + 12), maxHeight: '88%' }]}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Calificar evento</Text>
            <Pressable onPress={alCerrar} disabled={enviando} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={estilos.evento} numberOfLines={2}>{eventoTitulo}</Text>
            <View style={{ alignItems: 'center', marginTop: 16, gap: 6 }}>
              <Estrellas valor={estrellas} tamano={44} alCambiar={(n) => { setEstrellas(n); setError(''); }} />
              <Text style={estilos.texto}>{TEXTO[estrellas]}</Text>
              {!!error && <Text style={estilos.error}>{error}</Text>}
            </View>
            <CampoPago
              etiqueta="Comentario (opcional)" value={comentario} onChangeText={setComentario} maxLength={500} multiline
              placeholder="Cuéntanos cómo estuvo" style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
            />
            <Pressable style={[estilos.boton, enviando && { opacity: 0.7 }]} onPress={enviar} disabled={enviando} accessibilityRole="button">
              {enviando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Publicar calificación</Text>}
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
  evento: { fontSize: 16, fontWeight: '700', color: '#1F1B2E', textAlign: 'center' },
  texto: { fontSize: 14, fontWeight: '600', color: Colores.textoSuave },
  error: { fontSize: 13, color: Colores.error },
  boton: { height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
