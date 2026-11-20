import { StyleSheet } from 'react-native';
import { Colores } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  encabezado: { backgroundColor: '#4B1D8F', paddingHorizontal: 16, paddingBottom: 22, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 12 },
  volver: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  titulo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subtitulo: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 2 },
  contenido: { padding: 20, paddingBottom: 40 },
  seccion: { fontSize: 18, fontWeight: '800', color: Colores.primarioOscuro, marginBottom: 12 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14, backgroundColor: '#FCFAFF' },
  mensaje: { fontSize: 16, color: Colores.texto, textAlign: 'center', lineHeight: 22 },
  boton: { height: 52, borderRadius: 26, backgroundColor: Colores.primario, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
