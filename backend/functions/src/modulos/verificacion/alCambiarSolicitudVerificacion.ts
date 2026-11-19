import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) initializeApp();
const db = getFirestore();

// Cuando el administrador cambia el estado de una solicitud, se copia al perfil del organizador:
// usuarios/{uid}.estadoVerificacion y usuarios/{uid}.estaVerificado (campos que solo escribe el backend).
// Las notificaciones al organizador y a los administradores se agregan con el módulo de notificaciones.
export const alCambiarSolicitudVerificacion = onDocumentWritten(
  { document: 'solicitudesVerificacion/{uid}', region: 'us-west1' },
  async (evento) => {
    const despues = evento.data?.after.data();
    if (!despues) return; // la solicitud se borró: nada que sincronizar

    const antes = evento.data?.before.data();
    if (antes?.estado === despues.estado) return; // solo cambió texto o fechas

    const uid = evento.params.uid;
    logger.info(`Verificación de ${uid}: ${antes?.estado ?? 'sin solicitud'} -> ${despues.estado}`);

    await db.doc(`usuarios/${uid}`).update({
      estadoVerificacion: despues.estado,
      estaVerificado: despues.estado === 'aprobada',
    });
  },
);
