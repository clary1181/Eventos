import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCFAFF', gap: 12, padding: 30 },
  heroContenido: { paddingHorizontal: 20 },
  hoja: { marginTop: -40, backgroundColor: '#FCFAFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 20 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: -64 },
  avatar: { width: 104, height: 104, borderRadius: 52, borderWidth: 4, borderColor: '#FFFFFF', backgroundColor: '#E4D7F8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  inicial: { fontSize: 42, fontWeight: '800', color: Colores.primario },
  datos: { flex: 1, paddingTop: 52, gap: 4 },
  filaNombre: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nombre: { flexShrink: 1, fontSize: 24, fontWeight: '800', color: '#1F1B2E', letterSpacing: -0.4 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dato: { fontSize: 14.5, color: Colores.textoSuave, flexShrink: 1 },
  biografia: { fontSize: 15, color: '#3D3852', lineHeight: 22 },
  acciones: { flexDirection: 'row' },
  metricas: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 22, paddingVertical: 16, borderWidth: 1, borderColor: '#ECE6F7' },
  metrica: { flex: 1, alignItems: 'center', gap: 2 },
  numero: { fontSize: 24, fontWeight: '800', color: Colores.primarioOscuro },
  etiquetaMetrica: { fontSize: 13, color: Colores.textoSuave },
  separador: { width: 1, backgroundColor: '#ECE6F7' },
  seccion: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro, letterSpacing: -0.3 },
  lista: { gap: 14, marginTop: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, marginTop: 8 },
});
