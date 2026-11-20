import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  encabezado: { backgroundColor: '#4B1D8F', paddingHorizontal: 20, paddingBottom: 26, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  titulo: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitulo: { color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 4 },
  pestanas: { flexDirection: 'row', backgroundColor: '#F1EAFC', borderRadius: 24, padding: 4, marginHorizontal: 20, marginTop: 18 },
  pestana: { flex: 1, height: 44, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pestanaActiva: { backgroundColor: Colores.primario },
  textoPestana: { fontSize: 15, fontWeight: '700', color: Colores.primarioOscuro },
  lista: { padding: 20, gap: 14, paddingBottom: 40 },
  centro: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
});
