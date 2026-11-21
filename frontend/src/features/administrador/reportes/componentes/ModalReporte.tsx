import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { TITULO_MOTIVO, type AccionReporte, type ContextoReporte, type ReporteAdmin } from '../tipos';
import { formatearFechaCorta } from './TarjetaReporte';

interface Propiedades {
  reporte: ReporteAdmin | null;
  contexto: ContextoReporte | null;
  procesando: boolean;
  alCerrar: () => void;
  alResolver: (accion: AccionReporte, nota: string) => void;
}

const Dato = ({ etiqueta, valor }: { etiqueta: string; valor: string }) => (
  <View style={estilos.dato}>
    <Text style={estilos.etiqueta}>{etiqueta}</Text>
    <Text style={estilos.valor}>{valor}</Text>
  </View>
);

export function ModalReporte({ reporte: r, contexto, procesando, alCerrar, alResolver }: Propiedades) {
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setNota(''); setError(''); }, [r?.id]);
  if (!r) return null;

  const pendiente = r.estado === 'pendiente_moderacion';
  const puedeSuspender = contexto?.estadoEvento === 'aprobado';

  const accionar = (accion: AccionReporte) => {
    if (accion !== 'desestimar' && nota.trim().length < 1) { setError('Escribe una nota para el registro (máx. 500 caracteres).'); return; }
    alResolver(accion, nota);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={alCerrar}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={{ flex: 1 }} onPress={alCerrar} />
        <View style={estilos.hoja}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Reporte</Text>
            <Pressable onPress={alCerrar} hitSlop={10} accessibilityLabel="Cerrar"><Ionicons name="close" size={28} color={Colores.primarioOscuro} /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Dato etiqueta="Evento" valor={r.eventoTitulo} />
            <Dato etiqueta="Estado del evento" valor={contexto ? contexto.estadoEvento : 'Cargando…'} />
            <Dato etiqueta="Organizador" valor={contexto ? contexto.organizador : 'Cargando…'} />
            <Dato etiqueta="Reportado por" valor={contexto ? contexto.reportante : 'Cargando…'} />
            <Dato etiqueta="Motivo" valor={TITULO_MOTIVO[r.motivo] ?? r.motivo} />
            <Dato etiqueta="Fecha" valor={formatearFechaCorta(r.creadoEn)} />
            <Dato etiqueta="Descripción" valor={r.descripcion} />

            {pendiente ? (
              <>
                <Text style={estilos.etiquetaNota}>Nota de resolución</Text>
                <TextInput
                  style={[estilos.entrada, !!error && { borderColor: Colores.error }]} value={nota} onChangeText={(t) => { setNota(t); setError(''); }}
                  multiline maxLength={500} placeholder="Qué se decidió y por qué" placeholderTextColor={Colores.textoSuave}
                />
                {!!error && <Text style={estilos.error}>{error}</Text>}

                {procesando ? (
                  <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 18 }} />
                ) : (
                  <View style={{ gap: 10, marginTop: 16 }}>
                    <Pressable style={[estilos.boton, { backgroundColor: Colores.primario }]} onPress={() => accionar('resolver')}>
                      <Text style={estilos.textoBoton}>Resolver (sin suspender)</Text>
                    </Pressable>
                    {puedeSuspender && (
                      <Pressable style={[estilos.boton, { backgroundColor: '#B3261E' }]} onPress={() => accionar('suspender')}>
                        <Text style={estilos.textoBoton}>Suspender evento y resolver</Text>
                      </Pressable>
                    )}
                    <Pressable style={[estilos.boton, estilos.contorno]} onPress={() => accionar('desestimar')}>
                      <Text style={[estilos.textoBoton, { color: Colores.primario }]}>Desestimar (no hay infracción)</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : (
              <Dato etiqueta={r.estado === 'resuelto' ? 'Resolución' : 'Motivo del cierre'} valor={r.resolucion || '—'} />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28, maxHeight: '92%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro },
  dato: { marginTop: 10 },
  etiqueta: { fontSize: 12, fontWeight: '700', color: Colores.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5 },
  valor: { fontSize: 15, color: Colores.texto, marginTop: 2, lineHeight: 21 },
  etiquetaNota: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginTop: 18, marginBottom: 6 },
  entrada: { minHeight: 80, borderWidth: 1, borderColor: Colores.borde, borderRadius: 14, padding: 12, fontSize: 15, color: Colores.texto, textAlignVertical: 'top' },
  error: { fontSize: 12, color: Colores.error, marginTop: 4 },
  boton: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  contorno: { borderWidth: 1.5, borderColor: Colores.primario, backgroundColor: '#FFFFFF' },
  textoBoton: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
