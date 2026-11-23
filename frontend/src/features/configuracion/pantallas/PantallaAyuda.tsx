import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import { EncabezadoConfig } from '../componentes/EncabezadoConfig';
import { ModalEditarContenido } from '../componentes/ModalEditarContenido';
import { AYUDA_POR_DEFECTO } from '../contenidoPorDefecto';
import { useContenido } from '../hooks/useContenido';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

const CORREO_SOPORTE = 'kjsjsbpepejkk3@gmail.com';

const escribirASoporte = async () => {
  try {
    await Linking.openURL(`mailto:${CORREO_SOPORTE}?subject=${encodeURIComponent('Soporte Eventos App')}`);
  } catch {
    mostrarAviso({ titulo: 'No se pudo abrir el correo', mensaje: 'Revisa que tengas una aplicación de correo configurada.', tipo: 'error' });
  }
};

export function PantallaAyuda() {
  useBarraEstado('dark');
  const { items, esAdmin, guardando, guardar, errorLectura } = useContenido('ayuda', AYUDA_POR_DEFECTO);
  const [abierta, setAbierta] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);

  const preguntas = [
    ...items.map((i) => ({ p: i.titulo, r: i.texto, correo: false })),
    { p: '¿Cómo contacto a soporte?', r: 'Escríbenos desde el siguiente enlace:', correo: true },
  ];

  return (
    <View style={estilos.raiz}>
      <EncabezadoConfig titulo="Centro de ayuda" />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        {esAdmin && (
          <Pressable style={estilos.editar} onPress={() => setEditando(true)} accessibilityRole="button">
            <Ionicons name="create-outline" size={18} color={Colores.primario} />
            <Text style={estilos.textoEditar}>Editar preguntas frecuentes</Text>
          </Pressable>
        )}
        {esAdmin && errorLectura && (
          <Text style={estilos.aviso}>No se pudo leer el contenido guardado. Revisa que las reglas de contenidoApp estén publicadas en Firestore.</Text>
        )}
        {preguntas.map((q, i) => {
          const activa = abierta === i;
          return (
            <Pressable key={`${i}-${q.p}`} style={estilos.tarjeta} onPress={() => setAbierta(activa ? null : i)} accessibilityRole="button">
              <View style={estilos.fila}>
                <Text style={estilos.pregunta}>{q.p}</Text>
                <Ionicons name={activa ? 'chevron-up' : 'chevron-down'} size={20} color={Colores.primario} />
              </View>
              {activa && <Text style={estilos.respuesta}>{q.r}</Text>}
              {activa && q.correo && (
                <Pressable onPress={escribirASoporte} style={estilos.enlace} accessibilityRole="link" accessibilityLabel="Escribir a soporte">
                  <Ionicons name="mail-outline" size={18} color={Colores.primario} />
                  <Text style={estilos.textoEnlace}>Soporte Eventos App</Text>
                </Pressable>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {esAdmin && (
        <ModalEditarContenido
          visible={editando}
          titulo="Editar centro de ayuda"
          etiquetaTitulo="Pregunta"
          etiquetaTexto="Respuesta"
          items={items}
          guardando={guardando}
          alCerrar={() => setEditando(false)}
          alGuardar={guardar}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { padding: Espaciado.xl, paddingTop: Espaciado.sm, gap: Espaciado.md, paddingBottom: 48 },
  editar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: Radios.boton, borderWidth: 1.5, borderColor: Colores.primario },
  aviso: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.error },
  textoEditar: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.negrita, color: Colores.primario },
  tarjeta: { backgroundColor: Colores.fondoSuave, borderRadius: Radios.tarjeta, padding: Espaciado.lg, gap: Espaciado.sm },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.md },
  pregunta: { flex: 1, fontSize: Tipografia.cuerpo, fontFamily: Fuentes.seminegrita, color: Colores.primarioOscuro },
  respuesta: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 22 },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: Espaciado.xs },
  textoEnlace: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.negrita, color: Colores.primario, textDecorationLine: 'underline' },
});
