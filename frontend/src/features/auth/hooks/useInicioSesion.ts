import { useRef, useState } from 'react';
import { TipoAviso } from '../componentes/ModalAviso';
import { codigoDeError, mensajeDeError } from '../utilidades/errores';
import { validarCorreo } from '../utilidades/validaciones';
import { iniciarSesion, iniciarSesionConGoogle, reenviarCorreoVerificacion } from '../servicios/servicioAuth';

export interface AvisoInicioSesion {
  titulo: string;
  mensaje: string;
  tipo: TipoAviso;

  permiteReenvio?: boolean;
}

export function useInicioSesion() {
  const [correo, establecerCorreo] = useState('');
  const [contrasenia, establecerContrasenia] = useState('');
  const [errorCorreo, establecerErrorCorreo] = useState('');
  const [errorContrasenia, establecerErrorContrasenia] = useState('');
  const [cargando, establecerCargando] = useState(false);
  const [aviso, establecerAviso] = useState<AvisoInicioSesion | null>(null);
  const [reenviando, establecerReenviando] = useState(false);
  const enviandoRef = useRef(false);
  const googleRef = useRef(false);

  const cambiarCorreo = (texto: string) => {
    establecerCorreo(texto);
    if (errorCorreo) establecerErrorCorreo('');
  };

  const cambiarContrasenia = (texto: string) => {
    establecerContrasenia(texto);
    if (errorContrasenia) establecerErrorContrasenia('');
  };

  const cerrarAviso = () => establecerAviso(null);

  const reenviarCorreo = async () => {
    if (reenviando || enviandoRef.current) return;
    enviandoRef.current = true;
    establecerReenviando(true);
    try {
      await reenviarCorreoVerificacion(correo, contrasenia);
      establecerAviso({
        titulo: 'Correo enviado',
        mensaje: 'Te enviamos un nuevo enlace de verificación. Revisa también spam.',
        tipo: 'exito',
      });
    } catch (error) {
      establecerAviso({ titulo: 'No se pudo reenviar', mensaje: mensajeDeError(error), tipo: 'error' });
    } finally {
      establecerReenviando(false);
      enviandoRef.current = false;
    }
  };

  const enviar = async () => {
    if (cargando || enviandoRef.current) return;
    enviandoRef.current = true;
    const eCorreo = validarCorreo(correo);
    const eContrasenia = contrasenia ? '' : 'Ingresa tu contraseña.';
    establecerErrorCorreo(eCorreo);
    establecerErrorContrasenia(eContrasenia);
    if (eCorreo || eContrasenia) {
      enviandoRef.current = false;
      return;
    }

    establecerCargando(true);
    try {
      await iniciarSesion(correo, contrasenia);

    } catch (error) {
      if (codigoDeError(error) === 'auth/correo-no-verificado') {
        establecerAviso({
          titulo: 'Verifica tu correo',
          mensaje: 'Aún no has confirmado tu correo. Abre el enlace que te enviamos (revisa también spam).',
          tipo: 'info',
          permiteReenvio: true,
        });
      } else {
        establecerAviso({ titulo: 'No se pudo iniciar sesión', mensaje: mensajeDeError(error), tipo: 'error' });
      }
    } finally {
      establecerCargando(false);
      enviandoRef.current = false;
    }
  };

  const iniciarConGoogle = async () => {
    if (cargando || googleRef.current) return;
    googleRef.current = true;
    establecerCargando(true);
    try {
      await iniciarSesionConGoogle();

    } catch (error) {
      establecerAviso({ titulo: 'No se pudo iniciar con Google', mensaje: mensajeDeError(error), tipo: 'error' });
    } finally {
      establecerCargando(false);
      googleRef.current = false;
    }
  };

  return {
    correo,
    contrasenia,
    errorCorreo,
    errorContrasenia,
    cargando,
    aviso,
    reenviando,
    cambiarCorreo,
    cambiarContrasenia,
    enviar,
    iniciarConGoogle,
    cerrarAviso,
    reenviarCorreo,
  };
}
