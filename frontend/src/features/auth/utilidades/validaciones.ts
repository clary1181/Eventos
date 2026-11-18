// Cada validador devuelve un mensaje de error o '' si el valor es válido.
// Son ayuda para el usuario; la seguridad real está en firestore.rules.

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const NOMBRE_USUARIO = /^[a-zA-Z0-9_.]{3,20}$/;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validarCorreo = (valor: string): string => {
  if (!valor.trim()) return 'El correo es obligatorio.';
  return CORREO.test(valor.trim()) ? '' : 'Escribe un correo válido.';
};

export const validarNombrePersona = (valor: string, etiqueta: string, maximo = 40): string => {
  if (!valor.trim()) return `${etiqueta} es obligatorio.`;
  if (!SOLO_LETRAS.test(valor.trim())) return 'Solo se permiten letras.';
  return valor.trim().length > maximo ? `Máximo ${maximo} caracteres.` : '';
};

export const validarNombreUsuario = (valor: string): string => {
  if (!valor.trim()) return 'El nombre de usuario es obligatorio.';
  return NOMBRE_USUARIO.test(valor.trim())
    ? ''
    : '3 a 20 caracteres: letras, números, punto (.) y guion bajo (_).';
};

export const validarContrasenia = (valor: string): string => {
  if (!valor) return 'La contraseña es obligatoria.';
  if (valor.length < 8) return 'Mínimo 8 caracteres.';
  if (!/[a-z]/.test(valor) || !/[A-Z]/.test(valor) || !/\d/.test(valor)) {
    return 'Debe incluir mayúscula, minúscula y número.';
  }
  return '';
};

export const validarConfirmacion = (contrasenia: string, confirmacion: string): string => {
  if (!confirmacion) return 'Confirma tu contraseña.';
  return contrasenia === confirmacion ? '' : 'Las contraseñas no coinciden.';
};

// Fecha en formato DD/MM/AAAA. Debe existir y la persona debe tener 18 años o más.
export const validarFechaNacimiento = (valor: string): string => {
  const coincidencia = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!coincidencia) return 'Usa el formato DD/MM/AAAA.';
  const dia = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const anio = Number(coincidencia[3]);
  const fecha = new Date(anio, mes - 1, dia);
  const existe =
    fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  if (!existe || anio < 1900) return 'La fecha no es válida.';

  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() < mes - 1 || (hoy.getMonth() === mes - 1 && hoy.getDate() < dia)) edad--;
  return edad >= 18 ? '' : 'Debes tener al menos 18 años para registrarte.';
};

// "15032000" -> "15/03/2000" (mientras la persona escribe)
export const formatearFecha = (entrada: string): string => {
  const digitos = entrada.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

// "15/03/2000" -> "2000-03-15"
export const fechaAIso = (valor: string): string => {
  const [dia, mes, anio] = valor.split('/');
  return `${anio}-${mes}-${dia}`;
};
