import { StyleSheet } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: { flex: 1, borderRadius: 20, padding: 14 },
  vertical: { gap: 2 },
  horizontal: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  textos: { flexShrink: 1 },
  valor: { fontSize: 24, fontFamily: Fuentes.extranegrita, color: Colores.texto },
  valorHorizontal: { fontSize: 20 },
  etiqueta: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 17 },
});
