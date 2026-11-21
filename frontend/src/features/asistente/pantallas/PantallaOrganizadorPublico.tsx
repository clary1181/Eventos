import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, FondoHero } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useSesion } from '@/features/auth';
import { BotonSeguir } from '../componentes/BotonSeguir';
import { TarjetaEventoAsistente } from '../componentes/TarjetaEventoAsistente';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useEventosDelOrganizador } from '../hooks/useEventosDelOrganizador';
import { useFavoritos } from '../hooks/useFavoritos';
import { useOrganizadorPublico } from '../hooks/useOrganizadorPublico';
import { useSeguidos } from '../hooks/useSeguidos';
import { estilos } from './PantallaOrganizadorPublico.estilos';

export function PantallaOrganizadorPublico() {
  useBarraEstadoAsistente('light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const organizador = useOrganizadorPublico(id);
  const eventos = useEventosDelOrganizador(id);
  const favoritos = useFavoritos(perfil?.uid);
  const seguidos = useSeguidos(perfil?.uid);

  if (!id) return null;
  if (!organizador) return <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>;

  const alto = Math.round(width * 0.42) + top;
  const siguiendo = seguidos.ids.has(id);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/asistente/explorar' as Href));
  const tarjeta = (e: (typeof eventos.proximos)[number]) => (
    <TarjetaEventoAsistente key={e.id} evento={e} esFavorito={favoritos.ids.has(e.id)} alPulsar={() => router.push(`/asistente/evento/${e.id}` as Href)} alFavorito={() => favoritos.alternar(e.id)} />
  );

  return (
    <ScrollView style={estilos.raiz} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca alAtras={volver} />
        </View>
      </FondoHero>

      <View style={estilos.hoja}>
        <View style={estilos.cabecera}>
          <View style={estilos.avatar}>
            {organizador.fotoUrl ? (
              <Image source={{ uri: organizador.fotoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Text style={estilos.inicial}>{organizador.nombre.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View style={estilos.datos}>
            <View style={estilos.filaNombre}>
              <Text style={estilos.nombre} numberOfLines={2}>{organizador.nombre}</Text>
              <MaterialCommunityIcons name="check-decagram" size={22} color={Colores.primario} />
            </View>
            {!!organizador.ciudad && (
              <View style={estilos.fila}>
                <Ionicons name="location-outline" size={16} color={Colores.textoSuave} />
                <Text style={estilos.dato} numberOfLines={1}>{organizador.ciudad}</Text>
              </View>
            )}
            {!!organizador.instagram && (
              <View style={estilos.fila}>
                <Ionicons name="logo-instagram" size={16} color={Colores.textoSuave} />
                <Text style={estilos.dato} numberOfLines={1}>{organizador.instagram}</Text>
              </View>
            )}
          </View>
        </View>

        {!!organizador.biografia && <Text style={estilos.biografia}>{organizador.biografia}</Text>}

        {perfil?.rol === 'asistente' && id !== perfil.uid && (
          <View style={estilos.acciones}><BotonSeguir siguiendo={siguiendo} alPulsar={() => seguidos.alternar(id)} /></View>
        )}

        <View style={estilos.metricas}>
          <View style={estilos.metrica}>
            <Text style={estilos.numero}>{eventos.proximos.length}</Text>
            <Text style={estilos.etiquetaMetrica}>Próximos eventos</Text>
          </View>
          <View style={estilos.separador} />
          <View style={estilos.metrica}>
            <Text style={estilos.numero}>{eventos.realizados.length}</Text>
            <Text style={estilos.etiquetaMetrica}>Eventos realizados</Text>
          </View>
        </View>

        <View>
          <Text style={estilos.seccion}>Próximos eventos</Text>
          {eventos.cargando ? (
            <ActivityIndicator color={Colores.primario} style={{ marginTop: 16 }} />
          ) : eventos.proximos.length === 0 ? (
            <Text style={estilos.vacio}>Este organizador no tiene eventos próximos por ahora.</Text>
          ) : (
            <View style={estilos.lista}>{eventos.proximos.map(tarjeta)}</View>
          )}
        </View>

        {eventos.realizados.length > 0 && (
          <View>
            <Text style={estilos.seccion}>Eventos anteriores</Text>
            <View style={estilos.lista}>{eventos.realizados.slice(0, 5).map(tarjeta)}</View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
