# Bitácora de IA y diario de decisiones

**Proyecto:** Eventos Ensenada (app móvil) 
**Autora:** Clarita  
**Herramienta de IA:** Claude (Anthropic), usado como asistente de programación

> Este documento registra **cómo se usó la IA** en el proyecto y **qué decisiones se tomaron**: qué propuso la IA, qué se aceptó, qué se rechazó o se ajustó y por qué. No incluye el envío rutinario de archivos ni los mensajes de "continúa"; solo dudas, recomendaciones y decisiones.

---

## 1. Cómo trabajamos con la IA

- Se trabajó **por rol y por etapa** (asistente → organizador → administrador), una funcionalidad a la vez.
- La IA proponía el diseño y entregaba el código como archivos listos para copiar; **yo lo probaba en mi celular Android** (Expo + dev client) y reportaba qué fallaba o qué faltaba.
- Siempre se parte de **mis archivos más recientes** (porque los modifico entre entregas), no de versiones viejas.
- Antes de crear algo con impacto en el diseño, pedí que la IA **respondiera primero con su opinión** y yo decidía.
- La IA no ejecuta la app: solo revisa sintaxis/tipos. Las pruebas funcionales y la publicación de reglas de Firestore las hice yo.
- Regla propia: **no subir `.env` ni `.env.example`** al repositorio.

---

## 2. Diario de decisiones

Leyenda: ✅ aceptada · ✏️ aceptada con ajuste · ❌ rechazada / corregida por mí · ⏳ pendiente

| # | Etapa | Duda o propuesta | Recomendación de la IA | Mi decisión | Resultado |
|---|-------|------------------|------------------------|-------------|-----------|
| D1 | Organizador – Mis eventos | ¿Los 3 puntitos deben permitir **eliminar eventos**? Yo dudaba qué hacer si ya vendió entradas ("quizá que no deje si ya vendió"). | Permitir eliminar **solo si el evento no tiene entradas vendidas**; con ventas, no. | ✅ Acepté. | Regla de Firestore: se puede borrar un evento solo si `vendidas == 0`. |
| D2 | Organizador – Métricas | No sabía si las métricas eran por evento o generales; pedí que se vieran "más profesionales". | Separar **resumen general** (Inicio/Estadísticas) y **detalle por evento** (botón de métricas en cada evento). | ✅ Acepté. | Pantalla de estadísticas por evento + resumen general. |
| D3 | Asistente – Perfil | Propuse que la cantidad de "Organizadores que sigo" fuera un botón. | Se implementó como botón. | ❌ Lo corregí: **que muestre la cantidad pero no sea botón**, porque para eso ya existe "Mis actividades". | Cambiado a un contador no presionable. |
| D4 | Asistente – Seguir organizadores | Pedí buscar organizadores por nombre desde Inicio, seguirlos, ver a cuántos sigo y abrir su perfil desde la lista. | Colección `seguidos` (`{uid}_{organizadorId}`), buscador en Explorar, lista "Organizadores que sigo" y perfil público del organizador. | ✅ | Funcionando. |
| D5 | Administrador – Moderación | Pregunté qué opinaba de **bloquear por unos días a un organizador** con 3 reportes cuyos eventos se suspenden. Pedí que la IA **respondiera antes de generar código**. | Aplicar una **suspensión temporal de la cuenta** (no un bloqueo definitivo) ante reincidencia, con opción de que el administrador la levante; mientras dure, el organizador no puede publicar. | ✅ Dije "va". | Suspensión/levantamiento desde moderación; la regla `organizadorVerificadoActivo` ahora también exige que no haya suspensión vigente. |
| D6 | Alcance del proyecto | ¿Mi documentación menciona **mapas**? ¿Y qué falta (notificaciones, Google)? | Según el plan del proyecto **no hay mapas ni Google Sign-In**; sí hay "recibir recordatorios" y "favoritos y recordatorios". Mapas quedaron como extra opcional ("Cómo llegar" con Google Maps). | ✅ Acepté no hacer mapas por ahora. | Mapas descartados; el botón "Cómo llegar" queda **pendiente/opcional**. |
| D7 | Notificaciones – alcance | Pregunté si las notificaciones eran **solo para el asistente**. | No: **campana de avisos dentro de la app para los 3 roles** (con eventos propios de cada rol) + **recordatorios locales** para el asistente (favoritos y entradas). Presentó la lista de eventos que avisan. | ✅ "Esa lista me parece perfecta" (yo no tenía una propia). | Colección `notificaciones` + pantalla de avisos + recordatorios 24 h y 2 h antes. |
| D8 | Notificaciones – avisos al admin | La IA dijo que **no** agregaba el aviso "organizador solicitó verificación" porque no tenía el código de ese envío. Yo cuestioné: "¿pero cuando mando un evento no le llega nada al admin?" | Aclaró que el aviso de **evento nuevo** sí existía en la campana; el que no se emitió era solo el de solicitud de verificación. | ✅ Entendí la diferencia. El problema real era el **push**, no la campana. | El aviso de verificación al admin sigue ⏳ (el Inicio del admin ya muestra cuántas hay pendientes). |
| D9 | Notificaciones – pantallas con mi configuración | Pregunté: "¿lo que me diste **no afecta** lo que tengo? Yo metí Configuración en cada rol (reemplazando Cerrar sesión)". | La IA reconoció que su entrega **habría sobrescrito** mis pantallas actualizadas. | ❌ Rechacé esa entrega tal cual y pedí que se rehiciera sobre mis archivos. | Se regeneraron las 5 pantallas a partir de mis archivos, cambiando solo la campana. **Lección:** siempre parchar sobre mi última versión. |
| D10 | Notificaciones – push | La campana mostraba el aviso pero **no llegaba la notificación push**. Mi proyecto anterior sí la recibía. | Como no hay Cloud Functions, enviar el push **desde la app** con la API de Expo Push; guardar un token por usuario en `tokensPush/{uid}`; **reutilizar el dev client (APK de EAS) del proyecto anterior** y copiar su `projectId` y `slug`/`package` al nuevo `app.json`. | ✅ Acepté; fusioné los valores del `app.json` anterior. | Push funcionando. La causa de "solo hay un token" era que el admin aún no había iniciado sesión con el código nuevo y aceptado permisos. |
| D11 | Notificaciones – seguidores | Pregunté por qué al asistente **no le llegaba** que un organizador al que sigue publicó un evento. | Avisar a los seguidores **cuando el administrador aprueba** el evento (no cuando se crea, porque aún no es público). | ✅ Acepté. | Aviso `organizador_nuevo_evento` al aprobar. |
| D12 | Notificaciones – limitación conocida | La IA señaló que si un evento se **vuelve a aprobar** podría repetir el aviso a seguidores, y que los **tokens no se borran al cerrar sesión**. | Posibles mejoras: marca en el evento para no repetir, y borrar el token al cerrar sesión. | ⏳ Quedó **pendiente**; no era prioridad. | Documentado como limitación. |
| D13 | Organizador – Entradas vendidas | Mi documentación pide "consultar entradas vendidas". Pregunté **qué archivos** necesitaba la IA antes de que generara nada. | Pedir solo los archivos que se tocarían (estadísticas, gestión de evento, Inicio del organizador). | ✅ Se los pasé. | Lista de compradores por evento, accesible desde estadísticas y desde la gestión del evento. |
| D14 | Organizador – Filtro "Acumulado" | El filtro del Inicio era solo una etiqueta fija. | Selector de periodo real (7 días / 30 días / acumulado) calculando con los datos ya cargados. | ✅ | Selector funcionando. |
| D15 | Recuperar contraseña | Pedí revisar si faltaba. | Se verificó con mis archivos que **ya existía**; no se generó código nuevo. | ✅ | Sin cambios. |
| D16 | Inicio de sesión con Google | No estaba en el plan, pero lo quise agregar como extra. Pregunté si la IA necesitaba archivos de mi proyecto viejo. | Usar el módulo nativo `@react-native-google-signin` (requiere dev client, no Expo Go). Armar **primero pantallas y servicio**, y **después** configurar el `google-services.json` nuevo (el mío aún era del proyecto viejo). | ✅ Acepté ese orden. | Funcionando tras configurar Firebase (proveedor Google, SHA-1, `google-services.json` y ID de cliente web). |
| D17 | Google – cuentas nuevas | ¿Qué pasa si alguien entra con Google y **no tiene perfil**? | En vez de crear un perfil automático, mostrar una pantalla **"Completar perfil"** (nombre, fecha de nacimiento, usuario, ciudad y rol) y mantener la sesión abierta mientras tanto. | ✅ | Pantalla `completar-perfil` + estado `perfilPendiente` en la sesión. |
| D18 | Arquitectura general | Sin Cloud Functions en el proyecto nuevo. | Toda la lógica **en el cliente** y la seguridad en **reglas de Firestore**; evitar índices compuestos (filtros de igualdad y ordenar en la app). | ✅ | Se mantuvo en todas las funcionalidades. |
| D19 | Git | Se rechazó mi `git push` y me salían avisos "Deletion of directory… (y/n)" por OneDrive. | Hacer `git pull --rebase` y luego `push`; responder **n** a los avisos (son inofensivos). | ✅ | Commit y push resueltos. |

---

## 3. Dudas que tuve y cómo se aclararon

- **"¿Esto afecta lo que ya tengo?"** → Sí, podía pisar mis pantallas editadas; se rehízo sobre mis versiones (D9).
- **"¿Por qué sale en la campana pero no llega el push?"** → La campana usa Firestore y el push necesita token + permisos + `projectId` de EAS + credenciales FCM; faltaba el token del admin (D10).
- **"¿Qué pasa si el organizador ya vendió entradas y quiere eliminar el evento?"** → No se permite (D1).
- **"¿Mi documentación incluye mapas/Google?"** → No; son extras opcionales (D6, D16).
- **¿Por qué el `google-services.json` debe ser del mismo proyecto de Firebase?** → Porque el token de Google se valida contra ese proyecto; con el archivo viejo daría error de configuración.

---

## 4. Errores de la IA que se detectaron

| Error | Cómo se detectó | Corrección |
|-------|-----------------|------------|
| Entrega que sobrescribía mis pantallas con Configuración. | Lo noté yo y pregunté. | Se regeneró desde mis archivos (D9). |
| "Reportes sin revisar" siempre en 0 (se consultaba el estado `pendiente` en lugar de `pendiente_moderacion`). | Lo vi en el Inicio del admin. | Se corrigió la consulta. |
| Faltaba que yo tuviera `servicioReportes.ts`. | Yo no tenía ese archivo. | Se reenvió junto con `servicioCalificaciones.ts`. |
| Push sin `extra.eas.projectId`. | Advertencia en consola de Expo. | Se fusionó el `app.json` del proyecto anterior. |

---

---

## 5. Declaración de uso de IA

La IA se usó para **proponer diseño, generar y corregir código y reglas de seguridad, y explicar errores**. Las decisiones de alcance, el diseño visual, las pruebas en dispositivo, la configuración de Firebase/EAS/Google y la publicación de reglas las realicé yo. Todo el código fue revisado y probado antes de integrarse al repositorio.

> **Nota para completar:** agrega fechas a cada decisión (D1–D19) y, si lo deseas, las decisiones de las primeras etapas (registro/autenticación, roles, compra de entradas y QR) que no quedaron detalladas aquí.
