export const soloDigitos = (texto: string) => texto.replace(/\D/g, '');

export const telefonoValido = (texto: string) => soloDigitos(texto).length === 10;

export const extraerInstagram = (texto: string): string | null => {
  const t = texto.trim();
  if (!t) return null;
  const enlace = t.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/i);
  const usuario = enlace ? enlace[1] : t.replace(/^@/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(usuario) ? usuario : null;
};

export const normalizarSitioWeb = (texto: string): string | null => {
  const t = texto.trim();
  if (!t) return null;
  const url = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return url.length <= 200 && /^https?:\/\/[^\s/$.?#]+\.[^\s]{2,}$/i.test(url) ? url : null;
};

export const esUrlRemota = (valor: string | null | undefined) => !!valor && /^https?:\/\//i.test(valor);
