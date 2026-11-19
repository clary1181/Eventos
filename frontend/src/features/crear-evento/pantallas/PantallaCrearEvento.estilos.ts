import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  contenido: { paddingHorizontal: 20, paddingBottom: 40 },
  titulo: { fontSize: 28, fontWeight: '800', color: Colores.primarioOscuro, letterSpacing: -0.4 },
  subtitulo: { fontSize: 14, color: Colores.textoSuave, marginTop: 4 },
  aviso: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#EFE8FB', borderRadius: 16,
    padding: 12, marginTop: 16,
  },
  textoAviso: { flex: 1, fontSize: 13, color: Colores.primarioOscuro, lineHeight: 18 },
  seccion: { fontSize: 12, fontWeight: '800', color: Colores.primario, marginTop: 26, letterSpacing: 0.5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF' },
  chipActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  textoChip: { fontSize: 14, fontWeight: '600', color: Colores.texto },
  textoChipActivo: { color: '#FFFFFF' },
  fila: { flexDirection: 'row', gap: 12 },
  columna: { flex: 1 },
  etiquetaChips: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginTop: 14, marginBottom: 8 },
  boton: {
    height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center',
    marginTop: 28,
  },
  botonDeshabilitado: { opacity: 0.6 },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
