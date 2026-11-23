import { useRouter, type Href } from 'expo-router';
import { fechaSuspension, useSuspensionOrganizador } from '@/features/suspension-organizador';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

export function useAccionCrearEvento() {
  const router = useRouter();
  const { perfil } = usePerfilOrganizador();
  const suspension = useSuspensionOrganizador(perfil?.uid);

  return () => {
    if (suspension) {
      mostrarAviso({ titulo: 'Cuenta suspendida', mensaje: `No puedes crear eventos hasta el ${fechaSuspension(suspension.hasta)}.${suspension.motivo ? `\n\nMotivo: ${suspension.motivo}` : ''}`, tipo: 'error' });
      return;
    }
    if (perfil?.estaVerificado) {
      router.push('/organizador/crear' as Href);
      return;
    }
    mostrarAviso({
      titulo: 'Verifica tu cuenta',
      mensaje: 'Para publicar eventos primero debes verificar tu cuenta de organizador.',
      tipo: 'info',
      textoCancelar: 'Ahora no',
      textoConfirmar: 'Completar verificación',
      alConfirmar: () => router.push('/organizador/verificacion' as Href),
    });
  };
}
