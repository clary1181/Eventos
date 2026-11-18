import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  icono: { alignSelf: 'center', marginBottom: Espaciado.md },
  titulo: { fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center', marginBottom: Espaciado.lg },
  texto: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', lineHeight: 22, marginBottom: Espaciado.lg },
});