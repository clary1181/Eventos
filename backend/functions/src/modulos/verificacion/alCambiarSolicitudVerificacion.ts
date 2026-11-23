import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) initializeApp();
const db = getFirestore();

export const alCambiarSolicitudVerificacion = onDocumentWritten(
  { document: 'solicitudesVerificacion/{uid}', region: 'us-west1' },
  async (evento) => {
    const despues = evento.data?.after.data();
    if (!despues) return;

    const antes = evento.data?.before.data();
    if (antes?.estado === despues.estado) return;

    const uid = evento.params.uid;
    logger.info(`Verificación de ${uid}: ${antes?.estado ?? 'sin solicitud'} -> ${despues.estado}`);

    await db.doc(`usuarios/${uid}`).update({
      estadoVerificacion: despues.estado,
      estaVerificado: despues.estado === 'aprobada',
    });
  },
);
