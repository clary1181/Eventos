import * as FileSystem from 'expo-file-system/legacy';
import { Cloudinary } from '@/config/cloudinary';

export interface ImagenSubida {
  url: string;
  publicId: string;
}

// Sube una imagen local a Cloudinary con un upload preset sin firma y devuelve su URL.
// El fetch de Expo no acepta archivos { uri, name, type }, así que la imagen se manda como base64.
export async function subirImagen(uri: string, preset: string): Promise<ImagenSubida> {
  if (!Cloudinary.nombreNube || !preset) {
    throw new Error('Falta configurar Cloudinary (EXPO_PUBLIC_CLOUDINARY_* en el archivo .env).');
  }

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const tipo = uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const datos = new FormData();
  datos.append('file', `data:${tipo};base64,${base64}`);
  datos.append('upload_preset', preset);

  const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${Cloudinary.nombreNube}/image/upload`, {
    method: 'POST',
    body: datos,
  });
  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    // Cloudinary explica la causa (p. ej. "Upload preset not found")
    throw new Error(`Cloudinary: ${cuerpo?.error?.message ?? `error ${respuesta.status}`}`);
  }
  return { url: cuerpo.secure_url as string, publicId: cuerpo.public_id as string };
}