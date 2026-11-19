import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './CampoDocumento.estilos';

type Propiedades = {
  titulo: string;
  ayuda: string;
  icono: React.ComponentProps<typeof Ionicons>['name'];
  uri: string | null;
  alPresionar: () => void;
  error?: string;
};

// Tarjeta para adjuntar una foto: muestra la vista previa y cambia el texto del botón al elegirla
export function CampoDocumento({ titulo, ayuda, icono, uri, alPresionar, error }: Propiedades) {
  return (
    <View>
      <View style={[estilos.tarjeta, !!error && estilos.conError]}>
        <View style={estilos.fila}>
          <View style={estilos.icono}>
            <Ionicons name={icono} size={24} color={Colores.primario} />
          </View>
          <View style={estilos.textos}>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Text style={estilos.ayuda}>{ayuda}</Text>
          </View>
          <Pressable style={estilos.boton} onPress={alPresionar} accessibilityRole="button" accessibilityLabel={`${uri ? 'Cambiar' : 'Agregar'} ${titulo}`}>
            <Text style={estilos.textoBoton}>{uri ? 'Cambiar' : 'Agregar'}</Text>
          </Pressable>
        </View>
        {!!uri && <Image source={{ uri }} style={estilos.vistaPrevia} resizeMode="cover" />}
      </View>
      {!!error && <Text style={estilos.error}>{error}</Text>}
    </View>
  );
}
