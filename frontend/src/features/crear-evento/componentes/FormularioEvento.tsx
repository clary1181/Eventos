import React, { ReactNode } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colores } from '@/compartido/tema';
import { CATEGORIAS_EVENTO } from '../categorias';
import type { useFormularioEvento } from '../hooks/useFormularioEvento';
import { estilos } from '../pantallas/PantallaCrearEvento.estilos';
import { CampoFechaHora } from './CampoFechaHora';
import { CampoFormulario } from './CampoFormulario';
import { SelectorFoto } from './SelectorFoto';

interface Propiedades {
  formulario: ReturnType<typeof useFormularioEvento>;
  titulo: string;
  subtitulo: string;
  textoBoton: string;
  superior?: ReactNode; // p. ej. el botón de volver
  avisos?: ReactNode;   // avisos extra (como las correcciones del administrador)
}

// Cuerpo del formulario, compartido por "Crear evento" y "Corregir evento"
export function FormularioEvento({ formulario: f, titulo, subtitulo, textoBoton, superior, avisos }: Propiedades) {
  const { top } = useSafeAreaInsets();
  const { datos, cambiar, cambiarInicio, elegirFoto, enviar, enviando, reinicios } = f;

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        key={reinicios}
        contentContainerStyle={[estilos.contenido, { paddingTop: top + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {superior}
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.subtitulo}>{subtitulo}</Text>

        {avisos}
        <View style={estilos.aviso}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colores.primario} />
          <Text style={estilos.textoAviso}>Todo evento se revisa antes de publicarse. Te avisaremos cuando el administrador lo apruebe.</Text>
        </View>

        <Text style={estilos.seccion}>INFORMACIÓN</Text>
        <CampoFormulario etiqueta="Título" contador={100} value={datos.titulo} onChangeText={(t) => cambiar('titulo', t)} placeholder="Ej. Festival de Jazz en el Muelle" />
        <CampoFormulario
          etiqueta="Descripción" contador={2000} value={datos.descripcion} onChangeText={(t) => cambiar('descripcion', t)}
          placeholder="¿De qué trata? ¿Qué pueden esperar los asistentes?" multiline textAlignVertical="top" style={{ minHeight: 110, paddingTop: 12 }}
        />
        <Text style={estilos.etiquetaChips}>Categoría</Text>
        <View style={estilos.chips}>
          {CATEGORIAS_EVENTO.map((c) => {
            const activa = datos.categoria === c;
            return (
              <Pressable key={c} onPress={() => cambiar('categoria', c)} style={[estilos.chip, activa && estilos.chipActivo]} accessibilityRole="button">
                <Text style={[estilos.textoChip, activa && estilos.textoChipActivo]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>
        <SelectorFoto uri={datos.fotoUri} alPulsar={elegirFoto} />

        <Text style={estilos.seccion}>FECHA Y LUGAR</Text>
        <CampoFechaHora etiqueta="Inicio" valor={datos.fechaInicio} alCambiar={cambiarInicio} />
        <CampoFechaHora etiqueta="Fin" valor={datos.fechaFin} alCambiar={(fecha) => cambiar('fechaFin', fecha)} />
        <CampoFormulario etiqueta="Lugar" contador={100} value={datos.lugar} onChangeText={(t) => cambiar('lugar', t)} placeholder="Ej. Muelle Turístico" />
        <CampoFormulario etiqueta="Dirección en Ensenada" contador={200} value={datos.direccion} onChangeText={(t) => cambiar('direccion', t)} placeholder="Calle, número, colonia" />

        <Text style={estilos.seccion}>BOLETOS</Text>
        <View style={estilos.fila}>
          <View style={estilos.columna}>
            <CampoFormulario etiqueta="Precio (MXN)" value={datos.precio} onChangeText={(t) => cambiar('precio', t.replace(/[^0-9.,]/g, ''))} placeholder="0 si es gratis" keyboardType="decimal-pad" maxLength={9} />
          </View>
          <View style={estilos.columna}>
            <CampoFormulario etiqueta="Capacidad" value={datos.capacidad} onChangeText={(t) => cambiar('capacidad', t.replace(/\D/g, ''))} placeholder="100" keyboardType="number-pad" maxLength={6} />
          </View>
        </View>

        <Pressable
          onPress={enviar}
          disabled={enviando}
          style={({ pressed }) => [estilos.boton, (enviando || pressed) && estilos.botonDeshabilitado]}
          accessibilityRole="button"
        >
          {enviando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.textoBoton}>{textoBoton}</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
