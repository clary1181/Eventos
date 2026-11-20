import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#4B1D8F' },
  barra: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  volver: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  tituloBarra: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  contenido: { padding: 20, paddingBottom: 40 },
  boleto: { backgroundColor: '#FFFFFF', borderRadius: 26, overflow: 'hidden' },
  imagen: { width: '100%', height: 150, backgroundColor: '#EFE8FB' },
  info: { padding: 20, gap: 6 },
  titulo: { fontSize: 22, fontWeight: '800', color: '#1F1B2E', lineHeight: 28 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dato: { flex: 1, fontSize: 15, color: '#1F1B2E' },
  corte: { flexDirection: 'row', alignItems: 'center', height: 24, marginTop: 4 },
  muesca: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#4B1D8F' },
  linea: { flex: 1, borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#E4DEF0', marginHorizontal: 4 },
  zonaQR: { alignItems: 'center', padding: 20, paddingTop: 12, gap: 14 },
  marcoQR: { padding: 14, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#ECE6F7' },
  numero: { fontSize: 15, fontWeight: '700', color: Colores.primario },
  aviso: { fontSize: 13, color: Colores.textoSuave, textAlign: 'center', lineHeight: 18 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28, backgroundColor: '#FFFFFF' },
  mensaje: { fontSize: 16, color: Colores.texto, textAlign: 'center' },
});
