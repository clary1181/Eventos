import { collection, getCountFromServer, query, where, type Query } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { Conteo, ResumenAdministrador } from '../tipos';

// Cuenta documentos sin descargarlos. Si falla (reglas, red) devuelve null y la tarjeta muestra "—".
async function contar(consulta: Query): Promise<Conteo> {
  try {
    const instantanea = await getCountFromServer(consulta);
    return instantanea.data().count;
  } catch (error) {
    console.warn('No se pudo contar:', error);
    return null;
  }
}

export async function obtenerResumenAdministrador(): Promise<ResumenAdministrador> {
  const [usuarios, eventosTotales, eventosVerificados, entradas, organizadores, eventosPendientes, reportes] =
    await Promise.all([
      contar(collection(db, 'usuarios')),
      contar(collection(db, 'eventos')),
      contar(query(collection(db, 'eventos'), where('estado', '==', 'aprobado'))),
      contar(collection(db, 'entradas')),
      contar(query(collection(db, 'solicitudesVerificacion'), where('estado', '==', 'pendiente'))),
      contar(query(collection(db, 'eventos'), where('estado', '==', 'pendiente_aprobacion'))),
      contar(query(collection(db, 'reportes'), where('estado', '==', 'pendiente_moderacion'))),
    ]);

  return {
    plataforma: { usuarios, eventosTotales, eventosVerificados, entradas },
    tareas: {
      organizadoresPorVerificar: organizadores,
      eventosPorRevisar: eventosPendientes,
      reportesSinRevisar: reportes,
    },
  };
}
