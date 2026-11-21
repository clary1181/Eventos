import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, BotonIcono, FondoHero } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { avisarProximamente } from '@/compartido/utilidades/proximamente';
import { cerrarSesion, useSesion } from '@/features/auth';
import { BotonCorazon } from '../componentes/BotonCorazon';
import { ModalEditarPerfil } from '../componentes/ModalEditarPerfil';
import { useBarraEstadoAsistente } from '../hooks/useBarraEstadoAsistente';
import { useEventosFavoritos } from '../hooks/useEventosFavoritos';
import { useSeguidos } from '../hooks/useSeguidos';
import { usePerfilAsistente } from '../hooks/usePerfilAsistente';
import { formatearFechaHora } from '../utilidades/formato';
import { estilos } from './PantallaPerfilAsistente.estilos';

type Icono = React.ComponentProps<typeof Ionicons>['name'];

export function PantallaPerfilAsistente() {
  useBarraEstadoAsistente('light');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { perfil: sesion } = useSesion();
  const p = usePerfilAsistente(sesion?.uid);
  const fav = useEventosFavoritos(sesion?.uid);
  const seguidos = useSeguidos(sesion?.uid);
  const [editando, setEditando] = useState(false);

  if (!sesion) return null;
  if (!p.perfil) return <View style={estilos.centro}><ActivityIndicator size="large" color={Colores.primario} /></View>;

  const ir = (ruta: string) => router.push(ruta as Href);
  const alto = Math.round(width * 0.5) + top;
  const nombreCompleto = `${p.perfil.nombre} ${p.perfil.apellidos}`.trim();

  const abrirAjustes = () =>
    Alert.alert('Ajustes', undefined, [
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => cerrarSesion() },
      { text: 'Cancelar', style: 'cancel' },
    ]);

  const actividades: { icono: Icono; titulo: string; insignia?: number; alPulsar: () => void }[] = [
    { icono: 'ticket-outline', titulo: 'Mis entradas', insignia: p.entradasVigentes, alPulsar: () => ir('/asistente/entradas') },
    { icono: 'heart-outline', titulo: 'Mis favoritos', alPulsar: () => ir('/asistente/favoritos') },
    { icono: 'people-outline', titulo: 'Organizadores que sigo', alPulsar: () => ir('/asistente/organizadores-seguidos') },
    { icono: 'time-outline', titulo: 'Historial de eventos', alPulsar: () => ir('/asistente/historial') },
    { icono: 'star-outline', titulo: 'Mis calificaciones', alPulsar: () => ir('/asistente/mis-calificaciones') },
    { icono: 'document-text-outline', titulo: 'Mis reportes', alPulsar: () => ir('/asistente/mis-reportes') },
  ];

  return (
    <ScrollView style={estilos.raiz} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca
            alAtras={() => (router.canGoBack() ? router.back() : router.replace('/asistente/explorar' as Href))}
            derecha={
              <>
                <BotonIcono icono="notifications-outline" etiqueta="Avisos" onPress={() => avisarProximamente('Los avisos')} />
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
              {p.perfil.fotoUrl ? (
                <Image source={{ uri: p.perfil.fotoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Text style={estilos.inicial}>{p.perfil.nombre.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Pressable style={estilos.camara} onPress={p.cambiarFoto} disabled={p.guardando} accessibilityLabel="Cambiar foto">
              {p.guardando ? <ActivityIndicator size="small" color={Colores.primario} /> : <Ionicons name="camera" size={20} color={Colores.primario} />}
            </Pressable>
          </View>

          <View style={estilos.datos}>
            <View style={estilos.filaNombre}>
              <Text style={estilos.nombre} numberOfLines={2}>{nombreCompleto}</Text>
            </View>
            <Text style={estilos.usuario}>@{p.perfil.nombreUsuario}</Text>
            <View style={estilos.rol}>
              <Ionicons name="person-outline" size={16} color={Colores.primario} />
              <Text style={estilos.textoRol}>Asistente</Text>
            </View>
          </View>
        </View>

        <Pressable style={[estilos.editar, { alignSelf: 'flex-start', marginTop: -6 }]} onPress={() => setEditando(true)} accessibilityRole="button">
          <Ionicons name="pencil-outline" size={17} color={Colores.primario} />
          <Text style={estilos.textoEditar}>Editar perfil</Text>
        </Pressable>

        <Text style={estilos.biografia}>{p.perfil.biografia || 'Aún no has escrito una biografía. Toca "Editar perfil" para agregarla.'}</Text>

        <View style={estilos.metricas}>
          <View style={estilos.metrica}>
            <View style={estilos.filaMetrica}>
              <Ionicons name="calendar-outline" size={26} color={Colores.primarioOscuro} />
              <Text style={estilos.numero}>{p.eventosAsistidos}</Text>
            </View>
            <Text style={estilos.etiquetaMetrica}>Eventos asistidos</Text>
          </View>
          <View style={estilos.separador} />
          <View style={estilos.metrica}>
            <View style={estilos.filaMetrica}>
              <Ionicons name="heart-outline" size={26} color={Colores.primarioOscuro} />
              <Text style={estilos.numero}>{fav.favoritos.length}</Text>
            </View>
            <Text style={estilos.etiquetaMetrica}>Favoritos</Text>
          </View>
          <View style={estilos.separador} />
          <View style={estilos.metrica}>
            <View style={estilos.filaMetrica}>
              <Ionicons name="people-outline" size={26} color={Colores.primarioOscuro} />
              <Text style={estilos.numero}>{seguidos.lista.length}</Text>
            </View>
            <Text style={estilos.etiquetaMetrica}>Organizadores seguidos</Text>
          </View>
        </View>

        <View>
          <Text style={estilos.seccion}>Mis actividades</Text>
          <View style={estilos.actividades}>
            {[actividades.slice(0, 3), actividades.slice(3, 6)].map((fila, i) => (
              <View key={i} style={estilos.filaActividades}>
                {fila.map((a) => (
                  <Pressable key={a.titulo} style={({ pressed }) => [estilos.actividad, pressed && { opacity: 0.85 }]} onPress={a.alPulsar} accessibilityRole="button">
                    <Ionicons name={a.icono} size={34} color={Colores.primarioOscuro} />
                    <Text style={estilos.textoActividad}>{a.titulo}</Text>
                    {!!a.insignia && <View style={estilos.insignia}><Text style={estilos.textoInsignia}>{a.insignia}</Text></View>}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={estilos.seccion}>Próximos eventos de interés</Text>
          {fav.proximos.length === 0 ? (
            <Text style={estilos.vacioInteres}>Guarda eventos con el corazón y los verás aquí.</Text>
          ) : (
            <View style={{ gap: 12, marginTop: 12 }}>
              {fav.proximos.slice(0, 3).map((e) => (
                <Pressable key={e.id} style={estilos.interes} onPress={() => ir(`/asistente/evento/${e.id}`)} accessibilityRole="button">
                  <Image source={{ uri: e.imagenUrl }} style={estilos.imagenInteres} />
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.tituloInteres} numberOfLines={2}>{e.titulo}</Text>
                    <View style={estilos.filaInteres}>
                      <Ionicons name="calendar-outline" size={15} color={Colores.primarioOscuro} />
                      <Text style={estilos.datoInteres} numberOfLines={1}>{formatearFechaHora(e.fechaInicio)}</Text>
                    </View>
                    <View style={estilos.filaInteres}>
                      <Ionicons name="location-outline" size={15} color={Colores.primarioOscuro} />
                      <Text style={estilos.datoInteres} numberOfLines={1}>{e.lugar}</Text>
                    </View>
                  </View>
                  <BotonCorazon activo alPulsar={() => fav.alternar(e.id)} tamano={40} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <ModalEditarPerfil visible={editando} perfil={p.perfil} guardando={p.guardando} alCerrar={() => setEditando(false)} alGuardar={p.guardarDatos} />
    </ScrollView>
  );
}