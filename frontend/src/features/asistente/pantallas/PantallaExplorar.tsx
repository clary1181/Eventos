import React, { useRef } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, BotonIcono, FondoHero } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { ChipsCategoria } from '../componentes/ChipsCategoria';
import { TarjetaEventoAsistente } from '../componentes/TarjetaEventoAsistente';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useCatalogo } from '../hooks/useCatalogo';
import { FilaOrganizador } from '../componentes/FilaOrganizador';
import { useFavoritos } from '../hooks/useFavoritos';
import { useSeguidos } from '../hooks/useSeguidos';
import type { EventoPublico } from '../tipos';
import { estilos } from './PantallaExplorar.estilos';
import { CampanaAvisos } from '@/features/notificaciones';

export function PantallaExplorar() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const c = useCatalogo();
  const favoritos = useFavoritos(perfil?.uid);
  const seguidos = useSeguidos(perfil?.uid);
  const scroll = useRef<ScrollViewInstance>(null);
  const yProximos = useRef(0);

  const abrir = (e: EventoPublico) => router.push(`/asistente/evento/${e.id}` as Href);
  const tarjeta = (e: EventoPublico) => (
    <TarjetaEventoAsistente key={e.id} evento={e} esFavorito={favoritos.ids.has(e.id)} alPulsar={() => abrir(e)} alFavorito={() => favoritos.alternar(e.id)} />
  );
  const alto = Math.round(width * 0.62) + top;

  return (
    <ScrollView ref={scroll} style={estilos.raiz} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" bounces={false} overScrollMode="never">

      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca
            derecha={
              <>
                <CampanaAvisos />
                <BotonIcono icono="person-circle-outline" etiqueta="Mi perfil" onPress={() => router.push('/asistente/perfil' as Href)} />
              </>
            }
          />
          <Text style={estilos.saludo} numberOfLines={1}>¡Hola, {perfil?.nombre ?? ''}! 👋</Text>
          <Text style={estilos.subtitulo}>Descubre los mejores eventos de Ensenada</Text>
        </View>
      </FondoHero>

      <View style={estilos.buscador}>
        <Ionicons name="search-outline" size={26} color={Colores.textoSuave} />
        <TextInput
          style={estilos.entradaBuscador}
          value={c.busqueda}
          onChangeText={c.setBusqueda}
          placeholder="Buscar eventos u organizadores"
          placeholderTextColor={Colores.textoSuave}
          returnKeyType="search"
          numberOfLines={1}
          maxLength={100}
        />
        {c.busqueda.length > 0 && (
          <Ionicons name="close-circle" size={22} color={Colores.textoSuave} onPress={() => c.setBusqueda('')} accessibilityLabel="Borrar búsqueda" />
        )}
      </View>

      <View style={estilos.hoja}>
        <ChipsCategoria seleccionada={c.categoria} alCambiar={c.setCategoria} />

        {c.organizadores.length > 0 && (
          <View style={estilos.seccion}>
            <Text style={[estilos.titulo, { marginBottom: 14 }]}>Organizadores</Text>
            <View style={estilos.lista}>
              {c.organizadores.map((o) => (
                <FilaOrganizador
                  key={o.id}
                  organizadorId={o.id}
                  nombreRespaldo={o.nombre}
                  detalle={`${o.eventos} ${o.eventos === 1 ? 'evento publicado' : 'eventos publicados'}`}
                  siguiendo={seguidos.ids.has(o.id)}
                  alAbrir={() => router.push(`/asistente/organizador/${o.id}` as Href)}
                  alSeguir={() => seguidos.alternar(o.id)}
                />
              ))}
            </View>
          </View>
        )}

        {c.cargando ? (
          <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>
        ) : c.error ? (
          <View style={estilos.centro}><Text style={estilos.vacio}>{c.error}</Text></View>
        ) : !c.hayEventos ? (
          <View style={estilos.centro}>
            <Ionicons name="calendar-outline" size={48} color={Colores.acento} />
            <Text style={estilos.vacio}>Todavía no hay eventos publicados.{'\n'}¡Vuelve pronto!</Text>
          </View>
        ) : (
          <>
            {c.destacado && (
              <View style={estilos.seccion}>
                <View style={estilos.filaTitulo}>
                  <Text style={estilos.titulo}>Eventos destacados</Text>
                  {c.proximos.length > 0 && (
                    <Text style={estilos.verTodos} onPress={() => scroll.current?.scrollTo({ y: yProximos.current - 16, animated: true })}>
                      Ver todos ›
                    </Text>
                  )}
                </View>
                {tarjeta(c.destacado)}
              </View>
            )}

            <View style={estilos.seccion} onLayout={(ev) => { yProximos.current = ev.nativeEvent.layout.y; }}>
              <Text style={[estilos.titulo, { marginBottom: 14 }]}>{c.filtrando ? 'Resultados' : 'Próximos eventos'}</Text>
              {c.proximos.length === 0 ? (
                <View style={estilos.centro}>
                  <Ionicons name="search-outline" size={44} color={Colores.acento} />
                  <Text style={estilos.vacio}>{c.filtrando ? 'No se encontraron eventos.' : 'No hay más eventos por ahora.'}</Text>
                </View>
              ) : (
                <View style={estilos.lista}>{c.proximos.map(tarjeta)}</View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}