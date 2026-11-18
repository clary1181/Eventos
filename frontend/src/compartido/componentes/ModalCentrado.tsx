import React, { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { estilos } from './ModalCentrado.estilos';

type Propiedades = {
  visible: boolean;
  alCerrar: () => void;
  children: ReactNode;
};

// Ventana emergente centrada. Se cierra al tocar fuera o con el botón "atrás" de Android.
export function ModalCentrado({ visible, alCerrar, children }: Propiedades) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={alCerrar}>
      <Pressable style={estilos.fondo} onPress={alCerrar}>
        {/* Este Pressable interno evita que tocar la tarjeta cierre el modal */}
        <Pressable style={estilos.tarjeta} onPress={() => undefined}>
          <View>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
