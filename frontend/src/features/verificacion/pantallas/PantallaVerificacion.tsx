import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraMarca, BotonPrimario, CampoTexto, FondoHero } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { useSesion } from '@/features/auth';
import { AvisoObservaciones } from '../componentes/AvisoObservaciones';
import { CampoDocumento } from '../componentes/CampoDocumento';
import { FilaTerminos } from '../componentes/FilaTerminos';
import { TarjetaEstadoSolicitud } from '../componentes/TarjetaEstadoSolicitud';
import { LIMITE_DESCRIPCION, useFormularioVerificacion } from '../hooks/useFormularioVerificacion';
import { useSolicitudVerificacion } from '../hooks/useSolicitudVerificacion';
import type { SolicitudVerificacion } from '../tipos';
import { estilos } from './PantallaVerificacion.estilos';

function Formulario({ uid, previa, alTerminar }: { uid: string; previa: SolicitudVerificacion | null; alTerminar: () => void }) {
  const f = useFormularioVerificacion(uid, previa);
  const devuelta = previa?.estado === 'correccion_requerida';

  return (
    <>
      {devuelta && !!previa?.observaciones && <AvisoObservaciones texto={previa.observaciones} />}

      <Text style={estilos.seccion}>Contacto</Text>
      <CampoTexto icono="call-outline" placeholder="Teléfono (10 dígitos)" value={f.telefono} onChangeText={f.cambiarTelefono} error={f.errores.telefono} keyboardType="phone-pad" maxLength={10} />
      <CampoTexto icono="logo-instagram" placeholder="Instagram (@usuario)" value={f.instagram} onChangeText={f.cambiarInstagram} autoCapitalize="none" />
      <CampoTexto icono="link-outline" placeholder="Sitio web (opcional)" value={f.sitioWeb} onChangeText={f.cambiarSitioWeb} error={f.errores.contacto} autoCapitalize="none" keyboardType="url" />

      <Text style={estilos.seccion}>Tu actividad</Text>
      <CampoTexto
        icono="calendar-outline"
        placeholder="¿Qué tipo de eventos organizas? Si tienes eventos anteriores, pega aquí el enlace."
        value={f.descripcion}
        onChangeText={f.cambiarDescripcion}
        error={f.errores.descripcion}
        multiline
        autoCorrect
        style={{ minHeight: 110, textAlignVertical: 'top' }}
      />
      <Text style={estilos.contador}>{f.descripcion.length}/{LIMITE_DESCRIPCION}</Text>

      <Text style={estilos.seccion}>Documentos</Text>
      <CampoDocumento titulo="Selfie" ayuda="Una foto de tu cara, tomada ahora." icono="camera-outline" uri={f.selfie} alPresionar={f.hacerSelfie} error={f.errores.selfie} />
      <CampoDocumento titulo="Identificación oficial (INE)" ayuda="Foto clara del frente, sin reflejos." icono="card-outline" uri={f.identificacion} alPresionar={f.elegirIdentificacion} error={f.errores.identificacion} />
      <Text style={estilos.nota}>Usamos estas fotos solo para verificar tu identidad.</Text>

      <FilaTerminos aceptado={f.terminos} alCambiar={f.alternarTerminos} error={f.errores.terminos} />
      <BotonPrimario titulo={devuelta ? 'Reenviar verificación' : 'Enviar verificación'} onPress={() => f.enviar(alTerminar)} cargando={f.enviando} />
    </>
  );
}

export function PantallaVerificacion() {
  useBarraEstado('light');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { perfil } = useSesion();
  const { solicitud, cargando, error } = useSolicitudVerificacion(perfil?.uid);

  if (!perfil) return null;
  const alto = Math.round(width * 0.5) + top;
  const irAInicio = () => router.replace('/organizador/inicio' as Href);
  const alAtras = () => (router.canGoBack() ? router.back() : irAInicio());
  const editable = !solicitud || solicitud.estado === 'correccion_requerida';

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView
      style={estilos.raiz}
      contentContainerStyle={[estilos.contenido, { paddingBottom: Math.max(32, bottom + 24) }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <FondoHero alto={alto}>
        <View style={[estilos.heroContenido, { paddingTop: top + 8 }]}>
          <BarraMarca alAtras={alAtras} />
          <Text style={estilos.tituloHero}>Verificación de organizador</Text>
          <Text style={estilos.subtituloHero}>Para publicar eventos necesitamos confirmar quién eres.</Text>
        </View>
      </FondoHero>

      <View style={estilos.hoja}>
        {cargando ? (
          <View style={estilos.centro}><ActivityIndicator color={Colores.primario} /></View>
        ) : error ? (
          <View style={estilos.centro}><Text style={estilos.textoError}>{error}</Text></View>
        ) : editable ? (
          <Formulario uid={perfil.uid} previa={solicitud} alTerminar={irAInicio} />
        ) : (
          solicitud && <TarjetaEstadoSolicitud solicitud={solicitud} />
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
