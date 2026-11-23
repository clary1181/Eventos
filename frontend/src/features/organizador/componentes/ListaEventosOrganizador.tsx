import React, { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { TarjetaEvento, type Evento } from '@/features/eventos';
import { usePerfilOrganizador } from '../contexto/PerfilOrganizadorContexto';
import { BotonCrearEvento } from './BotonCrearEvento';
import { estilos } from './ListaEventosOrganizador.estilos';

type Propiedades = {
  eventos: Evento[];
  cargando: boolean;
  error: string | null;
  limite?: number;
  compacta?: boolean;
  acciones?: (evento: Evento) => ReactNode;
  alPresionarEvento?: (evento: Evento) => void;
  alCrear: () => void;
};

export function ListaEventosOrganizador({ eventos, cargando, error, limite, compacta, acciones, alPresionarEvento, alCrear }: Propiedades) {
  const { perfil } = usePerfilOrganizador();

  if (cargando) {
    return <View style={estilos.centro}><ActivityIndicator color={Colores.primario} /></View>;
  }
  if (error) {
    return <View style={estilos.centro}><Text style={estilos.error}>{error}</Text></View>;
  }
  if (eventos.length === 0) {
    return (
      <View style={estilos.vacio}>
        <Ionicons name="calendar-outline" size={36} color={Colores.primario} />
        <Text style={estilos.titulo}>Aún no tienes eventos</Text>
        <Text style={estilos.texto}>
          {perfil?.estaVerificado
            ? 'Crea tu primer evento. Lo revisará un administrador antes de publicarse.'
            : 'Cuando verifiquen tu cuenta podrás crear y publicar eventos.'}
        </Text>
        {perfil?.estaVerificado && <BotonCrearEvento alPresionar={alCrear} />}
      </View>
    );
  }

  return (
    <View style={estilos.lista}>
      {(limite ? eventos.slice(0, limite) : eventos).map((evento) => (
        <TarjetaEvento
          key={evento.id}
          evento={evento}
          compacta={compacta}
          acciones={acciones?.(evento)}
          alPresionar={alPresionarEvento ? () => alPresionarEvento(evento) : undefined}
        />
      ))}
    </View>
  );
}
