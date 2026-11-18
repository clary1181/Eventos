import { useState } from 'react';
import { mensajeDeError } from '../utilidades/errores';
import { validarCorreo } from '../utilidades/validaciones';
import { recuperarContrasenia } from '../servicios/servicioAuth';

export function useRecuperarContrasenia() {
  const [visible, establecerVisible] = useState(false);
  const [correo, establecerCorreo] = useState('');
  const [error, establecerError] = useState('');
  const [enviando, establecerEnviando] = useState(false);
  const [confirmacionVisible, establecerConfirmacionVisible] = useState(false);

  const abrir = (correoInicial = '') => {
    establecerCorreo(correoInicial.trim());
    establecerError('');
    establecerVisible(true);
  };

  const cerrar = () => establecerVisible(false);
  const cerrarConfirmacion = () => establecerConfirmacionVisible(false);

  const enviar = async () => {
    const mensaje = validarCorreo(correo);
    establecerError(mensaje);
    if (mensaje) return;

    establecerEnviando(true);
    try {
      await recuperarContrasenia(correo);
      establecerVisible(false);
      establecerConfirmacionVisible(true);
    } catch (e) {
      establecerError(mensajeDeError(e));
    } finally {
      establecerEnviando(false);
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