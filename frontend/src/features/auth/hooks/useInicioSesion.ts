import { useState } from 'react';
import { TipoAviso } from '../componentes/ModalAviso';
import { codigoDeError, mensajeDeError } from '../utilidades/errores';
import { validarCorreo } from '../utilidades/validaciones';
import { iniciarSesion, reenviarCorreoVerificacion } from '../servicios/servicioAuth';

export interface AvisoInicioSesion {
  titulo: string;
  mensaje: string;
  tipo: TipoAviso;
  // Si es true, se ofrece el botón "Reenviar correo"
  permiteReenvio?: boolean;
}

// Lógica de la pantalla de inicio de sesión (sin nada de diseño)
export function useInicioSesion() {
  const [correo, establecerCorreo] = useState('');
  const [contrasenia, establecerContrasenia] = useState('');
  const [errorCorreo, establecerErrorCorreo] = useState('');
  const [errorContrasenia, establecerErrorContrasenia] = useState('');
  const [cargando, establecerCargando] = useState(false);
  const [aviso, establecerAviso] = useState<AvisoInicioSesion | null>(null);
  const [reenviando, establecerReenviando] = useState(false);

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
    }
  };

  const enviar = async () => {
    const eCorreo = validarCorreo(correo);
    const eContrasenia = contrasenia ? '' : 'Ingresa tu contraseña.';
    establecerErrorCorreo(eCorreo);
    establecerErrorContrasenia(eContrasenia);
    if (eCorreo || eContrasenia) return;

    establecerCargando(true);
    try {
      await iniciarSesion(correo, contrasenia);
      // La redirección la hace la ruta (auth) al detectar la sesión
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
    }
  };

  const iniciarConGoogle = () => {
    establecerAviso({
      titulo: 'Próximamente',
      mensaje: 'Iniciar con Google necesita un build de desarrollo y se activará más adelante.',
      tipo: 'info',
    });
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