import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './BotonCrearPestana.estilos';

// Botón central y elevado de la barra de pestañas
export function BotonCrearPestana({ alPresionar }: { alPresionar: () => void }) {
  return (
    <View style={estilos.contenedor}>
      <Pressable style={({ pressed }) => [estilos.circulo, pressed && estilos.presionado]} onPress={alPresionar} accessibilityRole="button" accessibilityLabel="Crear evento">
        <Ionicons name="add" size={34} color={Colores.textoSobrePrimario} />
      </Pressable>
      <Text style={estilos.etiqueta}>Crear</Text>
    </View>
  );
}
