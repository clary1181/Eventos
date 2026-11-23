import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { PerfilOrganizador } from '../tipos';
import { estilos } from './BannerVerificacion.estilos';

const CONTENIDO: Record<PerfilOrganizador['estadoVerificacion'], { titulo: string; detalle: string; boton?: string }> = {
  sin_solicitud: { titulo: 'Verificación de organizador', detalle: 'Tu cuenta no está verificada.', boton: 'Completar verificación' },
  pendiente: { titulo: 'Verificación en revisión', detalle: 'Estamos revisando tu solicitud.', boton: 'Ver estado' },
  correccion_requerida: { titulo: 'Verificación con observaciones', detalle: 'Revisa qué debes corregir.', boton: 'Corregir' },
  rechazada: { titulo: 'Verificación rechazada', detalle: 'Consulta el motivo de la decisión.', boton: 'Ver motivo' },
  aprobada: { titulo: 'Organizador verificado', detalle: 'Tu cuenta está verificada por el equipo de MR-Eventos.' },
};

type Propiedades = {
  estado: PerfilOrganizador['estadoVerificacion'];
  alPresionar: () => void;
  elevado?: boolean;
};

export function BannerVerificacion({ estado, alPresionar, elevado = false }: Propiedades) {
  const c = CONTENIDO[estado];
  const aprobada = estado === 'aprobada';
  return (
    <View style={[estilos.tarjeta, elevado && estilos.elevada, aprobada && estilos.aprobada]}>
      {aprobada ? (
        <MaterialCommunityIcons name="check-decagram-outline" size={40} color={Colores.exitoTexto} />
      ) : (
        <Ionicons name="shield-checkmark-outline" size={40} color={Colores.primarioOscuro} />
      )}
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{c.titulo}</Text>
        <Text style={estilos.detalle}>{c.detalle}</Text>
      </View>
      {c.boton && (
        <Pressable style={estilos.boton} onPress={alPresionar} accessibilityRole="button">
          <Text style={estilos.textoBoton}>{c.boton}</Text>
          <Ionicons name="chevron-forward" size={15} color={Colores.primario} />
        </Pressable>
      )}
    </View>
  );
}
