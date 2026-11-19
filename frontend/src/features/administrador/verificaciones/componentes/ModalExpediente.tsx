import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Colores } from '@/compartido/tema';
import { ETIQUETA_ESTADO, PESTANAS_BANDEJA, type PerfilResumido, type SolicitudAdmin } from '../tipos';
import { formatearFecha } from './TarjetaSolicitud';

interface Propiedades {
  solicitud: SolicitudAdmin | null;
  perfil?: PerfilResumido;
  procesando: boolean;
  alCerrar: () => void;
  alResolver: (estado: 'aprobada' | 'correccion_requerida' | 'rechazada', observaciones: string) => void;
}

const Dato = ({ etiqueta, valor }: { etiqueta: string; valor: string }) => (
  <View style={{ marginTop: 10 }}>
    <Text style={estilos.etiqueta}>{etiqueta}</Text>
    <Text style={estilos.valor}>{valor || '—'}</Text>
  </View>
);

// Expediente completo de una solicitud con las acciones permitidas por las reglas:
// pendiente → aceptar / devolver / rechazar; devuelta → solo rechazar; el resto, solo lectura
export function ModalExpediente({ solicitud: s, perfil, procesando, alCerrar, alResolver }: Propiedades) {
  const [observaciones, setObservaciones] = useState('');
  useEffect(() => setObservaciones(s?.observaciones ?? ''), [s?.id, s?.observaciones]);

  const color = PESTANAS_BANDEJA.find((p) => p.estado === s?.estado)?.color ?? Colores.primario;

  const confirmarAceptar = () =>
    Alert.alert('Aceptar organizador', 'Podrá crear y publicar eventos.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: () => alResolver('aprobada', '') },
    ]);

  const abrir = (url: string) => Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir la imagen.'));

  return (
    <Modal visible={s !== null} animationType="slide" transparent onRequestClose={alCerrar}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={estilos.hoja}>
          {s && (
            <>
              <View style={estilos.cabecera}>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.titulo} numberOfLines={1}>{perfil?.nombreCompleto ?? 'Organizador'}</Text>
                  {!!perfil?.nombreUsuario && <Text style={estilos.subtitulo}>@{perfil.nombreUsuario}{perfil.ciudad ? ` · ${perfil.ciudad}` : ''}</Text>}
                </View>
                <View style={[estilos.insignia, { backgroundColor: color }]}>
                  <Text style={estilos.textoInsignia}>{ETIQUETA_ESTADO[s.estado]}</Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Dato etiqueta="Teléfono" valor={s.telefono} />
                <Dato etiqueta="Redes y sitio web" valor={s.redes.join('\n')} />
                <Dato etiqueta="Descripción de la actividad" valor={s.descripcionActividad} />
                {!!s.rfc && <Dato etiqueta="RFC" valor={s.rfc} />}
                <Dato etiqueta="Enviada" valor={formatearFecha(s.creadaEn)} />
                {s.reenvios > 0 && <Dato etiqueta="Reenvíos" valor={String(s.reenvios)} />}

                <Text style={estilos.seccion}>DOCUMENTOS (toca para ampliar)</Text>
                {s.documentos.length === 0 && <Text style={estilos.valor}>Sin documentos.</Text>}
                {s.documentos.map((d) => (
                  <Pressable key={d.clave} onPress={() => abrir(d.url)} style={{ marginTop: 8 }}>
                    <Text style={estilos.etiqueta}>{d.etiqueta}</Text>
                    <Image source={{ uri: d.url }} style={estilos.imagen} resizeMode="cover" />
                  </Pressable>
                ))}

                {(s.estado === 'pendiente' || s.estado === 'correccion_requerida') && (
                  <>
                    <Text style={estilos.seccion}>OBSERVACIONES / MOTIVO</Text>
                    <TextInput
                      style={estilos.entrada}
                      multiline
                      maxLength={500}
                      value={observaciones}
                      onChangeText={setObservaciones}
                      placeholder="Obligatorio para devolver o rechazar. El organizador lo verá en su pantalla de verificación."
                      placeholderTextColor={Colores.textoSuave}
                    />
                  </>
                )}
                {s.estado !== 'pendiente' && s.estado !== 'correccion_requerida' && !!s.observaciones && (
                  <Dato etiqueta="Observaciones" valor={s.observaciones} />
                )}
                {s.estado === 'correccion_requerida' && (
                  <Text style={estilos.nota}>Está esperando que el organizador corrija; solo puedes rechazarla.</Text>
                )}
              </ScrollView>

              <View style={estilos.acciones}>
                <Pressable style={[estilos.boton, { backgroundColor: '#EFE8FB' }]} onPress={alCerrar} disabled={procesando}>
                  <Text style={[estilos.textoBoton, { color: Colores.primario }]}>Cerrar</Text>
                </Pressable>
                {s.estado === 'pendiente' && (
                  <Pressable style={[estilos.boton, { backgroundColor: '#E8871A' }]} onPress={() => alResolver('correccion_requerida', observaciones)} disabled={procesando}>
                    <Text style={estilos.textoBoton}>Devolver</Text>
                  </Pressable>
                )}
                {(s.estado === 'pendiente' || s.estado === 'correccion_requerida') && (
                  <Pressable style={[estilos.boton, { backgroundColor: '#C62828' }]} onPress={() => alResolver('rechazada', observaciones)} disabled={procesando}>
                    <Text style={estilos.textoBoton}>Rechazar</Text>
                  </Pressable>
                )}
                {s.estado === 'pendiente' && (
                  <Pressable style={[estilos.boton, { backgroundColor: '#1B7F3B' }]} onPress={confirmarAceptar} disabled={procesando}>
                    {procesando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Aceptar</Text>}
                  </Pressable>
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
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '90%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.texto },
  subtitulo: { fontSize: 13, color: Colores.textoSuave, marginTop: 2 },
  insignia: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  textoInsignia: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  seccion: { fontSize: 12, fontWeight: '800', color: Colores.primario, marginTop: 20 },
  etiqueta: { fontSize: 12, fontWeight: '700', color: Colores.textoSuave },
  valor: { fontSize: 15, color: Colores.texto, marginTop: 2, lineHeight: 21 },
  imagen: { width: '100%', height: 200, borderRadius: 14, marginTop: 4, backgroundColor: '#EFE8FB' },
  entrada: {
    minHeight: 84, borderWidth: 1, borderColor: Colores.borde, borderRadius: 14, padding: 12, marginTop: 8,
    fontSize: 14, color: Colores.texto, textAlignVertical: 'top',
  },
  nota: { fontSize: 12, color: Colores.textoSuave, marginTop: 10 },
  acciones: { flexDirection: 'row', gap: 8, marginTop: 16 },
  boton: { flex: 1, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
