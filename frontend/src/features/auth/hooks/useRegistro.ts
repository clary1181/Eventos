import { useState } from 'react';
import { Alert } from 'react-native';
import { sanitizarTexto } from '@/compartido/utilidades/sanitizar';
import { CIUDADES_BAJA_CALIFORNIA } from '../constantes';
import { RolRegistrable } from '../tipos';
import { registrarCuenta } from '../servicios/servicioAuth';
import { codigoDeError, mensajeDeError } from '../utilidades/errores';
import {
  fechaAIso,
  formatearFecha,
  validarConfirmacion,
  validarContrasenia,
  validarCorreo,
  validarFechaNacimiento,
  validarNombrePersona,
  validarNombreUsuario,
} from '../utilidades/validaciones';

export interface ValoresRegistro {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  ciudad: string;
  nombreUsuario: string;
  correo: string;
  contrasenia: string;
  confirmar: string;
  rol: RolRegistrable;
}

type CampoValidable = Exclude<keyof ValoresRegistro, 'ciudad' | 'rol'>;
type Errores = Partial<Record<CampoValidable, string>>;

const VALORES_INICIALES: ValoresRegistro = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  ciudad: CIUDADES_BAJA_CALIFORNIA[0],
  nombreUsuario: '',
  correo: '',
  contrasenia: '',
  confirmar: '',
  rol: 'asistente',
};

const CAMPOS_PASO_1: CampoValidable[] = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento'];
const CAMPOS_PASO_2: CampoValidable[] = ['nombreUsuario', 'correo', 'contrasenia', 'confirmar'];

const validar = (campo: CampoValidable, v: ValoresRegistro): string => {
  switch (campo) {
    case 'nombre': return validarNombrePersona(v.nombre, 'El nombre');
    case 'apellidoPaterno': return validarNombrePersona(v.apellidoPaterno, 'El apellido paterno');
    case 'apellidoMaterno': return validarNombrePersona(v.apellidoMaterno, 'El apellido materno');
    case 'fechaNacimiento': return validarFechaNacimiento(v.fechaNacimiento);
    case 'nombreUsuario': return validarNombreUsuario(v.nombreUsuario);
    case 'correo': return validarCorreo(v.correo);
    case 'contrasenia': return validarContrasenia(v.contrasenia);
    case 'confirmar': return validarConfirmacion(v.contrasenia, v.confirmar);
  }
};

// Lógica de la pantalla de registro (2 pasos), sin nada de diseño
export function useRegistro() {
  const [paso, establecerPaso] = useState<1 | 2>(1);
  const [valores, establecerValores] = useState<ValoresRegistro>(VALORES_INICIALES);
  const [errores, establecerErrores] = useState<Errores>({});
  const [cargando, establecerCargando] = useState(false);
  const [ciudadesVisible, establecerCiudadesVisible] = useState(false);
  const [exito, establecerExito] = useState<{ visible: boolean; correoEnviado: boolean }>({
    visible: false,
    correoEnviado: true,
  });

  const cambiar = (campo: keyof ValoresRegistro, texto: string) => {
    const valor = campo === 'fechaNacimiento' ? formatearFecha(texto) : texto;
    const siguiente = { ...valores, [campo]: valor } as ValoresRegistro;
    establecerValores(siguiente);

    if (campo === 'ciudad' || campo === 'rol') return;
    establecerErrores((previos) => ({
      ...previos,
      [campo]: validar(campo, siguiente),
      ...(campo === 'contrasenia' && siguiente.confirmar ? { confirmar: validar('confirmar', siguiente) } : {}),
    }));
  };

  const validarCampos = (campos: CampoValidable[]): boolean => {
    const nuevos: Errores = {};
    campos.forEach((campo) => { nuevos[campo] = validar(campo, valores); });
    establecerErrores((previos) => ({ ...previos, ...nuevos }));
    return campos.every((campo) => !nuevos[campo]);
  };

  const irAlPaso2 = () => { if (validarCampos(CAMPOS_PASO_1)) establecerPaso(2); };
  const volverAlPaso1 = () => establecerPaso(1);

  const registrar = async () => {
    if (!validarCampos(CAMPOS_PASO_2)) return;

    establecerCargando(true);
    try {
      const resultado = await registrarCuenta(
        {
          nombre: sanitizarTexto(valores.nombre),
          apellidos: sanitizarTexto(`${valores.apellidoPaterno} ${valores.apellidoMaterno}`),
          fechaNacimiento: fechaAIso(valores.fechaNacimiento),
          ciudad: valores.ciudad,
          nombreUsuario: valores.nombreUsuario.trim(),
          correo: valores.correo,
          rol: valores.rol,
        },
        valores.contrasenia
      );
      establecerExito({ visible: true, correoEnviado: resultado.correoEnviado });
    } catch (error) {
      const codigo = codigoDeError(error);
      if (codigo === 'usuarios/nombre-en-uso') {
        establecerErrores((p) => ({ ...p, nombreUsuario: mensajeDeError(error) }));
      } else if (codigo === 'auth/email-already-in-use') {
        establecerErrores((p) => ({ ...p, correo: mensajeDeError(error) }));
      } else {
        Alert.alert('No se pudo crear la cuenta', mensajeDeError(error));
      }
    } finally {
      establecerCargando(false);
    }
  };

  return {
    paso,
    valores,
    errores,
    cargando,
    exito,
    ciudadesVisible,
    cambiar,
    irAlPaso2,
    volverAlPaso1,
    registrar,
    abrirCiudades: () => establecerCiudadesVisible(true),
    cerrarCiudades: () => establecerCiudadesVisible(false),
    elegirCiudad: (ciudad: string) => { cambiar('ciudad', ciudad); establecerCiudadesVisible(false); },
    cerrarExito: () => establecerExito((e) => ({ ...e, visible: false })),
  };
}
