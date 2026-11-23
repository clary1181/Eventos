import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSesion } from '@/features/auth';
import { escucharPerfilOrganizador, obtenerTelefono } from '../servicios/servicioPerfilOrganizador';
import type { PerfilOrganizador } from '../tipos';

interface Estado {
  perfil: PerfilOrganizador | null;
  telefono?: string;
}

const Contexto = createContext<Estado>({ perfil: null });

export function ProveedorPerfilOrganizador({ children }: { children: ReactNode }) {
  const { perfil: perfilSesion } = useSesion();
  const uid = perfilSesion?.uid;
  const [perfil, establecerPerfil] = useState<PerfilOrganizador | null>(null);
  const [telefono, establecerTelefono] = useState<string | undefined>();

  useEffect(() => {
    if (!uid) return;
    obtenerTelefono(uid).then(establecerTelefono).catch(() => undefined);
    return escucharPerfilOrganizador(uid, establecerPerfil, () => undefined);
  }, [uid]);

  const inicial: PerfilOrganizador | null = perfilSesion
    ? { ...perfilSesion, redes: {}, promedioCalificacion: 0, totalCalificaciones: 0 }
    : null;

  return <Contexto.Provider value={{ perfil: perfil ?? inicial, telefono }}>{children}</Contexto.Provider>;
}

export const usePerfilOrganizador = () => useContext(Contexto);
