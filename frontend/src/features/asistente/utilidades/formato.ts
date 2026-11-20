const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const dos = (n: number) => String(n).padStart(2, '0');

// "Sáb, 14 nov 2026" (sin depender de Intl, para que sea igual en todos los teléfonos)
export const formatearFechaCorta = (d: Date) => `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
// "20:00 h"
export const formatearHora = (d: Date) => `${dos(d.getHours())}:${dos(d.getMinutes())} h`;
// "14 nov 2026"
export const formatearDiaMes = (d: Date) => `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
// "Sáb, 14 nov 2026 · 20:00 h"
export const formatearFechaHora = (d: Date) => `${formatearFechaCorta(d)} · ${formatearHora(d)}`;
// "$350 MXN" o "Gratis"
export const formatearPrecio = (n: number) => (n > 0 ? `$${n.toLocaleString('es-MX')} MXN` : 'Gratis');

// Minúsculas y sin acentos, para buscar "musica" y encontrar "Música"
export const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
