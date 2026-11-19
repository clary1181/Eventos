import { StyleSheet } from 'react-native';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo, alignItems: 'center', justifyContent: 'center', padding: Espaciado.xl },
  circulo: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colores.primarioClaro,
    alignItems: 'center', justifyContent: 'center', marginBottom: Espaciado.xl,
  },
  titulo: { fontSize: Tipografia.titulo - 4, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center' },
  descripcion: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', marginTop: Espaciado.sm, lineHeight: 22 },
});
