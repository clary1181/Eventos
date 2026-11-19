import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: Espaciado.sm },
  pestana: {
    flex: 1, height: 50, borderRadius: 14, flexDirection: 'row', gap: 6,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1EBFB',
  },
  activa: { backgroundColor: Colores.primario },
  texto: { fontSize: 14, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
  textoActivo: { color: Colores.textoSobrePrimario },
});
