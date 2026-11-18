import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro, textAlign: 'center' },
  texto: {
    fontSize: Tipografia.cuerpo,
    color: Colores.textoSuave,
    textAlign: 'center',
    marginTop: Espaciado.sm,
    marginBottom: Espaciado.lg,
    lineHeight: 21,
  },
  cancelar: { alignSelf: 'center', marginTop: Espaciado.lg },
  textoCancelar: { color: Colores.primario, fontSize: Tipografia.cuerpo, fontWeight: '600' },
});
