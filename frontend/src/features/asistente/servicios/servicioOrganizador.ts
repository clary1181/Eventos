import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export interface OrganizadorPublico {
  nombre: string;
  fotoUrl: string;
  instagram: string;
  biografia: string;
  ciudad: string;
}

// Solo datos públicos de usuarios/{uid}; el teléfono es privado y no se muestra
export async function obtenerOrganizadorPublico(uid: string): Promise<OrganizadorPublico | null> {
  const d = (await getDoc(doc(db, 'usuarios', uid))).data();
  if (!d) return null;
  const redes = (d.redes ?? {}) as Record<string, unknown>;
  return {
    nombre: `${d.nombre ?? ''} ${d.apellidos ?? ''}`.trim() || 'Organizador',
    fotoUrl: String(d.fotoUrl ?? ''),
    instagram: typeof redes.instagram === 'string' ? redes.instagram : '',
    biografia: String(d.biografia ?? ''),
    ciudad: String(d.ciudad ?? ''),
  };
}
