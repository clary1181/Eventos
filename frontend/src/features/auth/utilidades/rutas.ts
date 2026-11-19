import type { Href } from 'expo-router';
import type { RolUsuario } from '../tipos';

// Pantalla a la que se envía a cada rol al iniciar sesión.
// Para dar de alta un rol nuevo solo se agrega aquí y se crea su carpeta en src/app.
const RUTA_INICIAL: Record<RolUsuario, string> = {
  asistente: '/asistente/explorar',
  organizador: '/organizador/inicio',
  administrador: '/administrador/inicio',
};

export const rutaInicialPorRol = (rol: RolUsuario) => RUTA_INICIAL[rol] as Href;
