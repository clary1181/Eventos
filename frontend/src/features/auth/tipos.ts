export type RolUsuario = 'asistente' | 'organizador' | 'administrador';
export type RolRegistrable = Exclude<RolUsuario, 'administrador'>;

export type EstadoVerificacion =
  | 'sin_solicitud'
  | 'pendiente'
  | 'correccion_requerida'
  | 'aprobada'
  | 'rechazada';

export interface PerfilPublico {
  uid: string;
  nombreUsuario: string;
  nombre: string;
  apellidos: string;
  rol: RolUsuario;
  ciudad: string;
  fotoUrl?: string;
  biografia?: string;
  estadoVerificacion: EstadoVerificacion;
  estaVerificado: boolean;
  estadoCuenta: 'activa' | 'bloqueada';
}

export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  ciudad: string;
  nombreUsuario: string;
  correo: string;
  rol: RolRegistrable;
}
