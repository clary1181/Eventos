import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/infraestructura/firebase';
import { Entorno } from '@/config/entorno';
import { estaRegistrando } from '../servicios/servicioAuth';
import { obtenerPerfil } from '../servicios/servicioUsuarios';
import { EstadoSesion, SesionContexto } from './SesionContexto';

type Base = Omit<EstadoSesion, 'recargar'>;

const SIN_SESION: Base = { usuario: null, perfil: null, pendientePerfil: false, cargando: false };

const entroConGoogle = (usuario: User) => usuario.providerData.some((p) => p.providerId === 'google.com');

// Decide el estado de sesión para un usuario de Firebase Auth
async function resolver(usuario: User | null): Promise<Base> {
  const sinVerificar = Entorno.exigirCorreoVerificado && usuario && !usuario.emailVerified;
  if (!usuario || sinVerificar || estaRegistrando()) return SIN_SESION;

  const perfil = await obtenerPerfil(usuario.uid);
  if (!perfil) {
    // Una cuenta nueva de Google aún no tiene perfil: debe completarlo. Cualquier otra sin perfil se cierra.
    if (entroConGoogle(usuario)) return { usuario, perfil: null, pendientePerfil: true, cargando: false };
    await signOut(auth);
    return SIN_SESION;
  }
  if (perfil.estadoCuenta === 'bloqueada') {
    await signOut(auth);
    return SIN_SESION;
  }
  return { usuario, perfil, pendientePerfil: false, cargando: false };
}

// Escucha Firebase Auth una sola vez y entrega { usuario, perfil, pendientePerfil, cargando } a toda la app.
// Así la sesión se restaura al reiniciar la app y las rutas pueden protegerse con <Redirect>.
export function SesionProvider({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<Base>({ ...SIN_SESION, cargando: true });

  useEffect(() => {
    let activo = true;

    const cancelar = onAuthStateChanged(auth, async (usuario) => {
      try {
        const siguiente = await resolver(usuario);
        if (activo) establecerEstado(siguiente);
      } catch {
        if (activo) establecerEstado(SIN_SESION);
      }
    });

    return () => {
      activo = false;
      cancelar();
    };
  }, []);

  const recargar = useCallback(async () => {
    try {
      establecerEstado(await resolver(auth.currentUser));
    } catch {
      establecerEstado(SIN_SESION);
    }
  }, []);

  const valor = useMemo(() => ({ ...estado, recargar }), [estado, recargar]);

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}
