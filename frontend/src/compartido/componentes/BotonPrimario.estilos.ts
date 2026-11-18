import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Radios } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  boton: {
    width: '100%',
    height: 45,
    borderRadius: Radios.boton,
    backgroundColor: Colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Espaciado.sm,
  },
  inactivo: { opacity: 0.6 },
  texto: { color: Colores.textoSobrePrimario, fontSize: 18, fontWeight: '700' },
});
