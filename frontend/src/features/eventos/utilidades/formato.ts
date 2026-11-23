const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dosDigitos = (n: number) => String(n).padStart(2, '0');

export const formatearFechaHora = (f: Date) =>
  `${DIAS[f.getDay()]}, ${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()} · ${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())} h`;

export const formatearMoneda = (n: number) => `$${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const formatearNumero = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatearFechaCorta = (f: Date) =>
  `${DIAS[f.getDay()]}, ${f.getDate()} ${MESES[f.getMonth()]} · ${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())} h`;
