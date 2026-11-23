import { useCallback, useEffect, useState } from 'react';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import {
  escucharPerfilAsistente, guardarDatosPerfil, type PerfilAsistente,
} from '@/features/asistente/servicios/servicioPerfilAsistente';

type Datos = { nombre: string; apellidos: string; ciudad: string; biografia: string };

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
        mostrarAviso({ titulo: 'No se pudo guardar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.', tipo: 'error' });
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [uid]
  );

  return { perfil, guardando, guardarDatos };
}
