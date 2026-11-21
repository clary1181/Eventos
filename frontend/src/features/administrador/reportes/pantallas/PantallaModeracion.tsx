import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { EncabezadoSeccionAdmin } from '../../componentes/EncabezadoSeccionAdmin';
import { useBarraClara } from '../../hooks/useBarraClara';
import { ModalReporte } from '../componentes/ModalReporte';
import { TarjetaCalificacionAdmin } from '../componentes/TarjetaCalificacionAdmin';
import { TarjetaReporte } from '../componentes/TarjetaReporte';
import { useModeracion } from '../hooks/useModeracion';

const Pestana = ({ texto, activa, alPulsar, color = Colores.primario }: { texto: string; activa: boolean; alPulsar: () => void; color?: string }) => (
  <Pressable onPress={alPulsar} style={[estilos.pestana, activa && { backgroundColor: color, borderColor: color }]}>
    <Text style={[estilos.textoPestana, activa && { color: '#FFFFFF' }]}>{texto}</Text>
  </Pressable>
);

export function PantallaModeracion() {
  useBarraClara();
  const m = useModeracion();

  return (
    <View style={estilos.raiz}>
      <EncabezadoSeccionAdmin titulo="Reportes" subtitulo="Modera los reportes y las calificaciones." />

      <View style={estilos.hoja}>
        <View style={estilos.pestanas}>
          <Pestana texto={`Reportes (${m.pendientes.length})`} activa={m.seccion === 'reportes'} alPulsar={() => m.setSeccion('reportes')} />
          <Pestana texto={`Calificaciones (${m.calificaciones.length})`} activa={m.seccion === 'calificaciones'} alPulsar={() => m.setSeccion('calificaciones')} />
        </View>
        {m.seccion === 'reportes' && (
          <View style={[estilos.pestanas, { marginTop: 8 }]}>
            <Pestana texto={`Pendientes (${m.pendientes.length})`} activa={m.pestana === 'pendientes'} alPulsar={() => m.setPestana('pendientes')} color="#E8871A" />
            <Pestana texto={`Atendidos (${m.atendidos.length})`} activa={m.pestana === 'atendidos'} alPulsar={() => m.setPestana('atendidos')} color="#1B9E4B" />
          </View>
        )}

        {m.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : m.error ? (
          <View style={estilos.centro}><Text style={estilos.vacio}>{m.error}</Text></View>
        ) : m.seccion === 'reportes' ? (
          m.lista.length === 0 ? (
            <View style={estilos.centro}>
              <Ionicons name="shield-checkmark-outline" size={48} color={Colores.acento} />
              <Text style={estilos.vacio}>{m.pestana === 'pendientes' ? 'No hay reportes pendientes.' : 'Aún no has atendido reportes.'}</Text>
            </View>
          ) : (
            <FlatList
              data={m.lista}
              keyExtractor={(r) => r.id}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              renderItem={({ item }) => <TarjetaReporte reporte={item} alPulsar={() => m.abrir(item)} />}
            />
          )
        ) : m.calificaciones.length === 0 ? (
          <View style={estilos.centro}>
            <Ionicons name="star-outline" size={48} color={Colores.acento} />
            <Text style={estilos.vacio}>Todavía no hay calificaciones.</Text>
          </View>
        ) : (
          <FlatList
            data={m.calificaciones}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => <TarjetaCalificacionAdmin calificacion={item} alAlternar={() => m.alternarOculta(item)} />}
          />
        )}
      </View>

      <ModalReporte reporte={m.seleccionado} contexto={m.contexto} procesando={m.procesando} alCerrar={m.cerrar} alResolver={m.resolver} />
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#4B1D8F' },
  hoja: { flex: 1, backgroundColor: '#FCFAFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -26, paddingTop: 16 },
  pestanas: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  pestana: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF' },
  textoPestana: { fontSize: 13, fontWeight: '700', color: Colores.texto },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  vacio: { fontSize: 14, color: Colores.textoSuave, textAlign: 'center' },
});
