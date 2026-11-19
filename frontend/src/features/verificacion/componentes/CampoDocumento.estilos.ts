import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: { borderWidth: 1.5, borderColor: Colores.borde, borderRadius: 18, padding: Espaciado.md, gap: Espaciado.md, marginBottom: Espaciado.md },
  conError: { borderColor: Colores.error },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.md },
  icono: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colores.tonoMorado, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1 },
  titulo: { fontSize: 15, fontFamily: Fuentes.negrita, color: Colores.texto },
  ayuda: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: 2, lineHeight: 17 },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1.5, borderColor: Colores.primario, paddingVertical: 8, paddingHorizontal: 14 },
  textoBoton: { fontSize: 13, fontFamily: Fuentes.seminegrita, color: Colores.primario },
  vistaPrevia: { width: '100%', height: 150, borderRadius: 12, backgroundColor: Colores.fondoSuave },
  error: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.error, marginLeft: 4 },
});
