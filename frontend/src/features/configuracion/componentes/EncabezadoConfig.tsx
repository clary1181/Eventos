import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export function EncabezadoConfig({ titulo }: { titulo: string }) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  return (
    <View style={[estilos.barra, { paddingTop: top + Espaciado.sm }]}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/' as Href))}
        hitSlop={10}
        accessibilityLabel="Volver"
      >
        <Ionicons name="arrow-back" size={26} color={Colores.primarioOscuro} />
      </Pressable>
      <Text style={estilos.titulo}>{titulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.md, paddingHorizontal: Espaciado.xl, paddingBottom: Espaciado.md, backgroundColor: Colores.fondo },
  titulo: { fontSize: Tipografia.titulo - 6, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
});
