const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dos = (n: number) => String(n).padStart(2, '0');

export const formatearFechaCorta = (d: Date) => `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;

export const formatearHora = (d: Date) => `${dos(d.getHours())}:${dos(d.getMinutes())} h`;

export const formatearDiaMes = (d: Date) => `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;

export const formatearFechaHora = (d: Date) => `${formatearFechaCorta(d)} · ${formatearHora(d)}`;

export const formatearPrecio = (n: number) => (n > 0 ? `$${n.toLocaleString('es-MX')} MXN` : 'Gratis');

export const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
