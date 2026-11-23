import type { Href } from 'expo-router';
import type { RolUsuario } from '../tipos';

const RUTA_INICIAL: Record<RolUsuario, string> = {
  asistente: '/asistente/explorar',
  organizador: '/organizador/inicio',
  administrador: '/administrador/inicio',
};

export const rutaInicialPorRol = (rol: RolUsuario) => RUTA_INICIAL[rol] as Href;
