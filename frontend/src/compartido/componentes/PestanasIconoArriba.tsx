import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores, Fuentes } from '@/compartido/tema';

type Opcion = { id: string; titulo: string; icono: React.ComponentProps<typeof MaterialCommunityIcons>['name'] };
interface Propiedades { opciones: Opcion[]; activa: string; alCambiar: (id: string) => void }

export function PestanasIconoArriba({ opciones, activa, alCambiar }: Propiedades) {
  return (
    <View style={estilos.fila}>
      {opciones.map((o) => {
        const activo = o.id === activa;
        return (
          <Pressable key={o.id} style={[estilos.pestana, activo && estilos.activa]} onPress={() => alCambiar(o.id)} accessibilityRole="tab" accessibilityState={{ selected: activo }}>
            <MaterialCommunityIcons name={o.icono} size={22} color={activo ? '#FFFFFF' : Colores.primarioOscuro} />
            <Text style={[estilos.texto, activo && { color: '#FFFFFF' }]} numberOfLines={1} adjustsFontSizeToFit>{o.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 8 },
  pestana: { flex: 1, height: 62, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: '#F1EBFB', paddingHorizontal: 4 },
  activa: { backgroundColor: Colores.primario },
  texto: { fontSize: 12.5, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
});
