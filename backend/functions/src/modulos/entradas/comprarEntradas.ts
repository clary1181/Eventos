import { randomBytes } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

if (getApps().length === 0) initializeApp();
const db = getFirestore();

// Límite de entradas por persona en cada evento (decisión D3). Debe coincidir con la app.
const MAX_ENTRADAS_POR_EVENTO = 5;

interface Peticion {
  eventoId?: unknown;
  cantidad?: unknown;
}

// Compra simulada: no existe procesador de pagos y NUNCA se reciben datos de tarjeta.
// Las entradas solo se crean aquí (las reglas de Firestore impiden escribirlas desde la app).
export const comprarEntradas = onCall({ region: 'us-west1' }, async (peticion) => {
  const uid = peticion.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Inicia sesión para comprar entradas.');

  const { eventoId, cantidad } = (peticion.data ?? {}) as Peticion;
  if (typeof eventoId !== 'string' || eventoId.length === 0 || eventoId.length > 100 || eventoId.includes('/')) {
    throw new HttpsError('invalid-argument', 'Evento no válido.');
  }
  if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_ENTRADAS_POR_EVENTO) {
    throw new HttpsError('invalid-argument', `Elige entre 1 y ${MAX_ENTRADAS_POR_EVENTO} entradas.`);
  }

  const perfil = (await db.doc(`usuarios/${uid}`).get()).data();
  if (!perfil || perfil.rol !== 'asistente' || perfil.estadoCuenta !== 'activa') {
    throw new HttpsError('permission-denied', 'Solo los asistentes con cuenta activa pueden comprar entradas.');
  }

  const refEvento = db.doc(`eventos/${eventoId}`);
  const ordenId = db.collection('entradas').doc().id; // identificador aleatorio que agrupa los boletos de esta compra

  return db.runTransaction(async (tx) => {
    // 1) Todas las lecturas primero
    const snapEvento = await tx.get(refEvento);
    if (!snapEvento.exists) throw new HttpsError('not-found', 'Este evento ya no está disponible.');
    const e = snapEvento.data() as Record<string, unknown>;

    if (e.estado !== 'aprobado') throw new HttpsError('failed-precondition', 'Este evento ya no está disponible.');
    const fin = e.fechaFin instanceof Timestamp ? e.fechaFin.toMillis() : 0;
    if (Date.now() >= fin) throw new HttpsError('failed-precondition', 'Este evento ya terminó.');

    const vendidas = Number(e.vendidas ?? 0);
    const disponibles = Number(e.capacidad ?? 0) - vendidas;
    if (disponibles <= 0) throw new HttpsError('resource-exhausted', 'El cupo de este evento está agotado.');
    if (cantidad > disponibles) {
      throw new HttpsError('resource-exhausted', `Solo quedan ${disponibles} ${disponibles === 1 ? 'entrada' : 'entradas'} disponibles.`);
    }

    const previas = await tx.get(db.collection('entradas').where('asistenteId', '==', uid).where('eventoId', '==', eventoId));
    if (previas.size + cantidad > MAX_ENTRADAS_POR_EVENTO) {
      throw new HttpsError(
        'resource-exhausted',
        `El máximo es ${MAX_ENTRADAS_POR_EVENTO} entradas por persona en cada evento (ya tienes ${previas.size}).`
      );
    }

    // 2) Escrituras
    const precio = Number(e.precio ?? 0);
    tx.update(refEvento, { vendidas: FieldValue.increment(cantidad) });

    const ids: string[] = [];
    for (let i = 0; i < cantidad; i++) {
      const ref = db.collection('entradas').doc();
      tx.set(ref, {
        eventoId,
        asistenteId: uid,
        organizadorId: e.organizadorId,
        ordenId,
        numero: i + 1,
        precio,
        pago: 'simulado_exitoso',
        token: randomBytes(18).toString('base64url'), // secreto: va dentro del QR
        usada: false,
        eventoTitulo: e.titulo,
        eventoFechaInicio: e.fechaInicio,
        lugar: e.lugar,
        imagenUrl: e.imagenUrl,
        creadaEn: FieldValue.serverTimestamp(),
      });
      ids.push(ref.id);
    }
    return { ordenId, entradas: ids, total: precio * cantidad };
  });
});
