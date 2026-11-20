import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  heroContenido: { paddingHorizontal: 20 },
  saludo: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginTop: 14 },
  subtitulo: { color: 'rgba(255,255,255,0.92)', fontSize: 16, marginTop: 4, maxWidth: '72%', lineHeight: 22 },
  // El buscador queda a caballo entre la foto y la hoja blanca
  buscador: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 58, marginHorizontal: 20, marginTop: -29, zIndex: 2,
    backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 18,
    shadowColor: '#4B1D8F', shadowOpacity: 0.15, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 5,
  },
  entradaBuscador: { flex: 1, fontSize: 16, color: Colores.texto, paddingVertical: 0 },
  hoja: { backgroundColor: '#FCFAFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -58, paddingTop: 58 + 20, paddingBottom: 32 },
  seccion: { paddingHorizontal: 20, marginTop: 28 },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  titulo: { fontSize: 24, fontWeight: '800', color: Colores.primarioOscuro, letterSpacing: -0.4 },
  verTodos: { fontSize: 16, fontWeight: '700', color: Colores.primario },
  lista: { gap: 14 },
  centro: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 10 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center' },
});