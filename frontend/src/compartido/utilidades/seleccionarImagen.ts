import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type OpcionesFoto = { frontal?: boolean; cuadrada?: boolean };

// Abre la cámara. Devuelve la ruta local de la foto o null si se canceló / no hay permiso.
export async function tomarFoto({ frontal = false, cuadrada = false }: OpcionesFoto = {}): Promise<string | null> {
  const permiso = await ImagePicker.requestCameraPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert('Permiso necesario', 'Permite el acceso a la cámara en los ajustes del teléfono.');
    return null;
  }
  const resultado = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: cuadrada ? [1, 1] : undefined,
    quality: 0.7,
    cameraType: frontal ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
  });
  return resultado.canceled ? null : resultado.assets[0]?.uri ?? null;
}

// Abre la galería. Devuelve la ruta local de la imagen o null.
export async function elegirDeGaleria(): Promise<string | null> {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert('Permiso necesario', 'Permite el acceso a tus fotos en los ajustes del teléfono.');
    return null;
  }
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });
  return resultado.canceled ? null : resultado.assets[0]?.uri ?? null;
}

// Pregunta si se toma la foto en ese momento o se elige de la galería
export const elegirFotoConOrigen = (titulo: string) =>
  new Promise<string | null>((resolver) => {
    Alert.alert(
      titulo,
      '¿De dónde quieres tomar la imagen?',
      [
        { text: 'Cámara', onPress: () => tomarFoto().then(resolver) },
        { text: 'Galería', onPress: () => elegirDeGaleria().then(resolver) },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolver(null) },
      ],
      { cancelable: true, onDismiss: () => resolver(null) },
    );
  });
