import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { paddingBottom: Espaciado.xxl * 2 },
  heroContenido: { flex: 1, paddingHorizontal: Espaciado.lg },
  tituloHero: { marginTop: Espaciado.md, color: Colores.textoSobrePrimario, fontSize: 24, fontFamily: Fuentes.extranegrita },
  subtituloHero: { marginTop: 4, color: Colores.textoSobrePrimario, fontSize: 14.5, lineHeight: 21, fontFamily: Fuentes.regular },
  hoja: { marginTop: -28, backgroundColor: Colores.fondo, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: Espaciado.lg, paddingTop: Espaciado.xl },
  seccion: { fontSize: 18, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, marginTop: Espaciado.lg, marginBottom: Espaciado.md },
  nota: { fontSize: 12.5, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: -4, marginBottom: Espaciado.md, marginLeft: 4, lineHeight: 18 },
  contador: { alignSelf: 'flex-end', fontSize: 12, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: -6, marginBottom: Espaciado.sm },
  centro: { alignItems: 'center', paddingVertical: Espaciado.xxl },
  textoError: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.error, textAlign: 'center' },
});
