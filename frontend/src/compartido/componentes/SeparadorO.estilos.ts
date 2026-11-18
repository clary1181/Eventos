import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: Espaciado.lg },
  linea: { flex: 1, height: 1, backgroundColor: Colores.borde },
  texto: { marginHorizontal: Espaciado.lg, color: Colores.textoSuave, fontSize: Tipografia.cuerpo },
});
