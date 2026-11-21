import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { EncabezadoSeccionAdmin } from '../../componentes/EncabezadoSeccionAdmin';
import { useBarraClara } from '../../hooks/useBarraClara';
import { ModalRevisionEvento } from '../componentes/ModalRevisionEvento';
import { TarjetaEventoAdmin } from '../componentes/TarjetaEventoAdmin';
import { useRevisionEventos } from '../hooks/useRevisionEventos';
import { PESTANAS_EVENTOS } from '../tipos';

export function PantallaRevisionEventos() {
  useBarraClara();
  const r = useRevisionEventos();

  return (
    <View style={estilos.raiz}>
      <EncabezadoSeccionAdmin titulo="Eventos" subtitulo="Aprueba, observa o rechaza los eventos enviados." />
      <View style={estilos.hoja}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.pestanas} style={{ flexGrow: 0 }}>
          {PESTANAS_EVENTOS.map((p) => {
            const activa = r.pestana === p.estado;
            return (
              <Pressable key={p.estado} onPress={() => r.setPestana(p.estado)} style={[estilos.pestana, activa && { backgroundColor: p.color, borderColor: p.color }]}>
                <Text style={[estilos.textoPestana, activa && { color: '#FFFFFF' }]}>{p.etiqueta} ({r.conteos[p.estado]})</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {r.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : r.error ? (
          <View style={estilos.centro}><Text style={estilos.vacio}>{r.error}</Text></View>
        ) : r.lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="calendar-outline" size={48} color={Colores.acento} />
            <Text style={estilos.vacio}>No hay eventos en esta sección.</Text>
          </View>
        ) : (
          <FlatList
            data={r.lista}
            keyExtractor={(e) => e.id}
            contentContainerStyle={{ padding: 16, gap: 14 }}
            renderItem={({ item }) => <TarjetaEventoAdmin evento={item} alPulsar={() => r.abrir(item.id)} />}
          />
        )}
      </View>
      <ModalRevisionEvento evento={r.seleccionado} procesando={r.procesando} alCerrar={r.cerrar} alDictaminar={r.dictaminar} alResolverCambios={r.resolverCambios} />
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#4B1D8F' },
  hoja: { flex: 1, backgroundColor: '#FCFAFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -26, paddingTop: 16 },
  pestanas: { paddingHorizontal: 16, gap: 8 },
  pestana: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF' },
  textoPestana: { fontSize: 13, fontWeight: '700', color: Colores.texto },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  vacio: { fontSize: 14, color: Colores.textoSuave, textAlign: 'center' },
});
