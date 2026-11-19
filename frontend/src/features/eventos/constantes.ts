import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import type { EstadoEvento } from './tipos';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

// Cómo se muestra cada estado del evento (insignias de las tarjetas)
export const PRESENTACION_ESTADO: Record<EstadoEvento, { etiqueta: string; icono: NombreIcono; color: string; fondo: string }> = {
  aprobado: { etiqueta: 'Publicado', icono: 'checkmark-circle', color: Colores.exitoTexto, fondo: Colores.exitoFondo },
  pendiente_aprobacion: { etiqueta: 'Pendiente de verificación', icono: 'time', color: Colores.advertencia, fondo: Colores.advertenciaFondo },
  requiere_correccion: { etiqueta: 'Requiere corrección', icono: 'alert-circle', color: Colores.advertencia, fondo: Colores.advertenciaFondo },
  rechazado: { etiqueta: 'Rechazado', icono: 'close-circle', color: Colores.error, fondo: Colores.errorFondo },
  suspendido: { etiqueta: 'Suspendido', icono: 'pause-circle', color: Colores.textoSuave, fondo: Colores.neutroFondo },
};
