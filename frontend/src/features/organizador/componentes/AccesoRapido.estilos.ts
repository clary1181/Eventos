import { StyleSheet } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tile: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 4,
    borderRadius: 20, backgroundColor: Colores.tonoMorado,
  },
  presionado: { opacity: 0.75 },
  texto: { fontSize: 12.5, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro, textAlign: 'center' },
});
