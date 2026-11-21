import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { TITULO_MOTIVO, type ReporteAdmin } from '../tipos';

export const formatearFechaCorta = (d: Date | null) =>
  d ? d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Ahora';

const ESTADO = {
  pendiente_moderacion: { texto: 'Pendiente', fondo: '#FDE8D4', color: '#B4530A' },
  resuelto: { texto: 'Resuelto', fondo: '#D9F2DE', color: '#1B7F3B' },
  desestimado: { texto: 'Desestimado', fondo: '#EEEDF2', color: '#55516B' },
} as const;

export function TarjetaReporte({ reporte: r, alPulsar }: { reporte: ReporteAdmin; alPulsar: () => void }) {
  const e = ESTADO[r.estado] ?? ESTADO.pendiente_moderacion;
  return (
    <Pressable onPress={alPulsar} style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.85 }]} accessibilityRole="button">
      <View style={estilos.icono}><Ionicons name="flag" size={22} color="#B3261E" /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={estilos.titulo} numberOfLines={1}>{r.eventoTitulo || 'Evento'}</Text>
        <Text style={estilos.motivo}>{TITULO_MOTIVO[r.motivo] ?? r.motivo}</Text>
        <Text style={estilos.detalle} numberOfLines={2}>{r.descripcion}</Text>
        <View style={estilos.pie}>
          <View style={[estilos.etiqueta, { backgroundColor: e.fondo }]}><Text style={[estilos.textoEtiqueta, { color: e.color }]}>{e.texto}</Text></View>
          <Text style={estilos.fecha}>{formatearFechaCorta(r.creadoEn)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={Colores.primarioMedio} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14,
    shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  icono: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FDE4E4', alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 16, fontWeight: '800', color: Colores.texto },
  motivo: { fontSize: 13, fontWeight: '700', color: Colores.primario },
  detalle: { fontSize: 13, color: Colores.textoSuave },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  etiqueta: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  textoEtiqueta: { fontSize: 12, fontWeight: '700' },
  fecha: { fontSize: 12, color: Colores.textoSuave },
});
