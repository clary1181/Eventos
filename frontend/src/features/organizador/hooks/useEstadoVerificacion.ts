import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

// Estado real de la verificación: se lee de la solicitud en vivo; mientras carga (o si no existe)
// se usa el valor guardado en el perfil.
export function useEstadoVerificacion(uid: string | undefined, estadoPerfil: string | undefined) {
  const [estadoSolicitud, setEstadoSolicitud] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, 'solicitudesVerificacion', uid),
      (instantanea) => setEstadoSolicitud(instantanea.exists() ? String(instantanea.data().estado) : null),
      () => setEstadoSolicitud(null)
    );
  }, [uid]);

  return estadoSolicitud ?? estadoPerfil ?? 'sin_solicitud';
}