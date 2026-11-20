import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { escucharMisEntradas } from '../servicios/servicioMisEntradas';
import {
  escucharPerfilAsistente, guardarDatosPerfil, guardarFotoPerfil, subirFotoACloudinary, type PerfilAsistente,
} from '../servicios/servicioPerfilAsistente';
import { estadoEntrada, type EntradaAsistente } from '../utilidades/entradas';

export function usePerfilAsistente(uid: string | undefined) {
  const [perfil, setPerfil] = useState<PerfilAsistente | null>(null);
  const [entradas, setEntradas] = useState<EntradaAsistente[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const a = escucharPerfilAsistente(uid, setPerfil, (e) => console.warn('Error al leer el perfil:', e));
    const b = escucharMisEntradas(uid, setEntradas, (e) => console.warn('Error al leer entradas:', e));
    return () => { a(); b(); };
  }, [uid]);

  // Eventos distintos a los que ya entró (entrada escaneada) y entradas todavía válidas
  const { eventosAsistidos, entradasVigentes } = useMemo(() => {
    const ahora = Date.now();
    return {
      eventosAsistidos: new Set(entradas.filter((e) => e.usada).map((e) => e.eventoId)).size,
      entradasVigentes: entradas.filter((e) => estadoEntrada(e, ahora) === 'valida').length,
    };
  }, [entradas]);

  const guardarDatos = useCallback(
    async (d: { nombre: string; apellidos: string; ciudad: string; biografia: string }): Promise<boolean> => {
      if (!uid) return false;
      setGuardando(true);
      try {
        await guardarDatosPerfil(uid, d);
        return true;
      } catch (e) {
        console.error('Error al guardar el perfil:', e);
        Alert.alert('No se pudo guardar', 'Revisa tu conexión e inténtalo de nuevo.');
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [uid]
  );

  const cambiarFoto = useCallback(async () => {
    if (!uid) return;
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
  }, [uid]);

  return { perfil, guardando, eventosAsistidos, entradasVigentes, guardarDatos, cambiarFoto };
}
