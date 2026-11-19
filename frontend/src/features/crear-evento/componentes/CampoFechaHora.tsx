import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colores } from '@/compartido/tema';

interface Propiedades {
  etiqueta: string;
  valor: Date | null;
  alCambiar: (fecha: Date | null) => void;
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');
const textoFecha = (d: Date) => `${dosDigitos(d.getDate())}/${dosDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
const textoHora = (d: Date) => `${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;

const formatearFecha = (t: string) => {
  const d = t.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};
const formatearHora = (t: string) => {
  const d = t.replace(/\D/g, '').slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
};

// Devuelve la fecha real o null si el formato o el calendario no son válidos (p. ej. 31/02)
function interpretar(fecha: string, hora: string): Date | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) return null;
  const [dia, mes, anio] = fecha.split('/').map(Number);
  const [h, m] = hora.split(':').map(Number);
  if (h > 23 || m > 59) return null;
  const f = new Date(anio, mes - 1, dia, h, m, 0, 0);
  return f.getFullYear() === anio && f.getMonth() === mes - 1 && f.getDate() === dia ? f : null;
}

// Fecha y hora escritas con formato automático. No usa módulos nativos, funciona en Expo Go.
export function CampoFechaHora({ etiqueta, valor, alCambiar }: Propiedades) {
  const [fecha, setFecha] = useState(valor ? textoFecha(valor) : '');
  const [hora, setHora] = useState(valor ? textoHora(valor) : '');

  // Si el valor cambia desde fuera (p. ej. el fin se propone solo), se refleja en los campos
  useEffect(() => {
    if (!valor) return;
    const actual = interpretar(fecha, hora);
    if (!actual || actual.getTime() !== valor.getTime()) {
      setFecha(textoFecha(valor));
      setHora(textoHora(valor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  const cambiarFecha = (t: string) => { const f = formatearFecha(t); setFecha(f); alCambiar(interpretar(f, hora)); };
  const cambiarHora = (t: string) => { const h = formatearHora(t); setHora(h); alCambiar(interpretar(fecha, h)); };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <View style={estilos.fila}>
        <TextInput
          style={[estilos.entrada, { flex: 1.4 }]} value={fecha} onChangeText={cambiarFecha}
          placeholder="DD/MM/AAAA" placeholderTextColor={Colores.textoSuave} keyboardType="number-pad" maxLength={10}
          accessibilityLabel={`${etiqueta}: fecha`}
        />
        <TextInput
          style={[estilos.entrada, { flex: 1 }]} value={hora} onChangeText={cambiarHora}
          placeholder="HH:MM (24 h)" placeholderTextColor={Colores.textoSuave} keyboardType="number-pad" maxLength={5}
          accessibilityLabel={`${etiqueta}: hora`}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginTop: 14 },
  etiqueta: { fontSize: 13, fontWeight: '700', color: Colores.primarioOscuro, marginBottom: 6 },
  fila: { flexDirection: 'row', gap: 10 },
  entrada: {
    minHeight: 48, borderWidth: 1, borderColor: Colores.borde, borderRadius: 16, backgroundColor: '#FFFFFF',
    paddingHorizontal: 14, fontSize: 15, color: Colores.texto,
  },
});
