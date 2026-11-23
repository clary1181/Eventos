export const Cloudinary = {
  nombreNube: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  presetVerificacion: process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_VERIFICACION || '',
} as const;
