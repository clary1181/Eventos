import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { flexGrow: 1 },
  formulario: { paddingHorizontal: Espaciado.xl, marginTop: -Espaciado.xs },
  titulo: {
    fontSize: Tipografia.titulo - 2,
    fontFamily: Fuentes.extranegrita,
    color: Colores.primarioOscuro,
    textAlign: 'center',
    marginBottom: Espaciado.md,
  },
  enlaceOlvido: { alignSelf: 'flex-end', marginBottom: Espaciado.md },
  textoOlvido: { color: Colores.primario, fontSize: Tipografia.cuerpo - 1, fontFamily: Fuentes.seminegrita },
  filaRegistro: { flexDirection: 'row', justifyContent: 'center', gap: Espaciado.sm, marginTop: Espaciado.lg },
  textoRegistro: { color: Colores.texto, fontSize: Tipografia.cuerpo - 1, fontFamily: Fuentes.regular },
  enlaceRegistro: { color: Colores.primario, fontSize: Tipografia.cuerpo - 1, fontFamily: Fuentes.extranegrita },
});