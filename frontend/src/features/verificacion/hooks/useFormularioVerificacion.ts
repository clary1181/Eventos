import { useEffect, useRef, useState } from 'react';
import { sanitizarTexto } from '@/compartido/utilidades/sanitizar';
import { elegirFotoConOrigen, tomarFoto } from '@/compartido/utilidades/seleccionarImagen';
import { enviarSolicitud } from '../servicios/servicioVerificacion';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import type { SolicitudVerificacion } from '../tipos';
import { extraerInstagram, normalizarSitioWeb, soloDigitos, telefonoValido } from '../utilidades/validaciones';

export const LIMITE_DESCRIPCION = 500;
const MINIMO_DESCRIPCION = 10;

export interface ErroresVerificacion {
  telefono?: string;
  contacto?: string;
  descripcion?: string;
  selfie?: string;
  identificacion?: string;
  terminos?: string;
}

export function useFormularioVerificacion(uid: string, previa: SolicitudVerificacion | null) {
  const [telefono, establecerTelefono] = useState('');
  const [instagram, establecerInstagram] = useState('');
  const [sitioWeb, establecerSitioWeb] = useState('');
  const [descripcion, establecerDescripcion] = useState('');
  const [selfie, establecerSelfie] = useState<string | null>(null);
  const [identificacion, establecerIdentificacion] = useState<string | null>(null);
  const [terminos, establecerTerminos] = useState(false);
  const [errores, establecerErrores] = useState<ErroresVerificacion>({});
  const [enviando, establecerEnviando] = useState(false);
  const enviandoRef = useRef(false);
  const precargado = useRef(false);

  useEffect(() => {
    if (!previa || precargado.current) return;
    precargado.current = true;
    establecerTelefono(previa.telefono);
    const enlaceInstagram = previa.redes.find((r) => /instagram\.com/i.test(r));
    establecerInstagram(enlaceInstagram ? extraerInstagram(enlaceInstagram) ?? '' : '');
    establecerSitioWeb(previa.redes.find((r) => !/instagram\.com/i.test(r)) ?? '');
    establecerDescripcion(previa.descripcionActividad);
    establecerSelfie(previa.documentos.selfie?.url ?? null);
    establecerIdentificacion(previa.documentos.identificacion?.url ?? null);
  }, [previa]);

  const quitarError = (campo: keyof ErroresVerificacion) => establecerErrores((e) => ({ ...e, [campo]: undefined }));

  const cambiarTelefono = (texto: string) => {
    establecerTelefono(soloDigitos(texto).slice(0, 10));
    quitarError('telefono');
  };
  const cambiarInstagram = (texto: string) => {
    establecerInstagram(texto);
    quitarError('contacto');
  };
  const cambiarSitioWeb = (texto: string) => {
    establecerSitioWeb(texto);
    quitarError('contacto');
  };
  const cambiarDescripcion = (texto: string) => {
    establecerDescripcion(texto.slice(0, LIMITE_DESCRIPCION));
    quitarError('descripcion');
  };
  const alternarTerminos = () => {
    establecerTerminos((t) => !t);
    quitarError('terminos');
  };

  const hacerSelfie = async () => {
    const uri = await tomarFoto({ frontal: true, cuadrada: true });
    if (uri) {
      establecerSelfie(uri);
      quitarError('selfie');
    }
  };
  const elegirIdentificacion = async () => {
    const uri = await elegirFotoConOrigen('Identificación oficial (INE)');
    if (uri) {
      establecerIdentificacion(uri);
      quitarError('identificacion');
    }
  };

  const validar = () => {
    const nuevos: ErroresVerificacion = {};
    const usuarioInstagram = extraerInstagram(instagram);
    const web = normalizarSitioWeb(sitioWeb);

    if (!telefonoValido(telefono)) nuevos.telefono = 'Escribe un teléfono de 10 dígitos.';
    if (instagram.trim() && !usuarioInstagram) nuevos.contacto = 'Revisa tu usuario de Instagram.';
    else if (sitioWeb.trim() && !web) nuevos.contacto = 'Revisa la dirección de tu sitio web.';
    else if (!usuarioInstagram && !web) nuevos.contacto = 'Escribe al menos tu Instagram o tu sitio web.';
    if (sanitizarTexto(descripcion).length < MINIMO_DESCRIPCION) {
      nuevos.descripcion = `Cuéntanos un poco más (mínimo ${MINIMO_DESCRIPCION} caracteres).`;
    }
    if (!selfie) nuevos.selfie = 'Toma una selfie.';
    if (!identificacion) nuevos.identificacion = 'Agrega una foto de tu INE.';
    if (!terminos) nuevos.terminos = 'Debes aceptar para continuar.';

    establecerErrores(nuevos);
    return { validos: Object.keys(nuevos).length === 0, usuarioInstagram, web };
  };

  const enviar = async (alTerminar: () => void) => {
    if (enviandoRef.current) return;
    const { validos, usuarioInstagram, web } = validar();
    if (!validos || !selfie || !identificacion) return;

    enviandoRef.current = true;
    establecerEnviando(true);
    try {
      await enviarSolicitud(
        uid,
        {
          telefono: soloDigitos(telefono),
          instagram: usuarioInstagram,
          sitioWeb: web,
          descripcionActividad: sanitizarTexto(descripcion),
          selfie,
          identificacion,
        },
        previa,
      );
      mostrarAviso({ titulo: 'Solicitud enviada', mensaje: 'Un administrador revisará tu información. Verás aquí el resultado.', tipo: 'exito', alAceptar: alTerminar });
    } catch (error) {
      const codigo = (error as { code?: string }).code;
      const mensaje =
        codigo === 'permission-denied'
          ? 'No tienes permiso para enviar la solicitud. Cierra sesión y vuelve a entrar.'
          : error instanceof Error && error.message.startsWith('Cloudinary')
            ? `No se pudieron subir tus fotos. ${error.message}`
            : error instanceof Error && error.message.startsWith('Falta configurar')
              ? error.message
              : 'No se pudo enviar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
      mostrarAviso({ titulo: 'No se pudo enviar', mensaje, tipo: 'error' });
    } finally {
      establecerEnviando(false);
      enviandoRef.current = false;
    }
  };

  return {
    telefono, instagram, sitioWeb, descripcion, selfie, identificacion, terminos, errores, enviando,
    cambiarTelefono, cambiarInstagram, cambiarSitioWeb, cambiarDescripcion, alternarTerminos,
    hacerSelfie, elegirIdentificacion, enviar,
  };
}
