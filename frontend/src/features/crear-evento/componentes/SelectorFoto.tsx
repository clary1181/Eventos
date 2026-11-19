import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';

interface Propiedades { uri: string | null; alPulsar: () => void }

// Vista previa con las proporciones reales de la imagen (sin recortar). Las muy altas se limitan a 420 px.
export function SelectorFoto({ uri, alPulsar }: Propiedades) {
  const [proporcion, setProporcion] = useState(16 / 9);

  useEffect(() => {
    if (!uri) return;
    Image.getSize(uri, (ancho, alto) => { if (ancho > 0 && alto > 0) setProporcion(ancho / alto); }, () => setProporcion(16 / 9));
  }, [uri]);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>Foto de portada</Text>
      <Pressable onPress={alPulsar} accessibilityRole="button" accessibilityLabel="Elegir foto de portada">
        {uri ? (
          <View style={estilos.marcoFoto}>
            <Image source={{ uri }} style={[estilos.foto, { aspectRatio: proporcion }]} resizeMode="contain" />
            <View style={estilos.cambiar}>
              <Ionicons name="image-outline" size={16} color="#FFFFFF" />
              <Text style={estilos.textoCambiar}>Cambiar</Text>
            </View>
          </View>
        ) : (
          <View style={estilos.vacio}>
            <Ionicons name="image-outline" size={36} color={Colores.primario} />
            <Text style={estilos.textoVacio}>Elegir de la galería</Text>
            <Text style={estilos.ayuda}>Se mostrará completa, sin recortar</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginTop: 14 },
  etiqueta: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginBottom: 6 },
  vacio: {
    width: '100%', height: 170, borderRadius: 18, backgroundColor: '#F1EAFC', borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: Colores.acento, alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  textoVacio: { fontSize: 14, fontWeight: '700', color: Colores.primario },
  ayuda: { fontSize: 12, color: Colores.textoSuave },
  marcoFoto: { width: '100%', borderRadius: 18, overflow: 'hidden', backgroundColor: '#F1EAFC', alignItems: 'center' },
  foto: { width: '100%', maxHeight: 420 },
  cambiar: {
    position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(42,21,96,0.75)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
  },
  textoCambiar: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});