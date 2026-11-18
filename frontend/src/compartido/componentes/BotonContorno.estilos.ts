import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Radios } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  boton: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    gap: Espaciado.md,
    borderRadius: Radios.boton,
    borderWidth: 1.5,
    borderColor: Colores.borde,
    backgroundColor: Colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: { backgroundColor: Colores.fondoSuave },
  texto: { color: Colores.texto, fontSize: 17, fontWeight: '600' },
});
