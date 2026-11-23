import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';
import { formatearFechaCorta } from '@/features/eventos';
import { TITULO_MOTIVO, type ReporteOrganizador } from '../tipos';

interface Propiedades {
  lista: ReporteOrganizador[];
  cargando: boolean;
  error: string | null;
  responder: (id: string, texto: string) => Promise<boolean>;
}

export function ListaReportesOrganizador({ lista, cargando, error, responder }: Propiedades) {
  const inset = useSafeAreaInsets();
  const [activo, setActivo] = useState<ReporteOrganizador | null>(null);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cargando) return <View style={estilos.centro}><ActivityIndicator color={Colores.primario} /></View>;
  if (error) return <View style={estilos.centro}><Text style={estilos.error}>{error}</Text></View>;
  if (lista.length === 0) {
    return (
      <View style={estilos.centro}>
        <Ionicons name="shield-checkmark-outline" size={44} color={Colores.exitoTexto} />
        <Text style={estilos.titulo}>Sin reportes</Text>
        <Text style={estilos.vacio}>Cuando un administrador revise un reporte fundado sobre alguno de tus eventos aparecerá aquí y podrás responder.</Text>
      </View>
    );
  }

  const abrir = (r: ReporteOrganizador) => { setTexto(''); setActivo(r); };
  const enviar = async () => {
    if (!activo) return;
    setEnviando(true);
    const ok = await responder(activo.id, texto);
    setEnviando(false);
    if (ok) setActivo(null);
  };

  return (
    <View style={{ gap: 12 }}>
      {lista.map((r) => (
        <View key={r.id} style={estilos.tarjeta}>
          <View style={estilos.fila}>
            <Text style={estilos.evento} numberOfLines={2}>{r.eventoTitulo || 'Evento'}</Text>
            <View style={[estilos.insignia, { backgroundColor: r.respuesta ? Colores.exitoFondo : Colores.advertenciaFondo }]}>
              <Text style={[estilos.textoInsignia, { color: r.respuesta ? Colores.exitoTexto : Colores.advertencia }]}>{r.respuesta ? 'Respondido' : 'Por responder'}</Text>
            </View>
          </View>
          <Text style={estilos.motivo}>{TITULO_MOTIVO[r.motivo] ?? r.motivo}</Text>
          <Text style={estilos.cuerpo}>{r.descripcion}</Text>
          {!!r.resolucion && (
            <View style={estilos.bloque}>
              <Text style={estilos.etiqueta}>Resolución del administrador</Text>
              <Text style={estilos.cuerpo}>{r.resolucion}</Text>
            </View>
          )}
          {!!r.respuesta && (
            <View style={[estilos.bloque, { backgroundColor: Colores.tonoMorado }]}>
              <Text style={estilos.etiqueta}>Tu respuesta</Text>
              <Text style={estilos.cuerpo}>{r.respuesta}</Text>
            </View>
          )}
          <View style={estilos.fila}>
            <Text style={estilos.fecha}>{r.creadoEn ? formatearFechaCorta(r.creadoEn) : ''}</Text>
            {!r.respuesta && (
              <Pressable style={estilos.boton} onPress={() => abrir(r)} accessibilityRole="button">
                <Ionicons name="chatbubble-ellipses-outline" size={17} color="#FFFFFF" />
                <Text style={estilos.textoBoton}>Responder</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}

      <Modal visible={!!activo} transparent animationType="fade" onRequestClose={() => setActivo(null)}>
        <KeyboardAvoidingView style={estilos.fondoModal} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[estilos.modal, { paddingBottom: Math.max(20, inset.bottom + 12), maxHeight: '88%' }]}>
            <Text style={estilos.tituloModal}>Responder reporte</Text>
            <Text style={estilos.vacio}>{activo?.eventoTitulo}. Solo puedes responder una vez y el administrador podrá verlo.</Text>
            <TextInput
              style={estilos.entrada} multiline maxLength={1000} value={texto} onChangeText={setTexto}
              placeholder="Explica lo ocurrido o lo que corregiste" placeholderTextColor={Colores.textoSuave} textAlignVertical="top"
            />
            <View style={estilos.fila}>
              <Pressable style={[estilos.boton, { backgroundColor: '#F1EBFB' }]} onPress={() => setActivo(null)} disabled={enviando}>
                <Text style={[estilos.textoBoton, { color: Colores.primarioOscuro }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={estilos.boton} onPress={enviar} disabled={enviando}>
                {enviando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Enviar respuesta</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', padding: 30, gap: 8 },
  titulo: { fontSize: 18, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  vacio: { fontSize: 14, color: Colores.textoSuave, textAlign: 'center', lineHeight: 20 },
  error: { fontSize: 14, color: Colores.error },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, gap: 8, borderWidth: 1, borderColor: '#ECE6F7' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  evento: { flex: 1, fontSize: 16, fontFamily: Fuentes.negrita, color: Colores.texto },
  insignia: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  textoInsignia: { fontSize: 12, fontFamily: Fuentes.seminegrita },
  motivo: { fontSize: 14, fontFamily: Fuentes.seminegrita, color: Colores.primario },
  cuerpo: { fontSize: 14, color: '#3D3852', lineHeight: 20 },
  bloque: { backgroundColor: '#F6F2FD', borderRadius: 12, padding: 10, gap: 2 },
  etiqueta: { fontSize: 12, fontFamily: Fuentes.seminegrita, color: Colores.textoSuave },
  fecha: { fontSize: 12.5, color: Colores.textoSuave },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colores.primario, borderRadius: 14, height: 42, paddingHorizontal: 16 },
  textoBoton: { color: '#FFFFFF', fontSize: 14, fontFamily: Fuentes.seminegrita },
  fondoModal: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, gap: 12 },
  tituloModal: { fontSize: 19, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  entrada: { minHeight: 110, borderWidth: 1, borderColor: Colores.borde, borderRadius: 14, padding: 12, fontSize: 15, color: Colores.texto },
});
