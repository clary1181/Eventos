import * as ImagePicker from 'expo-image-picker';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

type OpcionesFoto = { frontal?: boolean; cuadrada?: boolean };

export async function tomarFoto({ frontal = false, cuadrada = false }: OpcionesFoto = {}): Promise<string | null> {
  try {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      mostrarAviso({ titulo: 'Permiso necesario', mensaje: 'Permite el acceso a la cámara en los ajustes del teléfono.', tipo: 'info' });
      return null;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: cuadrada ? [1, 1] : undefined,
      quality: 0.7,
      cameraType: frontal ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
    });
    return resultado.canceled ? null : resultado.assets[0]?.uri ?? null;
  } catch {
    mostrarAviso({ titulo: 'Cámara no disponible', mensaje: 'No se pudo abrir la cámara. Revisa los permisos y vuelve a intentarlo.', tipo: 'error' });
    return null;
  }
}

export async function elegirDeGaleria(): Promise<string | null> {
  try {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      mostrarAviso({ titulo: 'Permiso necesario', mensaje: 'Permite el acceso a tus fotos en los ajustes del teléfono.', tipo: 'info' });
      return null;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    return resultado.canceled ? null : resultado.assets[0]?.uri ?? null;
  } catch {
    mostrarAviso({ titulo: 'Galería no disponible', mensaje: 'No se pudo abrir la galería. Revisa los permisos y vuelve a intentarlo.', tipo: 'error' });
    return null;
  }
}

export const elegirFotoConOrigen = (titulo: string) =>
  new Promise<string | null>((resolver) => {
    mostrarAviso({
      titulo,
      mensaje: '¿De dónde quieres tomar la imagen?',
      tipo: 'info',
      textoAceptar: 'Cámara',
      alAceptar: () => { void tomarFoto().then(resolver); },
      textoAccion: 'Galería',
      alAccion: () => { void elegirDeGaleria().then(resolver); },
      textoCancelar: 'Cancelar',
      alCancelar: () => resolver(null),
    });
  });
