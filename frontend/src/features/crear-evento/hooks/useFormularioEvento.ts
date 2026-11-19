import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSesion } from '@/features/auth';
import { crearEvento } from '../servicios/servicioCrearEvento';
import { editarEvento } from '../servicios/servicioEditarEvento';
import { desdeEvento, FORMULARIO_VACIO, type DatosFormularioEvento, type EventoEditable } from '../tipos';
import { validarEvento } from '../utilidades/validaciones';

const TRES_HORAS_MS = 3 * 60 * 60 * 1000;

// Sin argumento crea un evento; con un evento carga sus datos y, al enviar, lo corrige y lo reenvía a revisión
export function useFormularioEvento(editando?: EventoEditable) {
  const router = useRouter();
  const { perfil } = useSesion();
  const [datos, setDatos] = useState<DatosFormularioEvento>(() => (editando ? desdeEvento(editando) : FORMULARIO_VACIO));
  const [enviando, setEnviando] = useState(false);
  const [reinicios, setReinicios] = useState(0); // cambia la key del formulario para limpiar los campos

  const cambiar = useCallback(<K extends keyof DatosFormularioEvento>(campo: K, valor: DatosFormularioEvento[K]) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
  }, []);

  // Al elegir el inicio, el fin se propone 3 horas después si aún no hay uno válido
  const cambiarInicio = useCallback((inicio: Date | null) => {
    setDatos((previos) => {
      if (!inicio) return { ...previos, fechaInicio: null };
      const finValido = previos.fechaFin && previos.fechaFin.getTime() > inicio.getTime();
      return { ...previos, fechaInicio: inicio, fechaFin: finValido ? previos.fechaFin : new Date(inicio.getTime() + TRES_HORAS_MS) };
    });
  }, []);

  const elegirFoto = useCallback(async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!r.canceled && r.assets[0]) cambiar('fotoUri', r.assets[0].uri);
  }, [cambiar]);

  const enviar = useCallback(async () => {
    if (!perfil || enviando) return;
    const error = validarEvento(
      datos,
      editando
        ? { inicioSinCambios: datos.fechaInicio?.getTime() === editando.fechaInicio.getTime(), vendidas: editando.vendidas }
        : {}
    );
    if (error) return Alert.alert('Revisa el formulario', error);

    setEnviando(true);
    try {
      if (editando) {
        await editarEvento(editando.id, datos);
        Alert.alert('Evento reenviado', 'Tus cambios quedaron en revisión. Te mostraremos la respuesta del administrador.', [
          { text: 'Entendido', onPress: () => router.back() },
        ]);
      } else {
        await crearEvento({ uid: perfil.uid, nombre: perfil.nombre, apellidos: perfil.apellidos }, datos);
        setDatos(FORMULARIO_VACIO);
        setReinicios((n) => n + 1);
        Alert.alert('Evento enviado', 'Quedó en revisión. Cuando el administrador lo apruebe será visible para los asistentes.', [
          { text: 'Ver mis eventos', onPress: () => router.replace('/organizador/mis-eventos') },
        ]);
      }
    } catch (e) {
      console.error('Error al guardar el evento:', e);
      const codigo = (e as { code?: string })?.code;
      const detalle = e instanceof Error ? e.message : '';
      Alert.alert(
        editando ? 'No se pudo reenviar el evento' : 'No se pudo crear el evento',
        codigo === 'permission-denied'
          ? 'Tu cuenta debe estar verificada y activa, y el evento no debe haber terminado ni estar ya publicado.'
          : detalle.startsWith('Cloudinary') || detalle.startsWith('Falta')
            ? detalle
            : 'Revisa tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setEnviando(false);
    }
  }, [perfil, datos, enviando, editando, router]);

  return { datos, cambiar, cambiarInicio, elegirFoto, enviar, enviando, reinicios };
}
