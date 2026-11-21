import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { Calificacion } from '../servicios/servicioCalificaciones';
import { formatearDiaMes } from '../utilidades/formato';
import { Estrellas } from './Estrellas';

interface Propiedades {
  lista: Calificacion[];
  total: number;
  promedio: number;
  mia: Calificacion | null;
  puedeCalificar: boolean; // evento terminado + tiene entrada + aún no califica
  alCalificar: () => void;
}

export function SeccionCalificaciones({ lista, total, promedio, mia, puedeCalificar, alCalificar }: Propiedades) {
  return (
    <View>
      <Text style={estilos.seccion}>Calificaciones</Text>
      <View style={estilos.resumen}>
        {total > 0 ? (
          <>
            <Text style={estilos.promedio}>{promedio.toFixed(1)}</Text>
            <View style={{ gap: 2 }}>
              <Estrellas valor={promedio} tamano={22} />
              <Text style={estilos.total}>{total} {total === 1 ? 'reseña' : 'reseñas'}</Text>
            </View>
          </>
        ) : (
          <Text style={estilos.total}>Aún no hay calificaciones.</Text>
        )}
      </View>

      {puedeCalificar && (
        <Pressable style={estilos.boton} onPress={alCalificar} accessibilityRole="button">
          <Ionicons name="star-outline" size={20} color={Colores.primario} />
          <Text style={estilos.textoBoton}>Calificar este evento</Text>
        </Pressable>
      )}
      {!!mia && <Text style={estilos.nota}>Ya calificaste este evento con {mia.estrellas} {mia.estrellas === 1 ? 'estrella' : 'estrellas'}.</Text>}

      {lista.slice(0, 5).map((c) => (
        <View key={c.id} style={estilos.comentario}>
          <View style={estilos.filaComentario}>
            <Text style={estilos.autor} numberOfLines={1}>{c.asistenteNombre || 'Asistente'}</Text>
            <Text style={estilos.fecha}>{formatearDiaMes(c.creadaEn)}</Text>
          </View>
          <Estrellas valor={c.estrellas} tamano={16} />
          {!!c.comentario && <Text style={estilos.texto}>{c.comentario}</Text>}
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  seccion: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro, marginTop: 26 },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 },
  promedio: { fontSize: 40, fontWeight: '800', color: '#1F1B2E' },
  total: { fontSize: 14, color: Colores.textoSuave },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: Colores.primario, marginTop: 14 },
  textoBoton: { fontSize: 15, fontWeight: '700', color: Colores.primario },
  nota: { fontSize: 13, fontWeight: '600', color: Colores.primario, marginTop: 12 },
  comentario: { backgroundColor: '#F6F2FD', borderRadius: 16, padding: 14, marginTop: 10, gap: 4 },
  filaComentario: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  autor: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1F1B2E' },
  fecha: { fontSize: 12.5, color: Colores.textoSuave },
  texto: { fontSize: 14, color: '#3D3852', lineHeight: 20, marginTop: 2 },
});
