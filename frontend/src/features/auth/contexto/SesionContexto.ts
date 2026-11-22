import { createContext } from 'react';
import type { User } from 'firebase/auth';
import { PerfilPublico } from '../tipos';

export interface EstadoSesion {
  usuario: User | null;
  perfil: PerfilPublico | null;
  // Entró con Google pero todavía no tiene perfil: debe completarlo
  pendientePerfil: boolean;
  cargando: boolean;
  // Vuelve a leer el perfil (se usa justo después de crearlo)
  recargar: () => Promise<void>;
}

export const SesionContexto = createContext<EstadoSesion>({
  usuario: null,
  perfil: null,
  pendientePerfil: false,
  cargando: true,
  recargar: async () => undefined,
});
