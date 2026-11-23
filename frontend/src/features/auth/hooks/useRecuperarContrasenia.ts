import { useRef, useState } from 'react';
import { mensajeDeError } from '../utilidades/errores';
import { validarCorreo } from '../utilidades/validaciones';
import { recuperarContrasenia } from '../servicios/servicioAuth';

export function useRecuperarContrasenia() {
  const [visible, establecerVisible] = useState(false);
  const [correo, establecerCorreo] = useState('');
  const [error, establecerError] = useState('');
  const [enviando, establecerEnviando] = useState(false);
  const [confirmacionVisible, establecerConfirmacionVisible] = useState(false);
  const enviandoRef = useRef(false);

  const abrir = (correoInicial = '') => {
    establecerCorreo(correoInicial.trim());
    establecerError('');
    establecerVisible(true);
  };

  const cerrar = () => {
    if (!enviandoRef.current) establecerVisible(false);
  };
  const cerrarConfirmacion = () => establecerConfirmacionVisible(false);

  const enviar = async () => {
    if (enviandoRef.current) return;
    const mensaje = validarCorreo(correo);
    establecerError(mensaje);
    if (mensaje) return;

    enviandoRef.current = true;
    establecerEnviando(true);
    try {
      await recuperarContrasenia(correo);
      establecerVisible(false);
      establecerConfirmacionVisible(true);
    } catch (e) {
      establecerError(mensajeDeError(e));
    } finally {
      establecerEnviando(false);
      enviandoRef.current = false;
    }
  };

  return {
    visible,
    correo,
    establecerCorreo,
    error,
    enviando,
    confirmacionVisible,
    abrir,
    cerrar,
    cerrarConfirmacion,
    enviar,
  };
}