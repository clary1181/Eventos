import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  escucharPerfilAsistente, guardarDatosPerfil, type PerfilAsistente,
} from '@/features/asistente/servicios/servicioPerfilAsistente';

type Datos = { nombre: string; apellidos: string; ciudad: string; biografia: string };

// Lee y guarda los datos editables de usuarios/{uid} (las reglas permiten los mismos campos a todos los roles)
export function useEditarPerfil(uid: string | undefined) {
  const [perfil, setPerfil] = useState<PerfilAsistente | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!uid) return;
    return escucharPerfilAsistente(uid, setPerfil, (e) => console.warn('Error al leer el perfil:', e));
  }, [uid]);

  const guardarDatos = useCallback(
    async (d: Datos): Promise<boolean> => {
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

  return { perfil, guardando, guardarDatos };
}
