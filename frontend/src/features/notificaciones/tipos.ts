export type TipoAviso =
  // Para el administrador
  | 'evento_nuevo' | 'cambios_pendientes' | 'reporte_nuevo'
  // Para el organizador
  | 'entradas_compradas' | 'evento_aprobado' | 'evento_rechazado' | 'evento_correccion' | 'cambios_aprobados' | 'cambios_rechazados'
  | 'evento_reactivado' | 'reporte_recibido' | 'verificacion_resuelta' | 'cuenta_suspendida' | 'suspension_levantada'
  // Para el asistente (y también el organizador)
  | 'evento_suspendido' | 'evento_actualizado' | 'reporte_resuelto' | 'organizador_nuevo_evento';

// Un aviso guardado en la colección "notificaciones"
export interface Aviso {
  id: string;
  tipo: TipoAviso;
  titulo: string;
  mensaje: string;
  ruta: string;      // pantalla que se abre al tocarlo ('' = ninguna)
  leida: boolean;
  creadaEn: Date;
}

export interface NuevoAviso {
  destinatarioId: string; // uid, o 'administradores' para avisar a todos los administradores
  tipo: TipoAviso;
  titulo: string;
  mensaje: string;
  ruta?: string;
  eventoId?: string;
}

export const ADMINISTRADORES = 'administradores';
