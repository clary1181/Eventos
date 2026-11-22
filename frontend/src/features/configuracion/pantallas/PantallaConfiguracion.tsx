import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import { cerrarSesion, useSesion } from '@/features/auth';
import { usaContrasenia } from '@/features/auth/servicios/servicioAuth';
import { ModalEditarPerfil } from '@/features/asistente/componentes/ModalEditarPerfil';
import { EncabezadoConfig } from '../componentes/EncabezadoConfig';
import { ModalCambiarContrasenia } from '../componentes/ModalCambiarContrasenia';
import { SeccionConfiguracion } from '../componentes/SeccionConfiguracion';
import { useEditarPerfil } from '../hooks/useEditarPerfil';
import { seccionesPorRol } from '../secciones';
import type { FilaConfig, SeccionConfig } from '../tipos';

// Pantalla única para los tres roles: las secciones propias dependen del rol de la sesión
export function PantallaConfiguracion() {
  useBarraEstado('dark');
  const router = useRouter();
  const { perfil } = useSesion();
  const puedeEditarPerfil = !!perfil && perfil.rol !== 'administrador'; // el admin no edita su perfil
  const editar = useEditarPerfil(puedeEditarPerfil ? perfil?.uid : undefined);
  const [cambiandoClave, setCambiandoClave] = useState(false);
  const [editando, setEditando] = useState(false);
  if (!perfil) return null;

  const ir = (ruta: string) => router.push(ruta as Href);

  const filasCuenta: FilaConfig[] = [];
  if (puedeEditarPerfil) {
    filasCuenta.push({ icono: 'person-outline', titulo: 'Editar perfil', descripcion: 'Nombre, apellidos, ciudad y biografía', alPulsar: () => editar.perfil && setEditando(true) });
  }
  if (usaContrasenia()) {
    filasCuenta.push({ icono: 'lock-closed-outline', titulo: 'Cambiar contraseña', alPulsar: () => setCambiandoClave(true) });
  }
  const cuenta: SeccionConfig = { titulo: 'Cuenta y seguridad', filas: filasCuenta };

  const soporte: SeccionConfig = {
    titulo: 'Ayuda e información',
    filas: [
      { icono: 'help-circle-outline', titulo: 'Centro de ayuda', descripcion: perfil.rol === 'administrador' ? 'Preguntas frecuentes (editable)' : 'Preguntas frecuentes', alPulsar: () => ir('/ayuda') },
      { icono: 'document-text-outline', titulo: 'Información legal', descripcion: perfil.rol === 'administrador' ? 'Términos, privacidad y reglas (editable)' : 'Términos, privacidad y reglas', alPulsar: () => ir('/legal') },
    ],
  };

  const secciones = [cuenta, ...seccionesPorRol(perfil.rol, ir), soporte].filter((s) => s.filas.length > 0);

  const confirmarSalida = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => cerrarSesion() },
    ]);

  return (
    <View style={estilos.raiz}>
      <EncabezadoConfig titulo="Configuración" />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        {secciones.map((s) => <SeccionConfiguracion key={s.titulo} seccion={s} />)}

        <Pressable style={estilos.salir} onPress={confirmarSalida} accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color={Colores.error} />
          <Text style={estilos.textoSalir}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
      <ModalCambiarContrasenia visible={cambiandoClave} alCerrar={() => setCambiandoClave(false)} />
      {editar.perfil && (
        <ModalEditarPerfil
          visible={editando}
          perfil={editar.perfil}
          guardando={editar.guardando}
          alCerrar={() => setEditando(false)}
          alGuardar={editar.guardarDatos}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { padding: Espaciado.xl, paddingTop: Espaciado.sm, gap: Espaciado.xl, paddingBottom: 48 },
  salir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Espaciado.sm, height: 52, borderRadius: Radios.boton, backgroundColor: Colores.errorFondo },
  textoSalir: { fontSize: Tipografia.cuerpo + 1, fontFamily: Fuentes.negrita, color: Colores.error },
});
