import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { flexGrow: 1, paddingBottom: Espaciado.xxl },
  formulario: { paddingHorizontal: Espaciado.xl, marginTop: -Espaciado.sm },
  titulo: { fontSize: Tipografia.titulo, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center' },
  indicador: { flexDirection: 'row', justifyContent: 'center', gap: Espaciado.sm, marginTop: Espaciado.md },
  barra: { width: 32, height: 6, borderRadius: 3, backgroundColor: Colores.primarioClaro },
  barraActiva: { backgroundColor: Colores.primario },
  subtitulo: { textAlign: 'center', color: Colores.textoSuave, fontSize: Tipografia.pequeno, fontFamily: Fuentes.regular, marginTop: Espaciado.sm, marginBottom: Espaciado.xl },
  errorFecha: { color: Colores.error, fontSize: Tipografia.pequeno, fontFamily: Fuentes.regular, marginTop: -Espaciado.sm, marginBottom: Espaciado.md, marginLeft: Espaciado.sm },
  filaBotones: { flexDirection: 'row', gap: Espaciado.md, alignItems: 'flex-end' },
  filaInicio: { flexDirection: 'row', justifyContent: 'center', gap: Espaciado.sm, marginTop: Espaciado.xl },
  textoInicio: { color: Colores.texto, fontSize: Tipografia.cuerpo - 1, fontFamily: Fuentes.regular },
  enlaceInicio: { color: Colores.primario, fontSize: Tipografia.cuerpo - 1, fontFamily: Fuentes.extranegrita },
  // Modales
  tituloModal: { fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center', marginBottom: Espaciado.lg },
  textoModal: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', lineHeight: 22, marginBottom: Espaciado.lg },
  opcionCiudad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Espaciado.md,
    paddingHorizontal: Espaciado.lg,
    borderRadius: Radios.campo,
  },
  opcionCiudadActiva: { backgroundColor: Colores.fondoSuave },
  textoCiudad: { fontSize: Tipografia.subtitulo, fontFamily: Fuentes.regular, color: Colores.texto },
  textoCiudadActiva: { fontFamily: Fuentes.extranegrita, color: Colores.primario },
  iconoExito: { alignSelf: 'center', marginBottom: Espaciado.md },
});