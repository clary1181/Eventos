import { useCallback, useRef, useState } from 'react';
import { cambiarContrasenia } from '@/features/auth/servicios/servicioAuth';

const MENSAJES: Record<string, string> = {
  'auth/wrong-password': 'La contraseña actual no es correcta.',
  'auth/invalid-credential': 'La contraseña actual no es correcta.',
  'auth/weak-password': 'La nueva contraseña es demasiado débil.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/requires-recent-login': 'Por seguridad, cierra sesión, vuelve a entrar e inténtalo otra vez.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
};

export const LONGITUD_MINIMA = 8;

export function useCambiarContrasenia() {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const guardandoRef = useRef(false);

  const cambiar = useCallback(async (actual: string, nueva: string, confirmacion: string): Promise<boolean> => {
    if (guardandoRef.current) return false;
    setError(null);
    let problema: string | null = null;
    if (!actual) problema = 'Escribe tu contraseña actual.';
    else if (nueva.length < LONGITUD_MINIMA) problema = `La nueva contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres.`;
    else if (nueva === actual) problema = 'La nueva contraseña debe ser distinta a la actual.';
    else if (nueva !== confirmacion) problema = 'Las contraseñas no coinciden.';
    if (problema) {
      setError(problema);
      return false;
    }

    guardandoRef.current = true;
    setGuardando(true);
    try {
      await cambiarContrasenia(actual, nueva);
      return true;
    } catch (e) {
      const codigo = (e as { code?: string })?.code ?? '';
      setError(MENSAJES[codigo] ?? 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
      return false;
    } finally {
      setGuardando(false);
      guardandoRef.current = false;
    }
  }, []);

  const limpiarError = useCallback(() => setError(null), []);
  return { guardando, error, cambiar, limpiarError };
}
