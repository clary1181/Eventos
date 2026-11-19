import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'flex-start', gap: Espaciado.md, marginVertical: Espaciado.md },
  texto: { flex: 1, fontSize: 13, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 19 },
  error: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.error, marginLeft: 4, marginBottom: Espaciado.sm },
});
