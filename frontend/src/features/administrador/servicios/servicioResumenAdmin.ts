import { collection, getDocs, Timestamp, type DocumentData } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

const fecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);

export interface UsuarioPlat { rol: string; estaVerificado: boolean; creadoEn: Date | null }
export interface EventoPlat {
  id: string; titulo: string; organizadorId: string; organizadorNombre: string; categoria: string;
  estado: string; estadoCambio: string; creadoEn: Date | null; fechaFin: Date | null;
}
export interface EntradaPlat { eventoId: string; organizadorId: string; precio: number; usada: boolean; creadaEn: Date | null }
export interface ReportePlat { estado: string; creadoEn: Date | null }

// Datos de toda la plataforma. Cada colección es independiente: si una falla (reglas, red) queda en null
// y solo las tarjetas que dependen de ella muestran "—".
export interface DatosPlataforma {
  usuarios: UsuarioPlat[] | null;
  eventos: EventoPlat[] | null;
  entradas: EntradaPlat[] | null;
  reportes: ReportePlat[] | null;
  solicitudesPendientes: number | null;
}

async function leer<T>(nombre: string, mapa: (id: string, d: DocumentData) => T): Promise<T[] | null> {
  try {
    const s = await getDocs(collection(db, nombre));
    return s.docs.map((d) => mapa(d.id, d.data()));
  } catch (error) {
    console.warn(`No se pudo leer "${nombre}":`, error);
    return null;
  }
}

export async function obtenerDatosPlataforma(): Promise<DatosPlataforma> {
  const [usuarios, eventos, entradas, reportes, solicitudes] = await Promise.all([
    leer<UsuarioPlat>('usuarios', (_, d) => ({ rol: String(d.rol ?? ''), estaVerificado: d.estaVerificado === true, creadoEn: fecha(d.creadoEn) })),
    leer<EventoPlat>('eventos', (id, d) => ({
      id, titulo: String(d.titulo ?? ''), organizadorId: String(d.organizadorId ?? ''), organizadorNombre: String(d.organizadorNombre ?? ''),
      categoria: String(d.categoria ?? 'Otros'), estado: String(d.estado ?? ''), estadoCambio: String(d.estadoCambio ?? 'ninguno'),
      creadoEn: fecha(d.creadoEn), fechaFin: fecha(d.fechaFin),
    })),
    leer<EntradaPlat>('entradas', (_, d) => ({
      eventoId: String(d.eventoId ?? ''), organizadorId: String(d.organizadorId ?? ''), precio: Number(d.precio ?? 0),
      usada: d.usada === true, creadaEn: fecha(d.creadaEn),
    })),
    leer<ReportePlat>('reportes', (_, d) => ({ estado: String(d.estado ?? ''), creadoEn: fecha(d.creadoEn) })),
    leer<{ estado: string }>('solicitudesVerificacion', (_, d) => ({ estado: String(d.estado ?? '') })),
  ]);
  return { usuarios, eventos, entradas, reportes, solicitudesPendientes: solicitudes ? solicitudes.filter((s) => s.estado === 'pendiente').length : null };
}
