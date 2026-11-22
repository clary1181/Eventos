import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import { LONGITUD_MINIMA, useCambiarContrasenia } from '../hooks/useCambiarContrasenia';

interface Propiedades { visible: boolean; alCerrar: () => void }

export function ModalCambiarContrasenia({ visible, alCerrar }: Propiedades) {
  const { guardando, error, cambiar, limpiarError } = useCambiarContrasenia();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [ver, setVer] = useState(false);

  // Los campos no se conservan entre aperturas
  useEffect(() => {
    if (visible) { setActual(''); setNueva(''); setConfirmacion(''); setVer(false); limpiarError(); }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const guardar = async () => {
    if (await cambiar(actual, nueva, confirmacion)) {
      alCerrar();
      Alert.alert('Contraseña actualizada', 'Ya puedes usar tu nueva contraseña.');
    }
  };

  const campo = (etiqueta: string, valor: string, poner: (t: string) => void) => (
    <View style={{ gap: 6 }}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={estilos.campo}
        value={valor}
        onChangeText={(t) => { poner(t); limpiarError(); }}
        secureTextEntry={!ver}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!guardando}
        maxLength={64}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => !guardando && alCerrar()}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={{ flex: 1 }} onPress={() => !guardando && alCerrar()} />
        <View style={estilos.hoja}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Cambiar contraseña</Text>
            <Pressable onPress={alCerrar} disabled={guardando} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: Espaciado.md }}>
            {campo('Contraseña actual', actual, setActual)}
            {campo('Nueva contraseña', nueva, setNueva)}
            {campo('Confirmar nueva contraseña', confirmacion, setConfirmacion)}
            <Pressable onPress={() => setVer((v) => !v)} style={estilos.ver} accessibilityRole="button">
              <Ionicons name={ver ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colores.primario} />
              <Text style={estilos.textoVer}>{ver ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}</Text>
            </Pressable>
            <Text style={estilos.ayuda}>Mínimo {LONGITUD_MINIMA} caracteres.</Text>
            {!!error && <Text style={estilos.error}>{error}</Text>}
            <Pressable style={[estilos.boton, guardando && { opacity: 0.7 }]} onPress={guardar} disabled={guardando} accessibilityRole="button">
              {guardando ? <ActivityIndicator color={Colores.textoSobrePrimario} /> : <Text style={estilos.textoBoton}>Actualizar contraseña</Text>}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: Colores.fondo, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28, maxHeight: '92%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Espaciado.md },
  titulo: { fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  etiqueta: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
  campo: { height: 50, borderRadius: Radios.campo, borderWidth: 1, borderColor: Colores.borde, paddingHorizontal: Espaciado.lg, fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.texto },
  ver: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  textoVer: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.primario },
  ayuda: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.regular, color: Colores.textoSuave },
  error: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.error },
  boton: { height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center', marginTop: Espaciado.sm },
  textoBoton: { color: Colores.textoSobrePrimario, fontSize: 16, fontFamily: Fuentes.extranegrita },
});
