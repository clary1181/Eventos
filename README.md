# Eventos Ensenada

Aplicación móvil para **descubrir, publicar y administrar eventos en Ensenada, Baja California**. Permite que los asistentes exploren eventos y compren entradas con código QR, que los organizadores publiquen y validen sus eventos, y que un administrador revise y modere el contenido.

Proyecto de la materia **Aplicaciones Móviles** ·
Autora: **Clarita**

---

## Entrega

| Recurso | Enlace |
|---|---|
| 📱 **APK para Android** (descarga e instalación) | https://expo.dev/accounts/clary118/projects/App-MR-Eventos/builds/661cad5b-8834-46f1-87f8-29ecbafc9b66 | |
| Guía técnica del proyecto | [`docs/guia-proyecto.md`](docs/guia-proyecto.md) |
| Modelo de datos (propuesta de diseño) | [`docs/modelo-datos.md`](docs/modelo-datos.md) |

### Cómo instalar el APK

1. Abre el enlace del APK **desde un celular Android**.
2. Presiona **Instalar** (o descarga el `.apk`).
3. Si Android lo pide, permite **"Instalar apps de orígenes desconocidos"** para el navegador o gestor de archivos que uses.
4. Abre **Eventos** e inicia sesión con una cuenta de prueba (abajo) o crea una nueva.

> El enlace de Expo tiene una vigencia limitada. Si ya no está disponible, usa el de Google Drive.
> No se necesita Expo Go ni ejecutar nada en una computadora: el APK es independiente.

### Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Asistente | (crear el propio) | (crear el propio) |
| Organizador (verificado) | (crear el propio) | (crear el propio) |
| Administrador |  kjsjsbpepejkk3@gmail.com | Tacos1182$ |

También puedes **iniciar sesión con Google** o **registrarte** como asistente u organizador.

---

## ¿Qué hace la app?

La app tiene **tres roles**, cada uno con su propia navegación y permisos.

### Asistente
- **Explorar** el catálogo de eventos aprobados, con búsqueda por evento y por organizador.
- **Ver el detalle** de cada evento y **comprar entradas** (máximo 5 por persona y evento). _La compra es simulada: no se cobra dinero real._
- Cada entrada genera un **código QR** para entrar al evento.
- **Guardar favoritos** y **seguir organizadores** (ver a cuántos sigues y abrir su perfil).
- Consultar el **historial de eventos**, **calificar** eventos a los que asistió y **reportar** contenido inapropiado.
- Recibir **avisos** en la campana y **recordatorios** (24 h y 2 h antes) de sus favoritos y entradas.

### Organizador
- **Solicitar verificación** con documentos (obligatoria para publicar).
- **Crear y editar eventos** con portada; los eventos nuevos quedan en revisión.
- Consultar **estadísticas** generales y por evento, y la **lista de entradas vendidas**.
- **Validar entradas** escaneando el QR con la cámara.
- Ver los **reportes** recibidos y responder.
- Recibir avisos: aprobación o rechazo de eventos, compras de entradas, reportes y cambios de su cuenta.

### Administrador
- Revisar **solicitudes de verificación** (aprobar, rechazar o pedir correcciones).
- Revisar **eventos nuevos y cambios propuestos**.
- **Moderar contenido**: resolver reportes, suspender o reactivar eventos y cuentas.
- Ver **estadísticas** de la plataforma con filtro por periodo.

### Todos los roles
- Registro e inicio de sesión con **correo y contraseña** o con **Google**.
- **Recuperar contraseña**, **notificaciones**, **configuración**, ayuda y legales.

---

## Cómo funciona

### Flujo de un evento

```
Organizador crea evento ──► pendiente_aprobacion ──► Administrador revisa
                                                      ├─ aprueba  ─► visible para asistentes (se avisa a sus seguidores)
                                                      ├─ rechaza  ─► el organizador recibe el motivo
                                                      └─ pide correcciones
Asistente compra entradas ──► se generan entradas con QR ──► el organizador las escanea en la puerta
```

- Si un evento **ya vendió entradas**, los cambios sensibles no se aplican directo: se guardan como **cambio propuesto** y el administrador los aprueba.
- Un evento con **ventas no se puede eliminar**.
- Si un organizador reincide en reportes, el administrador puede **suspender su cuenta**; mientras dure no puede publicar.

### Entradas y QR
1. La compra se hace en una **transacción de Firestore** que verifica cupo y límite por persona.
2. Se crean entradas con identificador `{uid}_{eventoId}_{n}` y un token aleatorio.
3. El QR contiene `idEntrada`, `idEvento` y `token`.
4. Al escanear, otra transacción comprueba que la entrada pertenece al evento, que no se haya usado y que esté en la ventana de fecha, y la marca como **usada**.

### Notificaciones
- **Campana de avisos** dentro de la app para los tres roles, guardada en Firestore (`notificaciones`).
- **Push** con la API de Expo Push (los tokens se guardan en `tokensPush/{uid}`); funciona en el APK, **no en Expo Go**.
- **Recordatorios locales** programados en el teléfono para favoritos y entradas.

### Sesión y seguridad
- **Firebase Authentication** identifica a las personas; la sesión se restaura al reabrir la app.
- Quien entra por primera vez con Google completa su perfil (nombre, fecha de nacimiento, usuario, ciudad y rol).
- La seguridad real está en las **reglas de Firestore** (`backend/firestore.rules`): cada rol solo lee y escribe lo que le corresponde, y las colecciones no declaradas están bloqueadas.
- Las imágenes (perfil, documentos, portadas) se suben a **Cloudinary** con presets sin firma; el secreto de la API no está en el proyecto.

---

## Tecnologías

| Área | Herramientas |
|---|---|
| App | Expo SDK 58, React Native, React 19, TypeScript |
| Navegación | Expo Router (rutas por archivo) |
| Backend | Firebase Authentication y Firestore |
| Imágenes | Cloudinary |
| Inicio con Google | `@react-native-google-signin/google-signin` (módulo nativo) |
| Notificaciones | `expo-notifications` + Expo Push API |
| QR y cámara | Expo Camera + generación de QR |
| Builds | EAS Build (APK) |
| Diseño | Montserrat, paleta blanca y morada |

---

## Estructura del proyecto

```
Eventos/
├── frontend/                  # App Expo
│   ├── src/
│   │   ├── app/               # Rutas y layouts (expo-router)
│   │   ├── features/          # Código por dominio: auth, asistente, organizador,
│   │   │                      #   administrador, notificaciones, recordatorios, ...
│   │   ├── compartido/        # Componentes, tema y utilidades comunes
│   │   ├── config/            # Variables de entorno y Cloudinary
│   │   └── infraestructura/   # Inicialización de Firebase y Cloudinary
│   ├── app.json / app.config.js / eas.json
│   └── assets/
├── backend/
│   ├── firestore.rules        # Reglas de seguridad
│   ├── firestore.indexes.json
│   ├── tests/reglas.test.mjs  # Pruebas de reglas con el emulador
│   └── functions/             # Cloud Functions (no conectadas al cliente actual)
└── docs/                      # Guía, modelo de datos y bitácora
```

Cada dominio en `src/features/` se divide en `pantallas/`, `componentes/`, `hooks/` y `servicios/`: las pantallas solo dibujan, los hooks guardan la lógica y los servicios hablan con Firebase.

Más detalle en [`docs/guia-proyecto.md`](docs/guia-proyecto.md).

---

## Ejecutar el proyecto en desarrollo

**Requisitos:** Node.js, un celular Android y, para Google Sign-In y push, un *dev client* (APK de EAS con perfil `development`). Expo Go no soporta esas dos funciones.

```powershell
cd frontend
npm install
copy .env.example .env      # y completa los valores
npx expo start --dev-client -c
```

Variables de `frontend/.env` (solo nombres, los valores **no** se suben a git):

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
EXPO_PUBLIC_CLOUDINARY_PRESET_EVENTOS
EXPO_PUBLIC_CLOUDINARY_PRESET_VERIFICACION
EXPO_PUBLIC_EXIGIR_CORREO_VERIFICADO
EXPO_PUBLIC_USAR_EMULADORES
EXPO_PUBLIC_EMULADOR_HOST
```

Además, se necesita el archivo `frontend/google-services.json` del proyecto de Firebase (tampoco se sube a git).

### Reglas de Firestore

```powershell
cd backend
npm run test:reglas                       # pruebas con el emulador
firebase deploy --only firestore:rules    # publicar reglas
```

### Generar el APK

```powershell
cd frontend
eas build -p android --profile preview
```

---

## ️Alcance y limitaciones

- La **compra de entradas es simulada**: no hay pagos reales.
- No hay mapas ni integración con calendarios.
- Los **push** requieren el APK (no funcionan en Expo Go) y que el usuario acepte los permisos.
- Los tokens de push no se eliminan al cerrar sesión.
- `backend/functions/` incluye una Cloud Function de compra y un trigger de verificación, pero el cliente actual **no las usa**: la lógica corre en el cliente y se protege con las reglas de Firestore.
- Para revisar la app se recomienda un celular **Android**.
