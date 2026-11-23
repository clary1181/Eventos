import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { formatearMoneda, formatearNumero, type Evento } from '@/features/eventos';
import { Colores, Fuentes } from '@/compartido/tema';
import type { CalificacionResumen, EntradaResumen, Periodo } from '../tipos';
import { calcularResumen, NOMBRE_PERIODO, porcentaje, rendimientoPorEvento, serieVentas } from '../utilidades/calculos';
import { DistribucionEstrellas } from './DistribucionEstrellas';
import { FilaRendimientoEvento } from './FilaRendimientoEvento';
import { GraficaVentas } from './GraficaVentas';
import { ListaCalificaciones } from './ListaCalificaciones';
import { SelectorPeriodo } from './SelectorPeriodo';
import { TarjetaKpi } from './TarjetaKpi';

interface Propiedades {
  eventos: Evento[];
  entradas: EntradaResumen[];
  calificaciones: CalificacionResumen[];
  cargando: boolean;
  error?: string | null;
  alAbrirEvento: (e: Evento) => void;
}

export function PanelEstadisticas({ eventos, entradas, calificaciones, cargando, error, alAbrirEvento }: Propiedades) {
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const ahora = Date.now();
  const resumen = useMemo(() => calcularResumen(eventos, entradas, calificaciones, periodo), [eventos, entradas, calificaciones, periodo]);
  const serie = useMemo(() => serieVentas(entradas, periodo, ahora), [entradas, periodo]); // eslint-disable-line react-hooks/exhaustive-deps
  const rendimiento = useMemo(() => rendimientoPorEvento(eventos, entradas), [eventos, entradas]);

  if (cargando) return <View style={estilos.centro}><ActivityIndicator color={Colores.primario} /></View>;

  return (
    <View style={estilos.raiz}>
      {!!error && <Text style={estilos.error}>{error}</Text>}
      <SelectorPeriodo periodo={periodo} alCambiar={setPeriodo} />
      <Text style={estilos.periodo}>{NOMBRE_PERIODO[periodo]}</Text>

      <View style={estilos.rejilla}>
        <TarjetaKpi icono="cash-multiple" tono="verde" valor={formatearMoneda(resumen.ingresos)} etiqueta="Ingresos (simulados)" nota="Suma del precio de las entradas vendidas" />
        <TarjetaKpi icono="ticket-confirmation-outline" tono="morado" valor={formatearNumero(resumen.entradas)} etiqueta="Entradas vendidas" nota="En el periodo elegido" />
        <TarjetaKpi icono="qrcode-scan" tono="azul" valor={porcentaje(resumen.asistencia)} etiqueta="Asistencia" nota="Entradas validadas en eventos ya terminados" />
        <TarjetaKpi icono="chart-donut" tono="naranja" valor={porcentaje(resumen.ocupacion)} etiqueta="Ocupación" nota="Entradas vendidas sobre la capacidad publicada" />
        <TarjetaKpi icono="calendar-check-outline" tono="morado" valor={formatearNumero(resumen.activos)} etiqueta="Eventos activos" nota="Publicados que aún no terminan" />
        <TarjetaKpi icono="star-outline" tono="naranja" valor={resumen.promedio === null ? '—' : resumen.promedio.toFixed(1)} etiqueta="Calificación" nota={`${resumen.totalCalificaciones} ${resumen.totalCalificaciones === 1 ? 'reseña' : 'reseñas'}`} />
      </View>

      <GraficaVentas puntos={serie} titulo={periodo === 'todo' ? 'Ventas por mes' : 'Ventas por día'} />

      <View style={{ gap: 10 }}>
        <Text style={estilos.seccion}>Rendimiento por evento</Text>
        {rendimiento.length === 0 ? (
          <Text style={estilos.vacio}>Cuando publiques eventos verás aquí cuánto vende cada uno.</Text>
        ) : (
          rendimiento.map((r) => <FilaRendimientoEvento key={r.evento.id} item={r} alPulsar={() => alAbrirEvento(r.evento)} />)
        )}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={estilos.seccion}>Calificaciones</Text>
        <DistribucionEstrellas calificaciones={calificaciones} />
        {calificaciones.length > 0 && <ListaCalificaciones calificaciones={calificaciones} limite={3} />}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { gap: 18 },
  centro: { padding: 40, alignItems: 'center' },
  error: { fontSize: 13, color: Colores.error, backgroundColor: Colores.errorFondo, padding: 10, borderRadius: 12 },
  periodo: { fontSize: 13, color: Colores.textoSuave, marginTop: -8 },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  seccion: { fontSize: 20, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  vacio: { fontSize: 14, color: Colores.textoSuave },
});
