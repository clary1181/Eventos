import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './FilaTerminos.estilos';

type Propiedades = { aceptado: boolean; alCambiar: () => void; error?: string };

export function FilaTerminos({ aceptado, alCambiar, error }: Propiedades) {
  return (
    <View>
      <Pressable style={estilos.fila} onPress={alCambiar} accessibilityRole="checkbox" accessibilityState={{ checked: aceptado }}>
        <Ionicons name={aceptado ? 'checkbox' : 'square-outline'} size={26} color={error ? Colores.error : Colores.primario} />
        <Text style={estilos.texto}>
          Declaro que mis datos son verdaderos y acepto los términos para organizadores. Entiendo que cualquier falsedad puede suspender mi cuenta.
        </Text>
      </Pressable>
      {!!error && <Text style={estilos.error}>{error}</Text>}
    </View>
  );
}
