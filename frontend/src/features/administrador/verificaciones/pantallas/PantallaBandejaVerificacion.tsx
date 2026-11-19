import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { EncabezadoSeccionAdmin } from '../../componentes/EncabezadoSeccionAdmin';
import { useBarraClara } from '../../hooks/useBarraClara';
import { useBandejaVerificacion } from '../hooks/useBandejaVerificacion';
import { ModalExpediente } from '../componentes/ModalExpediente';
import { TarjetaSolicitud } from '../componentes/TarjetaSolicitud';
import { PESTANAS_BANDEJA } from '../tipos';

export function PantallaBandejaVerificacion() {
  useBarraClara();
  const b = useBandejaVerificacion();

  return (
    <View style={estilos.raiz}>
      <EncabezadoSeccionAdmin titulo="Organizadores" subtitulo="Revisa las solicitudes de verificación." />

      <View style={estilos.hoja}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.pestanas} style={{ flexGrow: 0 }}>
          {PESTANAS_BANDEJA.map((p) => {
            const activa = b.pestana === p.estado;
            return (
              <Pressable key={p.estado} onPress={() => b.setPestana(p.estado)} style={[estilos.pestana, activa && { backgroundColor: p.color, borderColor: p.color }]}>
                <Text style={[estilos.textoPestana, activa && { color: '#FFFFFF' }]}>{p.etiqueta} ({b.conteos[p.estado]})</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {b.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : b.error ? (
          <View style={estilos.centro}><Text style={estilos.vacio}>{b.error}</Text></View>
        ) : b.lista.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="shield-checkmark-outline" size={48} color={Colores.acento} />
            <Text style={estilos.vacio}>No hay solicitudes en esta sección.</Text>
          </View>
        ) : (
          <FlatList
            data={b.lista}
            keyExtractor={(s) => s.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => <TarjetaSolicitud solicitud={item} perfil={b.perfiles[item.id]} alPulsar={() => b.abrir(item.id)} />}
          />
        )}
      </View>

      <ModalExpediente
        solicitud={b.seleccionada}
        perfil={b.seleccionada ? b.perfiles[b.seleccionada.id] : undefined}
        procesando={b.procesando}
        alCerrar={b.cerrar}
        alResolver={b.resolver}
      />
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
