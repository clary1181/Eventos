import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BarraMarca, BotonIcono, FondoHero } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import type { Periodo } from '@/features/estadisticas';
import { SelectorPeriodoAdmin } from '../componentes/SelectorPeriodoAdmin';
import { TarjetaResumen } from '../componentes/TarjetaResumen';
import { AccesoRapidoAdmin } from '../componentes/AccesoRapidoAdmin';
import { FilaTarea } from '../componentes/FilaTarea';
import { useResumenAdministrador } from '../hooks/useResumenAdministrador';
import { useBarraClara } from '../hooks/useBarraClara';
import type { Conteo } from '../tipos';
import { estilos } from './PantallaInicioAdministrador.estilos';
import { CampanaAvisos } from '@/features/notificaciones';

const MORADO = Colores.primario;

// "5 organizadores por verificar" / "1 organizador por verificar" / sin dato
const textoTarea = (n: Conteo, singular: string, plural: string, sufijo: string) =>
  n === null ? `${plural} ${sufijo}` : `${n} ${n === 1 ? singular : plural} ${sufijo}`;

export function PantallaInicioAdministrador() {
  useBarraClara();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const [periodo, setPeriodo] = useState<Periodo>('todo');
  const { resumen, actualizando, recargar } = useResumenAdministrador(periodo);

  const p = resumen?.plataforma;
  const t = resumen?.tareas;
  const alto = Math.round(width * 0.62) + top;

  return (
    <View style={estilos.raiz}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={actualizando && !!resumen} onRefresh={recargar} tintColor="#FFFFFF" colors={[MORADO]} />
        }
      >
        <FondoHero alto={alto}>
          <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
            <BarraMarca
              derecha={
                <>
                  <CampanaAvisos />
                  <BotonIcono icono="settings-outline" etiqueta="Configuración" onPress={() => router.push('/administrador/configuracion' as Href)} />
                </>
              }
            />
            <Text style={estilos.saludo} numberOfLines={1}>Hola, {perfil?.nombre ?? 'administrador'} 👋</Text>
            <Text style={estilos.subtitulo}>Supervisa la plataforma, verifica organizadores y revisa eventos.</Text>
          </View>
        </FondoHero>

        <View style={estilos.hoja}>
          <View style={estilos.filaTitulo}>
            <Text style={estilos.titulo}>Resumen de la plataforma</Text>
            <SelectorPeriodoAdmin periodo={periodo} alCambiar={setPeriodo} />
          </View>

          <View style={estilos.fila}>
            <TarjetaResumen fondo="#EFE8FB" valor={p?.usuarios ?? null} etiqueta={'Usuarios\nregistrados'}
              icono={<Ionicons name="people-outline" size={36} color={MORADO} />} />
            <TarjetaResumen fondo="#E3F0FC" valor={p?.eventosTotales ?? null} etiqueta={'Eventos\ntotales'}
              icono={<Ionicons name="calendar-outline" size={36} color={MORADO} />} />
            <TarjetaResumen fondo="#E4F4E7" valor={p?.eventosVerificados ?? null} etiqueta={'Eventos\nverificados'}
              icono={<MaterialCommunityIcons name="check-decagram-outline" size={36} color="#1B7F3B" />} />
            <TarjetaResumen fondo="#FDE8DC" valor={p?.entradas ?? null} etiqueta={'Entradas\nsimuladas'}
              icono={<MaterialCommunityIcons name="ticket-confirmation-outline" size={36} color={MORADO} />} />
          </View>

          <Text style={[estilos.titulo, estilos.seccion]}>Acciones rápidas</Text>
          <View style={estilos.fila}>
            <AccesoRapidoAdmin etiqueta={'Verificar\norganizadores'}
              icono={<MaterialCommunityIcons name="account-check-outline" size={34} color={MORADO} />}
              alPulsar={() => router.push('/administrador/organizadores')} />
            <AccesoRapidoAdmin etiqueta={'Revisar\neventos'}
              icono={<MaterialCommunityIcons name="calendar-check-outline" size={34} color={MORADO} />}
              alPulsar={() => router.push('/administrador/eventos')} />
            <AccesoRapidoAdmin etiqueta="Reportes"
              icono={<Ionicons name="flag-outline" size={34} color={MORADO} />}
              alPulsar={() => router.push('/administrador/reportes')} />
            <AccesoRapidoAdmin etiqueta={'Moderar\ncontenido'}
              icono={<MaterialCommunityIcons name="gavel" size={34} color={MORADO} />}
              alPulsar={() => router.push('/administrador/moderacion' as Href)} />
          </View>

          <Text style={[estilos.titulo, estilos.seccion]}>Tareas pendientes</Text>
          <View style={estilos.lista}>
            <FilaTarea acento={MORADO} icono={<Ionicons name="person-outline" size={32} color={MORADO} />}
              titulo={textoTarea(t?.organizadoresPorVerificar ?? null, 'organizador', 'organizadores', 'por verificar')}
              descripcion="Solicitudes de verificación pendientes."
              alPulsar={() => router.push('/administrador/organizadores')} />
            <FilaTarea acento="#3DBE6B" icono={<Ionicons name="calendar-outline" size={32} color={MORADO} />}
              titulo={textoTarea(t?.eventosPorRevisar ?? null, 'evento', 'eventos', 'por revisar')}
              descripcion="Eventos nuevos o editados en espera de aprobación."
              alPulsar={() => router.push('/administrador/eventos')} />
            <FilaTarea acento="#F59A23" icono={<Ionicons name="flag-outline" size={32} color={MORADO} />}
              titulo={textoTarea(t?.reportesSinRevisar ?? null, 'reporte', 'reportes', 'sin revisar')}
              descripcion="Denuncias de la comunidad por eventos."
              alPulsar={() => router.push('/administrador/reportes')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
