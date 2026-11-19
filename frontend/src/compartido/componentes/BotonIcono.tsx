import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './BotonIcono.estilos';

type Propiedades = {
  icono: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  etiqueta: string;          // texto para lectores de pantalla
  tono?: 'sobreFoto' | 'claro';
  tamano?: number;
  conPunto?: boolean;        // punto rojo (notificaciones sin leer)
};

// Botón circular con un icono: para barras superiores y acciones de tarjetas
export function BotonIcono({ icono, onPress, etiqueta, tono = 'sobreFoto', tamano = 44, conPunto = false }: Propiedades) {
  const color = tono === 'sobreFoto' ? Colores.textoSobrePrimario : Colores.texto;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      hitSlop={6}
      style={({ pressed }) => [
        estilos.base,
        tono === 'sobreFoto' ? estilos.sobreFoto : estilos.claro,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
        pressed && estilos.presionado,
      ]}
    >
      <Ionicons name={icono} size={Math.round(tamano * 0.5)} color={color} />
      {conPunto && <View style={estilos.punto} />}
    </Pressable>
  );
}
