import { useEffect, useMemo, useState } from 'react';
import { escucharEntradasDeEvento, obtenerNombreComprador, type EntradaVendida, type NombreComprador } from '../servicios/servicioEntradasVendidas';

export interface Comprador {
  asistenteId: string;
  nombre: string;
  usuario: string;
  entradas: EntradaVendida[]; // ordenadas por número
  total: number;
  usadas: number;
  ultimaCompra: Date;
}

// Entradas vendidas de un evento agrupadas por comprador, en tiempo real
export function useEntradasVendidas(uid: string | undefined, eventoId: string | undefined) {
  const [entradas, setEntradas] = useState<EntradaVendida[]>([]);
  const [nombres, setNombres] = useState<Record<string, NombreComprador>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !eventoId) return;
    return escucharEntradasDeEvento(
      uid,
      eventoId,
      (l) => { setEntradas(l); setCargando(false); setError(null); },
      (e) => { console.error('Error al cargar las entradas vendidas:', e); setError('No se pudieron cargar las entradas. Revisa que hayas publicado las reglas.'); setCargando(false); }
    );
  }, [uid, eventoId]);

  // Busca el nombre de cada comprador nuevo
  useEffect(() => {
    const faltan = Array.from(new Set<string>(entradas.map((e) => e.asistenteId))).filter((id) => id && !nombres[id]);
    if (faltan.length === 0) return;
    let activo = true;
    Promise.all(faltan.map(async (id) => [id, await obtenerNombreComprador(id)] as const)).then((pares) => {
      if (activo) setNombres((previos) => ({ ...previos, ...Object.fromEntries(pares) }));
    });
    return () => { activo = false; };
  }, [entradas, nombres]);

  const compradores = useMemo<Comprador[]>(() => {
    const porPersona = new Map<string, EntradaVendida[]>();
    entradas.forEach((e) => porPersona.set(e.asistenteId, [...(porPersona.get(e.asistenteId) ?? []), e]));
    return Array.from(porPersona, ([asistenteId, lista]): Comprador => ({
      asistenteId,
      nombre: nombres[asistenteId]?.nombre ?? 'Cargando…',
      usuario: nombres[asistenteId]?.usuario ?? '',
      entradas: [...lista].sort((a, b) => a.numero - b.numero),
      total: lista.reduce((s, e) => s + e.precio, 0),
      usadas: lista.filter((e) => e.usada).length,
      ultimaCompra: new Date(Math.max(...lista.map((e) => e.creadaEn.getTime()))),
    })).sort((a, b) => b.ultimaCompra.getTime() - a.ultimaCompra.getTime());
  }, [entradas, nombres]);

  return {
    compradores,
    cargando,
    error,
    totalEntradas: entradas.length,
    validadas: entradas.filter((e) => e.usada).length,
    ingresos: entradas.reduce((s, e) => s + e.precio, 0),
  };
}
