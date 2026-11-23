import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { estilos } from './ModalCentrado.estilos';

type Propiedades = {
  visible: boolean;
  alCerrar: () => void;
  children: ReactNode;
};

export function ModalCentrado({ visible, alCerrar, children }: Propiedades) {
  const inset = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={alCerrar}>
      <KeyboardAvoidingView
        style={[estilos.fondo, { paddingTop: inset.top + 12, paddingBottom: inset.bottom + 12 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={estilos.fondoPresion} onPress={alCerrar} />
        <View style={[estilos.tarjeta, { maxHeight: '88%' }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.contenido}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
