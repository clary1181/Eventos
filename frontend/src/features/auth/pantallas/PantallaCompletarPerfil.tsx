import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonContorno, BotonPrimario, CampoSelector, CampoTexto, ModalCentrado } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { useFuentes } from '@/compartido/tema/useFuentes';
import { EncabezadoAuth } from '../componentes/EncabezadoAuth';
import { SelectorFecha } from '../componentes/SelectorFecha';
import { SelectorRol } from '../componentes/SelectorRol';
import { CIUDADES_BAJA_CALIFORNIA } from '../constantes';
import { useCompletarPerfilGoogle } from '../hooks/useCompletarPerfilGoogle';
import { useTecladoScroll } from '../hooks/useTecladoScroll';
import { estilos } from './PantallaRegistro.estilos';

// Primera vez con Google: faltan los datos que pide el registro normal
export function PantallaCompletarPerfil() {
  const c = useCompletarPerfilGoogle();
  const fuentesListas = useFuentes();
  const teclado = useTecladoScroll();
  const [calendarioVisible, establecerCalendarioVisible] = useState(false);

  if (!fuentesListas) return <View style={{ flex: 1, backgroundColor: Colores.fondo }} />;

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          <Text style={estilos.titulo}>Completa tu perfil</Text>
          <Text style={estilos.subtitulo}>Cuenta de Google: {c.correo}</Text>

          <CampoTexto icono="person-outline" placeholder="Nombre(s)" value={c.valores.nombre} onChangeText={(t) => c.cambiar('nombre', t)} onFocus={teclado.alEnfocar} error={c.errores.nombre} autoCapitalize="words" />
          <CampoTexto icono="people-outline" placeholder="Apellido paterno" value={c.valores.apellidoPaterno} onChangeText={(t) => c.cambiar('apellidoPaterno', t)} onFocus={teclado.alEnfocar} error={c.errores.apellidoPaterno} autoCapitalize="words" />
          <CampoTexto icono="people-outline" placeholder="Apellido materno" value={c.valores.apellidoMaterno} onChangeText={(t) => c.cambiar('apellidoMaterno', t)} onFocus={teclado.alEnfocar} error={c.errores.apellidoMaterno} autoCapitalize="words" />

          <CampoSelector
            icono="calendar-outline"
            valor={c.valores.fechaNacimiento || 'Fecha de nacimiento'}
            onPress={() => establecerCalendarioVisible(true)}
          />
          {!!c.errores.fechaNacimiento && <Text style={estilos.errorFecha}>{c.errores.fechaNacimiento}</Text>}

          <CampoSelector icono="location-outline" valor={c.valores.ciudad} onPress={c.abrirCiudades} />
          <CampoTexto icono="at-outline" placeholder="Nombre de usuario" value={c.valores.nombreUsuario} onChangeText={(t) => c.cambiar('nombreUsuario', t)} onFocus={teclado.alEnfocar} error={c.errores.nombreUsuario} autoCapitalize="none" />

          <SelectorRol valor={c.valores.rol} alCambiar={(rol) => c.cambiar('rol', rol)} />

          <BotonPrimario titulo="Continuar" onPress={c.enviar} cargando={c.cargando} />
          <BotonContorno titulo="Cancelar" onPress={c.cancelar} />
        </View>

        <View style={{ height: teclado.rellenoTeclado }} />
      </ScrollView>

      <SelectorFecha
        visible={calendarioVisible}
        valor={c.valores.fechaNacimiento}
        alCerrar={() => establecerCalendarioVisible(false)}
        alElegir={(fecha) => c.cambiar('fechaNacimiento', fecha)}
      />

      <ModalCentrado visible={c.ciudadesVisible} alCerrar={c.cerrarCiudades}>
        <Text style={estilos.tituloModal}>Selecciona tu ciudad</Text>
        {CIUDADES_BAJA_CALIFORNIA.map((ciudad) => {
          const activa = c.valores.ciudad === ciudad;
          return (
            <Pressable key={ciudad} style={[estilos.opcionCiudad, activa && estilos.opcionCiudadActiva]} onPress={() => c.elegirCiudad(ciudad)}>
              <Text style={[estilos.textoCiudad, activa && estilos.textoCiudadActiva]}>{ciudad}</Text>
              {activa && <Ionicons name="checkmark" size={20} color={Colores.primario} />}
            </Pressable>
          );
        })}
      </ModalCentrado>
    </KeyboardAvoidingView>
  );
}
