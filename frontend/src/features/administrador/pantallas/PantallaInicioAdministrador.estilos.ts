import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#4B1D8F' },
  hoja: {
    backgroundColor: '#FCFAFF', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 28, minHeight: 520,
  },

  heroContenido: { flex: 1, paddingHorizontal: Espaciado.lg },
  saludo: { marginTop: Espaciado.md, color: Colores.textoSobrePrimario, fontSize: 26, fontFamily: Fuentes.extranegrita },
  subtitulo: { marginTop: 4, color: Colores.textoSobrePrimario, fontSize: 15, lineHeight: 22, fontFamily: Fuentes.regular, maxWidth: '75%' },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.texto, letterSpacing: -0.3 },
  periodo: {
    flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colores.borde,
    backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8,
  },
  textoPeriodo: { fontSize: 13, color: Colores.texto },
  fila: { flexDirection: 'row', gap: 8, marginTop: 14 },
  seccion: { marginTop: 24 },
  lista: { gap: 12, marginTop: 14 },
});
