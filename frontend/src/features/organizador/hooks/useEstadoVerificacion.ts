import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

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