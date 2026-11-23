import { useEffect, useState } from 'react';
import { escucharCalificacionesOrganizador, escucharEntradasOrganizador } from '../servicios/servicioEstadisticas';
import type { CalificacionResumen, EntradaResumen } from '../tipos';

export function useDatosOrganizador(uid: string | undefined) {
  const [entradas, setEntradas] = useState<EntradaResumen[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionResumen[]>([]);
  const [cargandoEntradas, setCE] = useState(true);
  const [cargandoCals, setCC] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    const alError = (e: Error) => { console.error('Error al cargar estadísticas:', e); setError('No se pudieron cargar algunos datos. Revisa que hayas publicado las reglas.'); };
    const a = escucharEntradasOrganizador(uid, (l) => { setEntradas(l); setCE(false); }, (e) => { alError(e); setCE(false); });
    const b = escucharCalificacionesOrganizador(uid, (l) => { setCalificaciones(l); setCC(false); }, (e) => { alError(e); setCC(false); });
    return () => { a(); b(); };
  }, [uid]);

  return { entradas, calificaciones, cargando: cargandoEntradas || cargandoCals, error };
}
