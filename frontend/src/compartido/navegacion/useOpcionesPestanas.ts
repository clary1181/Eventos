import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores, Fuentes } from '@/compartido/tema';

export function useOpcionesPestanas() {
  const { bottom } = useSafeAreaInsets();
  return {
    headerShown: false,
    tabBarActiveTintColor: Colores.primario,
    tabBarInactiveTintColor: Colores.textoSuave,
    tabBarLabelStyle: { fontSize: 12, fontFamily: Fuentes.seminegrita },
    tabBarStyle: {
      height: 64 + bottom,
      paddingBottom: bottom + 6,
      paddingTop: 8,
      backgroundColor: Colores.fondo,
      borderTopWidth: 0,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      elevation: 16,
      shadowColor: Colores.sombra,
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -4 },
    },
  };
}
