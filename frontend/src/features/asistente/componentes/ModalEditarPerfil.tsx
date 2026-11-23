import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { PerfilAsistente } from '../servicios/servicioPerfilAsistente';
import { CampoPago } from './CampoPago';

interface Propiedades {
  visible: boolean;
  perfil: PerfilAsistente;
  guardando: boolean;
  alCerrar: () => void;
  alGuardar: (d: { nombre: string; apellidos: string; ciudad: string; biografia: string }) => Promise<boolean>;
}

export function ModalEditarPerfil({ visible, perfil, guardando, alCerrar, alGuardar }: Propiedades) {
  const inset = useSafeAreaInsets();
  const [d, setD] = useState({ nombre: '', apellidos: '', ciudad: '', biografia: '' });
  const [errores, setErrores] = useState<Partial<Record<keyof typeof d, string>>>({});

  useEffect(() => {
    if (visible) { setD({ nombre: perfil.nombre, apellidos: perfil.apellidos, ciudad: perfil.ciudad, biografia: perfil.biografia }); setErrores({}); }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const poner = (campo: keyof typeof d, valor: string) => { setD((x) => ({ ...x, [campo]: valor })); setErrores((e) => ({ ...e, [campo]: undefined })); };

  const guardar = async () => {
    const e: typeof errores = {};
    if (d.nombre.trim().length < 1 || d.nombre.trim().length > 50) e.nombre = 'Escribe tu nombre (máx. 50 letras).';
    if (d.apellidos.trim().length < 1 || d.apellidos.trim().length > 80) e.apellidos = 'Escribe tus apellidos (máx. 80 letras).';
    if (d.ciudad.trim().length < 1 || d.ciudad.trim().length > 60) e.ciudad = 'Escribe tu ciudad (máx. 60 letras).';
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    if (await alGuardar(d)) alCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!guardando) alCerrar(); }}>
      <KeyboardAvoidingView
        style={estilos.fondo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Pressable style={{ flex: 1 }} onPress={() => !guardando && alCerrar()} />
        <View style={[estilos.hoja, { maxHeight: '88%', paddingBottom: Math.max(16, inset.bottom) }]}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>Editar perfil</Text>
            <Pressable onPress={alCerrar} disabled={guardando} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
            </Pressable>
          </View>
          <ScrollView
            style={estilos.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.contenido}
          >
            <CampoPago etiqueta="Nombre" value={d.nombre} onChangeText={(t) => poner('nombre', t)} maxLength={50} error={errores.nombre} />
            <CampoPago etiqueta="Apellidos" value={d.apellidos} onChangeText={(t) => poner('apellidos', t)} maxLength={80} error={errores.apellidos} />
            <CampoPago etiqueta="Ciudad" value={d.ciudad} onChangeText={(t) => poner('ciudad', t)} maxLength={60} error={errores.ciudad} />
            <CampoPago
              etiqueta="Biografía" value={d.biografia} onChangeText={(t) => poner('biografia', t)} maxLength={160} multiline
              placeholder="Cuéntanos qué eventos te gustan" style={{ height: 90, textAlignVertical: 'top', paddingTop: 12 }}
            />
          </ScrollView>
          <Pressable style={[estilos.boton, guardando && { opacity: 0.7 }]} onPress={guardar} disabled={guardando} accessibilityRole="button">
            {guardando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Guardar cambios</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '92%' },
  scroll: { flexShrink: 1 },
  contenido: { paddingBottom: 12 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro },
  boton: { height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
