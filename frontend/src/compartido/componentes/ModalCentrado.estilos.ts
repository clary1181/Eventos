import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Radios } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: Colores.fondoModal,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Espaciado.xl,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colores.fondo,
    borderRadius: Radios.tarjeta,
    padding: Espaciado.xl,
  },
});
