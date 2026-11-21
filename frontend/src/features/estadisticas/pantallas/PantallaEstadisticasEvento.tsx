import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EncabezadoPantalla } from '@/compartido/componentes/EncabezadoPantalla';
import { Colores, Fuentes } from '@/compartido/tema';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { formatearFechaHora, formatearMoneda, formatearNumero, InsigniaEstadoEvento, useEventosOrganizador } from '@/features/eventos';
import { BarraProgreso } from '../componentes/BarraProgreso';
import { DistribucionEstrellas } from '../componentes/DistribucionEstrellas';
import { GraficaVentas } from '../componentes/GraficaVentas';
import { ListaCalificaciones } from '../componentes/ListaCalificaciones';
import { TarjetaKpi } from '../componentes/TarjetaKpi';
import { useDatosOrganizador } from '../hooks/useDatosOrganizador';
import { porcentaje, serieEvento } from '../utilidades/calculos';

export function PantallaEstadisticasEvento() {
  useBarraEstado('light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { perfil } = useSesion();
  const { eventos, cargando } = useEventosOrganizador(perfil?.uid);
  const datos = useDatosOrganizador(perfil?.uid);
  const evento = eventos.find((e) => e.id === id);
  const entradas = useMemo(() => datos.entradas.filter((e) => e.eventoId === id), [datos.entradas, id]);
  const calificaciones = useMemo(() => datos.calificaciones.filter((c) => c.eventoId === id), [datos.calificaciones, id]);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/organizador/estadisticas' as Href));

  if (cargando || datos.cargando) return <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>;
  if (!evento) {
    return (
      <View style={estilos.raiz}>
        <EncabezadoPantalla titulo="Evento no encontrado" alVolver={volver} />
        <Text style={[estilos.nota, { padding: 24 }]}>Es posible que se haya eliminado.</Text>
      </View>
    );
  }

  const ahora = Date.now();
  const vendidas = Math.max(evento.vendidas, entradas.length);
  const ingresos = entradas.reduce((a, e) => a + e.precio, 0);
  const validadas = entradas.filter((e) => e.usada).length;
  const ocupacion = evento.capacidad > 0 ? vendidas / evento.capacidad : 0;
  const terminado = evento.fechaFin.getTime() < ahora;
  const iniciado = evento.fechaInicio.getTime() <= ahora;

  return (
    <View style={estilos.raiz}>
      <EncabezadoPantalla titulo={evento.titulo} subtitulo={formatearFechaHora(evento.fechaInicio)} alVolver={volver} />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <View style={estilos.estado}><InsigniaEstadoEvento estado={evento.estado} /></View>

        <View style={estilos.tarjeta}>
          <View style={estilos.filaOcupacion}>
            <Text style={estilos.tituloTarjeta}>Entradas vendidas</Text>
            <Text style={estilos.cifra}>{formatearNumero(vendidas)} <Text style={estilos.deTotal}>de {formatearNumero(evento.capacidad)}</Text></Text>
          </View>
          <BarraProgreso valor={ocupacion} color={ocupacion >= 1 ? Colores.exitoTexto : Colores.primario} alto={12} />
          <Text style={estilos.nota}>{ocupacion >= 1 ? 'Agotado' : `${Math.round(ocupacion * 100)}% de ocupación · quedan ${formatearNumero(Math.max(0, evento.capacidad - vendidas))} lugares`}</Text>
        </View>

        <View style={estilos.rejilla}>
          <TarjetaKpi icono="cash-multiple" tono="verde" valor={formatearMoneda(ingresos)} etiqueta="Ingresos (simulados)" nota={evento.precio > 0 ? `Precio: ${formatearMoneda(evento.precio)}` : 'Evento gratuito'} />
          <TarjetaKpi
            icono="qrcode-scan" tono="azul"
            valor={iniciado ? formatearNumero(validadas) : '—'}
            etiqueta="Entradas validadas"
            nota={iniciado ? `${porcentaje(vendidas ? validadas / vendidas : null)} de las vendidas` : 'Se validan con QR el día del evento'}
          />
        </View>

        <GraficaVentas puntos={serieEvento(entradas, ahora)} titulo="Ventas por día" />

        <View style={{ gap: 10 }}>
          <Text style={estilos.seccion}>Calificaciones</Text>
          {!terminado ? (
            <View style={estilos.aviso}>
              <Ionicons name="time-outline" size={22} color={Colores.primario} />
              <Text style={estilos.textoAviso}>Los asistentes podrán calificar cuando el evento termine.</Text>
            </View>
          ) : (
            <>
              <DistribucionEstrellas calificaciones={calificaciones} />
              {calificaciones.length > 0 && <ListaCalificaciones calificaciones={calificaciones} mostrarEvento={false} />}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCFAFF' },
  contenido: { padding: 20, paddingBottom: 40, gap: 18 },
  estado: { flexDirection: 'row' },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, gap: 10, borderWidth: 1, borderColor: '#ECE6F7' },
  filaOcupacion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tituloTarjeta: { fontSize: 15, fontFamily: Fuentes.seminegrita, color: Colores.textoSuave },
  cifra: { fontSize: 26, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  deTotal: { fontSize: 15, color: Colores.textoSuave, fontFamily: Fuentes.seminegrita },
  nota: { fontSize: 13, color: Colores.textoSuave },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  seccion: { fontSize: 20, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colores.tonoMorado, borderRadius: 16, padding: 14 },
  textoAviso: { flex: 1, fontSize: 14, color: Colores.primarioOscuro },
});
