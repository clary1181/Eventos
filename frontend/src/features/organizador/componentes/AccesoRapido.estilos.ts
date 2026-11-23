import { StyleSheet } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: Colores.fondoSuave,
    borderWidth: 1,
    borderColor: Colores.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  presionada: { opacity: 0.8 },
  titulo: {
    fontSize: 11.5,
    lineHeight: 14,
    fontFamily: Fuentes.seminegrita,
    color: Colores.primarioOscuro,
    textAlign: 'center',
  },
});