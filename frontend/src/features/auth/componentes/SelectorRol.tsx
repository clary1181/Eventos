import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { RolRegistrable } from '../tipos';
import { estilos } from './SelectorRol.estilos';

const OPCIONES: { rol: RolRegistrable; titulo: string }[] = [
  { rol: 'asistente', titulo: 'Asistente' },
  { rol: 'organizador', titulo: 'Organizador' },
];

type Propiedades = { valor: RolRegistrable; alCambiar: (rol: RolRegistrable) => void };

export function SelectorRol({ valor, alCambiar }: Propiedades) {
  return (
    <View style={{ width: '100%' }}>
      <Text style={estilos.etiqueta}>Quiero usar la app como:</Text>
      <View style={estilos.fila}>
        {OPCIONES.map(({ rol, titulo }) => {
          const activo = valor === rol;
          return (
            <Pressable
              key={rol}
              style={[estilos.opcion, activo && estilos.opcionActiva]}
              onPress={() => alCambiar(rol)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
            >
              <Text style={[estilos.texto, activo && estilos.textoActivo]}>{titulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
