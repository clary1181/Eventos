import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
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
        mostrarAviso({ titulo: 'No se pudo guardar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.', tipo: 'error' });
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [uid]
  );

  const cambiarFoto = useCallback(async () => {
    if (!uid) return;
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
  }, [uid]);

  return { perfil, guardando, eventosAsistidos, entradasVigentes, guardarDatos, cambiarFoto };
}
