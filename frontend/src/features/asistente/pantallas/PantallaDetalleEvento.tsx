import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { BarraCompra } from '../componentes/BarraCompra';
import { CabeceraDetalle } from '../componentes/CabeceraDetalle';
import { DatosPrincipalesEvento } from '../componentes/DatosPrincipalesEvento';
import { MetricasEvento } from '../componentes/MetricasEvento';
import { ModalCalificar } from '../componentes/ModalCalificar';
import { ModalCompra } from '../componentes/ModalCompra';
import { ModalReportar } from '../componentes/ModalReportar';
import { SeccionCalificaciones } from '../componentes/SeccionCalificaciones';
import { TarjetaOrganizadorDetalle } from '../componentes/TarjetaOrganizadorDetalle';
import { TarjetaUbicacion } from '../componentes/TarjetaUbicacion';
import { useAccionesEvento } from '../hooks/useAccionesEvento';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useCalificaciones } from '../hooks/useCalificaciones';
import { useEntradasDelEvento } from '../hooks/useEntradasDelEvento';
import { useEventoPublico } from '../hooks/useEventoPublico';
import { useFavoritos } from '../hooks/useFavoritos';
import { useOrganizadorPublico } from '../hooks/useOrganizadorPublico';
import { useReporteEvento } from '../hooks/useReporteEvento';
import { MAX_ENTRADAS_POR_EVENTO } from '../tipos';
import { formatearFechaHora, formatearPrecio } from '../utilidades/formato';
import { estilos } from './PantallaDetalleEvento.estilos';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

export function PantallaDetalleEvento() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { perfil } = useSesion();
  const { evento, cargando } = useEventoPublico(id);
  const organizador = useOrganizadorPublico(evento?.organizadorId);
  const favoritos = useFavoritos(perfil?.uid);
  const misEntradas = useEntradasDelEvento(perfil?.uid, id);
  const [comprando, setComprando] = useState(false);
  const [calificando, setCalificando] = useState(false);
  const [reportando, setReportando] = useState(false);
  const cal = useCalificaciones(id, perfil?.uid);
  const yaReporto = useReporteEvento(perfil?.uid, id);
  const acciones = useAccionesEvento(evento, perfil?.uid, perfil?.nombre);

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/explorar' as Href));

  if (cargando) {
    return (
      <View style={estilos.centro}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Colores.primario} />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={estilos.centro}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="calendar-outline" size={52} color={Colores.acento} />
        <Text style={estilos.mensaje}>Este evento ya no está disponible.</Text>
        <Pressable style={estilos.botonVolver} onPress={volver}>
          <Ionicons name="chevron-back" size={18} color={Colores.primario} />
          <Text style={estilos.textoVolver}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const disponibles = Math.max(0, evento.capacidad - evento.vendidas);
  const finalizado = evento.fechaFin.getTime() <= Date.now();
  const maxCompra = Math.max(0, Math.min(MAX_ENTRADAS_POR_EVENTO - misEntradas, disponibles));
  const puedeComprar = !finalizado && maxCompra > 0;

  const textoBoton = finalizado
    ? 'Evento finalizado'
    : disponibles === 0
      ? 'Cupo agotado'
      : maxCompra === 0
        ? 'Alcanzaste el límite de entradas'
        : evento.precio > 0
          ? 'Comprar entrada'
          : 'Obtener entrada gratis';
  const aviso = puedeComprar && disponibles <= 20 ? `¡Quedan solo ${disponibles} entradas!` : undefined;

  const compartir = () =>
    Share.share({
      message: `${evento.titulo}\n${formatearFechaHora(evento.fechaInicio)}\n${evento.lugar}, Ensenada · ${formatearPrecio(evento.precio)}\nEncuéntralo en MR-Eventos.`,
    }).catch(() => mostrarAviso({ titulo: 'No se pudo compartir', mensaje: 'Inténtalo de nuevo.', tipo: 'error' }));

  return (
    <View style={estilos.raiz}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 + bottom }}>
        <CabeceraDetalle
          imagenUrl={evento.imagenUrl}
          esFavorito={favoritos.ids.has(evento.id)}
          alVolver={volver}
          alFavorito={() => favoritos.alternar(evento.id)}
          alCompartir={compartir}
        />

        <View style={estilos.hoja}>
          <Text style={estilos.titulo}>{evento.titulo}</Text>
          <DatosPrincipalesEvento evento={evento} />
          <TarjetaOrganizadorDetalle nombreRespaldo={evento.organizadorNombre} organizador={organizador} alPulsar={() => router.push(`/asistente/organizador/${evento.organizadorId}` as Href)} />
          <MetricasEvento evento={evento} />

          <Text style={estilos.seccion}>Descripción</Text>
          <Text style={estilos.descripcion}>{evento.descripcion || 'Sin descripción.'}</Text>

          <Text style={estilos.seccion}>Ubicación</Text>
          <TarjetaUbicacion evento={evento} />

          <SeccionCalificaciones
            lista={cal.lista}
            total={cal.total}
            promedio={cal.promedio}
            mia={cal.mia}
            puedeCalificar={finalizado && misEntradas > 0 && !cal.mia}
            alCalificar={() => setCalificando(true)}
          />

          {yaReporto ? (
            <Text style={estilos.yaReportaste}>Ya reportaste este evento. Gracias por avisar.</Text>
          ) : (
            <Pressable style={estilos.reportar} onPress={() => setReportando(true)} accessibilityRole="button">
              <Ionicons name="flag-outline" size={18} color={Colores.textoSuave} />
              <Text style={estilos.textoReportar}>Reportar evento</Text>
            </Pressable>
          )}

          {misEntradas > 0 && (
            <Text style={estilos.yaTienes} onPress={() => router.push('/asistente/entradas' as Href)}>
              Ya tienes {misEntradas} {misEntradas === 1 ? 'entrada' : 'entradas'} para este evento · Ver mis entradas
            </Text>
          )}
        </View>
      </ScrollView>

      <BarraCompra texto={textoBoton} aviso={aviso} habilitado={puedeComprar} alPulsar={() => setComprando(true)} />

      <ModalCalificar visible={calificando} eventoTitulo={evento.titulo} enviando={acciones.enviando} alCerrar={() => setCalificando(false)} alEnviar={acciones.calificar} />
      <ModalReportar visible={reportando} eventoTitulo={evento.titulo} enviando={acciones.enviando} alCerrar={() => setReportando(false)} alEnviar={acciones.reportar} />

      <ModalCompra
        visible={comprando}
        evento={evento}
        maxCompra={maxCompra}
        alCerrar={() => setComprando(false)}
        alVerEntradas={() => { setComprando(false); router.replace('/asistente/entradas' as Href); }}
      />
    </View>
  );
}
