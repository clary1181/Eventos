import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  sobreFoto: { backgroundColor: 'rgba(255,255,255,0.18)' },
  claro: { backgroundColor: '#EFEBF6' },
  presionado: { opacity: 0.7 },
  punto: {
    position: 'absolute', top: 8, right: 9, width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FF4D4F', borderWidth: 1.5, borderColor: Colores.primarioOscuro,
  },
});
