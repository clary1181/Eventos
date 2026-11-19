// API pública de la feature "auth": lo único que otras partes de la app deben importar
export { SesionProvider } from './contexto/SesionProvider';
export { useSesion } from './hooks/useSesion';
export { cerrarSesion } from './servicios/servicioAuth';
export { GuardiaRol } from './componentes/GuardiaRol';
export { rutaInicialPorRol } from './utilidades/rutas';
export { PantallaInicioSesion } from './pantallas/PantallaInicioSesion';
export { PantallaRegistro } from './pantallas/PantallaRegistro';
export type { PerfilPublico, RolUsuario } from './tipos';