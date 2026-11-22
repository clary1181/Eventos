import { Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { fechaSuspension, useSuspensionOrganizador } from '@/features/suspension-organizador';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';

// Acción de "Crear evento": solo los organizadores verificados pueden publicar (decisión D1)
export function useAccionCrearEvento() {
  const router = useRouter();
  const { perfil } = usePerfilOrganizador();
  const suspension = useSuspensionOrganizador(perfil?.uid);

  return () => {
    if (suspension) {
      Alert.alert('Cuenta suspendida', `No puedes crear eventos hasta el ${fechaSuspension(suspension.hasta)}.${suspension.motivo ? `\n\nMotivo: ${suspension.motivo}` : ''}`);
      return;
    }
    if (perfil?.estaVerificado) {
      router.push('/organizador/crear' as Href);
      return;
    }
    Alert.alert('Verifica tu cuenta', 'Para publicar eventos primero debes verificar tu cuenta de organizador.', [
      { text: 'Ahora no', style: 'cancel' },
      { text: 'Completar verificación', onPress: () => router.push('/organizador/verificacion' as Href) },
    ]);
  };
}
