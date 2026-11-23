import { useCallback, useEffect, useState } from 'react';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import { escucharReportesOrganizador, responderReporte } from '../servicios/servicioReportesOrganizador';
import type { ReporteOrganizador } from '../tipos';

export function useReportesOrganizador(uid: string | undefined) {
  const [lista, setLista] = useState<ReporteOrganizador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    return escucharReportesOrganizador(
      uid,
      (l) => { setLista(l); setCargando(false); setError(null); },
      (e) => { console.error('Error al cargar reportes:', e); setError('No se pudieron cargar los reportes.'); setCargando(false); }
    );
  }, [uid]);

  const responder = useCallback(async (id: string, texto: string): Promise<boolean> => {
    if (texto.trim().length === 0) { mostrarAviso({ titulo: 'Escribe tu respuesta', mensaje: 'La respuesta no puede estar vacía.', tipo: 'error' }); return false; }
    try {
      await responderReporte(id, texto);
      return true;
    } catch (e) {
      console.error('Error al responder el reporte:', e);
      mostrarAviso({ titulo: 'No se pudo enviar', mensaje: 'Revisa tu conexión. Solo puedes responder una vez por reporte.', tipo: 'error' });
      return false;
    }
  }, []);

  return { lista, cargando, error, responder, pendientes: lista.filter((r) => !r.respuesta).length };
}
