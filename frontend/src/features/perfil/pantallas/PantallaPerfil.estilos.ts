import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo, padding: Espaciado.xl, paddingTop: Espaciado.xxl * 2 },
  cabecera: { alignItems: 'center', marginBottom: Espaciado.xl },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center', marginBottom: Espaciado.md },
  inicial: { color: Colores.textoSobrePrimario, fontSize: 40, fontFamily: Fuentes.extranegrita },
  nombre: { fontSize: Tipografia.titulo - 4, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center' },
  usuario: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.textoSuave, marginTop: 2 },
  etiqueta: { marginTop: Espaciado.md, backgroundColor: Colores.primarioClaro, borderRadius: 999, paddingHorizontal: Espaciado.lg, paddingVertical: Espaciado.xs },
  textoEtiqueta: { color: Colores.primario, fontFamily: Fuentes.negrita, fontSize: Tipografia.pequeno },
});
