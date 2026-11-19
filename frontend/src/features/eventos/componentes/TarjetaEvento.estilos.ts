import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', alignItems: 'center', gap: Espaciado.md, padding: 10,
    backgroundColor: Colores.fondo, borderRadius: 20, borderWidth: 1, borderColor: '#EEE9F6',
    shadowColor: Colores.sombra, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  presionada: { opacity: 0.85 },
  imagen: { width: 92, height: 92, borderRadius: 14, backgroundColor: Colores.primarioClaro, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imagenCompacta: { width: 80, height: 80 },
  cuerpo: { flex: 1, gap: 4 },
  titulo: { fontSize: 15.5, fontFamily: Fuentes.negrita, color: Colores.texto },
  linea: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  textoLinea: { flex: 1, fontSize: 13, fontFamily: Fuentes.regular, color: Colores.texto },
  acciones: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});
