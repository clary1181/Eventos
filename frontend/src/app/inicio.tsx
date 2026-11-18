import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { BotonContorno } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { cerrarSesion, useSesion } from '@/features/auth';

// PROVISIONAL: sirve para comprobar que el login funciona.
// Se reemplazará por los grupos (asistente), (organizador) y (administrador).
export default function Inicio() {
  const { perfil } = useSesion();
  if (!perfil) return <Redirect href="/iniciar-sesion" />;

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>¡Hola, {perfil.nombre}!</Text>
      <Text style={estilos.texto}>@{perfil.nombreUsuario} · {perfil.rol}</Text>
      <View style={{ width: '100%', marginTop: 24 }}>
        <BotonContorno titulo="Cerrar sesión" onPress={cerrarSesion} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colores.fondo },
  titulo: { fontSize: 28, fontWeight: '800', color: Colores.primarioOscuro },
  texto: { fontSize: 16, color: Colores.textoSuave, marginTop: 8 },
});
