import { useEffect, useState } from 'react';
import { obtenerOrganizadorPublico, type OrganizadorPublico } from '../servicios/servicioOrganizador';

export function useOrganizadorPublico(uid: string | undefined) {
  const [organizador, setOrganizador] = useState<OrganizadorPublico | null>(null);
  useEffect(() => {
    if (!uid) return;
    let activo = true;
    obtenerOrganizadorPublico(uid).then((o) => { if (activo) setOrganizador(o); }).catch(() => {});
    return () => { activo = false; };
  }, [uid]);
  return organizador;
}
