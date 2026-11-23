import * as FileSystem from 'expo-file-system/legacy';
import { Cloudinary } from '@/config/cloudinary';

export interface ImagenSubida {
  url: string;
  publicId: string;
}

export async function subirImagen(uri: string, preset: string): Promise<ImagenSubida> {
  if (!Cloudinary.nombreNube || !preset) {
    throw new Error('Falta configurar Cloudinary (EXPO_PUBLIC_CLOUDINARY_* en el archivo .env).');
  }

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const tipo = uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const datos = new FormData();
  datos.append('file', `data:${tipo};base64,${base64}`);
  datos.append('upload_preset', preset);

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 30000);
  let respuesta: globalThis.Response;
  try {
    respuesta = await fetch(`https://api.cloudinary.com/v1_1/${Cloudinary.nombreNube}/image/upload`, {
      method: 'POST',
      body: datos,
      signal: controlador.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Cloudinary: la subida tardó demasiado. Revisa tu conexión e inténtalo de nuevo.');
    }
    throw new Error('Cloudinary: no se pudo conectar. Revisa tu conexión e inténtalo de nuevo.');
  } finally {
    clearTimeout(timeout);
  }
  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {

    throw new Error(`Cloudinary: ${cuerpo?.error?.message ?? `error ${respuesta.status}`}`);
  }
  return { url: cuerpo.secure_url as string, publicId: cuerpo.public_id as string };
}