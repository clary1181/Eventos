import type { SeccionConfig } from './tipos';

type Rol = 'asistente' | 'organizador' | 'administrador';

export const RUTA_PERFIL: Record<Rol, string> = {
  asistente: '/asistente/perfil',
  organizador: '/organizador/perfil',
  administrador: '/administrador/perfil',
};

// Secciones propias de cada rol. Solo accesos a pantallas que ya existen.
export const seccionesPorRol = (rol: Rol, ir: (ruta: string) => void): SeccionConfig[] => {
  if (rol === 'asistente') {
    return [{
      titulo: 'Mi actividad',
      filas: [
        { icono: 'time-outline', titulo: 'Historial de eventos', alPulsar: () => ir('/asistente/historial') },
        { icono: 'star-outline', titulo: 'Mis calificaciones', alPulsar: () => ir('/asistente/mis-calificaciones') },
        { icono: 'document-text-outline', titulo: 'Mis reportes', alPulsar: () => ir('/asistente/mis-reportes') },
        { icono: 'people-outline', titulo: 'Organizadores que sigo', alPulsar: () => ir('/asistente/organizadores-seguidos') },
      ],
    }];
  }
  if (rol === 'organizador') {
    return [{
      titulo: 'Mi cuenta de organizador',
      filas: [
        { icono: 'shield-checkmark-outline', titulo: 'Verificación', descripcion: 'Estado de tu solicitud y documentos', alPulsar: () => ir('/organizador/verificacion') },
        { icono: 'flag-outline', titulo: 'Reportes recibidos', alPulsar: () => ir('/organizador/reportes') },
      ],
    }];
  }
  return [{
    titulo: 'Administración',
    filas: [
      { icono: 'business-outline', titulo: 'Solicitudes de organizadores', alPulsar: () => ir('/administrador/organizadores') },
      { icono: 'calendar-outline', titulo: 'Revisión de eventos', alPulsar: () => ir('/administrador/eventos') },
      { icono: 'flag-outline', titulo: 'Reportes', alPulsar: () => ir('/administrador/reportes') },
      { icono: 'shield-outline', titulo: 'Moderación', alPulsar: () => ir('/administrador/moderacion') },
    ],
  }];
};
