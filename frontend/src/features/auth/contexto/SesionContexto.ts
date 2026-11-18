import { createContext } from 'react';
import type { User } from 'firebase/auth';
import { PerfilPublico } from '../tipos';

export interface EstadoSesion {
  usuario: User | null;
  perfil: PerfilPublico | null;
  cargando: boolean;
}

export const SesionContexto = createContext<EstadoSesion>({
  usuario: null,
  perfil: null,
  cargando: true,
});
