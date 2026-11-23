import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { paddingBottom: Espaciado.xxl },
  heroContenido: { flex: 1, paddingHorizontal: Espaciado.lg },
  hoja: {
    marginTop: -30, backgroundColor: Colores.fondo, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingHorizontal: Espaciado.lg, paddingTop: Espaciado.xl, gap: 18,
  },
  cabecera: { flexDirection: 'row', gap: Espaciado.lg },
  avatarCaja: { width: 104, height: 104 },
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: Colores.primarioOscuro, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: Colores.primarioClaro },
  inicial: { color: Colores.textoSobrePrimario, fontSize: 40, fontFamily: Fuentes.extranegrita },
  camara: {
    position: 'absolute', right: -2, bottom: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: Colores.primarioClaro,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colores.fondo,
  },
  datos: { flex: 1, gap: 3 },
  filaNombre: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nombre: { flexShrink: 1, fontSize: 21, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  rol: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.textoSuave },
  filaCalificacion: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  calificacion: { fontSize: 14.5, fontFamily: Fuentes.negrita, color: Colores.texto },
  resenas: { fontSize: 13.5, fontFamily: Fuentes.regular, color: Colores.textoSuave },
  biografia: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 21, marginTop: 2 },
  editar: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1.5, borderColor: Colores.primario,
    borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12, marginTop: 4,
  },
  textoEditar: { fontSize: 13, fontFamily: Fuentes.seminegrita, color: Colores.primario },
  contactos: { flexDirection: 'row', alignItems: 'center' },
  contacto: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  textoContacto: { flexShrink: 1, fontSize: 12.5, fontFamily: Fuentes.media, color: Colores.primarioOscuro },
  divisor: { width: 1, height: 26, backgroundColor: Colores.borde },
  metricas: { flexDirection: 'row', gap: 8 },
  metrica: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 10, paddingHorizontal: 6,
    borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: Colores.fondoSuave,
  },
  metricaValor: { alignSelf: 'stretch', textAlign: 'center', fontSize: 18, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  metricaEtiqueta: { fontSize: 11, fontFamily: Fuentes.media, color: Colores.textoSuave, textAlign: 'center', lineHeight: 14 },
  encabezadoLista: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tituloSeccion: { fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  proximamente: { alignItems: 'center', gap: 8, padding: Espaciado.xl, backgroundColor: Colores.fondoSuave, borderRadius: 20 },
  textoProximamente: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
});