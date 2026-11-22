import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores, Espaciado, Fuentes, Radios, Tipografia } from '@/compartido/tema';
import { MAX_ITEMS, MAX_TEXTO, MAX_TITULO, type ItemContenido } from '../servicios/servicioContenido';

interface Propiedades {
  visible: boolean;
  titulo: string;          // título del modal
  etiquetaTitulo: string;  // "Pregunta", "Sección"...
  etiquetaTexto: string;   // "Respuesta", "Texto"...
  items: ItemContenido[];
  guardando: boolean;
  alCerrar: () => void;
  alGuardar: (items: ItemContenido[]) => Promise<boolean>;
}

export function ModalEditarContenido({ visible, titulo, etiquetaTitulo, etiquetaTexto, items, guardando, alCerrar, alGuardar }: Propiedades) {
  const [lista, setLista] = useState<ItemContenido[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que se abre, parte de la versión actual
  useEffect(() => {
    if (visible) { setLista(items.map((i) => ({ ...i }))); setError(null); }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const cambiar = (i: number, campo: keyof ItemContenido, valor: string) => {
    setLista((l) => l.map((x, k) => (k === i ? { ...x, [campo]: valor } : x)));
    setError(null);
  };
  const quitar = (i: number) => setLista((l) => l.filter((_, k) => k !== i));
  const mover = (i: number, delta: number) =>
    setLista((l) => {
      const j = i + delta;
      if (j < 0 || j >= l.length) return l;
      const copia = [...l];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  const agregar = () => setLista((l) => (l.length >= MAX_ITEMS ? l : [...l, { titulo: '', texto: '' }]));

  const guardar = async () => {
    if (lista.length < 1) return setError('Debe haber al menos un elemento.');
    for (let i = 0; i < lista.length; i++) {
      const t = lista[i].titulo.trim();
      const x = lista[i].texto.trim();
      if (t.length < 1 || t.length > MAX_TITULO) return setError(`${etiquetaTitulo} ${i + 1}: escribe un título (máx. ${MAX_TITULO} caracteres).`);
      if (x.length < 1 || x.length > MAX_TEXTO) return setError(`${etiquetaTitulo} ${i + 1}: escribe el texto (máx. ${MAX_TEXTO} caracteres).`);
    }
    if (await alGuardar(lista)) alCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => !guardando && alCerrar()}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={{ flex: 1 }} onPress={() => !guardando && alCerrar()} />
        <View style={estilos.hoja}>
          <View style={estilos.cabecera}>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Pressable onPress={alCerrar} disabled={guardando} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: Espaciado.md, paddingBottom: Espaciado.md }}>
            {lista.map((item, i) => (
              <View key={i} style={estilos.tarjeta}>
                <View style={estilos.filaTarjeta}>
                  <Text style={estilos.numero}>{etiquetaTitulo} {i + 1}</Text>
                  <View style={estilos.acciones}>
                    <Pressable onPress={() => mover(i, -1)} disabled={i === 0} hitSlop={8} accessibilityLabel="Subir" style={i === 0 && { opacity: 0.3 }}>
                      <Ionicons name="arrow-up" size={20} color={Colores.primario} />
                    </Pressable>
                    <Pressable onPress={() => mover(i, 1)} disabled={i === lista.length - 1} hitSlop={8} accessibilityLabel="Bajar" style={i === lista.length - 1 && { opacity: 0.3 }}>
                      <Ionicons name="arrow-down" size={20} color={Colores.primario} />
                    </Pressable>
                    <Pressable onPress={() => quitar(i)} hitSlop={8} accessibilityLabel="Eliminar">
                      <Ionicons name="trash-outline" size={20} color={Colores.error} />
                    </Pressable>
                  </View>
                </View>
                <TextInput
                  style={estilos.campo}
                  value={item.titulo}
                  onChangeText={(t) => cambiar(i, 'titulo', t)}
                  placeholder={etiquetaTitulo}
                  placeholderTextColor={Colores.textoSuave}
                  maxLength={MAX_TITULO}
                  editable={!guardando}
                />
                <TextInput
                  style={[estilos.campo, estilos.campoLargo]}
                  value={item.texto}
                  onChangeText={(t) => cambiar(i, 'texto', t)}
                  placeholder={etiquetaTexto}
                  placeholderTextColor={Colores.textoSuave}
                  maxLength={MAX_TEXTO}
                  multiline
                  editable={!guardando}
                />
              </View>
            ))}

            <Pressable
              onPress={agregar}
              disabled={lista.length >= MAX_ITEMS || guardando}
              style={[estilos.agregar, lista.length >= MAX_ITEMS && { opacity: 0.4 }]}
              accessibilityRole="button"
            >
              <Ionicons name="add" size={20} color={Colores.primario} />
              <Text style={estilos.textoAgregar}>Agregar {etiquetaTitulo.toLowerCase()}</Text>
            </Pressable>

            {!!error && <Text style={estilos.error}>{error}</Text>}

            <Pressable style={[estilos.boton, guardando && { opacity: 0.7 }]} onPress={guardar} disabled={guardando} accessibilityRole="button">
              {guardando ? <ActivityIndicator color={Colores.textoSobrePrimario} /> : <Text style={estilos.textoBoton}>Guardar cambios</Text>}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  hoja: { backgroundColor: Colores.fondo, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28, maxHeight: '94%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Espaciado.md },
  titulo: { fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro },
  tarjeta: { backgroundColor: Colores.fondoSuave, borderRadius: Radios.tarjeta, padding: Espaciado.md, gap: Espaciado.sm },
  filaTarjeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  numero: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.negrita, color: Colores.primarioOscuro },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: Espaciado.lg },
  campo: { minHeight: 46, borderRadius: Radios.campo, borderWidth: 1, borderColor: Colores.borde, backgroundColor: Colores.fondo, paddingHorizontal: Espaciado.md, paddingVertical: 10, fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.texto },
  campoLargo: { minHeight: 100, textAlignVertical: 'top' },
  agregar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 48, borderRadius: Radios.boton, borderWidth: 1.5, borderColor: Colores.primario },
  textoAgregar: { fontSize: Tipografia.cuerpo, fontFamily: Fuentes.negrita, color: Colores.primario },
  error: { fontSize: Tipografia.pequeno, fontFamily: Fuentes.seminegrita, color: Colores.error },
  boton: { height: 54, borderRadius: 27, backgroundColor: Colores.primario, alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: Colores.textoSobrePrimario, fontSize: 16, fontFamily: Fuentes.extranegrita },
});
