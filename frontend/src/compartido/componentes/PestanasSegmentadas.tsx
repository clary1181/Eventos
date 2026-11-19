import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './PestanasSegmentadas.estilos';

type Opcion = {
  id: string;
  titulo: string;
  icono: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

type Propiedades = { opciones: Opcion[]; activa: string; alCambiar: (id: string) => void };

// Selector de secciones dentro de una pantalla (Mis eventos / Estadísticas / Reportes)
export function PestanasSegmentadas({ opciones, activa, alCambiar }: Propiedades) {
  return (
    <View style={estilos.fila}>
      {opciones.map((opcion) => {
        const seleccionada = opcion.id === activa;
        return (
          <Pressable
            key={opcion.id}
            style={[estilos.pestana, seleccionada && estilos.activa]}
            onPress={() => alCambiar(opcion.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: seleccionada }}
          >
            <MaterialCommunityIcons
              name={opcion.icono}
              size={20}
              color={seleccionada ? Colores.textoSobrePrimario : Colores.primarioOscuro}
            />
            <Text style={[estilos.texto, seleccionada && estilos.textoActivo]} numberOfLines={1}>
              {opcion.titulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
