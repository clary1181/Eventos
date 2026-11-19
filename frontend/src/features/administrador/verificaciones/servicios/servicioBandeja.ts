import {
  collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc, type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';
import type { DocumentoAdmin, EstadoSolicitud, PerfilResumido, SolicitudAdmin } from '../tipos';

const ETIQUETA_DOCUMENTO: Record<string, string> = {
  identificacion: 'Identificación (INE)',
  selfie: 'Selfie',
  fotoRostro: 'Selfie',
  rostro: 'Selfie',
};

const aFecha = (valor: unknown): Date | null =>
  valor && typeof (valor as { toDate?: unknown }).toDate === 'function' ? (valor as { toDate: () => Date }).toDate() : null;

// Las redes pueden guardarse como texto o como objeto {url|valor|usuario}; se muestran como texto
const redATexto = (red: unknown): string => {
  if (typeof red === 'string') return red;
  if (red && typeof red === 'object') {
    const r = red as Record<string, unknown>;
    return String(r.url ?? r.valor ?? r.usuario ?? r.enlace ?? '');
  }
  return '';
};

const aDocumentos = (valor: unknown): DocumentoAdmin[] => {
  if (!valor || typeof valor !== 'object') return [];
  return Object.entries(valor as Record<string, unknown>)
    .map(([clave, d]) => {
      const url = typeof d === 'string' ? d : String((d as { url?: unknown })?.url ?? '');
      return { clave, etiqueta: ETIQUETA_DOCUMENTO[clave] ?? clave, url };
    })
    .filter((d) => d.url !== '');
};

// Escucha TODAS las solicitudes (solo el administrador puede listarlas según las reglas)
export function escucharSolicitudes(
  alCambiar: (lista: SolicitudAdmin[]) => void,
  alError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'solicitudesVerificacion'),
    (instantanea) => {
      alCambiar(
        instantanea.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            estado: x.estado as EstadoSolicitud,
            telefono: String(x.telefono ?? ''),
            redes: Array.isArray(x.redes) ? x.redes.map(redATexto).filter(Boolean) : [],
            descripcionActividad: String(x.descripcionActividad ?? ''),
            rfc: String(x.rfc ?? ''),
            documentos: aDocumentos(x.documentos),
            reenvios: Number(x.reenvios ?? 0),
            observaciones: String(x.observaciones ?? ''),
            creadaEn: aFecha(x.creadaEn),
            actualizadaEn: aFecha(x.actualizadaEn),
            revisadaEn: aFecha(x.revisadaEn),
          };
        })
      );
    },
    alError
  );
}

const cachePerfiles = new Map<string, PerfilResumido>();

export async function obtenerPerfilResumido(uid: string): Promise<PerfilResumido> {
  const guardado = cachePerfiles.get(uid);
  if (guardado) return guardado;
  const vacio: PerfilResumido = { nombreCompleto: 'Organizador', nombreUsuario: '', ciudad: '' };
  try {
    const d = (await getDoc(doc(db, 'usuarios', uid))).data();
    if (!d) return vacio;
    const perfil = {
      nombreCompleto: `${d.nombre ?? ''} ${d.apellidos ?? ''}`.trim() || 'Organizador',
      nombreUsuario: String(d.nombreUsuario ?? ''),
      ciudad: String(d.ciudad ?? ''),
    };
    cachePerfiles.set(uid, perfil);
    return perfil;
  } catch {
    return vacio;
  }
}

// Solo toca los campos que las reglas permiten al administrador
export async function resolverSolicitud(
  uidOrganizador: string,
  nuevoEstado: Exclude<EstadoSolicitud, 'pendiente'>,
  observaciones: string,
  uidAdmin: string
): Promise<void> {
  const cambios: Record<string, unknown> = {
    estado: nuevoEstado,
    revisadaEn: serverTimestamp(),
    revisadaPor: uidAdmin,
    actualizadaEn: serverTimestamp(),
  };
  if (nuevoEstado !== 'aprobada') cambios.observaciones = observaciones.trim();
  await updateDoc(doc(db, 'solicitudesVerificacion', uidOrganizador), cambios);
}
