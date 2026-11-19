import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { paddingBottom: Espaciado.xxl },
  heroContenido: { flex: 1, paddingHorizontal: Espaciado.lg },
  saludo: { marginTop: Espaciado.md, color: Colores.textoSobrePrimario, fontSize: 26, fontFamily: Fuentes.extranegrita },
  subtitulo: { marginTop: 4, color: Colores.textoSobrePrimario, fontSize: 15, lineHeight: 22, fontFamily: Fuentes.regular, maxWidth: '75%' },
  // La hoja blanca se encima 34 px sobre la foto (el aviso queda a medias entre foto y fondo blanco)
  hoja: { marginTop: -34, paddingHorizontal: Espaciado.lg, gap: 22 },
  accesos: { flexDirection: 'row', gap: 10 },
  encabezadoSeccion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Espaciado.md },
  tituloSeccion: { fontSize: 21, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  periodo: { borderWidth: 1, borderColor: Colores.borde, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  textoPeriodo: { fontSize: 13, fontFamily: Fuentes.media, color: Colores.texto },
  metricas: { flexDirection: 'row', gap: 10 },
  verTodos: { fontSize: 14.5, fontFamily: Fuentes.negrita, color: Colores.primario },
});
