import type { PerfilPublico } from '@/features/auth';

export interface PerfilOrganizador {
  uid: string;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  ciudad: string;
  fotoUrl?: string;
  biografia?: string;
  redes: { instagram?: string; sitioWeb?: string };
  estadoVerificacion: PerfilPublico['estadoVerificacion'];
  estaVerificado: boolean;
  promedioCalificacion: number;
  totalCalificaciones: number;
}
