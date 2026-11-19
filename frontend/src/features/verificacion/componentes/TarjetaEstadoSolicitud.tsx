import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { SolicitudVerificacion } from '../tipos';
import { estilos } from './TarjetaEstadoSolicitud.estilos';

const FORMATO_FECHA = (f?: Date) =>
  f ? `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}` : undefined;

// Resultado de la solicitud cuando ya no se puede editar: en revisión, aprobada o rechazada
export function TarjetaEstadoSolicitud({ solicitud }: { solicitud: SolicitudVerificacion }) {
  const enviada = FORMATO_FECHA(solicitud.actualizadaEn ?? solicitud.creadaEn);

  if (solicitud.estado === 'aprobada') {
    return (
      <View style={[estilos.tarjeta, { backgroundColor: Colores.exitoFondo }]}>
        <View style={estilos.circulo}><Ionicons name="shield-checkmark" size={38} color={Colores.exitoTexto} /></View>
        <Text style={[estilos.titulo, { color: Colores.exitoTexto }]}>¡Cuenta verificada!</Text>
        <Text style={estilos.texto}>Ya puedes crear eventos. Cada evento nuevo lo revisa un administrador antes de publicarse.</Text>
      </View>
    );
  }

  if (solicitud.estado === 'rechazada') {
    return (
      <View style={[estilos.tarjeta, { backgroundColor: Colores.errorFondo }]}>
        <View style={estilos.circulo}><Ionicons name="close-circle" size={42} color={Colores.error} /></View>
        <Text style={[estilos.titulo, { color: Colores.error }]}>Solicitud rechazada</Text>
        {!!solicitud.observaciones && <Text style={[estilos.texto, estilos.motivo]}>Motivo: {solicitud.observaciones}</Text>}
        <Text style={estilos.texto}>Si crees que fue un error, contacta al equipo administrador.</Text>
      </View>
    );
  }

  return (
    <View style={[estilos.tarjeta, { backgroundColor: Colores.fondoSuave }]}>
      <View style={estilos.circulo}><Ionicons name="time" size={40} color={Colores.primario} /></View>
      <Text style={[estilos.titulo, { color: Colores.primarioOscuro }]}>Solicitud en revisión</Text>
      <Text style={estilos.texto}>Un administrador está revisando tu información. Aquí verás el resultado en cuanto haya una respuesta.</Text>
      {!!enviada && <Text style={estilos.fecha}>Enviada el {enviada}</Text>}
    </View>
  );
}
