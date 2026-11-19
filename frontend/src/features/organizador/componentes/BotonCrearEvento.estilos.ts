import { StyleSheet } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  boton: {
    flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: Colores.primario,
    borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: Colores.fondo,
  },
  presionado: { backgroundColor: Colores.fondoSuave },
  texto: { fontSize: 14.5, fontFamily: Fuentes.negrita, color: Colores.primario },
});
