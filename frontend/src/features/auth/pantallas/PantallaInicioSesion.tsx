import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BotonContorno, BotonPrimario, CampoTexto, SeparadorO } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useFuentes } from '@/compartido/tema/useFuentes';
import { DecoracionConcierto } from '../componentes/DecoracionConcierto';
import { EncabezadoAuth } from '../componentes/EncabezadoAuth';
import { ModalAviso } from '../componentes/ModalAviso';
import { ModalRecuperarContrasenia } from '../componentes/ModalRecuperarContrasenia';
import { useInicioSesion } from '../hooks/useInicioSesion';
import { useRecuperarContrasenia } from '../hooks/useRecuperarContrasenia';
import { estilos } from './PantallaInicioSesion.estilos';

export function PantallaInicioSesion() {
  const router = useRouter();
  const sesion = useInicioSesion();
  const recuperar = useRecuperarContrasenia();
  const fuentesListas = useFuentes();

  if (!fuentesListas) return <View style={{ flex: 1, backgroundColor: Colores.fondo }} />;

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <DecoracionConcierto />

      <ScrollView
        contentContainerStyle={estilos.contenido}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <EncabezadoAuth />

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>Iniciar sesión</Text>

          <CampoTexto
            icono="mail-outline"
            placeholder="Correo electrónico"
            value={sesion.correo}
            onChangeText={sesion.cambiarCorreo}
            error={sesion.errorCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            maxLength={254}
          />
          <CampoTexto
            icono="lock-closed-outline"
            placeholder="Contraseña"
            esContrasenia
            value={sesion.contrasenia}
            onChangeText={sesion.cambiarContrasenia}
            error={sesion.errorContrasenia}
            autoCapitalize="none"
            autoComplete="password"
            maxLength={64}
          />

          <Pressable style={estilos.enlaceOlvido} onPress={() => recuperar.abrir(sesion.correo)}>
            <Text style={estilos.textoOlvido}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          <BotonPrimario titulo="Iniciar sesión" onPress={sesion.enviar} cargando={sesion.cargando} />

          <SeparadorO />

          <BotonContorno
            titulo="Continuar con Google"
            onPress={sesion.iniciarConGoogle}
            icono={<Ionicons name="logo-google" size={20} color="#4285F4" />}
            deshabilitado={sesion.cargando}
          />

          <View style={estilos.filaRegistro}>
            <Text style={estilos.textoRegistro}>¿Aún no tienes una cuenta?</Text>
            <Pressable onPress={() => router.push('/registro')}>
              <Text style={estilos.enlaceRegistro}>Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ModalAviso
        visible={!!sesion.aviso}
        titulo={sesion.aviso?.titulo ?? ''}
        mensaje={sesion.aviso?.mensaje ?? ''}
        tipo={sesion.aviso?.tipo}
        alCerrar={sesion.cerrarAviso}
        textoAccion={sesion.aviso?.permiteReenvio ? 'Reenviar correo' : undefined}
        alAccion={sesion.reenviarCorreo}
        cargandoAccion={sesion.reenviando}
      />

      <ModalAviso
        visible={recuperar.confirmacionVisible}
        titulo="Revisa tu correo"
        mensaje="Si ese correo está registrado, te enviamos un enlace para crear una nueva contraseña. Revisa también spam."
        tipo="exito"
        alCerrar={recuperar.cerrarConfirmacion}
      />

      <ModalRecuperarContrasenia
        visible={recuperar.visible}
        correo={recuperar.correo}
        establecerCorreo={recuperar.establecerCorreo}
        error={recuperar.error}
        enviando={recuperar.enviando}
        cerrar={recuperar.cerrar}
        enviar={recuperar.enviar}
      />
    </KeyboardAvoidingView>
  );
}