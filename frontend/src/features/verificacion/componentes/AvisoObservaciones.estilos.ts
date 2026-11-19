import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  caja: { backgroundColor: Colores.advertenciaFondo, borderRadius: 16, padding: Espaciado.lg, gap: 4, marginBottom: Espaciado.lg },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { fontSize: 14.5, fontFamily: Fuentes.negrita, color: Colores.advertencia },
  texto: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 20 },
});
