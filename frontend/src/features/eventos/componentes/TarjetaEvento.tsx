import React, { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { formatearFechaCorta, formatearFechaHora } from '../utilidades/formato';
import type { Evento } from '../tipos';
import { InsigniaEstadoEvento } from './InsigniaEstadoEvento';
import { estilos } from './TarjetaEvento.estilos';

type Propiedades = {
  evento: Evento;
  alPresionar?: () => void;
  acciones?: ReactNode;      // botones a la derecha (estadísticas, editar, más)
  compacta?: boolean;        // miniatura y fecha más pequeñas (cuando hay varias acciones)
};

// Tarjeta de evento para listas: miniatura, título, estado, fecha y lugar
export function TarjetaEvento({ evento, alPresionar, acciones, compacta = false }: Propiedades) {
  return (
    <Pressable style={({ pressed }) => [estilos.tarjeta, pressed && !!alPresionar && estilos.presionada]} onPress={alPresionar} disabled={!alPresionar}>
      <View style={[estilos.imagen, compacta && estilos.imagenCompacta]}>
        {evento.imagenUrl ? (
          <Image source={{ uri: evento.imagenUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={30} color={Colores.primario} />
        )}
      </View>

      <View style={estilos.cuerpo}>
        <Text style={estilos.titulo} numberOfLines={2}>{evento.titulo}</Text>
        <InsigniaEstadoEvento estado={evento.estado} />
        <View style={estilos.linea}>
          <Ionicons name="calendar-outline" size={16} color={Colores.texto} />
          <Text style={estilos.textoLinea} numberOfLines={1}>{compacta ? formatearFechaCorta(evento.fechaInicio) : formatearFechaHora(evento.fechaInicio)}</Text>
        </View>
        <View style={estilos.linea}>
          <Ionicons name="location-outline" size={16} color={Colores.texto} />
          <Text style={estilos.textoLinea} numberOfLines={1}>{evento.lugar}</Text>
          {(evento.estado === 'requiere_correccion' || evento.estado === 'rechazado') &&
            !!(evento.estado === 'rechazado' ? evento.motivoRechazo : evento.observaciones) && (
              <View style={{ backgroundColor: '#FDE8D4', borderRadius: 12, padding: 10, marginTop: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#B4530A' }}>
                  {evento.estado === 'rechazado' ? 'Motivo del rechazo' : 'Correcciones pedidas'}
                </Text>
                <Text style={{ fontSize: 13, color: Colores.texto, marginTop: 2 }} numberOfLines={compacta ? 3 : undefined}>
                  {evento.estado === 'rechazado' ? evento.motivoRechazo : evento.observaciones}
                </Text>
              </View>
            )}
        </View>
      </View>

      {acciones && <View style={estilos.acciones}>{acciones}</View>}
    </Pressable>
  );
}
