export interface DatosQR {
  idEntrada: string;
  idEvento: string;
  token: string;
}

// Formato del QR: MREV|idEntrada|idEvento|token. Devuelve null si no es un QR de MR-Eventos.
export function leerPayloadQR(texto: string): DatosQR | null {
  const partes = texto.trim().split('|');
  if (partes.length !== 4 || partes[0] !== 'MREV') return null;
  const [, idEntrada, idEvento, token] = partes;
  if (!idEntrada || !idEvento || !token || idEntrada.includes('/') || idEvento.includes('/')) return null;
  return { idEntrada, idEvento, token };
}
