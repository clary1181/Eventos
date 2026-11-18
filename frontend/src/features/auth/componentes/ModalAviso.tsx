import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonContorno, BotonPrimario, ModalCentrado } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { estilos } from './ModalAviso.estilos';

export type TipoAviso = 'error' | 'info' | 'exito';

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tipo?: TipoAviso;
  textoBoton?: string;
  alCerrar: () => void;
  // Acción opcional, por ejemplo "Reenviar correo"
  textoAccion?: string;
  alAccion?: () => void;
  cargandoAccion?: boolean;
}

const ICONOS: Record<TipoAviso, { nombre: 'close-circle' | 'information-circle' | 'checkmark-circle'; color: string }> = {
  error: { nombre: 'close-circle', color: Colores.error },
  info: { nombre: 'information-circle', color: Colores.primario },
  exito: { nombre: 'checkmark-circle', color: Colores.exito },
};

// Minimodal de aviso, con el mismo estilo que el de "Cuenta creada"
export function ModalAviso({
  visible,
  titulo,
  mensaje,
  tipo = 'error',
  textoBoton = 'Entendido',
  alCerrar,
  textoAccion,
  alAccion,
  cargandoAccion = false,
}: Props) {
  const icono = ICONOS[tipo];
  return (
    <ModalCentrado visible={visible} alCerrar={alCerrar}>
      <Ionicons name={icono.nombre} size={64} color={icono.color} style={estilos.icono} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>{mensaje}</Text>
      <BotonPrimario titulo={textoBoton} onPress={alCerrar} />
      {textoAccion && alAccion && (
        <BotonContorno titulo={cargandoAccion ? 'Enviando...' : textoAccion} onPress={cargandoAccion ? () => undefined : alAccion} />
      )}
    </ModalCentrado>
  );
}