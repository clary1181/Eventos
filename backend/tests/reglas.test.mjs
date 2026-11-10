import { readFileSync } from 'node:fs';
import { describe, it, before, after, beforeEach } from 'node:test';
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
} from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  collection, query, where, writeBatch, serverTimestamp, Timestamp,
} from 'firebase/firestore';

let testEnv;

const DIA = 24 * 60 * 60 * 1000;
const enDias = (n) => Timestamp.fromDate(new Date(Date.now() + n * DIA));
const como = (uid, token = {}) => testEnv.authenticatedContext(uid, token).firestore();
const anonimo = () => testEnv.unauthenticatedContext().firestore();

// ---------- Datos de apoyo ----------
function usuario(nombreUsuario, nombre, apellidos, rol, estadoVerificacion = 'sin_solicitud') {
  return {
    nombreUsuario, nombre, apellidos, rol, ciudad: 'Ensenada',
    estadoVerificacion, estaVerificado: estadoVerificacion === 'aprobada',
    estadoCuenta: 'activa', promedioCalificacion: 0, totalCalificaciones: 0,
    creadoEn: Timestamp.now(),
  };
}

function eventoBase(extra = {}) {
  return {
    organizadorId: 'orgOk', organizadorNombre: 'Marta Ruiz', organizadorVerificado: true,
    titulo: 'Feria del taco', descripcion: 'Una feria de tacos en el puerto',
    categoria: 'Comida', fechaInicio: enDias(2), fechaFin: enDias(3),
    lugar: 'Muelle', direccion: 'Av. Costera 123, Ensenada',
    precio: 100, capacidad: 50, vendidas: 0,
    imagenUrl: 'https://res.cloudinary.com/demo/image/upload/a.jpg',
    imagenPublicId: 'eventos/a', estado: 'aprobado', estadoCambio: 'ninguno',
    promedioCalificacion: 0, totalCalificaciones: 0,
    creadoEn: Timestamp.now(), actualizadoEn: Timestamp.now(),
    ...extra,
  };
}

async function sembrar() {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'usuarios', 'asist1'), usuario('asist1', 'Ana', 'Lopez', 'asistente'));
    await setDoc(doc(db, 'usuarios', 'asist2'), usuario('asist2', 'Luis', 'Perez', 'asistente'));
    await setDoc(doc(db, 'usuarios', 'orgOk'), usuario('orgok', 'Marta', 'Ruiz', 'organizador', 'aprobada'));
    await setDoc(doc(db, 'usuarios', 'orgNo'), usuario('orgno', 'Pedro', 'Soto', 'organizador'));
    await setDoc(doc(db, 'usuarios', 'admin1'), usuario('admin1', 'Admin', 'Sistema', 'administrador'));
    await setDoc(doc(db, 'usuarios', 'asist1', 'privado', 'perfil'), { correo: 'a1@test.com', telefono: '6461111111' });
    await setDoc(doc(db, 'usuarios', 'asist2', 'privado', 'perfil'), { correo: 'a2@test.com', telefono: '6462222222' });

    await setDoc(doc(db, 'eventos', 'e1'), eventoBase());                                  // aprobado, sin ventas
    await setDoc(doc(db, 'eventos', 'e2'), eventoBase({ titulo: 'Con ventas', vendidas: 3 })); // aprobado, con ventas
    await setDoc(doc(db, 'eventos', 'e3'), eventoBase({ titulo: 'Pendiente', estado: 'pendiente_aprobacion' }));

    await setDoc(doc(db, 'entradas', 'ent1'), {
      eventoId: 'e1', asistenteId: 'asist1', organizadorId: 'orgOk', usada: false, creadaEn: Timestamp.now(),
    });
    await setDoc(doc(db, 'solicitudesVerificacion', 'orgNo'), {
      organizadorId: 'orgNo', estado: 'pendiente', telefono: '6463333333',
      redes: ['https://instagram.com/orgno'], descripcionActividad: 'Organizo conciertos locales',
      documentos: { identificacion: { url: 'https://x.test/a.jpg', publicId: 'v/a' } },
      reenvios: 0, creadaEn: Timestamp.now(), actualizadaEn: Timestamp.now(),
    });
    await setDoc(doc(db, 'notificaciones', 'n1'), {
      destinatarioId: 'asist1', tipo: 'prueba', titulo: 'Hola', cuerpo: 'Texto', leida: false, creadaEn: Timestamp.now(),
    });
    await setDoc(doc(db, 'calificaciones', 'c1'), {
      eventoId: 'e1', organizadorId: 'orgOk', asistenteId: 'asist1', estrellas: 5, oculta: false, creadaEn: Timestamp.now(),
    });
  });
}

// ---------- Configuración ----------
before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-eventos',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});
after(async () => { await testEnv.cleanup(); });
beforeEach(async () => { await testEnv.clearFirestore(); await sembrar(); });

// ---------- usuarios ----------
describe('usuarios', () => {
  function registro(uid, rol) {
    const db = como(uid, { email: `${uid}@test.com` });
    const b = writeBatch(db);
    b.set(doc(db, 'nombresUsuario', uid), { uid });
    b.set(doc(db, 'usuarios', uid), {
      nombreUsuario: uid, nombre: 'Nueva', apellidos: 'Persona', rol, ciudad: 'Ensenada',
      estadoVerificacion: 'sin_solicitud', estaVerificado: false, estadoCuenta: 'activa',
      promedioCalificacion: 0, totalCalificaciones: 0, creadoEn: serverTimestamp(),
    });
    b.set(doc(db, 'usuarios', uid, 'privado', 'perfil'), { correo: `${uid}@test.com` });
    return b.commit();
  }

  it('permite registrar un asistente', () => assertSucceeds(registro('nuevo1', 'asistente')));
  it('permite registrar un organizador', () => assertSucceeds(registro('nuevo2', 'organizador')));
  it('NO permite registrarse como administrador', () => assertFails(registro('nuevo3', 'administrador')));

  it('NO permite cambiar el propio rol', () =>
    assertFails(updateDoc(doc(como('asist1'), 'usuarios', 'asist1'), { rol: 'administrador' })));
  it('NO permite marcarse como verificado', () =>
    assertFails(updateDoc(doc(como('orgNo'), 'usuarios', 'orgNo'), { estaVerificado: true, estadoVerificacion: 'aprobada' })));
  it('permite editar la propia biografía', () =>
    assertSucceeds(updateDoc(doc(como('asist1'), 'usuarios', 'asist1'), { biografia: 'Hola' })));
  it('NO permite editar el perfil de otro', () =>
    assertFails(updateDoc(doc(como('asist1'), 'usuarios', 'asist2'), { biografia: 'hackeado' })));

  it('un autenticado lee el perfil público de otro', () =>
    assertSucceeds(getDoc(doc(como('asist1'), 'usuarios', 'asist2'))));
  it('un anónimo NO lee perfiles', () =>
    assertFails(getDoc(doc(anonimo(), 'usuarios', 'asist2'))));
  it('un asistente NO lee el perfil privado de otro', () =>
    assertFails(getDoc(doc(como('asist1'), 'usuarios', 'asist2', 'privado', 'perfil'))));
  it('el dueño lee su perfil privado', () =>
    assertSucceeds(getDoc(doc(como('asist1'), 'usuarios', 'asist1', 'privado', 'perfil'))));
  it('el admin lee perfiles privados', () =>
    assertSucceeds(getDoc(doc(como('admin1'), 'usuarios', 'asist1', 'privado', 'perfil'))));
});

// ---------- eventos ----------
describe('eventos', () => {
  const nuevoEvento = (extra = {}) => eventoBase({
    estado: 'pendiente_aprobacion', creadoEn: serverTimestamp(), actualizadoEn: serverTimestamp(), ...extra,
  });

  it('un anónimo lee un evento aprobado', () =>
    assertSucceeds(getDoc(doc(anonimo(), 'eventos', 'e1'))));
  it('un anónimo NO lee un evento pendiente', () =>
    assertFails(getDoc(doc(anonimo(), 'eventos', 'e3'))));
  it('el catálogo (filtrado por aprobado) funciona sin sesión', () =>
    assertSucceeds(getDocs(query(collection(anonimo(), 'eventos'), where('estado', '==', 'aprobado')))));
  it('listar todos los eventos sin filtro falla', () =>
    assertFails(getDocs(collection(anonimo(), 'eventos'))));
  it('el dueño lee su evento pendiente', () =>
    assertSucceeds(getDoc(doc(como('orgOk'), 'eventos', 'e3'))));

  it('un organizador verificado crea un evento', () =>
    assertSucceeds(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento())));
  it('un organizador NO verificado no puede crear eventos', () =>
    assertFails(setDoc(doc(como('orgNo'), 'eventos', 'nuevo'), nuevoEvento({ organizadorId: 'orgNo', organizadorNombre: 'Pedro Soto' }))));
  it('un asistente no puede crear eventos', () =>
    assertFails(setDoc(doc(como('asist1'), 'eventos', 'nuevo'), nuevoEvento({ organizadorId: 'asist1' }))));
  it('NO permite crear un evento ya aprobado', () =>
    assertFails(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento({ estado: 'aprobado' }))));
  it('NO permite crear con boletos ya vendidos', () =>
    assertFails(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento({ vendidas: 5 }))));
  it('NO permite suplantar el nombre del organizador', () =>
    assertFails(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento({ organizadorNombre: 'Otra Persona' }))));
  it('NO permite precio negativo', () =>
    assertFails(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento({ precio: -5 }))));
  it('NO permite una fecha ya pasada', () =>
    assertFails(setDoc(doc(como('orgOk'), 'eventos', 'nuevo'), nuevoEvento({ fechaInicio: enDias(-2), fechaFin: enDias(-1) }))));

  it('el organizador NO puede aprobar su propio evento', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'eventos', 'e3'), { estado: 'aprobado', actualizadoEn: serverTimestamp() })));
  it('otro organizador NO edita un evento ajeno', () =>
    assertFails(updateDoc(doc(como('orgNo'), 'eventos', 'e1'), { titulo: 'Robado', actualizadoEn: serverTimestamp() })));

  it('aprobado SIN ventas: un cambio sensible directo (sin volver a revisión) falla', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'eventos', 'e1'), { precio: 200, actualizadoEn: serverTimestamp() })));
  it('aprobado SIN ventas: un cambio sensible regresa a revisión', () =>
    assertSucceeds(updateDoc(doc(como('orgOk'), 'eventos', 'e1'), {
      precio: 200, estado: 'pendiente_aprobacion', actualizadoEn: serverTimestamp(),
    })));
  it('aprobado SIN ventas: un cambio no sensible se publica directo', () =>
    assertSucceeds(updateDoc(doc(como('orgOk'), 'eventos', 'e1'), {
      descripcion: 'Descripción actualizada del evento', actualizadoEn: serverTimestamp(),
    })));

  it('aprobado CON ventas: un cambio sensible directo falla', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'eventos', 'e2'), { precio: 200, actualizadoEn: serverTimestamp() })));
  it('aprobado CON ventas: un cambio sensible entra como cambioPropuesto', () =>
    assertSucceeds(updateDoc(doc(como('orgOk'), 'eventos', 'e2'), {
      estadoCambio: 'pendiente',
      cambioPropuesto: { lugar: 'Nuevo lugar', solicitadoEn: serverTimestamp() },
      actualizadoEn: serverTimestamp(),
    })));
  it('aprobado CON ventas: no se puede bajar la capacidad por debajo de lo vendido', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'eventos', 'e2'), { capacidad: 2, actualizadoEn: serverTimestamp() })));
  it('NO permite que el organizador se suba las ventas', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'eventos', 'e1'), { vendidas: 40, actualizadoEn: serverTimestamp() })));

  it('el admin aprueba un evento pendiente', () =>
    assertSucceeds(updateDoc(doc(como('admin1'), 'eventos', 'e3'), { estado: 'aprobado', actualizadoEn: serverTimestamp() })));
  it('el admin NO puede rechazar sin motivo', () =>
    assertFails(updateDoc(doc(como('admin1'), 'eventos', 'e3'), { estado: 'rechazado', actualizadoEn: serverTimestamp() })));
  it('el admin rechaza con motivo', () =>
    assertSucceeds(updateDoc(doc(como('admin1'), 'eventos', 'e3'), {
      estado: 'rechazado', motivoRechazo: 'Información incompleta', actualizadoEn: serverTimestamp(),
    })));
  it('el admin NO puede pedir correcciones sin observaciones', () =>
    assertFails(updateDoc(doc(como('admin1'), 'eventos', 'e3'), { estado: 'requiere_correccion', actualizadoEn: serverTimestamp() })));
  it('nadie borra eventos', () =>
    assertFails(deleteDoc(doc(como('admin1'), 'eventos', 'e1'))));
});

// ---------- entradas ----------
describe('entradas', () => {
  it('el asistente dueño lee su entrada', () =>
    assertSucceeds(getDoc(doc(como('asist1'), 'entradas', 'ent1'))));
  it('otro asistente NO la lee', () =>
    assertFails(getDoc(doc(como('asist2'), 'entradas', 'ent1'))));
  it('el organizador del evento la lee', () =>
    assertSucceeds(getDoc(doc(como('orgOk'), 'entradas', 'ent1'))));
  it('el cliente NO puede crear entradas', () =>
    assertFails(setDoc(doc(como('asist1'), 'entradas', 'falsa'), {
      eventoId: 'e1', asistenteId: 'asist1', organizadorId: 'orgOk', usada: false, creadaEn: serverTimestamp(),
    })));
  it('el organizador NO puede marcar una entrada como usada desde el cliente', () =>
    assertFails(updateDoc(doc(como('orgOk'), 'entradas', 'ent1'), { usada: true })));
  it('el asistente NO puede borrar su entrada', () =>
    assertFails(deleteDoc(doc(como('asist1'), 'entradas', 'ent1'))));
});

// ---------- solicitudes de verificación ----------
describe('solicitudesVerificacion', () => {
  const solicitudNueva = (uid) => ({
    organizadorId: uid, estado: 'pendiente', telefono: '6461234567',
    redes: ['https://instagram.com/x'], descripcionActividad: 'Organizo conciertos locales',
    documentos: { identificacion: { url: 'https://x.test/a.jpg', publicId: 'v/a' } },
    reenvios: 0, creadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
  });

  it('un organizador envía su solicitud', () =>
    assertSucceeds(setDoc(doc(como('orgOk'), 'solicitudesVerificacion', 'orgOk'), solicitudNueva('orgOk'))));
  it('un asistente NO puede enviar solicitud', () =>
    assertFails(setDoc(doc(como('asist1'), 'solicitudesVerificacion', 'asist1'), solicitudNueva('asist1'))));
  it('NO permite crear una solicitud ya aprobada', () =>
    assertFails(setDoc(doc(como('orgOk'), 'solicitudesVerificacion', 'orgOk'), { ...solicitudNueva('orgOk'), estado: 'aprobada' })));
  it('el titular lee su solicitud', () =>
    assertSucceeds(getDoc(doc(como('orgNo'), 'solicitudesVerificacion', 'orgNo'))));
  it('otro usuario NO lee la solicitud', () =>
    assertFails(getDoc(doc(como('asist1'), 'solicitudesVerificacion', 'orgNo'))));
  it('el organizador NO puede aprobarse a sí mismo', () =>
    assertFails(updateDoc(doc(como('orgNo'), 'solicitudesVerificacion', 'orgNo'), { estado: 'aprobada', actualizadaEn: serverTimestamp() })));
  it('el admin aprueba una solicitud', () =>
    assertSucceeds(updateDoc(doc(como('admin1'), 'solicitudesVerificacion', 'orgNo'), {
      estado: 'aprobada', revisadaPor: 'admin1', revisadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
    })));
  it('el admin NO puede devolver sin observaciones', () =>
    assertFails(updateDoc(doc(como('admin1'), 'solicitudesVerificacion', 'orgNo'), {
      estado: 'correccion_requerida', revisadaPor: 'admin1', revisadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
    })));
  it('el admin devuelve con observaciones', () =>
    assertSucceeds(updateDoc(doc(como('admin1'), 'solicitudesVerificacion', 'orgNo'), {
      estado: 'correccion_requerida', observaciones: 'La INE no se lee',
      revisadaPor: 'admin1', revisadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
    })));
});

// ---------- favoritos, reportes, notificaciones, calificaciones ----------
describe('favoritos', () => {
  it('un asistente guarda un favorito propio', () =>
    assertSucceeds(setDoc(doc(como('asist1'), 'favoritos', 'asist1_e1'), {
      asistenteId: 'asist1', eventoId: 'e1', creadoEn: serverTimestamp(),
    })));
  it('NO puede crear favoritos a nombre de otro', () =>
    assertFails(setDoc(doc(como('asist1'), 'favoritos', 'asist2_e1'), {
      asistenteId: 'asist2', eventoId: 'e1', creadoEn: serverTimestamp(),
    })));
  it('un organizador no guarda favoritos', () =>
    assertFails(setDoc(doc(como('orgOk'), 'favoritos', 'orgOk_e1'), {
      asistenteId: 'orgOk', eventoId: 'e1', creadoEn: serverTimestamp(),
    })));
});

describe('reportes', () => {
  const reporte = (extra = {}) => ({
    eventoId: 'e1', organizadorId: 'orgOk', reportanteId: 'asist1', eventoTitulo: 'Feria del taco',
    motivo: 'spam', descripcion: 'Parece spam', estado: 'pendiente_moderacion',
    creadoEn: serverTimestamp(), ...extra,
  });

  it('un asistente reporta un evento aprobado', () =>
    assertSucceeds(setDoc(doc(como('asist1'), 'reportes', 'asist1_e1'), reporte())));
  it('NO permite falsear el organizador del evento', () =>
    assertFails(setDoc(doc(como('asist1'), 'reportes', 'asist1_e1'), reporte({ organizadorId: 'orgNo' }))));
  it('NO permite un motivo fuera de la lista', () =>
    assertFails(setDoc(doc(como('asist1'), 'reportes', 'asist1_e1'), reporte({ motivo: 'porque si' }))));
  it('NO permite reportar sin descripción', () =>
    assertFails(setDoc(doc(como('asist1'), 'reportes', 'asist1_e1'), reporte({ descripcion: '' }))));
  it('el reportante NO puede cerrar su propio reporte', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'reportes', 'asist1_e1'), {
        eventoId: 'e1', organizadorId: 'orgOk', reportanteId: 'asist1', eventoTitulo: 'Feria del taco',
        motivo: 'spam', descripcion: 'Parece spam', estado: 'pendiente_moderacion', creadoEn: Timestamp.now(),
      });
    });
    await assertFails(updateDoc(doc(como('asist1'), 'reportes', 'asist1_e1'), { estado: 'cerrado' }));
    await assertFails(getDoc(doc(como('asist2'), 'reportes', 'asist1_e1')));
    await assertSucceeds(getDoc(doc(como('admin1'), 'reportes', 'asist1_e1')));
  });
});

describe('notificaciones', () => {
  it('el destinatario lee y marca como leída', async () => {
    await assertSucceeds(getDoc(doc(como('asist1'), 'notificaciones', 'n1')));
    await assertSucceeds(updateDoc(doc(como('asist1'), 'notificaciones', 'n1'), { leida: true }));
  });
  it('NO puede cambiar el contenido', () =>
    assertFails(updateDoc(doc(como('asist1'), 'notificaciones', 'n1'), { titulo: 'Otro' })));
  it('otro usuario NO la lee', () =>
    assertFails(getDoc(doc(como('asist2'), 'notificaciones', 'n1'))));
  it('un cliente NO puede crear notificaciones', () =>
    assertFails(setDoc(doc(como('asist2'), 'notificaciones', 'falsa'), {
      destinatarioId: 'asist1', tipo: 'x', titulo: 't', cuerpo: 'c', leida: false, creadaEn: serverTimestamp(),
    })));
});

describe('calificaciones y otras colecciones', () => {
  it('el cliente NO crea calificaciones directamente', () =>
    assertFails(setDoc(doc(como('asist2'), 'calificaciones', 'asist2_e1'), {
      eventoId: 'e1', organizadorId: 'orgOk', asistenteId: 'asist2', estrellas: 5, oculta: false, creadaEn: serverTimestamp(),
    })));
  it('el admin oculta una calificación', () =>
    assertSucceeds(updateDoc(doc(como('admin1'), 'calificaciones', 'c1'), { oculta: true })));
  it('el asistente NO edita su calificación directamente', () =>
    assertFails(updateDoc(doc(como('asist1'), 'calificaciones', 'c1'), { estrellas: 1 })));
  it('colecciones no declaradas están bloqueadas (mail)', () =>
    assertFails(setDoc(doc(como('admin1'), 'mail', 'm1'), { to: 'x@test.com' })));
});