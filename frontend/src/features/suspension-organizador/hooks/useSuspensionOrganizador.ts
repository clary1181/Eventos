import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export interface Suspension { hasta: Date; motivo: string }

export function useSuspensionOrganizador(uid: string | undefined): Suspension | null {
  const [datos, setDatos] = useState<Suspension | null>(null);
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, 'usuarios', uid),
      (s) => {
        const x = s.data();
        setDatos(x && x.suspensionHasta instanceof Timestamp ? { hasta: x.suspensionHasta.toDate(), motivo: String(x.motivoSuspension ?? '') } : null);
      },
      () => setDatos(null)
    );
  }, [uid]);

  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  return datos && datos.hasta.getTime() > ahora ? datos : null;
}
