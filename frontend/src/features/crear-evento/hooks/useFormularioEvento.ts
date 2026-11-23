import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSesion } from '@/features/auth';
import { crearEvento } from '../servicios/servicioCrearEvento';
import { analizarCambios, editarEvento, editarEventoPublicado } from '../servicios/servicioEditarEvento';
import { desdeEvento, FORMULARIO_VACIO, type DatosFormularioEvento, type EventoEditable } from '../tipos';
import { validarEvento } from '../utilidades/validaciones';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

const TRES_HORAS_MS = 3 * 60 * 60 * 1000;

export function useFormularioEvento(editando?: EventoEditable) {
  const router = useRouter();
  const { perfil } = useSesion();
  const [datos, setDatos] = useState<DatosFormularioEvento>(() => (editando ? desdeEvento(editando) : FORMULARIO_VACIO));
  const [enviando, setEnviando] = useState(false);
  const [reinicios, setReinicios] = useState(0);

  const cambiar = useCallback(<K extends keyof DatosFormularioEvento>(campo: K, valor: DatosFormularioEvento[K]) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
  }, []);

  const cambiarInicio = useCallback((inicio: Date | null) => {
    setDatos((previos) => {
      if (!inicio) return { ...previos, fechaInicio: null };
      const finValido = previos.fechaFin && previos.fechaFin.getTime() > inicio.getTime();
      return { ...previos, fechaInicio: inicio, fechaFin: finValido ? previos.fechaFin : new Date(inicio.getTime() + TRES_HORAS_MS) };
    });
  }, []);

  const elegirFoto = useCallback(async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!r.canceled && r.assets[0]) cambiar('fotoUri', r.assets[0].uri);
    } catch {
      mostrarAviso({ titulo: 'No se pudo abrir la galería', mensaje: 'Revisa los permisos de fotos e inténtalo de nuevo.', tipo: 'error' });
    }
  }, [cambiar]);

  const enviar = useCallback(async () => {
    if (!perfil || enviando) return;
    const error = validarEvento(
      datos,
      editando
        ? { inicioSinCambios: datos.fechaInicio?.getTime() === editando.fechaInicio.getTime(), vendidas: editando.vendidas }
        : {}
    );
    if (error) return mostrarAviso({ titulo: 'Revisa el formulario', mensaje: error, tipo: 'error' });

    try {
      if (editando && editando.estado === 'aprobado') {
        const previo = analizarCambios(editando, datos);
        if (previo.sensibles.length > 0) {
          const confirmado = await new Promise<boolean>((resolver) =>
            mostrarAviso({
              titulo: 'Cambios que requieren revisión',
              mensaje: `Cambiaste: ${previo.sensibles.join(', ')}.\n\n` +
                (editando.vendidas === 0
                  ? 'El evento dejará de ser visible hasta que el administrador lo apruebe de nuevo.'
                  : 'Como ya hay entradas vendidas, estos cambios se enviarán al administrador y el evento seguirá publicado como está hasta que los apruebe.'),
              tipo: 'info',
              textoCancelar: 'Cancelar',
              alCancelar: () => resolver(false),
              textoConfirmar: 'Enviar',
              alConfirmar: () => resolver(true),
            })
          );
          if (!confirmado) return;
        }
        setEnviando(true);
        const cambios = await editarEventoPublicado(editando, datos);
        mostrarAviso({
          titulo: cambios.sensibles.length > 0 ? 'Cambios enviados' : 'Cambios guardados',
          mensaje: cambios.sensibles.length > 0 ? 'Quedaron en revisión. Verás aquí la respuesta del administrador.' : 'Tus cambios ya se publicaron.',
          tipo: 'exito',
          alAceptar: () => router.back(),
        });
      } else if (editando) {
        setEnviando(true);
        await editarEvento(editando.id, datos, editando);
        mostrarAviso({
          titulo: 'Evento reenviado',
          mensaje: 'Tus cambios quedaron en revisión. Te mostraremos la respuesta del administrador.',
          tipo: 'exito',
          alAceptar: () => router.back(),
        });
      } else {
        setEnviando(true);
        await crearEvento({ uid: perfil.uid, nombre: perfil.nombre, apellidos: perfil.apellidos }, datos);
        setDatos(FORMULARIO_VACIO);
        setReinicios((n) => n + 1);
        mostrarAviso({
          titulo: 'Evento enviado',
          mensaje: 'Quedó en revisión. Cuando el administrador lo apruebe será visible para los asistentes.',
          tipo: 'exito',
          textoAceptar: 'Ver mis eventos',
          alAceptar: () => router.replace('/organizador/mis-eventos'),
        });
      }
    } catch (e) {
      console.error('Error al guardar el evento:', e);
      const codigo = (e as { code?: string })?.code;
      const detalle = e instanceof Error ? e.message : '';
      const esEdicion = (e as { esEdicion?: boolean })?.esEdicion === true;
      mostrarAviso({
        titulo: editando ? 'No se pudo guardar el evento' : 'No se pudo crear el evento',
        mensaje: codigo === 'permission-denied'
          ? 'Tu cuenta debe estar verificada y sin suspensión vigente, el evento no debe haber terminado y no puedes tener otro cambio en revisión.'
          : esEdicion || detalle.startsWith('Cloudinary') || detalle.startsWith('Falta')
            ? detalle
            : 'Revisa tu conexión e inténtalo de nuevo.',
        tipo: 'error',
      });
    } finally {
      setEnviando(false);
    }
  }, [perfil, datos, enviando, editando, router]);

  return { datos, cambiar, cambiarInicio, elegirFoto, enviar, enviando, reinicios };
}
