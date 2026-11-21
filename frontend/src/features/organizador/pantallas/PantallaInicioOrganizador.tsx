import React from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, BotonIcono, FondoHero } from '@/compartido/componentes';
import { avisarProximamente } from '@/compartido/utilidades/proximamente';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { AccesoRapido } from '../componentes/AccesoRapido';
import { BannerVerificacion } from '../componentes/BannerVerificacion';
import { ListaEventosOrganizador } from '../componentes/ListaEventosOrganizador';
import { TarjetaMetrica } from '../componentes/TarjetaMetrica';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';
import { useAccionCrearEvento } from '../hooks/useAccionCrearEvento';
import { useResumenOrganizador } from '../hooks/useResumenOrganizador';
import { estilos } from './PantallaInicioOrganizador.estilos';
import { useEstadoVerificacion } from '../hooks/useEstadoVerificacion';
import { useGestionEvento } from '@/features/gestion-evento';
import { formatearMoneda, formatearNumero, useEventosOrganizador, type Evento } from '@/features/eventos';

export function PantallaInicioOrganizador() {
  useBarraEstado('light');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil } = usePerfilOrganizador();
  const { eventos, cargando, error } = useEventosOrganizador(perfil?.uid);
  const resumen = useResumenOrganizador(eventos);
  const crear = useAccionCrearEvento();
  const gestion = useGestionEvento();
  const estadoVerificacion = useEstadoVerificacion(perfil?.uid, perfil?.estadoVerificacion);
  

  if (!perfil) return null;
  const ir = (ruta: string) => router.push(ruta as Href);
  const editar = (evento: Evento) => {
    if (evento.estado !== 'pendiente_aprobacion' && evento.estado !== 'requiere_correccion' && evento.estado !== 'aprobado') {
      avisarProximamente('La edición de eventos rechazados o suspendidos');
      return;
    }
    ir(`/organizador/editar-evento?id=${evento.id}`);
  };
  const alto = Math.round(width * 0.62) + top;

  return (
    <ScrollView style={estilos.raiz} contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca
            derecha={
              <>
                <BotonIcono icono="notifications-outline" etiqueta="Notificaciones" onPress={() => avisarProximamente('Las notificaciones')} />
                <BotonIcono icono="person-circle-outline" etiqueta="Mi perfil" onPress={() => ir('/organizador/perfil')} />
              </>
            }
          />
          <Text style={estilos.saludo} numberOfLines={1}>Hola, {perfil.nombre} 👋</Text>
          <Text style={estilos.subtitulo}>Gestiona tus eventos, entradas y reportes desde un solo lugar.</Text>
        </View>
      </FondoHero>

      <View style={estilos.hoja}>
        {estadoVerificacion !== 'aprobada' && (
          <BannerVerificacion elevado estado={estadoVerificacion as typeof perfil.estadoVerificacion} alPresionar={() => ir('/organizador/verificacion')} />
        )}

        <View style={estilos.accesos}>
          <AccesoRapido icono="plus-box-outline" titulo="Crear evento" alPresionar={crear} />
          <AccesoRapido icono="calendar-blank-outline" titulo="Mis eventos" alPresionar={() => ir('/organizador/mis-eventos')} />
          <AccesoRapido icono="qrcode-scan" titulo="Validar QR" alPresionar={() => ir('/organizador/validar-qr')} />
          <AccesoRapido icono="message-alert-outline" titulo="Reportes" alPresionar={() => ir('/organizador/reportes')} />
        </View>

        <View>
          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>Resumen general</Text>
            <View style={estilos.periodo}><Text style={estilos.textoPeriodo}>Acumulado</Text></View>
          </View>
          <View style={estilos.metricas}>
            <TarjetaMetrica icono="ticket-confirmation-outline" valor={formatearNumero(resumen.entradasVendidas)} etiqueta="Entradas vendidas" tono="morado" />
            <TarjetaMetrica icono="cash-multiple" valor={formatearMoneda(resumen.ingresos)} etiqueta="Ingresos (simulados)" tono="verde" />
            <TarjetaMetrica icono="account-group-outline" valor={formatearNumero(resumen.activos)} etiqueta="Eventos activos" tono="naranja" />
          </View>
        </View>

        <View>
          <View style={estilos.encabezadoSeccion}>
            <Text style={estilos.tituloSeccion}>Mis eventos</Text>
            <Pressable onPress={() => ir('/organizador/mis-eventos')} hitSlop={8}>
              <Text style={estilos.verTodos}>Ver todos ›</Text>
            </Pressable>
          </View>
          <ListaEventosOrganizador
            eventos={eventos}
            cargando={cargando}
            error={error}
            limite={3}
            compacta
            alCrear={crear}
            acciones={(evento) => (
              <>
                <BotonIcono tono="claro" tamano={30} icono="stats-chart" etiqueta="Estadísticas del evento" onPress={() => gestion.verEstadisticas(evento)} />
                <BotonIcono tono="claro" tamano={30} icono="pencil-outline" etiqueta="Editar evento" onPress={() => editar(evento)} />
                <BotonIcono tono="claro" tamano={30} icono="ellipsis-horizontal" etiqueta="Más opciones" onPress={() => gestion.abrirMenu(evento)} />
              </>
            )}
          />
        </View>
      </View>
      {gestion.hoja}
    </ScrollView>
  );
}