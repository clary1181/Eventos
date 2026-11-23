export interface DatosTarjeta {
  titular: string;
  numero: string;
  vencimiento: string;
  cvv: string;
}
export type ErroresTarjeta = Partial<Record<keyof DatosTarjeta, string>>;

export const TARJETA_VACIA: DatosTarjeta = { titular: '', numero: '', vencimiento: '', cvv: '' };

const soloDigitos = (t: string) => t.replace(/\D/g, '');

export const formatearNumeroTarjeta = (t: string) => soloDigitos(t).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
export const formatearVencimiento = (t: string) => {
  const d = soloDigitos(t).slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
};

export const ultimosCuatro = (numero: string) => soloDigitos(numero).slice(-4);

export function marcaTarjeta(numero: string): string {
  const n = soloDigitos(numero);
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'American Express';
  return 'Tarjeta';
}

function luhnValido(numero: string): boolean {
  let suma = 0;
  let doble = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let d = Number(numero[i]);
    if (doble) { d *= 2; if (d > 9) d -= 9; }
    suma += d;
    doble = !doble;
  }
  return suma % 10 === 0;
}

export function validarTarjeta(d: DatosTarjeta, ahora = new Date()): ErroresTarjeta {
  const e: ErroresTarjeta = {};
  if (d.titular.trim().length < 3) e.titular = 'Escribe el nombre como aparece en la tarjeta.';

  const n = soloDigitos(d.numero);
  if (n.length < 15 || n.length > 16) e.numero = 'El número debe tener 15 o 16 dígitos.';
  else if (!luhnValido(n)) e.numero = 'El número de tarjeta no es válido.';

  const m = /^(\d{2})\/(\d{2})$/.exec(d.vencimiento);
  if (!m) e.vencimiento = 'Usa el formato MM/AA.';
  else {
    const mes = Number(m[1]);
    const anio = 2000 + Number(m[2]);
    const vencida = anio < ahora.getFullYear() || (anio === ahora.getFullYear() && mes < ahora.getMonth() + 1);
    if (mes < 1 || mes > 12) e.vencimiento = 'El mes debe estar entre 01 y 12.';
    else if (vencida) e.vencimiento = 'La tarjeta está vencida.';
    else if (anio > ahora.getFullYear() + 20) e.vencimiento = 'La fecha de vencimiento no es válida.';
  }

  const largoCvv = /^3[47]/.test(n) ? 4 : 3;
  if (!new RegExp(`^\\d{${largoCvv}}$`).test(d.cvv)) e.cvv = `El CVV tiene ${largoCvv} dígitos.`;
  return e;
}
