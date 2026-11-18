import { StyleSheet } from 'react-native';
import { Colores, Espaciado } from '@/compartido/tema';

export const ALTO_ONDA = 45;

export const estilos = StyleSheet.create({
  cabecera: { overflow: 'hidden', backgroundColor: Colores.primarioOscuro },
  contenido: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Espaciado.xl,
  },
  marca: {
    color: Colores.textoSobrePrimario,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  lema: {
    color: Colores.textoSobrePrimario,
    textAlign: 'center',
    marginTop: Espaciado.xs,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  onda: { position: 'absolute', left: 0, right: 0, bottom: -1 },
});