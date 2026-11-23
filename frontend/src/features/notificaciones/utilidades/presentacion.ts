import type { Ionicons } from '@expo/vector-icons';
import type { TipoAviso } from '../tipos';

type Icono = React.ComponentProps<typeof Ionicons>['name'];

export const PRESENTACION: Record<TipoAviso, { icono: Icono; color: string; fondo: string }> = {
  evento_nuevo: { icono: 'calendar-outline', color: '#5E1F9C', fondo: '#EFE8FB' },
  cambios_pendientes: { icono: 'create-outline', color: '#1D5FA8', fondo: '#E3EEFB' },
  reporte_nuevo: { icono: 'flag-outline', color: '#B4530A', fondo: '#FDE8D4' },
  verificacion_nueva: { icono: 'shield-checkmark-outline', color: '#5E1F9C', fondo: '#EFE8FB' },
  entradas_compradas: { icono: 'ticket-outline', color: '#1B7F3B', fondo: '#E4F4E7' },
  evento_aprobado: { icono: 'checkmark-circle-outline', color: '#1B7F3B', fondo: '#E4F4E7' },
  evento_rechazado: { icono: 'close-circle-outline', color: '#C62828', fondo: '#FCE4E4' },
  evento_correccion: { icono: 'alert-circle-outline', color: '#B4530A', fondo: '#FDE8D4' },
  cambios_aprobados: { icono: 'checkmark-done-outline', color: '#1B7F3B', fondo: '#E4F4E7' },
  cambios_rechazados: { icono: 'close-circle-outline', color: '#C62828', fondo: '#FCE4E4' },
  evento_reactivado: { icono: 'play-circle-outline', color: '#1B7F3B', fondo: '#E4F4E7' },
  reporte_recibido: { icono: 'flag-outline', color: '#B4530A', fondo: '#FDE8D4' },
  verificacion_resuelta: { icono: 'shield-checkmark-outline', color: '#5E1F9C', fondo: '#EFE8FB' },
  cuenta_suspendida: { icono: 'ban-outline', color: '#C62828', fondo: '#FCE4E4' },
  suspension_levantada: { icono: 'lock-open-outline', color: '#1B7F3B', fondo: '#E4F4E7' },
  evento_suspendido: { icono: 'pause-circle-outline', color: '#C62828', fondo: '#FCE4E4' },
  evento_actualizado: { icono: 'refresh-circle-outline', color: '#1D5FA8', fondo: '#E3EEFB' },
  organizador_nuevo_evento: { icono: 'sparkles-outline', color: '#5E1F9C', fondo: '#EFE8FB' },
  reporte_resuelto: { icono: 'shield-checkmark-outline', color: '#5E1F9C', fondo: '#EFE8FB' },
};

export function tiempoRelativo(d: Date, ahora = Date.now()): string {
  const min = Math.floor((ahora - d.getTime()) / 60000);
  if (min < 1) return 'Ahora';
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const dias = Math.floor(h / 24);
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
