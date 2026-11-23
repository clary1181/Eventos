import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colores, Fuentes } from '@/compartido/tema';
import { formatearMoneda, formatearNumero } from '@/features/eventos';
import type { Metrica, PuntoVenta } from '../tipos';

const ALTO = 130;

export function GraficaVentas({ puntos, titulo = 'Ventas' }: { puntos: PuntoVenta[]; titulo?: string }) {
  const [metrica, setMetrica] = useState<Metrica>('entradas');
  const valores = puntos.map((p) => (metrica === 'entradas' ? p.entradas : p.ingresos));
  const maximo = Math.max(0, ...valores);
  const total = valores.reduce((a, b) => a + b, 0);
  const fmt = (n: number) => (metrica === 'entradas' ? formatearNumero(n) : formatearMoneda(n));

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.cabecera}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.total}>{fmt(total)}</Text>
        </View>
        <View style={estilos.alterna}>
          {(['entradas', 'ingresos'] as const).map((m) => (
            <Pressable key={m} style={[estilos.opcion, metrica === m && estilos.opcionActiva]} onPress={() => setMetrica(m)}>
              <Text style={[estilos.textoOpcion, metrica === m && { color: '#FFFFFF' }]}>{m === 'entradas' ? 'Entradas' : 'Ingresos'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {maximo === 0 ? (
        <View style={[estilos.vacio, { height: ALTO }]}><Text style={estilos.textoVacio}>Aún no hay ventas en este periodo.</Text></View>
      ) : (
        <>
          <Text style={estilos.maximo}>Máx. {fmt(maximo)}</Text>
          <View style={[estilos.barras, { height: ALTO }]}>
            {valores.map((v, i) => (
              <View key={i} style={estilos.columna}>
                <View style={{ width: '100%', height: v > 0 ? Math.max(4, (v / maximo) * ALTO) : 2, borderRadius: 4, backgroundColor: v > 0 ? Colores.primario : '#E4DCF3' }} />
              </View>
            ))}
          </View>
          <View style={estilos.etiquetas}>
            {puntos.map((p, i) => (
              <Text key={i} style={estilos.etiqueta} numberOfLines={1}>{p.etiqueta}</Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#ECE6F7', gap: 8 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titulo: { fontSize: 15, color: Colores.textoSuave, fontFamily: Fuentes.seminegrita },
  total: { fontSize: 24, color: Colores.primarioOscuro, fontFamily: Fuentes.negrita },
  alterna: { flexDirection: 'row', backgroundColor: '#F1EBFB', borderRadius: 12, padding: 3 },
  opcion: { paddingHorizontal: 12, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  opcionActiva: { backgroundColor: Colores.primario },
  textoOpcion: { fontSize: 13, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
  maximo: { fontSize: 12, color: Colores.textoSuave },
  barras: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, borderBottomWidth: 1, borderBottomColor: '#ECE6F7' },
  columna: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  etiquetas: { flexDirection: 'row', gap: 3 },
  etiqueta: { flex: 1, fontSize: 10.5, color: Colores.textoSuave, textAlign: 'center' },
  vacio: { alignItems: 'center', justifyContent: 'center' },
  textoVacio: { fontSize: 14, color: Colores.textoSuave },
});
