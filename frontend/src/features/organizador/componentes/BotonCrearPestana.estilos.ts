import { StyleSheet } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center' },
  circulo: {
    width: 62, height: 62, borderRadius: 31, marginTop: -20, backgroundColor: Colores.primario,
    alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: Colores.fondo,
    shadowColor: Colores.sombra, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  presionado: { opacity: 0.85 },
  etiqueta: { marginTop: 2, fontSize: 12, fontFamily: Fuentes.seminegrita, color: Colores.textoSuave },
});
