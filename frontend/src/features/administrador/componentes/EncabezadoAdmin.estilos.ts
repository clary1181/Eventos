import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  imagen: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoMarca: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  boton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  punto: {
    position: 'absolute', top: 3, right: 4, width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FF5A4E', borderWidth: 1.5, borderColor: '#6A2FB0',
  },
  titulo: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginTop: 14 },
  textoTitulo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.4, flexShrink: 1 },
  subtitulo: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 21, paddingHorizontal: 20, marginTop: 4, maxWidth: '72%' },
});
