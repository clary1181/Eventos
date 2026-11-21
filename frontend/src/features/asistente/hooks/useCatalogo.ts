import { useEffect, useMemo, useState } from 'react';
import { escucharEventosPublicos } from '../servicios/servicioCatalogo';
import type { EventoPublico } from '../tipos';
import { normalizar } from '../utilidades/formato';

export interface OrganizadorEncontrado { id: string; nombre: string; eventos: number }

export function useCatalogo() {
  const [todos, setTodos] = useState<EventoPublico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');

  useEffect(
    () =>
      escucharEventosPublicos(
        (l) => { setTodos(l); setCargando(false); setError(null); },
        (e) => { console.error('Error al cargar el catálogo:', e); setError('No se pudieron cargar los eventos.'); setCargando(false); }
      ),
    []
  );

  // Eventos que aún no terminan, del más próximo al más lejano
  const vigentes = useMemo(() => {
    const ahora = Date.now();
    return todos.filter((e) => e.fechaFin.getTime() > ahora).sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
  }, [todos]);

  const filtrando = busqueda.trim() !== '' || categoria !== 'Todos';

  const filtrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return vigentes.filter((e) => {
      const coincideCategoria = categoria === 'Todos' || e.categoria === categoria;
      const coincideTexto =
        texto === '' || [e.titulo, e.descripcion, e.lugar, e.organizadorNombre].some((c) => normalizar(c).includes(texto));
      return coincideCategoria && coincideTexto;
    });
  }, [vigentes, busqueda, categoria]);

  // Organizadores (con eventos publicados) cuyo nombre coincide con la búsqueda
  const organizadores = useMemo<OrganizadorEncontrado[]>(() => {
    const texto = normalizar(busqueda.trim());
    if (texto === '') return [];
    const mapa = new Map<string, OrganizadorEncontrado>();
    todos.forEach((e) => {
      if (!normalizar(e.organizadorNombre).includes(texto)) return;
      const actual = mapa.get(e.organizadorId);
      if (actual) actual.eventos += 1;
      else mapa.set(e.organizadorId, { id: e.organizadorId, nombre: e.organizadorNombre, eventos: 1 });
    });
    return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre)).slice(0, 6);
  }, [todos, busqueda]);

  // Destacado: el evento con más entradas vendidas (a igualdad, el más próximo). Solo sin búsqueda ni filtro.
  const destacado = useMemo(() => {
    if (filtrando) return null;
    return vigentes.reduce<EventoPublico | null>((mejor, e) => (!mejor || e.vendidas > mejor.vendidas ? e : mejor), null);
  }, [vigentes, filtrando]);

  const proximos = useMemo(
    () => (filtrando ? filtrados : vigentes.filter((e) => e.id !== destacado?.id)),
    [filtrando, filtrados, vigentes, destacado]
  );

  return { cargando, error, busqueda, setBusqueda, categoria, setCategoria, filtrando, destacado, proximos, organizadores, hayEventos: vigentes.length > 0 };
}
