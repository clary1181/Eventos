import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  lista: { gap: Espaciado.md },
  centro: { alignItems: 'center', paddingVertical: Espaciado.xl, gap: Espaciado.sm },
  vacio: { alignItems: 'center', padding: Espaciado.xl, gap: Espaciado.sm, backgroundColor: Colores.fondoSuave, borderRadius: 20 },
  titulo: { fontSize: 16, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro, textAlign: 'center' },
  texto: { fontSize: 13.5, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', lineHeight: 20 },
  error: { color: Colores.error, fontSize: 13.5, fontFamily: Fuentes.regular, textAlign: 'center' },
});
