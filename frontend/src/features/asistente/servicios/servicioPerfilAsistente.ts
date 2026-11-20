import { doc, onSnapshot, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/infraestructura/firebase';

export interface PerfilAsistente {
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  fotoUrl: string;
  biografia: string;
  ciudad: string;
}

export function escucharPerfilAsistente(uid: string, alCambiar: (p: PerfilAsistente | null) => void, alError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'usuarios', uid),
    (s) => {
      const d = s.data();
      alCambiar(
        d
          ? {
              nombre: String(d.nombre ?? ''),
              apellidos: String(d.apellidos ?? ''),
              nombreUsuario: String(d.nombreUsuario ?? ''),
              fotoUrl: String(d.fotoUrl ?? ''),
              biografia: String(d.biografia ?? ''),
              ciudad: String(d.ciudad ?? ''),
            }
          : null
      );
    },
    alError
  );
}

// Solo campos que las reglas permiten editar al dueño
export const guardarDatosPerfil = (uid: string, d: { nombre: string; apellidos: string; ciudad: string; biografia: string }) =>
  updateDoc(doc(db, 'usuarios', uid), { nombre: d.nombre.trim(), apellidos: d.apellidos.trim(), ciudad: d.ciudad.trim(), biografia: d.biografia.trim() });

export const guardarFotoPerfil = (uid: string, fotoUrl: string) => updateDoc(doc(db, 'usuarios', uid), { fotoUrl });

// Cloudinary con preset sin firma (misma cuenta y preset que las portadas). Nunca va el API secret en la app.
const NUBE = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'wokxbznu';
const PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS ?? 'eventos-portadas';

export async function subirFotoACloudinary(base64: string, mime: string): Promise<string> {
  const datos = new FormData();
  datos.append('file', `data:${mime};base64,${base64}`); // cadena, no archivo: así funciona en Expo
  datos.append('upload_preset', PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${NUBE}/image/upload`, { method: 'POST', body: datos });
  if (!r.ok) throw new Error('No se pudo subir la imagen.');
  const json = (await r.json()) as { secure_url?: string };
  if (!json.secure_url) throw new Error('Cloudinary no devolvió la URL de la imagen.');
  return json.secure_url;
}
