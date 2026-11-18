import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Radios, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  envoltorio: { width: '100%', marginBottom: Espaciado.md },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
    borderWidth: 1.5,
    borderColor: Colores.borde,
    borderRadius: Radios.campo,
    backgroundColor: Colores.fondo,
    paddingHorizontal: Espaciado.lg,
  },
  campoError: { borderColor: Colores.error },
  icono: { marginRight: Espaciado.md },
  entrada: {
    flex: 1,
    fontSize: Tipografia.cuerpo,
    color: Colores.texto,
    paddingVertical: Espaciado.sm,
  },
  textoError: {
    color: Colores.error,
    fontSize: Tipografia.pequeno,
    marginTop: Espaciado.xs,
    marginLeft: Espaciado.sm,
  },
});
