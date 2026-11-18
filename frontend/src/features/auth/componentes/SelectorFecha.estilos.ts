import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Espaciado.md },
  apagado: { opacity: 0.25 },
  tituloMes: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.xs, paddingVertical: Espaciado.xs, paddingHorizontal: Espaciado.sm },
  textoTitulo: { fontSize: 17, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  fila: { flexDirection: 'row', flexWrap: 'wrap' },
  diaSemana: { width: '14.2857%', textAlign: 'center', fontSize: 12, fontFamily: Fuentes.seminegrita, color: Colores.textoSuave, marginBottom: Espaciado.xs },
  celda: { width: '14.2857%', height: 40, alignItems: 'center', justifyContent: 'center' },
  circulo: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  celdaActiva: { backgroundColor: Colores.primario },
  textoDia: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.texto },
  textoActivo: { color: Colores.textoSobrePrimario, fontFamily: Fuentes.extranegrita },
  textoApagado: { color: Colores.borde },
  listaAnios: { maxHeight: 260 },
  rejillaAnios: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Espaciado.sm, paddingBottom: Espaciado.sm },
  celdaAnio: { width: '22%', paddingVertical: Espaciado.sm, borderRadius: 12, alignItems: 'center' },
  textoAnio: { fontSize: 14, fontFamily: Fuentes.regular, color: Colores.texto },
});