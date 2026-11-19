const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dosDigitos = (n: number) => String(n).padStart(2, '0');

// "Sáb, 14 nov 2026 · 20:00 h" (a mano: no depende de Intl, que en el teléfono puede faltar)
export const formatearFechaHora = (f: Date) =>
  `${DIAS[f.getDay()]}, ${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()} · ${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())} h`;

// 12250 -> "$12,250"
export const formatearMoneda = (n: number) => `$${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

// 1250 -> "1,250"
export const formatearNumero = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// "Sáb, 14 nov · 20:00 h" (para tarjetas angostas)
export const formatearFechaCorta = (f: Date) =>
  `${DIAS[f.getDay()]}, ${f.getDate()} ${MESES[f.getMonth()]} · ${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())} h`;
