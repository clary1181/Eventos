import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  izquierda: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.sm, flexShrink: 1 },
  derecha: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.md },
  nombre: { color: Colores.textoSobrePrimario, fontSize: 22, fontFamily: Fuentes.extranegrita },
});
