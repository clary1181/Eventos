import type { PerfilPublico } from '@/features/auth';

// Perfil del organizador tal como lo muestra su pantalla (usuarios/{uid} + campos que mantiene el backend)
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
