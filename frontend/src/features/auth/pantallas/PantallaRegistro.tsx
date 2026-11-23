import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BotonContorno, BotonPrimario, CampoSelector, CampoTexto, ModalCentrado } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useFuentes } from '@/compartido/tema/useFuentes';
import { EncabezadoAuth } from '../componentes/EncabezadoAuth';
import { SelectorFecha } from '../componentes/SelectorFecha';
import { SelectorRol } from '../componentes/SelectorRol';
import { CIUDADES_BAJA_CALIFORNIA } from '../constantes';
import { useRegistro } from '../hooks/useRegistro';
import { useTecladoScroll } from '../hooks/useTecladoScroll';
import { estilos } from './PantallaRegistro.estilos';

export function PantallaRegistro() {
  const router = useRouter();
  const r = useRegistro();
  const fuentesListas = useFuentes();
  const teclado = useTecladoScroll();
  const [calendarioVisible, establecerCalendarioVisible] = useState(false);
  const irAInicioSesion = () => router.replace('/iniciar-sesion');

  if (!fuentesListas) return <View style={{ flex: 1, backgroundColor: Colores.fondo }} />;

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={teclado.scrollRef}
        onScroll={teclado.alScroll}
        scrollEventThrottle={16}
        contentContainerStyle={estilos.contenido}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <EncabezadoAuth compacto />

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>Crear cuenta</Text>
          <View style={estilos.indicador}>
            <View style={[estilos.barra, r.paso === 1 && estilos.barraActiva]} />
            <View style={[estilos.barra, r.paso === 2 && estilos.barraActiva]} />
          </View>
          <Text style={estilos.subtitulo}>
            {r.paso === 1 ? 'Paso 1 de 2 · Datos personales' : 'Paso 2 de 2 · Tu cuenta'}
          </Text>

          {r.paso === 1 ? (
            <>
              <CampoTexto icono="person-outline" placeholder="Nombre(s)" value={r.valores.nombre} onChangeText={(t) => r.cambiar('nombre', t)} onFocus={teclado.alEnfocar} error={r.errores.nombre} autoCapitalize="words" maxLength={40} />
              <CampoTexto icono="people-outline" placeholder="Apellido paterno" value={r.valores.apellidoPaterno} onChangeText={(t) => r.cambiar('apellidoPaterno', t)} onFocus={teclado.alEnfocar} error={r.errores.apellidoPaterno} autoCapitalize="words" maxLength={40} />
              <CampoTexto icono="people-outline" placeholder="Apellido materno" value={r.valores.apellidoMaterno} onChangeText={(t) => r.cambiar('apellidoMaterno', t)} onFocus={teclado.alEnfocar} error={r.errores.apellidoMaterno} autoCapitalize="words" maxLength={40} />

              <CampoSelector
                icono="calendar-outline"
                valor={r.valores.fechaNacimiento || 'Fecha de nacimiento'}
                onPress={() => establecerCalendarioVisible(true)}
              />
              {!!r.errores.fechaNacimiento && <Text style={estilos.errorFecha}>{r.errores.fechaNacimiento}</Text>}

              <CampoSelector icono="location-outline" valor={r.valores.ciudad} onPress={r.abrirCiudades} />
              <BotonPrimario titulo="Siguiente" onPress={r.irAlPaso2} />
            </>
          ) : (
            <>
              <CampoTexto icono="at-outline" placeholder="Nombre de usuario" value={r.valores.nombreUsuario} onChangeText={(t) => r.cambiar('nombreUsuario', t)} onFocus={teclado.alEnfocar} error={r.errores.nombreUsuario} autoCapitalize="none" maxLength={20} />
              <CampoTexto icono="mail-outline" placeholder="Correo electrónico" value={r.valores.correo} onChangeText={(t) => r.cambiar('correo', t)} onFocus={teclado.alEnfocar} error={r.errores.correo} keyboardType="email-address" autoCapitalize="none" autoComplete="email" maxLength={254} />
              <CampoTexto icono="lock-closed-outline" placeholder="Contraseña" esContrasenia value={r.valores.contrasenia} onChangeText={(t) => r.cambiar('contrasenia', t)} onFocus={teclado.alEnfocar} error={r.errores.contrasenia} autoCapitalize="none" maxLength={64} />
              <CampoTexto icono="shield-checkmark-outline" placeholder="Confirmar contraseña" esContrasenia value={r.valores.confirmar} onChangeText={(t) => r.cambiar('confirmar', t)} onFocus={teclado.alEnfocar} error={r.errores.confirmar} autoCapitalize="none" maxLength={64} />
              <SelectorRol valor={r.valores.rol} alCambiar={(rol) => r.cambiar('rol', rol)} />

              <View style={estilos.filaBotones}>
                <View style={{ flex: 1 }}>
                  <BotonContorno titulo="Atrás" onPress={r.volverAlPaso1} />
                </View>
                <View style={{ flex: 1.4 }}>
                  <BotonPrimario titulo="Crear cuenta" onPress={r.registrar} cargando={r.cargando} />
                </View>
              </View>
            </>
          )}

          <View style={estilos.filaInicio}>
            <Text style={estilos.textoInicio}>¿Ya tienes una cuenta?</Text>
            <Pressable onPress={irAInicioSesion}>
              <Text style={estilos.enlaceInicio}>Inicia sesión</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: teclado.rellenoTeclado }} />
      </ScrollView>

      <SelectorFecha
        visible={calendarioVisible}
        valor={r.valores.fechaNacimiento}
        alCerrar={() => establecerCalendarioVisible(false)}
        alElegir={(fecha) => r.cambiar('fechaNacimiento', fecha)}
      />

      <ModalCentrado visible={r.ciudadesVisible} alCerrar={r.cerrarCiudades}>
        <Text style={estilos.tituloModal}>Selecciona tu ciudad</Text>
        {CIUDADES_BAJA_CALIFORNIA.map((ciudad) => {
          const activa = r.valores.ciudad === ciudad;
          return (
            <Pressable key={ciudad} style={[estilos.opcionCiudad, activa && estilos.opcionCiudadActiva]} onPress={() => r.elegirCiudad(ciudad)}>
              <Text style={[estilos.textoCiudad, activa && estilos.textoCiudadActiva]}>{ciudad}</Text>
              {activa && <Ionicons name="checkmark" size={20} color={Colores.primario} />}
            </Pressable>
          );
        })}
      </ModalCentrado>

      <ModalCentrado visible={r.exito.visible} alCerrar={r.cerrarExito}>
        <Ionicons name="checkmark-circle" size={64} color={Colores.exito} style={estilos.iconoExito} />
        <Text style={estilos.tituloModal}>¡Cuenta creada!</Text>
        <Text style={estilos.textoModal}>
          {r.exito.correoEnviado
            ? `Te enviamos un enlace de verificación a ${r.valores.correo.trim().toLowerCase()}. Ábrelo para activar tu cuenta (revisa también spam) y después inicia sesión.`
            : 'Tu cuenta fue creada, pero no pudimos enviar el correo de verificación. Inicia sesión y pulsa "Reenviar correo".'}
        </Text>
        <BotonPrimario titulo="Ir a iniciar sesión" onPress={() => { r.cerrarExito(); irAInicioSesion(); }} />
      </ModalCentrado>
    </KeyboardAvoidingView>
  );
}