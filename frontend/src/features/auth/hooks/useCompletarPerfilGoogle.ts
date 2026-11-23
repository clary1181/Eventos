import { useRef, useState } from 'react';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { sanitizarTexto } from '@/compartido/utilidades/sanitizar';
import { CIUDADES_BAJA_CALIFORNIA } from '../constantes';
import type { RolRegistrable } from '../tipos';
import { cerrarSesion, completarPerfilGoogle } from '../servicios/servicioAuth';
import { codigoDeError, mensajeDeError } from '../utilidades/errores';
import {
  fechaAIso,
  formatearFecha,
  validarFechaNacimiento,
  validarNombrePersona,
  validarNombreUsuario,
} from '../utilidades/validaciones';
import { useSesion } from './useSesion';

interface Valores {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  ciudad: string;
  nombreUsuario: string;
  rol: RolRegistrable;
}

type CampoValidable = 'nombre' | 'apellidoPaterno' | 'apellidoMaterno' | 'fechaNacimiento' | 'nombreUsuario';
type Errores = Partial<Record<CampoValidable, string>>;

const CAMPOS: CampoValidable[] = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'nombreUsuario'];

const validar = (campo: CampoValidable, v: Valores): string => {
  switch (campo) {
    case 'nombre': return validarNombrePersona(v.nombre, 'El nombre');
    case 'apellidoPaterno': return validarNombrePersona(v.apellidoPaterno, 'El apellido paterno');
    case 'apellidoMaterno': return validarNombrePersona(v.apellidoMaterno, 'El apellido materno');
    case 'fechaNacimiento': return validarFechaNacimiento(v.fechaNacimiento);
    case 'nombreUsuario': return validarNombreUsuario(v.nombreUsuario);
  }
};

export function useCompletarPerfilGoogle() {
  const { usuario, recargar } = useSesion();
  const correo = usuario?.email ?? '';

  const [valores, establecerValores] = useState<Valores>(() => {

    const primerNombre = (usuario?.displayName ?? '').split(' ')[0] ?? '';
    const usuarioSugerido = correo.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 20);
    return {
      nombre: validarNombrePersona(primerNombre, 'El nombre') ? '' : primerNombre,
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      ciudad: CIUDADES_BAJA_CALIFORNIA[0],
      nombreUsuario: validarNombreUsuario(usuarioSugerido) ? '' : usuarioSugerido,
      rol: 'asistente',
    };
  });
  const [errores, establecerErrores] = useState<Errores>({});
  const [cargando, establecerCargando] = useState(false);
  const [ciudadesVisible, establecerCiudadesVisible] = useState(false);
  const enviandoRef = useRef(false);

  const cambiar = (campo: keyof Valores, texto: string) => {
    const valor = campo === 'fechaNacimiento' ? formatearFecha(texto) : texto;
    const siguiente = { ...valores, [campo]: valor } as Valores;
    establecerValores(siguiente);
    if (campo === 'ciudad' || campo === 'rol') return;
    establecerErrores((previos) => ({ ...previos, [campo]: validar(campo, siguiente) }));
  };

  const enviar = async () => {
    if (cargando || enviandoRef.current) return;
    enviandoRef.current = true;
    const nuevos: Errores = {};
    CAMPOS.forEach((campo) => { nuevos[campo] = validar(campo, valores); });
    establecerErrores(nuevos);
    if (CAMPOS.some((campo) => nuevos[campo])) {
      enviandoRef.current = false;
      return;
    }

    establecerCargando(true);
    try {
      await completarPerfilGoogle({
        nombre: sanitizarTexto(valores.nombre),
        apellidos: sanitizarTexto(`${valores.apellidoPaterno} ${valores.apellidoMaterno}`),
        fechaNacimiento: fechaAIso(valores.fechaNacimiento),
        ciudad: valores.ciudad,
        nombreUsuario: valores.nombreUsuario.trim(),
        rol: valores.rol,
      });

      await recargar();
    } catch (error) {
      if (codigoDeError(error) === 'usuarios/nombre-en-uso') {
        establecerErrores((p) => ({ ...p, nombreUsuario: mensajeDeError(error) }));
      } else {
        mostrarAviso({ titulo: 'No se pudo guardar tu perfil', mensaje: mensajeDeError(error), tipo: 'error' });
      }
    } finally {
      establecerCargando(false);
      enviandoRef.current = false;
    }
  };

  const cancelar = () => {
    void cerrarSesion().catch(() => mostrarAviso({
      titulo: 'No se pudo cerrar la sesión',
      mensaje: 'Revisa tu conexión e inténtalo de nuevo.',
      tipo: 'error',
    }));
  };

  return {
    correo,
    valores,
    errores,
    cargando,
    ciudadesVisible,
    cambiar,
    enviar,
    cancelar,
    abrirCiudades: () => establecerCiudadesVisible(true),
    cerrarCiudades: () => establecerCiudadesVisible(false),
    elegirCiudad: (ciudad: string) => { cambiar('ciudad', ciudad); establecerCiudadesVisible(false); },
  };
}
