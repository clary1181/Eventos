import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', alignItems: 'center', gap: Espaciado.md, padding: 14, borderRadius: 20,
    backgroundColor: Colores.fondoSuave, borderWidth: 1, borderColor: '#EEE9F6',
  },
  elevada: { shadowColor: Colores.sombra, shadowOpacity: 0.14, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  aprobada: { backgroundColor: Colores.tonoVerde, borderColor: '#CFE9D4' },
  textos: { flex: 1 },
  titulo: { fontSize: 15.5, fontFamily: Fuentes.negrita, color: Colores.texto },
  detalle: { fontSize: 13, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: 2 },
  boton: {
    flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 1.5, borderColor: Colores.primario,
    borderRadius: 999, paddingVertical: 8, paddingLeft: 12, paddingRight: 8, backgroundColor: Colores.fondo,
  },
  textoBoton: { fontSize: 12.5, fontFamily: Fuentes.negrita, color: Colores.primario },
});
