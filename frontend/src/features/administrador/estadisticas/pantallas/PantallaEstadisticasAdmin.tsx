import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colores } from '@/compartido/tema';
import { formatearMoneda, formatearNumero } from '@/features/eventos';
import { GraficaVentas, NOMBRE_PERIODO, porcentaje, serieVentas, TarjetaKpi, type Periodo } from '@/features/estadisticas';
import { BarrasDistribucion } from '../../componentes/BarrasDistribucion';
import { EncabezadoSeccionAdmin } from '../../componentes/EncabezadoSeccionAdmin';
import { SelectorPeriodoAdmin } from '../../componentes/SelectorPeriodoAdmin';
import { TarjetaRanking } from '../../componentes/TarjetaRanking';
import { useBarraClara } from '../../hooks/useBarraClara';
import { useResumenAdministrador } from '../../hooks/useResumenAdministrador';

const n = (v: number | null) => (v === null ? '—' : formatearNumero(v));

export function PantallaEstadisticasAdmin() {
  useBarraClara();
  const [periodo, setPeriodo] = useState<Periodo>('todo');
  const { estadisticas: e, actualizando, recargar } = useResumenAdministrador(periodo);

  return (
    <View style={estilos.raiz}>
      <EncabezadoSeccionAdmin titulo="Estadísticas" subtitulo="Actividad de la plataforma: usuarios, eventos, ventas y moderación." />
      <ScrollView
        contentContainerStyle={estilos.contenido}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={actualizando && !!e} onRefresh={recargar} colors={[Colores.primario]} />}
      >
        <View style={estilos.filaTitulo}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.titulo}>Resumen</Text>
            <Text style={estilos.periodo}>{NOMBRE_PERIODO[periodo]}</Text>
          </View>
          <SelectorPeriodoAdmin periodo={periodo} alCambiar={setPeriodo} />
        </View>

        {!e ? (
          <View style={{ padding: 40 }}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : (
          <>
            <View style={estilos.rejilla}>
              <TarjetaKpi icono="account-plus-outline" tono="morado" valor={n(e.usuariosNuevos)} etiqueta="Usuarios nuevos" nota="Cuentas creadas en el periodo" />
              <TarjetaKpi icono="account-check-outline" tono="verde" valor={n(e.organizadoresVerificados)} etiqueta="Organizadores verificados" nota="Total en la plataforma" />
              <TarjetaKpi icono="calendar-plus" tono="azul" valor={n(e.eventosCreados)} etiqueta="Eventos creados" nota="Propuestos por organizadores" />
              <TarjetaKpi icono="calendar-check-outline" tono="verde" valor={n(e.eventosPublicados)} etiqueta="Eventos publicados" nota="Creados en el periodo y aprobados" />
              <TarjetaKpi icono="ticket-confirmation-outline" tono="morado" valor={n(e.entradas)} etiqueta="Entradas vendidas" nota="Compras simuladas" />
              <TarjetaKpi icono="cash-multiple" tono="verde" valor={e.ingresos === null ? '—' : formatearMoneda(e.ingresos)} etiqueta="Ingresos (simulados)" nota="Suma de precios de entradas" />
              <TarjetaKpi icono="qrcode-scan" tono="azul" valor={porcentaje(e.asistencia)} etiqueta="Asistencia" nota="Entradas validadas en eventos ya terminados" />
              <TarjetaKpi icono="flag-outline" tono="naranja" valor={n(e.reportes)} etiqueta="Reportes recibidos" nota="Denuncias de la comunidad" />
            </View>

            <GraficaVentas puntos={serieVentas(e.serieEntradas, periodo, Date.now())} titulo={periodo === 'todo' ? 'Entradas por mes' : 'Entradas por día'} />

            <BarrasDistribucion titulo="Eventos por estado" items={e.porEstado} />
            <BarrasDistribucion titulo="Eventos por categoría" items={e.porCategoria} />
            <BarrasDistribucion titulo="Usuarios nuevos por rol" items={e.porRol} />
            <BarrasDistribucion titulo="Reportes por estado" items={e.reportesPorEstado} vacio="No hubo reportes en este periodo." />
            <TarjetaRanking titulo="Eventos más vendidos" items={e.topEventos} />
            <TarjetaRanking titulo="Organizadores con más ventas" items={e.topOrganizadores} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FCFAFF' },
  contenido: { padding: 16, paddingBottom: 32, gap: 16 },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titulo: { fontSize: 20, fontWeight: '800', color: Colores.texto, letterSpacing: -0.3 },
  periodo: { fontSize: 13, color: Colores.textoSuave },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
