import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarraEstado } from '@/compartido/utilidades/useBarraEstado';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import { EncabezadoConfig } from '../componentes/EncabezadoConfig';
import { ModalEditarContenido } from '../componentes/ModalEditarContenido';
import { LEGAL_POR_DEFECTO } from '../contenidoPorDefecto';
import { useContenido } from '../hooks/useContenido';

export function PantallaLegal() {
  useBarraEstado('dark');
  const { items, esAdmin, guardando, guardar, errorLectura } = useContenido('legal', LEGAL_POR_DEFECTO);
  const [editando, setEditando] = useState(false);

  return (
    <View style={estilos.raiz}>
      <EncabezadoConfig titulo="Información legal" />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        {esAdmin && (
          <Pressable style={estilos.editar} onPress={() => setEditando(true)} accessibilityRole="button">
            <Ionicons name="create-outline" size={18} color={Colores.primario} />
            <Text style={estilos.textoEditar}>Editar información legal</Text>
          </Pressable>
        )}
        {esAdmin && errorLectura && (
          <Text style={estilos.aviso}>No se pudo leer el contenido guardado. Revisa que las reglas de contenidoApp estén publicadas en Firestore.</Text>
        )}
        {items.map((s, i) => (
          <View key={`${i}-${s.titulo}`} style={{ gap: Espaciado.sm }}>
            <Text style={estilos.titulo}>{s.titulo}</Text>
            <Text style={estilos.texto}>{s.texto}</Text>
          </View>
        ))}
      </ScrollView>
      {esAdmin && (
        <ModalEditarContenido
          visible={editando}
          titulo="Editar información legal"
          etiquetaTitulo="Sección"
          etiquetaTexto="Texto"
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
  contenido: { padding: Espaciado.xl, paddingTop: Espaciado.sm, gap: Espaciado.xl, paddingBottom: 48 },
  editar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: Radios.boton, borderWidth: 1.5, borderColor: Colores.primario },
  aviso: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.error },
  textoEditar: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.negrita, color: Colores.primario },
  titulo: { fontSize: Tipografia.subtitulo + 2, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  texto: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.texto, lineHeight: 22 },
});
