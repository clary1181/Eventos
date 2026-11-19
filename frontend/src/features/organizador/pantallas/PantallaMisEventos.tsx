import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonIcono } from '@/compartido/componentes';
import { avisarProximamente } from '@/compartido/utilidades/proximamente';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useEventosOrganizador, type Evento } from '@/features/eventos';
import { BotonCrearEvento } from '../componentes/BotonCrearEvento';
import { ListaEventosOrganizador } from '../componentes/ListaEventosOrganizador';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';
import { useAccionCrearEvento } from '../hooks/useAccionCrearEvento';
import { estilos } from './PantallaMisEventos.estilos';

// Solo los eventos que aún no son públicos se pueden corregir directamente (reglas de Firestore)
const esEditable = (evento: Evento) => evento.estado === 'pendiente_aprobacion' || evento.estado === 'requiere_correccion';

export function PantallaMisEventos() {
  useBarraEstado('dark');
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { perfil } = usePerfilOrganizador();
  const { eventos, cargando, error } = useEventosOrganizador(perfil?.uid);
  const crear = useAccionCrearEvento();

  const editar = (evento: Evento) => {
    if (!esEditable(evento)) {
      avisarProximamente('La edición de eventos publicados, rechazados o suspendidos');
      return;
    }
    router.push(`/organizador/editar-evento?id=${evento.id}` as Href);
  };

  return (
    <ScrollView style={estilos.raiz} contentContainerStyle={[estilos.contenido, { paddingTop: top + 20 }]} showsVerticalScrollIndicator={false}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Mis eventos</Text>
        <BotonCrearEvento alPresionar={crear} />
      </View>
      <ListaEventosOrganizador
        eventos={eventos}
        cargando={cargando}
        error={error}
        alCrear={crear}
        alPresionarEvento={(evento) => (esEditable(evento) ? editar(evento) : avisarProximamente('El detalle del evento'))}
        acciones={(evento) => (
          <>
            <BotonIcono tono="claro" tamano={36} icono="pencil-outline" etiqueta="Editar evento" onPress={() => editar(evento)} />
            <BotonIcono tono="claro" tamano={36} icono="ellipsis-horizontal" etiqueta="Más opciones" onPress={() => avisarProximamente('Más opciones')} />
          </>
        )}
      />
    </ScrollView>
  );
}