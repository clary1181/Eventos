import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
    if (texto.trim().length === 0) { Alert.alert('Escribe tu respuesta', 'La respuesta no puede estar vacía.'); return false; }
    try {
      await responderReporte(id, texto);
      return true;
    } catch (e) {
      console.error('Error al responder el reporte:', e);
      Alert.alert('No se pudo enviar', 'Revisa tu conexión. Solo puedes responder una vez por reporte.');
      return false;
    }
  }, []);

  return { lista, cargando, error, responder, pendientes: lista.filter((r) => !r.respuesta).length };
}
