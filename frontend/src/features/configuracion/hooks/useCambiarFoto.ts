import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { guardarFotoPerfil, subirFotoACloudinary } from '@/features/asistente/servicios/servicioPerfilAsistente';

// Elige una foto de la galería, la sube a Cloudinary y guarda la URL en usuarios/{uid}.fotoUrl
// (las reglas permiten ese campo al dueño de cualquier rol)
export function useCambiarFoto(uid: string | undefined) {
  const [guardando, setGuardando] = useState(false);

  const cambiar = useCallback(async () => {
    if (!uid || guardando) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7, base64: true });
    const foto = r.canceled ? null : r.assets[0];
    if (!foto?.base64) return;
    setGuardando(true);
    try {
      const url = await subirFotoACloudinary(foto.base64, foto.mimeType ?? 'image/jpeg');
      await guardarFotoPerfil(uid, url);
    } catch (e) {
      console.error('Error al cambiar la foto:', e);
      Alert.alert('No se pudo cambiar la foto', 'Inténtalo de nuevo con otra imagen.');
    } finally {
      setGuardando(false);
    }
  }, [uid, guardando]);

  return { guardando, cambiar };
}
