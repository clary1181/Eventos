export type TipoAviso =

  | 'evento_nuevo' | 'cambios_pendientes' | 'reporte_nuevo'
   | 'verificacion_nueva'

  | 'entradas_compradas' | 'evento_aprobado' | 'evento_rechazado' | 'evento_correccion' | 'cambios_aprobados' | 'cambios_rechazados'
  | 'evento_reactivado' | 'reporte_recibido' | 'verificacion_resuelta' | 'cuenta_suspendida' | 'suspension_levantada'

  | 'evento_suspendido' | 'evento_actualizado' | 'reporte_resuelto' | 'organizador_nuevo_evento';

export interface Aviso {
  id: string;
  tipo: TipoAviso;
  titulo: string;
  mensaje: string;
  ruta: string;
  leida: boolean;
  creadaEn: Date;
}

export interface NuevoAviso {
  destinatarioId: string;
  tipo: TipoAviso;
  titulo: string;
  mensaje: string;
  ruta?: string;
  eventoId?: string;
}

export const ADMINISTRADORES = 'administradores';
