import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { Colores, Fuentes } from '@/compartido/tema';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { formatearFechaHora, formatearMoneda, formatearNumero, useEventosOrganizador } from '@/features/eventos';
import { useEntradasVendidas, type Comprador } from '../hooks/useEntradasVendidas';

type Filtro = 'todas' | 'pendientes' | 'validadas';
const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const hora = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

const Chip = ({ texto, activo, alPulsar }: { texto: string; activo: boolean; alPulsar: () => void }) => (
  <Pressable onPress={alPulsar} style={[estilos.chip, activo && estilos.chipActivo]} accessibilityRole="button">
    <Text style={[estilos.textoChip, activo && { color: '#FFFFFF' }]}>{texto}</Text>
  </Pressable>
);

function TarjetaComprador({ c }: { c: Comprador }) {
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.filaTarjeta}>
        <View style={estilos.avatar}><Text style={estilos.inicial}>{c.nombre.charAt(0).toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={estilos.nombre} numberOfLines={1}>{c.nombre}</Text>
          <Text style={estilos.detalle} numberOfLines={1}>
            {c.usuario ? `@${c.usuario} · ` : ''}{c.entradas.length} {c.entradas.length === 1 ? 'entrada' : 'entradas'} · {c.total > 0 ? formatearMoneda(c.total) : 'Gratis'}
          </Text>
        </View>
      </View>
      <Text style={estilos.detalle}>Compró el {hora(c.ultimaCompra)}</Text>
      <View style={{ gap: 6 }}>
        {c.entradas.map((e) => (
          <View key={e.id} style={estilos.filaEntrada}>
            <Ionicons name="ticket-outline" size={18} color={Colores.primario} />
            <Text style={estilos.textoEntrada}>Entrada {e.numero}</Text>
            <View style={[estilos.estado, { backgroundColor: e.usada ? '#E4F4E7' : '#FDF1DC' }]}>
              <Text style={[estilos.textoEstado, { color: e.usada ? '#1B7F3B' : '#B4530A' }]}>
                {e.usada ? `Validada${e.usadaEn ? ` · ${hora(e.usadaEn)}` : ''}` : 'Sin validar'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PantallaEntradasVendidas() {
  useBarraEstado('light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { perfil } = useSesion();
  const { eventos } = useEventosOrganizador(perfil?.uid);
  const d = useEntradasVendidas(perfil?.uid, id);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const evento = eventos.find((e) => e.id === id);
  const volver = () => (router.canGoBack() ? router.back() : router.replace(`/organizador/estadisticas-evento?id=${id}` as Href));

  const lista = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return d.compradores
      .filter((c) => filtro === 'todas' || (filtro === 'validadas' ? c.usadas > 0 : c.usadas < c.entradas.length))
      .filter((c) => texto === '' || normalizar(`${c.nombre} ${c.usuario}`).includes(texto));
  }, [d.compradores, busqueda, filtro]);

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla titulo="Entradas vendidas" subtitulo={evento ? `${evento.titulo} · ${formatearFechaHora(evento.fechaInicio)}` : undefined} alVolver={volver} />

      {d.cargando ? (
        <ActivityIndicator size="large" color={Colores.primario} style={{ marginTop: 40 }} />
      ) : d.error ? (
        <Text style={estilos.vacio}>{d.error}</Text>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(c) => c.asistenteId}
          contentContainerStyle={estilos.contenido}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={{ gap: 12 }}>
              <View style={estilos.resumen}>
                <View style={estilos.dato}><Text style={estilos.cifra}>{formatearNumero(d.totalEntradas)}</Text><Text style={estilos.etiqueta}>Vendidas</Text></View>
                <View style={estilos.separador} />
                <View style={estilos.dato}><Text style={estilos.cifra}>{formatearNumero(d.validadas)}</Text><Text style={estilos.etiqueta}>Validadas</Text></View>
                <View style={estilos.separador} />
                <View style={estilos.dato}><Text style={estilos.cifra}>{formatearNumero(d.totalEntradas - d.validadas)}</Text><Text style={estilos.etiqueta}>Sin validar</Text></View>
                <View style={estilos.separador} />
                <View style={estilos.dato}><Text style={estilos.cifra}>{formatearMoneda(d.ingresos)}</Text><Text style={estilos.etiqueta}>Ingresos</Text></View>
              </View>
              <View style={estilos.buscador}>
                <Ionicons name="search-outline" size={20} color={Colores.textoSuave} />
                <TextInput style={estilos.entradaBusqueda} value={busqueda} onChangeText={setBusqueda} placeholder="Buscar comprador" placeholderTextColor={Colores.textoSuave} maxLength={80} />
              </View>
              <View style={estilos.chips}>
                <Chip texto="Todas" activo={filtro === 'todas'} alPulsar={() => setFiltro('todas')} />
                <Chip texto="Sin validar" activo={filtro === 'pendientes'} alPulsar={() => setFiltro('pendientes')} />
                <Chip texto="Validadas" activo={filtro === 'validadas'} alPulsar={() => setFiltro('validadas')} />
              </View>
              <Text style={estilos.contador}>{lista.length} {lista.length === 1 ? 'comprador' : 'compradores'}</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={estilos.centro}>
              <Ionicons name="ticket-outline" size={48} color={Colores.acento} />
              <Text style={estilos.vacio}>{d.totalEntradas === 0 ? 'Todavía no se han vendido entradas para este evento.' : 'Ningún comprador coincide con la búsqueda.'}</Text>
            </View>
          }
          renderItem={({ item }) => <TarjetaComprador c={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  contenido: { padding: 16, paddingBottom: 40 },
  centro: { alignItems: 'center', gap: 10, padding: 30 },
  vacio: { fontSize: 15, color: Colores.textoSuave, textAlign: 'center', lineHeight: 21 },
  resumen: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 14, borderWidth: 1, borderColor: '#ECE6F7' },
  dato: { flex: 1, alignItems: 'center', gap: 2 },
  separador: { width: 1, backgroundColor: '#ECE6F7' },
  cifra: { fontSize: 16, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  etiqueta: { fontSize: 11.5, color: Colores.textoSuave },
  buscador: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 16, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF', paddingHorizontal: 14 },
  entradaBusqueda: { flex: 1, fontSize: 15, color: Colores.texto, paddingVertical: 0 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: 18, borderWidth: 1, borderColor: Colores.borde, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  chipActivo: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  textoChip: { fontSize: 13.5, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
  contador: { fontSize: 13, color: Colores.textoSuave, marginBottom: 4 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, gap: 10, borderWidth: 1, borderColor: '#ECE6F7' },
  filaTarjeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E4D7F8', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 19, fontFamily: Fuentes.negrita, color: Colores.primario },
  nombre: { fontSize: 16, fontFamily: Fuentes.negrita, color: Colores.texto },
  detalle: { fontSize: 13, color: Colores.textoSuave },
  filaEntrada: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoEntrada: { fontSize: 14, fontFamily: Fuentes.seminegrita, color: Colores.texto, flex: 1 },
  estado: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  textoEstado: { fontSize: 12, fontFamily: Fuentes.seminegrita },
});
