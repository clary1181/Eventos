import React from 'react';
import { Pressable, Text } from 'react-native';
import { BotonPrimario, CampoTexto, ModalCentrado } from '@/compartido/componentes';
import { estilos } from './ModalRecuperarContrasenia.estilos';

type Propiedades = {
  visible: boolean;
  correo: string;
  establecerCorreo: (texto: string) => void;
  error: string;
  enviando: boolean;
  cerrar: () => void;
  enviar: () => void;
};

export function ModalRecuperarContrasenia({ visible, correo, establecerCorreo, error, enviando, cerrar, enviar }: Propiedades) {
  return (
    <ModalCentrado visible={visible} alCerrar={cerrar}>
      <Text style={estilos.titulo}>Recuperar contraseña</Text>
      <Text style={estilos.texto}>Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.</Text>
      <CampoTexto
        icono="mail-outline"
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={establecerCorreo}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <BotonPrimario titulo="Enviar enlace" onPress={enviar} cargando={enviando} />
      <Pressable style={estilos.cancelar} onPress={cerrar}>
        <Text style={estilos.textoCancelar}>Cancelar</Text>
      </Pressable>
    </ModalCentrado>
  );
}
