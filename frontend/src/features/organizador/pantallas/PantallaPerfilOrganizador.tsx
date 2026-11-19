import React, { useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, BotonIcono, FondoHero, PestanasSegmentadas } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { avisarProximamente } from '@/compartido/utilidades/proximamente';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { cerrarSesion } from '@/features/auth';
import { formatearNumero, useEventosOrganizador } from '@/features/eventos';
import { BannerVerificacion } from '../componentes/BannerVerificacion';
import { BotonCrearEvento } from '../componentes/BotonCrearEvento';
import { ListaEventosOrganizador } from '../componentes/ListaEventosOrganizador';
import { TarjetaMetrica } from '../componentes/TarjetaMetrica';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';
import { useAccionCrearEvento } from '../hooks/useAccionCrearEvento';
import { useResumenOrganizador } from '../hooks/useResumenOrganizador';
import { estilos } from './PantallaPerfilOrganizador.estilos';

const SECCIONES = [
  { id: 'eventos', titulo: 'Mis eventos', icono: 'calendar-blank-outline' },
  { id: 'estadisticas', titulo: 'Estadísticas', icono: 'chart-bar' },
  { id: 'reportes', titulo: 'Reportes', icono: 'flag-outline' },
] as const;

type Contacto = { icono: React.ComponentProps<typeof Ionicons>['name']; texto: string; url: string };

const abrir = (url: string) => Linking.openURL(url).catch(() => Alert.alert('No se pudo abrir el enlace'));

export function PantallaPerfilOrganizador() {
  useBarraEstado('light');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil, telefono } = usePerfilOrganizador();
  const { eventos, cargando, error } = useEventosOrganizador(perfil?.uid);
  const resumen = useResumenOrganizador(eventos);
  const crear = useAccionCrearEvento();
  const [seccion, establecerSeccion] = useState<string>('eventos');

  if (!perfil) return null;
  const alto = Math.round(width * 0.5) + top;

  const instagram = perfil.redes.instagram?.replace(/^@/, '');
  const sitio = perfil.redes.sitioWeb;
  const contactos: Contacto[] = [
    telefono ? { icono: 'call-outline', texto: telefono, url: `tel:${telefono}` } : null,
    instagram ? { icono: 'logo-instagram', texto: `@${instagram}`, url: `https://instagram.com/${instagram}` } : null,
    sitio ? { icono: 'link-outline', texto: sitio.replace(/^https?:\/\//, ''), url: /^https?:\/\//.test(sitio) ? sitio : `https://${sitio}` } : null,
  ].filter((c): c is Contacto => c !== null);

  const alAtras = () => (router.canGoBack() ? router.back() : router.replace('/organizador/inicio' as Href));
  const abrirAjustes = () =>
    Alert.alert('Ajustes', undefined, [
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => cerrarSesion() },
      { text: 'Cancelar', style: 'cancel' },
    ]);

  return (
    <ScrollView style={estilos.raiz} contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca
            alAtras={alAtras}
            derecha={
              <>
                <BotonIcono icono="notifications-outline" etiqueta="Notificaciones" onPress={() => avisarProximamente('Las notificaciones')} />
                <BotonIcono icono="settings-outline" etiqueta="Ajustes" onPress={abrirAjustes} />
              </>
            }
          />
        </View>
      </FondoHero>

      <View style={estilos.hoja}>
        <View style={estilos.cabecera}>
          <View style={estilos.avatarCaja}>
            <View style={estilos.avatar}>
              {perfil.fotoUrl ? (
                <Image source={{ uri: perfil.fotoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Text style={estilos.inicial}>{perfil.nombre.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Pressable style={estilos.camara} onPress={() => avisarProximamente('Cambiar la foto de perfil')} accessibilityLabel="Cambiar foto">
              <Ionicons name="camera" size={18} color={Colores.primario} />
            </Pressable>
          </View>

          <View style={estilos.datos}>
            <View style={estilos.filaNombre}>
              <Text style={estilos.nombre} numberOfLines={2}>{perfil.nombre} {perfil.apellidos}</Text>
              {perfil.estaVerificado && <MaterialCommunityIcons name="check-decagram" size={22} color={Colores.primario} />}
            </View>
            <Text style={estilos.rol}>Organizador de eventos</Text>
            <View style={estilos.filaCalificacion}>
              <Ionicons name="star" size={17} color={Colores.estrella} />
              {perfil.totalCalificaciones > 0 ? (
                <>
                  <Text style={estilos.calificacion}>{perfil.promedioCalificacion.toFixed(1)}</Text>
                  <Text style={estilos.resenas}>({formatearNumero(perfil.totalCalificaciones)} reseñas)</Text>
                </>
              ) : (
                <Text style={estilos.resenas}>Sin reseñas todavía</Text>
              )}
            </View>
            <Pressable style={estilos.editar} onPress={() => avisarProximamente('Editar perfil')} accessibilityRole="button">
              <Ionicons name="pencil-outline" size={15} color={Colores.primario} />
              <Text style={estilos.textoEditar}>Editar perfil</Text>
            </Pressable>
          </View>
        </View>

        <Text style={estilos.biografia}>{perfil.biografia || 'Aún no has agregado una descripción de lo que organizas.'}</Text>

        {contactos.length > 0 && (
          <View style={estilos.contactos}>
            {contactos.map((c, i) => (
              <React.Fragment key={c.url}>
                {i > 0 && <View style={estilos.divisor} />}
                <Pressable style={estilos.contacto} onPress={() => abrir(c.url)}>
                  <Ionicons name={c.icono} size={19} color={Colores.primario} />
                  <Text style={estilos.textoContacto} numberOfLines={1}>{c.texto}</Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        )}

        <BannerVerificacion estado={perfil.estadoVerificacion} alPresionar={() => router.push('/organizador/verificacion' as Href)} />

        <View style={estilos.metricas}>
          <TarjetaMetrica disposicion="horizontal" icono="calendar-check-outline" valor={formatearNumero(resumen.publicados)} etiqueta="Eventos publicados" />
          <TarjetaMetrica disposicion="horizontal" icono="ticket-confirmation-outline" valor={formatearNumero(resumen.entradasVendidas)} etiqueta="Entradas vendidas" />
          <TarjetaMetrica disposicion="horizontal" icono="star-outline" valor={perfil.totalCalificaciones > 0 ? perfil.promedioCalificacion.toFixed(1) : '—'} etiqueta="Calificación promedio" />
        </View>

        <PestanasSegmentadas opciones={[...SECCIONES]} activa={seccion} alCambiar={establecerSeccion} />

        {seccion === 'eventos' ? (
          <>
            <View style={estilos.encabezadoLista}>
              <Text style={estilos.tituloSeccion}>Mis eventos</Text>
              <BotonCrearEvento alPresionar={crear} />
            </View>
            <ListaEventosOrganizador
              eventos={eventos}
              cargando={cargando}
              error={error}
              alCrear={crear}
              acciones={() => (
                <BotonIcono tono="claro" tamano={36} icono="ellipsis-horizontal" etiqueta="Más opciones" onPress={() => avisarProximamente('Más opciones')} />
              )}
            />
          </>
        ) : (
          <View style={estilos.proximamente}>
            <Ionicons name="construct-outline" size={32} color={Colores.primario} />
            <Text style={estilos.textoProximamente}>
              {seccion === 'estadisticas'
                ? 'Aquí verás las ventas y la asistencia de tus eventos. Llega en una próxima etapa.'
                : 'Aquí verás los reportes que reciban tus eventos y podrás responderlos. Llega en una próxima etapa.'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
