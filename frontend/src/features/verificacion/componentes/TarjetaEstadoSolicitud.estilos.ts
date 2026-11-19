import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: { alignItems: 'center', gap: Espaciado.sm, padding: Espaciado.xl, borderRadius: 22 },
  circulo: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Colores.fondo, marginBottom: Espaciado.sm },
  titulo: { fontSize: 20, fontFamily: Fuentes.extranegrita, textAlign: 'center' },
  texto: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.texto, textAlign: 'center', lineHeight: 21 },
  motivo: { fontFamily: Fuentes.seminegrita },
  fecha: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: Espaciado.xs },
});
