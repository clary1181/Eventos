import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export function useReporteEvento(uid: string | undefined, eventoId: string | undefined) {
  const [yaReporto, setYaReporto] = useState(false);
  useEffect(() => {
    if (!uid || !eventoId) return;
    return onSnapshot(
      query(collection(db, 'reportes'), where('reportanteId', '==', uid), where('eventoId', '==', eventoId)),
      (s) => setYaReporto(!s.empty),
      () => setYaReporto(false)
    );
  }, [uid, eventoId]);
  return yaReporto;
}
