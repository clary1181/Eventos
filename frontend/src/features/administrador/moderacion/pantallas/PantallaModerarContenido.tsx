import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { Colores } from '@/compartido/tema';
import { useBarraClara } from '../../hooks/useBarraClara';
import { TarjetaCalificacionAdmin } from '../../reportes/componentes/TarjetaCalificacionAdmin';
import { DURACIONES_SUSPENSION, UMBRAL_REINCIDENCIA } from '../constantes';
import { useModerarContenido, type Reincidente } from '../hooks/useModerarContenido';
import type { EventoModerable } from '../servicios/servicioModerarContenido';

const Chip = ({ texto, activo, alPulsar, color = Colores.primario }: { texto: string; activo: boolean; alPulsar: () => void; color?: string }) => (
  <Pressable onPress={alPulsar} style={[estilos.chip, activo && { backgroundColor: color, borderColor: color }]}>
    <Text style={[estilos.textoChip, activo && { color: '#FFFFFF' }]}>{texto}</Text>
  </Pressable>
);

function TarjetaEventoModerable({ e, alSuspender, alReactivar }: { e: EventoModerable; alSuspender: () => void; alReactivar: () => void }) {
  const suspendido = e.estado === 'suspendido';
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.fila}>
        {e.imagenUrl ? <Image source={{ uri: e.imagenUrl }} style={estilos.imagen} /> : <View style={[estilos.imagen, { backgroundColor: '#EFE8FB' }]} />}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={estilos.titulo} numberOfLines={2}>{e.titulo}</Text>
          <Text style={estilos.detalle} numberOfLines={1}>{e.organizadorNombre}</Text>
          <Text style={estilos.detalle}>{e.vendidas} {e.vendidas === 1 ? 'entrada vendida' : 'entradas vendidas'}</Text>
        </View>
      </View>
      {suspendido && !!e.motivo && <Text style={estilos.motivo}>Motivo: {e.motivo}</Text>}
      <Pressable style={[estilos.accion, { backgroundColor: suspendido ? '#E4F4E7' : '#FDE4E4' }]} onPress={suspendido ? alReactivar : alSuspender} accessibilityRole="button">
        <Ionicons name={suspendido ? 'play-circle-outline' : 'pause-circle-outline'} size={20} color={suspendido ? '#1B7F3B' : '#B3261E'} />
        <Text style={[estilos.textoAccion, { color: suspendido ? '#1B7F3B' : '#B3261E' }]}>{suspendido ? 'Reactivar evento' : 'Suspender evento'}</Text>
      </Pressable>
    </View>
  );
}

function TarjetaReincidente({ r, alSancionar, alLevantar }: { r: Reincidente; alSancionar: () => void; alLevantar: () => void }) {
  const o = r.organizador;
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.fila}>
        {o.fotoUrl ? <Image source={{ uri: o.fotoUrl }} style={[estilos.imagen, { borderRadius: 36 }]} /> : (
          <View style={[estilos.imagen, { borderRadius: 36, backgroundColor: '#E4D7F8', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: Colores.primario }}>{o.nombre.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={estilos.titulo} numberOfLines={2}>{o.nombre}</Text>
          <Text style={[estilos.detalle, { color: '#B3261E', fontWeight: '700' }]}>{r.suspendidos.length} {r.suspendidos.length === 1 ? 'evento suspendido' : 'eventos suspendidos'}</Text>
        </View>
      </View>
      {r.suspendidos.slice(0, 4).map((e) => <Text key={e.id} style={estilos.detalle} numberOfLines={1}>• {e.titulo}</Text>)}
      {r.suspensionActiva && o.suspensionHasta && (
        <View style={estilos.aviso}>
          <Text style={estilos.textoAviso}>Cuenta suspendida hasta el {o.suspensionHasta.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          {!!o.motivoSuspension && <Text style={estilos.detalle}>Motivo: {o.motivoSuspension}</Text>}
        </View>
      )}
      <Pressable style={[estilos.accion, { backgroundColor: r.suspensionActiva ? '#E4F4E7' : '#FDE4E4' }]} onPress={r.suspensionActiva ? alLevantar : alSancionar} accessibilityRole="button">
        <Ionicons name={r.suspensionActiva ? 'lock-open-outline' : 'ban-outline'} size={20} color={r.suspensionActiva ? '#1B7F3B' : '#B3261E'} />
        <Text style={[estilos.textoAccion, { color: r.suspensionActiva ? '#1B7F3B' : '#B3261E' }]}>{r.suspensionActiva ? 'Levantar suspensión' : 'Suspender cuenta'}</Text>
      </Pressable>
    </View>
  );
}

export function PantallaModerarContenido() {
  useBarraClara();
  const router = useRouter();
  const m = useModerarContenido();
  const [motivo, setMotivo] = useState('');
  const [dias, setDias] = useState<number>(7);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/administrador/inicio' as Href));
  const cerrarSancion = () => { if (!m.procesando) { m.setASancionar(null); setMotivo(''); setDias(7); } };
  const cerrarModal = () => { if (!m.procesando) { m.setASuspender(null); setMotivo(''); } };

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla titulo="Moderar contenido" subtitulo="Retira eventos publicados u oculta calificaciones inapropiadas" alVolver={volver} />

      <View style={estilos.barra}>
        <View style={estilos.filaChips}>
          <Chip texto="Eventos" activo={m.seccion === 'eventos'} alPulsar={() => m.setSeccion('eventos')} />
          <Chip texto="Calificaciones" activo={m.seccion === 'calificaciones'} alPulsar={() => m.setSeccion('calificaciones')} />
          <Chip texto={`Organizadores${m.totalOrgsPendientes > 0 ? ` (${m.totalOrgsPendientes})` : ''}`} activo={m.seccion === 'organizadores'} alPulsar={() => m.setSeccion('organizadores')} color={m.totalOrgsPendientes > 0 ? '#B3261E' : Colores.primario} />
        </View>
        <View style={estilos.buscador}>
          <Ionicons name="search-outline" size={20} color={Colores.textoSuave} />
          <TextInput style={estilos.entradaBusqueda} value={m.busqueda} onChangeText={m.setBusqueda} placeholder={m.seccion === 'eventos' ? 'Buscar por evento u organizador' : m.seccion === 'organizadores' ? 'Buscar organizador' : 'Buscar por evento, autor o comentario'} placeholderTextColor={Colores.textoSuave} />
        </View>
        <View style={estilos.filaChips}>
          {m.seccion === 'eventos' ? (
            <>
              <Chip texto={`Publicados (${m.totalPublicados})`} activo={m.filtroEventos === 'publicados'} alPulsar={() => m.setFiltroEventos('publicados')} color="#1B7F3B" />
              <Chip texto={`Suspendidos (${m.totalSuspendidos})`} activo={m.filtroEventos === 'suspendidos'} alPulsar={() => m.setFiltroEventos('suspendidos')} color="#B3261E" />
            </>
) : m.seccion === 'organizadores' ? (
            <>
              <Chip texto={`Por revisar (${m.totalOrgsPendientes})`} activo={m.filtroOrgs === 'pendientes'} alPulsar={() => m.setFiltroOrgs('pendientes')} color="#B3261E" />
              <Chip texto={`Suspendidos (${m.totalOrgsSuspendidos})`} activo={m.filtroOrgs === 'suspendidos'} alPulsar={() => m.setFiltroOrgs('suspendidos')} color="#6B6778" />
            </>
          ) : (
            <>
              <Chip texto="Todas" activo={m.filtroCals === 'todas'} alPulsar={() => m.setFiltroCals('todas')} />
              <Chip texto={`Ocultas (${m.totalOcultas})`} activo={m.filtroCals === 'ocultas'} alPulsar={() => m.setFiltroCals('ocultas')} color="#B3261E" />
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {m.cargando ? (
          <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 30 }} />
        ) : m.error ? (
          <Text style={estilos.vacio}>{m.error}</Text>
        ) : m.seccion === 'eventos' ? (
          m.eventos.length === 0 ? (
            <Text style={estilos.vacio}>{m.filtroEventos === 'publicados' ? 'No hay eventos publicados que coincidan.' : 'No hay eventos suspendidos.'}</Text>
          ) : (
            m.eventos.map((e) => <TarjetaEventoModerable key={e.id} e={e} alSuspender={() => { setMotivo(''); m.setASuspender(e); }} alReactivar={() => m.reactivar(e)} />)
          )
        ) : m.seccion === 'organizadores' ? (
          m.organizadoresLista.length === 0 ? (
            <Text style={estilos.vacio}>
              {m.filtroOrgs === 'pendientes' ? `Ningún organizador tiene ${UMBRAL_REINCIDENCIA} o más eventos suspendidos sin sanción.` : 'No hay cuentas suspendidas.'}
            </Text>
          ) : (
            m.organizadoresLista.map((r) => (
              <TarjetaReincidente key={r.organizador.uid} r={r} alSancionar={() => { setMotivo(''); setDias(7); m.setASancionar(r); }} alLevantar={() => m.quitarSancion(r)} />
            ))
          )
        ) : m.calificaciones.length === 0 ? (
          <Text style={estilos.vacio}>{m.filtroCals === 'ocultas' ? 'No hay calificaciones ocultas.' : 'Todavía no hay calificaciones.'}</Text>
        ) : (
          m.calificaciones.map((c) => <TarjetaCalificacionAdmin key={c.id} calificacion={c} alAlternar={() => m.alternarOculta(c)} />)
        )}
      </ScrollView>

      <Modal visible={!!m.aSancionar} transparent animationType="fade" onRequestClose={cerrarSancion}>
        <KeyboardAvoidingView style={estilos.fondoModal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={estilos.modal}>
            <Text style={estilos.tituloModal}>Suspender cuenta</Text>
            <Text style={estilos.detalle}>{m.aSancionar?.organizador.nombre} no podrá crear ni editar eventos durante este tiempo. Podrá seguir entrando a la app y verá el motivo.</Text>
            <View style={estilos.filaChips}>
              {DURACIONES_SUSPENSION.map((d) => <Chip key={d.dias} texto={d.etiqueta} activo={dias === d.dias} alPulsar={() => setDias(d.dias)} color="#B3261E" />)}
            </View>
            <TextInput style={estilos.entrada} multiline maxLength={500} value={motivo} onChangeText={setMotivo} placeholder="Motivo de la suspensión (lo verá el organizador)" placeholderTextColor={Colores.textoSuave} textAlignVertical="top" />
            <View style={estilos.fila}>
              <Pressable style={[estilos.botonModal, { backgroundColor: '#F1EBFB' }]} onPress={cerrarSancion} disabled={m.procesando}><Text style={[estilos.textoBoton, { color: Colores.primarioOscuro }]}>Cancelar</Text></Pressable>
              <Pressable style={[estilos.botonModal, { backgroundColor: '#B3261E' }]} onPress={() => m.confirmarSancion(dias, motivo)} disabled={m.procesando}>
                {m.procesando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Suspender</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!m.aSuspender} transparent animationType="fade" onRequestClose={cerrarModal}>
        <KeyboardAvoidingView style={estilos.fondoModal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={estilos.modal}>
            <Text style={estilos.tituloModal}>Suspender evento</Text>
            <Text style={estilos.detalle}>"{m.aSuspender?.titulo}" dejará de mostrarse en el catálogo. Las entradas ya vendidas se conservan.</Text>
            <TextInput style={estilos.entrada} multiline maxLength={500} value={motivo} onChangeText={setMotivo} placeholder="Motivo de la suspensión (lo verá el organizador)" placeholderTextColor={Colores.textoSuave} textAlignVertical="top" />
            <View style={estilos.fila}>
              <Pressable style={[estilos.botonModal, { backgroundColor: '#F1EBFB' }]} onPress={cerrarModal} disabled={m.procesando}><Text style={[estilos.textoBoton, { color: Colores.primarioOscuro }]}>Cancelar</Text></Pressable>
              <Pressable style={[estilos.botonModal, { backgroundColor: '#B3261E' }]} onPress={() => m.confirmarSuspension(motivo)} disabled={m.procesando}>
                {m.procesando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>Suspender</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  barra: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  filaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aviso: { backgroundColor: '#FDE4E4', borderRadius: 12, padding: 10, gap: 2 },
  textoAviso: { fontSize: 13.5, fontWeight: '800', color: '#B3261E' },
  chip: { paddingHorizontal: 14, height: 38, borderRadius: 19, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  textoChip: { fontSize: 14, fontWeight: '700', color: Colores.primarioOscuro },
  buscador: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF', paddingHorizontal: 14 },
  entradaBusqueda: { flex: 1, fontSize: 15, color: Colores.texto, paddingVertical: 0 },
  lista: { padding: 16, gap: 12, paddingBottom: 40 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', marginTop: 30, lineHeight: 21 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, gap: 10, shadowColor: '#4B1D8F', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  fila: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  imagen: { width: 72, height: 72, borderRadius: 14 },
  titulo: { fontSize: 16, fontWeight: '800', color: Colores.texto },
  detalle: { fontSize: 13, color: Colores.textoSuave, lineHeight: 18 },
  motivo: { fontSize: 13, color: '#B3261E' },
  accion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 14 },
  textoAccion: { fontSize: 15, fontWeight: '800' },
  fondoModal: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, gap: 12 },
  tituloModal: { fontSize: 19, fontWeight: '800', color: Colores.primarioOscuro },
  entrada: { minHeight: 100, borderWidth: 1, borderColor: Colores.borde, borderRadius: 14, padding: 12, fontSize: 15, color: Colores.texto },
  botonModal: { flex: 1, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
