import { useCallback, useEffect, useState } from 'react';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { useSesion } from '@/features/auth';
import {
  escucharContenido, guardarContenido, type ClaveContenido, type ItemContenido,
} from '../servicios/servicioContenido';

export function useContenido(clave: ClaveContenido, porDefecto: ItemContenido[]) {
  const { perfil } = useSesion();
  const [remoto, setRemoto] = useState<ItemContenido[] | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorLectura, setErrorLectura] = useState(false);
  const esAdmin = perfil?.rol === 'administrador';
  const uid = perfil?.uid;

  useEffect(
    () =>
      escucharContenido(
        clave,
        (i) => { setRemoto(i); setErrorLectura(false); },
        (e) => { console.warn(`Error al leer ${clave}:`, e); setErrorLectura(true); }
      ),
    [clave]
  );

  const guardar = useCallback(
    async (items: ItemContenido[]): Promise<boolean> => {
      if (!uid || !esAdmin) return false;
      setGuardando(true);
      try {
        await guardarContenido(clave, items, uid);
        return true;
      } catch (e) {
        console.error('Error al guardar el contenido:', e);
        const codigo = (e as { code?: string })?.code ?? '';
        mostrarAviso({
          titulo: 'No se pudo guardar',
          mensaje: codigo === 'permission-denied'
            ? 'Las reglas de Firestore no permitieron guardar. Revisa que ya publicaste las reglas nuevas (firebase deploy --only firestore:rules).'
            : 'Revisa tu conexión e inténtalo de nuevo.',
          tipo: 'error',
        });
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [uid, esAdmin, clave]
  );

  return { items: remoto ?? porDefecto, esAdmin, guardando, guardar, errorLectura };
}
