import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { guardarFotoPerfil, subirFotoACloudinary } from '@/features/asistente/servicios/servicioPerfilAsistente';

export function useCambiarFoto(uid: string | undefined) {
  const [guardando, setGuardando] = useState(false);

  const cambiar = useCallback(async () => {
    if (!uid || guardando) return;
    let base64: string | null = null;
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7, base64: true });
      base64 = r.canceled ? null : r.assets[0]?.base64 ?? null;
    } catch {
      mostrarAviso({ titulo: 'No se pudo abrir la galería', mensaje: 'Revisa los permisos de fotos e inténtalo de nuevo.', tipo: 'error' });
      return;
    }
    if (!base64) return;
    setGuardando(true);
    try {
      const url = await subirFotoACloudinary(base64, 'image/jpeg');
      await guardarFotoPerfil(uid, url);
    } catch (e) {
      console.error('Error al cambiar la foto:', e);
      mostrarAviso({ titulo: 'No se pudo cambiar la foto', mensaje: 'Inténtalo de nuevo con otra imagen.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  }, [uid, guardando]);

  return { guardando, cambiar };
}
