import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { paddingHorizontal: Espaciado.lg, paddingBottom: Espaciado.xxl, gap: Espaciado.lg },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { fontSize: 26, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
});
