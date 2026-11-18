import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './CampoTexto.estilos';

type Propiedades = {
  icono: keyof typeof Ionicons.glyphMap;
  valor: string;
  onPress: () => void;
};

// Campo que se ve como CampoTexto pero abre una lista (ciudad, etc.)
export function CampoSelector({ icono, valor, onPress }: Propiedades) {
  return (
    <View style={estilos.envoltorio}>
      <Pressable style={estilos.campo} onPress={onPress} accessibilityRole="button">
        <Ionicons name={icono} size={22} color={Colores.primarioOscuro} style={estilos.icono} />
        <Text style={[estilos.entrada, { paddingVertical: 0 }]}>{valor}</Text>
        <Ionicons name="chevron-down" size={20} color={Colores.textoSuave} />
      </Pressable>
    </View>
  );
}
