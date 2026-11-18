import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/infraestructura/firebase';
import { Entorno } from '@/config/entorno';
import { estaRegistrando } from '../servicios/servicioAuth';
import { obtenerPerfil } from '../servicios/servicioUsuarios';
import { EstadoSesion, SesionContexto } from './SesionContexto';

const SIN_SESION: EstadoSesion = { usuario: null, perfil: null, cargando: false };

// Escucha Firebase Auth una sola vez y entrega { usuario, perfil, cargando } a toda la app.
// Así la sesión se restaura al reiniciar la app y las rutas pueden protegerse con <Redirect>.
export function SesionProvider({ children }: { children: ReactNode }) {
  const [estado, establecerEstado] = useState<EstadoSesion>({ usuario: null, perfil: null, cargando: true });

  useEffect(() => {
    let activo = true;

    const cancelar = onAuthStateChanged(auth, async (usuario) => {
      const sinVerificar = Entorno.exigirCorreoVerificado && usuario && !usuario.emailVerified;
      if (!usuario || sinVerificar || estaRegistrando()) {
        if (activo) establecerEstado(SIN_SESION);
        return;
      }

      try {
        const perfil = await obtenerPerfil(usuario.uid);
        if (!perfil || perfil.estadoCuenta === 'bloqueada') {
          await signOut(auth);
          if (activo) establecerEstado(SIN_SESION);
          return;
        }
        if (activo) establecerEstado({ usuario, perfil, cargando: false });
      } catch {
        if (activo) establecerEstado(SIN_SESION);
      }
    });

    return () => {
      activo = false;
      cancelar();
    };
  }, []);

  return <SesionContexto.Provider value={estado}>{children}</SesionContexto.Provider>;
}
