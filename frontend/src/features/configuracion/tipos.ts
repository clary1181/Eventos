import type { Ionicons } from '@expo/vector-icons';

export type IconoConfig = React.ComponentProps<typeof Ionicons>['name'];

export interface FilaConfig {
  icono: IconoConfig;
  titulo: string;
  descripcion?: string;
  alPulsar: () => void;
}

export interface SeccionConfig {
  titulo: string;
  filas: FilaConfig[];
}
