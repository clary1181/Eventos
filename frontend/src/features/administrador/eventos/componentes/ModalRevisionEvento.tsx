import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Colores } from '@/compartido/tema';
import { formatearFecha } from '../../verificaciones/componentes/TarjetaSolicitud';
import { ETIQUETA_ESTADO_EVENTO, PESTANAS_EVENTOS, type EventoAdmin } from '../tipos';

interface Propiedades {
  evento: EventoAdmin | null;
  procesando: boolean;
  alCerrar: () => void;
  alDictaminar: (estado: 'aprobado' | 'requiere_correccion' | 'rechazado', texto: string) => void;
}

const Dato = ({ etiqueta, valor }: { etiqueta: string; valor: string }) => (
  <View style={{ marginTop: 10 }}>
    <Text style={estilos.etiqueta}>{etiqueta}</Text>
    <Text style={estilos.valor}>{valor || '—'}</Text>
  </View>
);

export function ModalRevisionEvento({ evento: e, procesando, alCerrar, alDictaminar }: Propiedades) {
  const [texto, setTexto] = useState('');
  useEffect(() => setTexto(''), [e?.id]);

  const color = PESTANAS_EVENTOS.find((p) => p.estado === e?.estado)?.color ?? Colores.primario;
  const confirmarAprobar = () =>
    Alert.alert('Aprobar evento', 'Será visible para todos los asistentes.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aprobar', onPress: () => alDictaminar('aprobado', '') },
    ]);

  return (
    <Modal visible={e !== null} animationType="slide" transparent onRequestClose={alCerrar}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={estilos.hoja}>
          {e && (
            <>
              <View style={estilos.cabecera}>
                <Text style={estilos.titulo} numberOfLines={2}>{e.titulo}</Text>
                <View style={[estilos.insignia, { backgroundColor: color }]}><Text style={estilos.textoInsignia}>{ETIQUETA_ESTADO_EVENTO[e.estado]}</Text></View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} resizeMode="cover" />
                <Dato etiqueta="Organizador" valor={e.organizadorNombre} />
                <Dato etiqueta="Categoría" valor={e.categoria} />
                <Dato etiqueta="Descripción" valor={e.descripcion} />
                <Dato etiqueta="Inicio" valor={formatearFecha(e.fechaInicio)} />
                <Dato etiqueta="Fin" valor={formatearFecha(e.fechaFin)} />
                <Dato etiqueta="Lugar" valor={e.lugar} />
                <Dato etiqueta="Dirección" valor={e.direccion} />
                <Dato etiqueta="Precio" valor={e.precio > 0 ? `$${e.precio.toLocaleString('es-MX')} MXN` : 'Gratis'} />
                <Dato etiqueta="Capacidad" valor={`${e.capacidad} (vendidas: ${e.vendidas})`} />
                <Dato etiqueta="Creado" valor={formatearFecha(e.creadoEn)} />
                {!!e.observaciones && e.estado === 'requiere_correccion' && <Dato etiqueta="Correcciones pedidas" valor={e.observaciones} />}
                {!!e.motivoRechazo && e.estado === 'rechazado' && <Dato etiqueta="Motivo del rechazo" valor={e.motivoRechazo} />}

                {e.estado === 'pendiente_aprobacion' && (
                  <>
                    <Text style={estilos.seccion}>CORRECCIONES / MOTIVO</Text>
                    <TextInput
                      style={estilos.entrada} multiline maxLength={500} value={texto} onChangeText={setTexto}
                      placeholder="Obligatorio para pedir correcciones o rechazar."
                      placeholderTextColor={Colores.textoSuave}
                    />
                  </>
                )}
              </ScrollView>

              <View style={estilos.acciones}>
                <Pressable style={[estilos.boton, { backgroundColor: '#EFE8FB' }]} onPress={alCerrar} disabled={procesando}>
                  <Text style={[estilos.textoBoton, { color: Colores.primario }]}>Cerrar</Text>
                </Pressable>
                {e.estado === 'pendiente_aprobacion' && (
                  <>
                    <Pressable style={[estilos.boton, { backgroundColor: '#E8871A' }]} onPress={() => alDictaminar('requiere_correccion', texto)} disabled={procesando}>
                      <Text style={estilos.textoBoton}>Correcciones</Text>
                    </Pressable>
                    <Pressable style={[estilos.boton, { backgroundColor: '#C62828' }]} onPress={() => alDictaminar('rechazado', texto)} disabled={procesando}>
                      <Text style={estilos.textoBoton}>Rechazar</Text>
                    </Pressable>
                    <Pressable style={[estilos.boton, { backgroundColor: '#1B7F3B' }]} onPress={confirmarAprobar} disabled={procesando}>
                      {procesando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Aprobar</Text>}
                    </Pressable>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '92%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  titulo: { flex: 1, fontSize: 20, fontWeight: '800', color: Colores.texto },
  insignia: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  textoInsignia: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  imagen: { width: '100%', aspectRatio: 16 / 9, borderRadius: 14, backgroundColor: '#EFE8FB' },
  seccion: { fontSize: 12, fontWeight: '800', color: Colores.primario, marginTop: 20 },
  etiqueta: { fontSize: 12, fontWeight: '700', color: Colores.textoSuave },
  valor: { fontSize: 15, color: Colores.texto, marginTop: 2, lineHeight: 21 },
  entrada: { minHeight: 84, borderWidth: 1, borderColor: Colores.borde, borderRadius: 14, padding: 12, marginTop: 8, fontSize: 14, color: Colores.texto, textAlignVertical: 'top' },
  acciones: { flexDirection: 'row', gap: 8, marginTop: 16 },
  boton: { flex: 1, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});
