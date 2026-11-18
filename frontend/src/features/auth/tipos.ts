export type RolUsuario = 'asistente' | 'organizador' | 'administrador';
export type RolRegistrable = Exclude<RolUsuario, 'administrador'>;

export type EstadoVerificacion =
  | 'sin_solicitud'
  | 'pendiente'
  | 'correccion_requerida'
  | 'aprobada'
  | 'rechazada';

// Documento público: usuarios/{uid}
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

// Datos que captura el formulario de registro
export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // AAAA-MM-DD (se guarda en usuarios/{uid}/privado/perfil)
  ciudad: string;
  nombreUsuario: string;
  correo: string;
  rol: RolRegistrable;
}
