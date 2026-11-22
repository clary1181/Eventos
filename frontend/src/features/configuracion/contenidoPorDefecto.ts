import type { ItemContenido } from './servicios/servicioContenido';

// Textos iniciales. Se usan mientras el administrador no haya guardado su propia versión en Firestore.
export const AYUDA_POR_DEFECTO: ItemContenido[] = [
  { titulo: '¿Cómo funciona la compra de entradas?', texto: 'La compra es una simulación: eliges la cantidad, capturas datos de pago de prueba y se generan tus entradas. No se cobra dinero real ni se guarda información de tu tarjeta.' },
  { titulo: '¿Cuántas entradas puedo comprar por evento?', texto: 'Hasta 5 por persona en cada evento, siempre que haya cupo disponible.' },
  { titulo: '¿Cómo uso mi código QR?', texto: 'En "Mis eventos" abre tu entrada y muestra el QR en la puerta. El organizador lo escanea y la entrada queda marcada como usada: solo funciona una vez.' },
  { titulo: '¿Qué significa "Evento verificado"?', texto: 'Que el organizador pasó una revisión de identidad por parte del administrador y que el evento fue aprobado antes de publicarse.' },
  { titulo: '¿Cómo reporto un evento sospechoso?', texto: 'Desde el detalle del evento usa la opción de reportar. Puedes seguir su estado en Configuración > Mis reportes.' },
  { titulo: '¿Puedo calificar un evento?', texto: 'Sí, cuando el evento ya terminó y tienes una entrada comprada. Solo puedes calificar una vez por evento.' },
  { titulo: 'Soy organizador, ¿cómo publico eventos?', texto: 'Primero solicita la verificación de tu cuenta. Cuando sea aprobada podrás crear eventos, que se publican después de que un administrador los revise.' },
];

export const LEGAL_POR_DEFECTO: ItemContenido[] = [
  { titulo: 'Términos y condiciones', texto: 'Eventos es una aplicación académica para descubrir y publicar eventos en Ensenada. Al usarla aceptas hacerlo de buena fe, con información veraz y sin intentar vulnerar su seguridad. Las compras de entradas son simuladas: no generan cargos ni obligaciones de pago reales.' },
  { titulo: 'Política de privacidad', texto: 'Guardamos los datos necesarios para operar tu cuenta: nombre, correo, fecha de nacimiento y, si eres organizador, la documentación de verificación. No almacenamos datos de tarjetas. Los datos de verificación solo los ve el administrador. Puedes actualizar tu información desde tu perfil.' },
  { titulo: 'Reglas de publicación', texto: 'Los eventos deben ser reales, con fecha, lugar y precio correctos. Está prohibido publicar información falsa, spam, contenido inapropiado o eventos fraudulentos. Todo evento pasa por revisión antes de aparecer en el catálogo y puede suspenderse si recibe reportes fundados.' },
  { titulo: 'Moderación', texto: 'Los administradores pueden aprobar, devolver o rechazar eventos, ocultar calificaciones y suspender organizadores que incumplan estas reglas.' },
];
