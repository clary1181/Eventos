import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Radios, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  etiqueta: { color: Colores.textoSuave, fontSize: Tipografia.pequeno, fontWeight: '600', marginBottom: Espaciado.sm, marginLeft: Espaciado.sm },
  fila: { flexDirection: 'row', gap: Espaciado.md, width: '100%', marginBottom: Espaciado.lg },
  opcion: {
    flex: 1,
    height: 52,
    borderRadius: Radios.campo,
    borderWidth: 1.5,
    borderColor: Colores.borde,
    backgroundColor: Colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcionActiva: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  texto: { color: Colores.texto, fontSize: Tipografia.cuerpo, fontWeight: '600' },
  textoActivo: { color: Colores.textoSobrePrimario },
});
