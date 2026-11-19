// Cloudinary: el nombre de la nube y los "upload presets" (sin firma) no son secretos.
// El API Secret NUNCA va en la app.
export const Cloudinary = {
  nombreNube: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  presetVerificacion: process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_VERIFICACION || '',
} as const;
