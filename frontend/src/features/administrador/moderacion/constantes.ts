// Eventos suspendidos a partir de los cuales se alerta al administrador sobre un organizador (fácil de cambiar)
export const UMBRAL_REINCIDENCIA = 3;

export const DURACIONES_SUSPENSION = [
  { dias: 7, etiqueta: '7 días' },
  { dias: 15, etiqueta: '15 días' },
  { dias: 30, etiqueta: '30 días' },
  { dias: 365, etiqueta: 'Indefinida' }, // hasta que el administrador la levante (máx. 1 año)
] as const;
