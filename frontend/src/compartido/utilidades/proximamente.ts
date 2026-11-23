import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

export const avisarProximamente = (funcion: string) =>
  mostrarAviso({ titulo: 'Próximamente', mensaje: `${funcion} estará disponible en una próxima etapa.`, tipo: 'info' });
