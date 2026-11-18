// Limpieza básica de texto antes de guardarlo (quita < >, caracteres de control y espacios repetidos).
// No sustituye a las reglas de Firestore.
export const sanitizarTexto = (texto: string): string =>
  texto
    .replace(/[<>]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
