import { StyleSheet } from 'react-native';
import { Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  insignia: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
  },
  texto: { fontSize: 12.5, fontFamily: Fuentes.seminegrita },
});
