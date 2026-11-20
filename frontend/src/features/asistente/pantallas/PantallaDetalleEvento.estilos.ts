import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FFFFFF' },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingHorizontal: 20, paddingTop: 22 },
  titulo: { fontSize: 32, fontWeight: '800', color: '#1F1B2E', letterSpacing: -0.6, lineHeight: 38 },
  seccion: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro, marginTop: 26 },
  descripcion: { fontSize: 16, color: '#3D3852', lineHeight: 24, marginTop: 8 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14, backgroundColor: '#FFFFFF' },
  mensaje: { fontSize: 16, color: Colores.texto, textAlign: 'center', lineHeight: 22 },
  yaTienes: { fontSize: 14, fontWeight: '700', color: Colores.primario, textAlign: 'center', marginTop: 18 },
  botonVolver: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 22, borderWidth: 1.5, borderColor: Colores.primario },
  textoVolver: { fontSize: 15, fontWeight: '700', color: Colores.primario },
});
