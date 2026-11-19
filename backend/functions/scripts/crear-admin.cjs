/* Crea un administrador en los EMULADORES (no toca producción).
 * Uso (desde backend/functions, con los emuladores corriendo):
 *   node scripts/crear-admin.cjs correo@ejemplo.com ContraseñaSegura123 "Nombre" "Apellidos" nombreusuario
 */
const fs = require('fs');
const path = require('path');

process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';

const [correo, contrasena, nombre = 'Admin', apellidos = 'Plataforma', nombreUsuario = 'admin'] = process.argv.slice(2);
if (!correo || !contrasena || contrasena.length < 8) {
  console.error('Uso: node scripts/crear-admin.cjs <correo> <contraseña de 8+ caracteres> [nombre] [apellidos] [usuario]');
  process.exit(1);
}

// El proyecto sale de .firebaserc (o de GCLOUD_PROJECT)
let projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
  try {
    const rc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', '.firebaserc'), 'utf8'));
    projectId = rc.projects && rc.projects.default;
  } catch { /* se avisa abajo */ }
}
if (!projectId) { console.error('No encontré el proyecto: define GCLOUD_PROJECT=<id>.'); process.exit(1); }

const admin = require('firebase-admin');
admin.initializeApp({ projectId });

(async () => {
  const auth = admin.auth();
  const db = admin.firestore();
  let usuario;
  try { usuario = await auth.getUserByEmail(correo); }
  catch { usuario = await auth.createUser({ email: correo, password: contrasena, emailVerified: true, displayName: `${nombre} ${apellidos}` }); }

  await db.doc(`usuarios/${usuario.uid}`).set({
    uid: usuario.uid, nombreUsuario, nombre, apellidos, rol: 'administrador', ciudad: 'Ensenada',
    estadoVerificacion: 'sin_solicitud', estaVerificado: false, estadoCuenta: 'activa',
    creadoEn: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`Administrador listo: ${correo} (uid ${usuario.uid}) en el proyecto ${projectId}`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
