import { useEffect, useState } from 'react';
import { escucharMisCalificaciones, type Calificacion } from '../servicios/servicioCalificaciones';
import { escucharMisReportes, type ReporteEnviado } from '../servicios/servicioReportes';

export function useMisCalificaciones(uid: string | undefined) {
  const [lista, setLista] = useState<Calificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    if (!uid) return;
    return escucharMisCalificaciones(uid, (l) => { setLista(l); setCargando(false); }, () => setCargando(false));
  }, [uid]);
  return { lista, cargando };
}

export function useMisReportes(uid: string | undefined) {
  const [lista, setLista] = useState<ReporteEnviado[]>([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    if (!uid) return;
    return escucharMisReportes(uid, (l) => { setLista(l); setCargando(false); }, () => setCargando(false));
  }, [uid]);
  return { lista, cargando };
}
