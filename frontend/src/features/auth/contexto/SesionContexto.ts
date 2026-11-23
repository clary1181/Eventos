import { createContext } from 'react';
import type { User } from 'firebase/auth';
import { PerfilPublico } from '../tipos';

export interface EstadoSesion {
  usuario: User | null;
  perfil: PerfilPublico | null;

  pendientePerfil: boolean;
  cargando: boolean;

  recargar: () => Promise<void>;
}

export const SesionContexto = createContext<EstadoSesion>({
  usuario: null,
  perfil: null,
  pendientePerfil: false,
  cargando: true,
  recargar: async () => undefined,
});
