# Guía del proyecto Eventos

## 1. Propósito y alcance de esta guía

Eventos es una aplicación móvil con Expo, React Native y TypeScript para asistentes, organizadores y administradores. Firebase Authentication identifica a las personas; Cloud Firestore guarda perfiles, eventos y solicitudes; Cloudinary recibe las imágenes de verificación.

Esta guía se basa en los archivos presentes en el repositorio. Describe lo que el código hace hoy, no lo que solo aparece como diseño en `docs/modelo-datos.md`. No se puede deducir de los archivos locales si cada servicio está desplegado en Firebase.

### Estado funcional observado

- **Acceso:** registro con correo y contraseña, perfil público y privado, inicio/cierre de sesión, verificación de correo y recuperación de contraseña.
- **Google:** no hay un flujo de autenticación con Google conectado.
- **Protección de rutas:** se restaura la sesión, se comprueba el perfil y las pantallas de cada rol quedan protegidas.
- **Organizador:** puede enviar una solicitud de verificación, adjuntar selfie e identificación a Cloudinary, corregir y reenviar una solicitud devuelta, ver el estado de su cuenta y consultar en tiempo real sus eventos existentes.
- **Administrador:** ve conteos del sistema y una bandeja funcional para revisar solicitudes de verificación. Puede aprobar, pedir correcciones o rechazar.
- **Eventos:** existen tipos, tarjetas, formato de datos, reglas de acceso y una consulta en vivo de eventos de un organizador. Crear eventos, explorar el catálogo público y administrar/aprobar eventos desde pantallas todavía no está implementado.
- **Asistente:** explorar, favoritos y entradas son pantallas provisionales; no hay en esas rutas catálogo, compra, QR o guardado de favoritos.
- **Otras rutas provisionales:** estadísticas, reportes, validación de QR y administración de eventos/reportes muestran pantallas “próximamente”.
- **Backend:** hay una Cloud Function real que sincroniza el resultado de la verificación con el perfil del organizador. No hay funciones para compra de entradas, QR, notificaciones, calificaciones ni moderación.
- **Hosting:** las páginas de `backend/public/` son las páginas de plantilla de Firebase Hosting; no sirven el frontend Expo.

## 2. Arquitectura y conexiones

```text
frontend/src/app (rutas y layouts Expo Router)
  ├─ (auth) ─────────────── features/auth (formularios, hooks, Firebase Auth/Firestore)
  ├─ asistente ──────────── features/perfil y pantallas provisionales
  ├─ organizador ───────── features/organizador, features/eventos, features/verificacion
  └─ administrador ─────── features/administrador/verificaciones
                                  │
                    compartido (UI, tema, navegación y utilidades)
                                  │
                    infraestructura/firebase ── config/entorno ── Firebase
                    infraestructura/cloudinary ─ config/cloudinary ─ Cloudinary

backend/firebase.json
  ├─ firestore.rules ───────── autorización y validación de documentos
  ├─ firestore.indexes.json ── índices compuestos de consultas
  ├─ functions/src ─────────── trigger de solicitud de verificación
  ├─ functions/scripts ─────── creación manual de administrador en emuladores
  ├─ tests/reglas.test.mjs ─── pruebas de autorización con emulador
  └─ public ────────────────── páginas de plantilla de Hosting

docs/modelo-datos.md ───────── diseño y decisiones del modelo Firestore
```

El alias `@/` apunta a `frontend/src/` (definido en `frontend/tsconfig.json`). Expo Router convierte los archivos de `frontend/src/app/` en rutas. Las pantallas delegan la lógica y los componentes a `frontend/src/features/`; las rutas no son el lugar para inicializar Firebase.

### Flujo de sesión y acceso por rol

1. `src/app/_layout.tsx` carga fuentes y monta `SesionProvider` alrededor del navegador.
2. `SesionProvider` escucha Firebase Auth, exige correo verificado según la configuración y carga `usuarios/{uid}` desde Firestore.
3. Si no existe perfil, la cuenta está bloqueada o no cumple la verificación de correo, no se conserva una sesión aceptada.
4. `src/app/index.tsx` envía a la pantalla de acceso o usa `rutaInicialPorRol` para dirigir al asistente, organizador o administrador.
5. Los layouts de rol usan `GuardiaRol` y bloquean al usuario con rol distinto.
6. Las reglas de Firestore vuelven a validar permisos en el servidor; las protecciones visuales del frontend no sustituyen esas reglas.

### Flujo de registro

1. `useRegistro` y `PantallaRegistro` validan los datos.
2. `servicioAuth.registrarCuenta` crea la cuenta Firebase Auth.
3. `servicioUsuarios.crearPerfilCompleto` escribe en un lote `nombresUsuario/{nombre}`, `usuarios/{uid}` y `usuarios/{uid}/privado/perfil`.
4. Se solicita el correo de verificación y se cierra la sesión. El inicio de sesión exige verificación si `EXPO_PUBLIC_EXIGIR_CORREO_VERIFICADO` no se establece en `false`.
5. Las reglas solo aceptan los roles registrables `asistente` y `organizador`; la cuenta de administrador se crea por separado mediante un script para emuladores.

### Flujo de verificación del organizador

1. La pantalla de organizador lee `usuarios/{uid}` y `usuarios/{uid}/privado/perfil` mediante `ProveedorPerfilOrganizador`.
2. `PantallaVerificacion` obtiene en tiempo real `solicitudesVerificacion/{uid}`.
3. El formulario valida teléfono, redes, descripción, selfie, identificación y aceptación de términos.
4. `subirImagen` envía las imágenes a Cloudinary usando el preset de verificación configurado en Expo; `servicioVerificacion` crea o actualiza la solicitud en Firestore.
5. La bandeja administrativa escucha solicitudes, carga datos públicos resumidos y actualiza el estado usando `servicioBandeja`.
6. `alCambiarSolicitudVerificacion` se activa cuando cambia el documento y sincroniza `estadoVerificacion` y `estaVerificado` en `usuarios/{uid}`.

La solicitud y los perfiles se protegen con `firestore.rules`. La Function no implementa envío de notificaciones, aunque el código indica que eso quedaría para otro módulo.

### Entorno y servicios externos

- `frontend/src/config/entorno.ts` consume variables `EXPO_PUBLIC_*`; `infraestructura/firebase/cliente.ts` crea Firebase una sola vez, mantiene Auth con AsyncStorage y conecta opcionalmente los emuladores de Auth y Firestore.
- `frontend/src/config/cloudinary.ts` lee el nombre de nube y el preset público de carga. El secreto de API de Cloudinary nunca debe ponerse en la app.
- `frontend/.env.example` es la plantilla de entorno. `frontend/.env` es configuración local; no copiar sus valores a esta documentación ni compartirla.
- En un dispositivo físico, `EXPO_PUBLIC_EMULADOR_HOST` debe ser una IP alcanzable de la computadora; `127.0.0.1` identifica al propio dispositivo.

## 3. Árbol del proyecto

Árbol de archivos del proyecto, agrupado para facilitar su lectura. Incluye fuentes, configuración, documentación y recursos de la aplicación; no expande dependencias instaladas ni archivos generados. En esta copia también existen logs de Firebase y salidas compiladas en `backend/functions/lib/`, que se describen al final de esta sección.

```text
Eventos/
├── estructura.txt
├── docs/
│   ├── guia-proyecto.md
│   └── modelo-datos.md
├── backend/
│   ├── .firebaserc
│   ├── .gitignore
│   ├── firebase.json
│   ├── firestore.indexes.json
│   ├── firestore.rules
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── 404.html
│   │   └── index.html
│   ├── tests/
│   │   └── reglas.test.mjs
│   └── functions/
│       ├── .eslintrc.js
│       ├── .gitignore
│       ├── package.json
│       ├── package-lock.json
│       ├── tsconfig.json
│       ├── tsconfig.dev.json
│       ├── scripts/
│       │   └── crear-admin.cjs
│       └── src/
│           ├── index.ts
│           └── modulos/
│               └── verificacion/
│                   └── alCambiarSolicitudVerificacion.ts
└── frontend/
    ├── .claude/
    │   └── settings.json
    ├── .vscode/
    │   ├── extensions.json
    │   └── settings.json
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── AGENTS.md
    ├── CLAUDE.md
    ├── app.json
    ├── expo-env.d.ts
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── assets/
    │   ├── imagenes/
    │   │   ├── concierto.jpg
    │   │   └── ensenada.jpg
    │   └── images/
    │       ├── android-icon-background.png
    │       ├── android-icon-foreground.png
    │       ├── android-icon-monochrome.png
    │       ├── favicon.png
    │       ├── icon.png
    │       └── splash-icon.png
    └── src/
        ├── app/
        │   ├── _layout.tsx
        │   ├── index.tsx
        │   ├── (auth)/
        │   │   ├── _layout.tsx
        │   │   ├── iniciar-sesion.tsx
        │   │   └── registro.tsx
        │   ├── asistente/
        │   │   ├── _layout.tsx
        │   │   ├── entradas.tsx
        │   │   ├── explorar.tsx
        │   │   ├── favoritos.tsx
        │   │   └── perfil.tsx
        │   ├── organizador/
        │   │   ├── _layout.tsx
        │   │   ├── crear.tsx
        │   │   ├── estadisticas.tsx
        │   │   ├── inicio.tsx
        │   │   ├── mis-eventos.tsx
        │   │   ├── perfil.tsx
        │   │   ├── reportes.tsx
        │   │   ├── validar-qr.tsx
        │   │   ├── verificacion.tsx
        │   │   └── (pestanas)/
        │   │       ├── _layout.tsx
        │   │       ├── crear.tsx
        │   │       ├── estadisticas.tsx
        │   │       ├── inicio.tsx
        │   │       ├── mis-eventos.tsx
        │   │       └── perfil.tsx
        │   └── administrador/
        │       ├── _layout.tsx
        │       ├── perfil.tsx
        │       └── (pestanas)/
        │           ├── _layout.tsx
        │           ├── estadisticas.tsx
        │           ├── eventos.tsx
        │           ├── inicio.tsx
        │           ├── organizadores.tsx
        │           └── reportes.tsx
        ├── compartido/
        │   ├── componentes/
        │   │   ├── BarraMarca.estilos.ts
        │   │   ├── BarraMarca.tsx
        │   │   ├── BotonContorno.estilos.ts
        │   │   ├── BotonContorno.tsx
        │   │   ├── BotonIcono.estilos.ts
        │   │   ├── BotonIcono.tsx
        │   │   ├── BotonPrimario.estilos.ts
        │   │   ├── BotonPrimario.tsx
        │   │   ├── CampoSelector.tsx
        │   │   ├── CampoTexto.estilos.ts
        │   │   ├── CampoTexto.tsx
        │   │   ├── FondoHero.tsx
        │   │   ├── IconoTicket.tsx
        │   │   ├── ModalCentrado.estilos.ts
        │   │   ├── ModalCentrado.tsx
        │   │   ├── PantallaEnConstruccion.estilos.ts
        │   │   ├── PantallaEnConstruccion.tsx
        │   │   ├── PestanasSegmentadas.estilos.ts
        │   │   ├── PestanasSegmentadas.tsx
        │   │   ├── SeparadorO.estilos.ts
        │   │   ├── SeparadorO.tsx
        │   │   └── index.ts
        │   ├── navegacion/
        │   │   └── useOpcionesPestanas.ts
        │   ├── tema/
        │   │   ├── colores.ts
        │   │   ├── index.ts
        │   │   ├── medidas.ts
        │   │   └── useFuentes.ts
        │   └── utilidades/
        │       ├── proximamente.ts
        │       ├── sanitizar.ts
        │       ├── seleccionarImagen.ts
        │       └── useBarraEstado.ts
        ├── config/
        │   ├── cloudinary.ts
        │   └── entorno.ts
        ├── features/
        │   ├── auth/
        │   │   ├── constantes.ts
        │   │   ├── index.ts
        │   │   ├── tipos.ts
        │   │   ├── componentes/
        │   │   │   ├── DecoracionConcierto.tsx
        │   │   │   ├── EncabezadoAuth.estilos.ts
        │   │   │   ├── EncabezadoAuth.tsx
        │   │   │   ├── GuardiaRol.tsx
        │   │   │   ├── IconoTicket.tsx
        │   │   │   ├── ModalAviso.estilos.ts
        │   │   │   ├── ModalAviso.tsx
        │   │   │   ├── ModalRecuperarContrasenia.estilos.ts
        │   │   │   ├── ModalRecuperarContrasenia.tsx
        │   │   │   ├── SelectorFecha.estilos.ts
        │   │   │   ├── SelectorFecha.tsx
        │   │   │   ├── SelectorRol.estilos.ts
        │   │   │   └── SelectorRol.tsx
        │   │   ├── contexto/
        │   │   │   ├── SesionContexto.ts
        │   │   │   └── SesionProvider.tsx
        │   │   ├── hooks/
        │   │   │   ├── useInicioSesion.ts
        │   │   │   ├── useRecuperarContrasenia.ts
        │   │   │   ├── useRegistro.ts
        │   │   │   ├── useSesion.ts
        │   │   │   └── useTecladoScroll.ts
        │   │   ├── pantallas/
        │   │   │   ├── PantallaInicioSesion.estilos.ts
        │   │   │   ├── PantallaInicioSesion.tsx
        │   │   │   ├── PantallaRegistro.estilos.ts
        │   │   │   └── PantallaRegistro.tsx
        │   │   ├── servicios/
        │   │   │   ├── servicioAuth.ts
        │   │   │   └── servicioUsuarios.ts
        │   │   └── utilidades/
        │   │       ├── errores.ts
        │   │       ├── rutas.ts
        │   │       └── validaciones.ts
        │   ├── administrador/
        │   │   ├── index.ts
        │   │   ├── tipos.ts
        │   │   ├── componentes/
        │   │   │   ├── AccesoRapidoAdmin.tsx
        │   │   │   ├── EncabezadoAdmin.estilos.ts
        │   │   │   ├── EncabezadoAdmin.tsx
        │   │   │   ├── EncabezadoSeccionAdmin.tsx
        │   │   │   ├── FilaTarea.tsx
        │   │   │   └── TarjetaResumen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useBarraClara.ts
        │   │   │   └── useResumenAdministrador.ts
        │   │   ├── pantallas/
        │   │   │   ├── PantallaInicioAdministrador.estilos.ts
        │   │   │   └── PantallaInicioAdministrador.tsx
        │   │   ├── servicios/
        │   │   │   └── servicioResumenAdmin.ts
        │   │   └── verificaciones/
        │   │       ├── index.ts
        │   │       ├── tipos.ts
        │   │       ├── componentes/
        │   │       │   ├── ModalExpediente.tsx
        │   │       │   └── TarjetaSolicitud.tsx
        │   │       ├── hooks/
        │   │       │   └── useBandejaVerificacion.ts
        │   │       ├── pantallas/
        │   │       │   └── PantallaBandejaVerificacion.tsx
        │   │       └── servicios/
        │   │           └── servicioBandeja.ts
        │   ├── eventos/
        │   │   ├── constantes.ts
        │   │   ├── index.ts
        │   │   ├── tipos.ts
        │   │   ├── componentes/
        │   │   │   ├── InsigniaEstadoEvento.estilos.ts
        │   │   │   ├── InsigniaEstadoEvento.tsx
        │   │   │   ├── TarjetaEvento.estilos.ts
        │   │   │   └── TarjetaEvento.tsx
        │   │   ├── hooks/
        │   │   │   └── useEventosOrganizador.ts
        │   │   ├── servicios/
        │   │   │   └── servicioEventos.ts
        │   │   └── utilidades/
        │   │       └── formato.ts
        │   ├── organizador/
        │   │   ├── index.ts
        │   │   ├── tipos.ts
        │   │   ├── componentes/
        │   │   │   ├── AccesoRapido.estilos.ts
        │   │   │   ├── AccesoRapido.tsx
        │   │   │   ├── BannerVerificacion.estilos.ts
        │   │   │   ├── BannerVerificacion.tsx
        │   │   │   ├── BotonCrearEvento.estilos.ts
        │   │   │   ├── BotonCrearEvento.tsx
        │   │   │   ├── BotonCrearPestana.estilos.ts
        │   │   │   ├── BotonCrearPestana.tsx
        │   │   │   ├── ListaEventosOrganizador.estilos.ts
        │   │   │   ├── ListaEventosOrganizador.tsx
        │   │   │   ├── TarjetaMetrica.estilos.ts
        │   │   │   └── TarjetaMetrica.tsx
        │   │   ├── contexto/
        │   │   │   └── PerfilOrganizadorContexto.tsx
        │   │   ├── hooks/
        │   │   │   ├── useAccionCrearEvento.ts
        │   │   │   └── useResumenOrganizador.ts
        │   │   ├── pantallas/
        │   │   │   ├── PantallaInicioOrganizador.estilos.ts
        │   │   │   ├── PantallaInicioOrganizador.tsx
        │   │   │   ├── PantallaMisEventos.estilos.ts
        │   │   │   ├── PantallaMisEventos.tsx
        │   │   │   ├── PantallaPerfilOrganizador.estilos.ts
        │   │   │   └── PantallaPerfilOrganizador.tsx
        │   │   └── servicios/
        │   │       └── servicioPerfilOrganizador.ts
        │   ├── perfil/
        │   │   ├── index.ts
        │   │   └── pantallas/
        │   │       ├── PantallaPerfil.estilos.ts
        │   │       └── PantallaPerfil.tsx
        │   └── verificacion/
        │       ├── index.ts
        │       ├── tipos.ts
        │       ├── componentes/
        │       │   ├── AvisoObservaciones.estilos.ts
        │       │   ├── AvisoObservaciones.tsx
        │       │   ├── CampoDocumento.estilos.ts
        │       │   ├── CampoDocumento.tsx
        │       │   ├── FilaTerminos.estilos.ts
        │       │   ├── FilaTerminos.tsx
        │       │   ├── TarjetaEstadoSolicitud.estilos.ts
        │       │   └── TarjetaEstadoSolicitud.tsx
        │       ├── hooks/
        │       │   ├── useFormularioVerificacion.ts
        │       │   └── useSolicitudVerificacion.ts
        │       ├── pantallas/
        │       │   ├── PantallaVerificacion.estilos.ts
        │       │   └── PantallaVerificacion.tsx
        │       ├── servicios/
        │       │   └── servicioVerificacion.ts
        │       └── utilidades/
        │           └── validaciones.ts
        └── infraestructura/
            ├── cloudinary/
            │   ├── index.ts
            │   └── subirImagen.ts
            └── firebase/
                ├── cliente.ts
                └── index.ts
```

No se expanden `node_modules/` ni `.git/`: contienen dependencias y metadatos de Git, no código propio del producto. Tampoco se expanden las salidas compiladas `backend/functions/lib/` (`index.js`, mapas `.js.map` y el JS/mapa del módulo de verificación), los logs `backend/firestore-debug.log`, `backend/functions/firebase-debug.log` y `backend/functions/firestore-debug.log`, ni archivos internos de Expo generados localmente. `frontend/.env` aparece solo por nombre: contiene configuración local y no se debe publicar.

## 4. Responsabilidad de cada archivo

Las rutas de esta sección son relativas a la raíz del repositorio. En archivos `.estilos.ts`, la responsabilidad es definir los estilos de su componente o pantalla homónimos. Los archivos de imagen son recursos visuales y no ejecutan lógica.

### Raíz, documentación y configuración de Firebase

| Archivo | Función y conexiones |
|---|---|
| `estructura.txt` | Inventario de rutas del proyecto; sirve como referencia auxiliar de estructura. |
| `docs/guia-proyecto.md` | Esta guía: estado, conexiones, árbol e inventario funcional. |
| `docs/modelo-datos.md` | Describe colecciones, campos, estados y decisiones de diseño de Firestore. Especificación de referencia; no implica que todos sus flujos estén implementados. |
| `backend/.firebaserc` | Selecciona el proyecto Firebase por defecto para la CLI. |
| `backend/.gitignore` | Excluye del control de versiones los archivos locales o generados del backend. |
| `backend/firebase.json` | Conecta Firestore con sus reglas e índices, Functions con su paquete TypeScript, Hosting con `public/` y define puertos de emuladores. |
| `backend/firestore.rules` | Autoriza y valida lecturas/escrituras en usuarios, perfiles privados, nombres, solicitudes, eventos, entradas, favoritos, reportes, calificaciones y notificaciones. Es la protección de datos, no la UI. |
| `backend/firestore.indexes.json` | Índices compuestos para consultas de eventos, entradas, reportes, solicitudes, favoritos y notificaciones. |
| `backend/package.json` | Dependencias y comando `test:reglas` que inicia el emulador Firestore y ejecuta Node Test Runner. |
| `backend/package-lock.json` | Versiones exactas de dependencias del paquete de pruebas. |
| `backend/tests/reglas.test.mjs` | Prepara datos de prueba y verifica operaciones permitidas/prohibidas contra `firestore.rules` con `@firebase/rules-unit-testing`. |
| `backend/public/index.html` | Página estática de bienvenida de la plantilla Firebase Hosting; no es la app móvil. |
| `backend/public/404.html` | Página 404 de la plantilla de Hosting. |

### `backend/functions/`

| Archivo | Función y conexiones |
|---|---|
| `backend/functions/package.json` | Scripts de lint, compilación TypeScript, emulación y despliegue; declara Node 24 y `lib/index.js` como entrada compilada. |
| `backend/functions/package-lock.json` | Versiones exactas de Firebase Admin, Firebase Functions y herramientas de desarrollo. |
| `backend/functions/tsconfig.json` | Compila `src/` estrictamente a `lib/`, que Firebase Functions carga como `main`. |
| `backend/functions/tsconfig.dev.json` | Configuración auxiliar de TypeScript usada por el lint. |
| `backend/functions/.eslintrc.js` | Reglas ESLint para el paquete Functions; excluye artefactos generados. |
| `backend/functions/.gitignore` | Excluye dependencias, compilados y otros archivos locales de Functions. |
| `backend/functions/src/index.ts` | Inicializa opciones globales (`maxInstances: 10`) y exporta `alCambiarSolicitudVerificacion` para que Firebase la despliegue. |
| `backend/functions/src/modulos/verificacion/alCambiarSolicitudVerificacion.ts` | Trigger Firestore en `solicitudesVerificacion/{uid}`; ante cambios de estado actualiza `usuarios/{uid}.estadoVerificacion` y `estaVerificado`. |
| `backend/functions/scripts/crear-admin.cjs` | Crea una cuenta y perfil administrador conectándose por defecto a los emuladores Auth/Firestore; requiere argumentos y un ID de proyecto. No se debe usar para crear un administrador en producción. |
| `backend/functions/lib/` | JavaScript y mapas fuente generados por `tsc`; salida derivada de `src/`, no editar a mano. |
| `backend/functions/firebase-debug.log` y `backend/functions/firestore-debug.log` | Logs locales de depuración de Firebase/emuladores; no forman parte del código de la app. |
| `backend/firestore-debug.log` | Log local del emulador de Firestore; no es fuente ni especificación. |

### `frontend/`: configuración y recursos

| Archivo o carpeta | Función y conexiones |
|---|---|
| `frontend/package.json` | Define Expo Router como entrada, scripts `start/android/ios/web` y dependencias de Expo, React Native, Firebase, fuentes e imágenes. |
| `frontend/package-lock.json` | Versiones exactas de dependencias del frontend. |
| `frontend/app.json` | Nombre/slug, esquema, orientación, recursos de icono y splash, plugins y opciones web de Expo. |
| `frontend/tsconfig.json` | TypeScript estricto; configura el alias `@/*` hacia `src/*` e incluye las rutas Expo. |
| `frontend/expo-env.d.ts` | Declaración de tipos Expo mantenida por la configuración del proyecto. |
| `frontend/.env.example` | Plantilla para variables públicas Expo/Firebase/Cloudinary y emuladores; usarla para preparar el entorno local. |
| `frontend/.env` | Valores locales de entorno; no se documentan sus valores ni se deben incluir en Git o mensajes. |
| `frontend/.gitignore` | Excluye archivos generados y configuración local del frontend. |
| `frontend/AGENTS.md` | Instrucciones del proyecto para cambios Expo, navegación, dependencias y validación. |
| `frontend/CLAUDE.md` | Reutiliza las instrucciones de `AGENTS.md` mediante la referencia `@AGENTS.md`. |
| `frontend/.claude/settings.json` | Ajustes locales de Claude Code para esta carpeta. |
| `frontend/.vscode/settings.json` | Preferencias de VS Code del workspace frontend. |
| `frontend/.vscode/extensions.json` | Extensiones recomendadas para VS Code. |
| `frontend/assets/imagenes/concierto.jpg` | Imagen local usada como recurso visual en pantallas de la app. |
| `frontend/assets/imagenes/ensenada.jpg` | Fotografía local de Ensenada usada por la interfaz de acceso. |
| `frontend/assets/images/icon.png` | Icono principal de Expo. |
| `frontend/assets/images/android-icon-background.png` | Fondo del icono adaptativo Android. |
| `frontend/assets/images/android-icon-foreground.png` | Primer plano del icono adaptativo Android. |
| `frontend/assets/images/android-icon-monochrome.png` | Icono monocromático adaptativo Android. |
| `frontend/assets/images/favicon.png` | Favicon de la versión web. |
| `frontend/assets/images/splash-icon.png` | Imagen que Expo muestra en la pantalla de inicio. |

### `frontend/src/app/`: rutas Expo Router

Los archivos de esta carpeta conectan URLs y layouts con features. Los que reexportan pantallas son adaptadores de navegación; las pantallas en construcción no implementan todavía el flujo anunciado.

| Archivo | Función y conexiones |
|---|---|
| `frontend/src/app/_layout.tsx` | Layout raíz: carga fuentes, configura barra de estado, monta `SesionProvider` y el Stack. |
| `frontend/src/app/index.tsx` | Ruta `/`: espera la sesión y redirige al login o a la ruta del rol. |
| `frontend/src/app/(auth)/_layout.tsx` | Stack del grupo de acceso; evita permanecer en login/registro cuando ya hay perfil. |
| `frontend/src/app/(auth)/iniciar-sesion.tsx` | Enruta `/iniciar-sesion` a `PantallaInicioSesion`. |
| `frontend/src/app/(auth)/registro.tsx` | Enruta `/registro` a `PantallaRegistro`. |
| `frontend/src/app/asistente/_layout.tsx` | Protege el grupo con `GuardiaRol(asistente)` y crea pestañas Explorar, Favoritos, Entradas y Perfil. |
| `frontend/src/app/asistente/explorar.tsx` | Ruta de catálogo; actualmente muestra `PantallaEnConstruccion`. |
| `frontend/src/app/asistente/favoritos.tsx` | Ruta de favoritos; actualmente muestra `PantallaEnConstruccion`. |
| `frontend/src/app/asistente/entradas.tsx` | Ruta de entradas/QR; actualmente muestra `PantallaEnConstruccion`. |
| `frontend/src/app/asistente/perfil.tsx` | Conecta la pestaña con `features/perfil/PantallaPerfil`. |
| `frontend/src/app/organizador/_layout.tsx` | Protege el grupo de organizador, monta `ProveedorPerfilOrganizador` y configura pantallas apiladas de reportes y QR. |
| `frontend/src/app/organizador/(pestanas)/_layout.tsx` | Navegación por pestañas del organizador y acceso central para crear. |
| `frontend/src/app/organizador/(pestanas)/inicio.tsx` | Conecta la pestaña de inicio con `PantallaInicioOrganizador`. |
| `frontend/src/app/organizador/(pestanas)/mis-eventos.tsx` | Conecta con `PantallaMisEventos`. |
| `frontend/src/app/organizador/(pestanas)/perfil.tsx` | Conecta con `PantallaPerfilOrganizador`. |
| `frontend/src/app/organizador/(pestanas)/crear.tsx` | Ruta de creación desde pestañas; pantalla en construcción. |
| `frontend/src/app/organizador/(pestanas)/estadisticas.tsx` | Ruta de estadísticas desde pestañas; pantalla en construcción. |
| `frontend/src/app/organizador/inicio.tsx` | Ruta alternativa de inicio que reexporta `PantallaInicioOrganizador`. |
| `frontend/src/app/organizador/mis-eventos.tsx` | Ruta alternativa que reexporta `PantallaMisEventos`. |
| `frontend/src/app/organizador/perfil.tsx` | Ruta alternativa que reexporta `PantallaPerfilOrganizador`. |
| `frontend/src/app/organizador/crear.tsx` | Ruta de creación a la que apunta la acción del organizador; actualmente pantalla en construcción. |
| `frontend/src/app/organizador/estadisticas.tsx` | Ruta de estadísticas; actualmente pantalla en construcción. |
| `frontend/src/app/organizador/reportes.tsx` | Ruta de reportes; actualmente pantalla en construcción. |
| `frontend/src/app/organizador/validar-qr.tsx` | Ruta para validar QR; actualmente pantalla en construcción. |
| `frontend/src/app/organizador/verificacion.tsx` | Conecta con `PantallaVerificacion`, el formulario y el estado de la solicitud. |
| `frontend/src/app/administrador/_layout.tsx` | Protege todo el grupo con `GuardiaRol(administrador)` y configura Stack/perfil. |
| `frontend/src/app/administrador/(pestanas)/_layout.tsx` | Define la navegación por pestañas del administrador. |
| `frontend/src/app/administrador/(pestanas)/inicio.tsx` | Conecta con el panel real `PantallaInicioAdministrador`. |
| `frontend/src/app/administrador/(pestanas)/organizadores.tsx` | Conecta con la bandeja real de solicitudes de verificación. |
| `frontend/src/app/administrador/(pestanas)/eventos.tsx` | Ruta de moderación de eventos; actualmente pantalla en construcción. |
| `frontend/src/app/administrador/(pestanas)/reportes.tsx` | Ruta de moderación de reportes; actualmente pantalla en construcción. |
| `frontend/src/app/administrador/(pestanas)/estadisticas.tsx` | Ruta de estadísticas detalladas; actualmente pantalla en construcción. |
| `frontend/src/app/administrador/perfil.tsx` | Conecta con la pantalla de perfil compartida. |

Los paréntesis en `(auth)` y `(pestanas)` agrupan navegación y no forman parte del segmento de URL.

### `frontend/src/features/auth/`: cuenta y sesión

| Archivo | Función y conexiones |
|---|---|
| `features/auth/index.ts` | API pública de autenticación; exporta proveedor, hook, guardia, pantallas, rutas, tipos y cierre de sesión. |
| `features/auth/tipos.ts` | Tipos de rol, perfil público, estado de verificación y datos del registro. |
| `features/auth/constantes.ts` | Lista de ciudades de Baja California consumida por el formulario de registro. |
| `features/auth/contexto/SesionContexto.ts` | Define el tipo y contexto del estado `usuario`, `perfil` y `cargando`. |
| `features/auth/contexto/SesionProvider.tsx` | Escucha Firebase Auth, obtiene perfil Firestore y descarta sesiones no verificadas, bloqueadas o sin perfil. Lo monta el layout raíz. |
| `features/auth/hooks/useSesion.ts` | Hook para leer el estado del contexto de sesión. |
| `features/auth/hooks/useInicioSesion.ts` | Estado, validación y acciones del formulario de acceso y reenvío de verificación. |
| `features/auth/hooks/useRecuperarContrasenia.ts` | Estado y envío del correo para restablecer contraseña. |
| `features/auth/hooks/useRegistro.ts` | Estado del registro, validaciones, selección de rol/ciudad y envío. |
| `features/auth/hooks/useTecladoScroll.ts` | Ajusta el desplazamiento del formulario al abrirse el teclado móvil. |
| `features/auth/servicios/servicioAuth.ts` | Operaciones de Firebase Auth: registrar, verificar/re-enviar correo, iniciar sesión, recuperar contraseña y cerrar sesión. |
| `features/auth/servicios/servicioUsuarios.ts` | Consulta perfil y disponibilidad del nombre; crea atómicamente el índice de nombre, perfil público y perfil privado. |
| `features/auth/utilidades/validaciones.ts` | Reglas de validación y formatos para los campos del formulario. |
| `features/auth/utilidades/errores.ts` | Convierte códigos/errores de Firebase en mensajes adecuados para la interfaz. |
| `features/auth/utilidades/rutas.ts` | Mapea cada `RolUsuario` a su destino inicial en Expo Router. |
| `features/auth/componentes/GuardiaRol.tsx` | Protege una sección de navegación comprobando el rol de la sesión. |
| `features/auth/componentes/DecoracionConcierto.tsx` | Elemento gráfico de la interfaz de acceso. |
| `features/auth/componentes/EncabezadoAuth.tsx` y `EncabezadoAuth.estilos.ts` | Cabecera visual de autenticación y sus estilos; utiliza recursos de imagen/marca compartidos. |
| `features/auth/componentes/IconoTicket.tsx` | Icono de boleto reutilizado en las pantallas de autenticación. |
| `features/auth/componentes/ModalAviso.tsx` y `ModalAviso.estilos.ts` | Modal de aviso y estilos. |
| `features/auth/componentes/ModalRecuperarContrasenia.tsx` y `ModalRecuperarContrasenia.estilos.ts` | Interfaz de recuperación de contraseña; llama al hook/servicio de Auth. |
| `features/auth/componentes/SelectorFecha.tsx` y `SelectorFecha.estilos.ts` | Selector de fecha usado en los datos personales del registro. |
| `features/auth/componentes/SelectorRol.tsx` y `SelectorRol.estilos.ts` | Selector de roles permitidos en el registro. |
| `features/auth/pantallas/PantallaInicioSesion.tsx` y `PantallaInicioSesion.estilos.ts` | Formulario de login, navegación a registro, recuperación y mensajes; utiliza hooks y componentes compartidos. |
| `features/auth/pantallas/PantallaRegistro.tsx` y `PantallaRegistro.estilos.ts` | Formulario de creación de cuenta; coordina validación, selector de rol y servicio de registro. |

### `frontend/src/features/verificacion/`: solicitud del organizador

| Archivo | Función y conexiones |
|---|---|
| `features/verificacion/index.ts` | API pública de la feature para las rutas de organizador. |
| `features/verificacion/tipos.ts` | Tipos de la solicitud y sus estados/campos. |
| `features/verificacion/utilidades/validaciones.ts` | Normaliza y valida teléfono, Instagram y URL. |
| `features/verificacion/servicios/servicioVerificacion.ts` | Escucha `solicitudesVerificacion/{uid}`, sube/reutiliza imágenes vía Cloudinary y crea o reenvía la solicitud en Firestore. |
| `features/verificacion/hooks/useSolicitudVerificacion.ts` | Mantiene en vivo solicitud, carga y error para la pantalla. |
| `features/verificacion/hooks/useFormularioVerificacion.ts` | Estado del formulario, selección de fotos, validación y coordinación con el servicio. |
| `features/verificacion/pantallas/PantallaVerificacion.tsx` y `PantallaVerificacion.estilos.ts` | Pantalla de envío/estado de verificación; combina sesión, formulario, observaciones y solicitud. |
| `features/verificacion/componentes/AvisoObservaciones.tsx` y `.estilos.ts` | Muestra las observaciones que debe atender el organizador. |
| `features/verificacion/componentes/CampoDocumento.tsx` y `.estilos.ts` | Selector y vista previa de selfie o identificación. |
| `features/verificacion/componentes/FilaTerminos.tsx` y `.estilos.ts` | Control de aceptación de términos del formulario. |
| `features/verificacion/componentes/TarjetaEstadoSolicitud.tsx` y `.estilos.ts` | Presenta el estado de una solicitud enviada que no requiere edición inmediata. |

### `frontend/src/features/administrador/`: panel y revisión

| Archivo | Función y conexiones |
|---|---|
| `features/administrador/index.ts` | Exporta el panel de inicio al router. |
| `features/administrador/tipos.ts` | Tipos de conteos y resumen de plataforma/tareas. |
| `features/administrador/servicios/servicioResumenAdmin.ts` | Ejecuta conteos Firestore de usuarios, eventos, entradas, verificaciones y reportes para el dashboard; si un conteo falla, devuelve `null` para esa tarjeta. |
| `features/administrador/hooks/useResumenAdministrador.ts` | Refresca el resumen al entrar en foco o solicitar recarga. |
| `features/administrador/hooks/useBarraClara.ts` | Ajusta el estilo de la barra de estado para las pantallas administrativas. |
| `features/administrador/pantallas/PantallaInicioAdministrador.tsx` y `.estilos.ts` | Dashboard real con métricas, tareas y accesos; delega conteos al hook y servicios. |
| `features/administrador/componentes/AccesoRapidoAdmin.tsx` | Acceso rápido a secciones administrativas. |
| `features/administrador/componentes/EncabezadoAdmin.tsx` y `EncabezadoAdmin.estilos.ts` | Encabezado gráfico del panel. |
| `features/administrador/componentes/EncabezadoSeccionAdmin.tsx` | Título reutilizable para secciones del panel. |
| `features/administrador/componentes/FilaTarea.tsx` | Fila de tarea pendiente con acceso a la sección relacionada. |
| `features/administrador/componentes/TarjetaResumen.tsx` | Tarjeta para mostrar conteos de plataforma. |
| `features/administrador/verificaciones/index.ts` | Exporta pantalla y tipos de revisión de verificación. |
| `features/administrador/verificaciones/tipos.ts` | Tipos de solicitud administrativa, documentos, estado y perfil resumido. |
| `features/administrador/verificaciones/servicios/servicioBandeja.ts` | Escucha solicitudes, obtiene perfil resumido y actualiza estado/observaciones con Firestore. |
| `features/administrador/verificaciones/hooks/useBandejaVerificacion.ts` | Filtra, ordena y cuenta solicitudes por estado; coordina acciones y errores de revisión. |
| `features/administrador/verificaciones/pantallas/PantallaBandejaVerificacion.tsx` | Interfaz de bandeja para que el administrador examine y resuelva solicitudes. |
| `features/administrador/verificaciones/componentes/ModalExpediente.tsx` | Modal con el expediente y sus documentos. |
| `features/administrador/verificaciones/componentes/TarjetaSolicitud.tsx` | Tarjeta resumida de una solicitud en la bandeja. |

La bandeja administrativa está implementada para solicitudes de verificación. Las rutas de eventos, reportes y estadísticas detalladas no tienen aún una pantalla equivalente.

### `frontend/src/features/eventos/`: tipos, presentación y lectura

| Archivo | Función y conexiones |
|---|---|
| `features/eventos/index.ts` | API pública de componentes, hook, formatos y tipos de evento. |
| `features/eventos/tipos.ts` | Tipos de `Evento` y estados manejados por el frontend. |
| `features/eventos/constantes.ts` | Etiquetas, iconos y colores de cada estado usados por la insignia del evento. |
| `features/eventos/servicios/servicioEventos.ts` | Escucha en tiempo real eventos por `organizadorId`, ordenados por fecha de creación; usa el índice compuesto de Firestore. |
| `features/eventos/hooks/useEventosOrganizador.ts` | Administra suscripción, carga, lista y error del servicio de eventos. |
| `features/eventos/utilidades/formato.ts` | Formatea fechas, moneda y cantidades para la interfaz. |
| `features/eventos/componentes/TarjetaEvento.tsx` y `TarjetaEvento.estilos.ts` | Presenta los datos resumidos de un evento. |
| `features/eventos/componentes/InsigniaEstadoEvento.tsx` y `InsigniaEstadoEvento.estilos.ts` | Presenta visualmente el estado de revisión/publicación. |

No hay en esta feature un servicio frontend para crear, editar, comprar o validar entradas de eventos.

### `frontend/src/features/organizador/`: panel, perfil y métricas locales

| Archivo | Función y conexiones |
|---|---|
| `features/organizador/index.ts` | API pública de proveedor, acciones, componentes y pantallas de organizador. |
| `features/organizador/tipos.ts` | Tipo del perfil del organizador combinando campos públicos y estado de verificación. |
| `features/organizador/contexto/PerfilOrganizadorContexto.tsx` | Mantiene un listener del perfil y carga el teléfono privado para compartirlo entre pantallas. |
| `features/organizador/servicios/servicioPerfilOrganizador.ts` | Escucha `usuarios/{uid}` y consulta el teléfono en la ruta privada. |
| `features/organizador/hooks/useAccionCrearEvento.ts` | Envía a crear evento o, si no está verificado, ofrece navegar a verificación. La ruta de creación aún es provisional. |
| `features/organizador/hooks/useResumenOrganizador.ts` | Calcula conteos e ingresos estimados a partir de los eventos ya cargados; no consulta ventas desde un backend de pagos. |
| `features/organizador/pantallas/PantallaInicioOrganizador.tsx` y `.estilos.ts` | Panel real: perfil, estado de verificación, accesos, métricas calculadas y lista en vivo de eventos. |
| `features/organizador/pantallas/PantallaMisEventos.tsx` y `.estilos.ts` | Lista eventos propios y sus estados mediante `useEventosOrganizador`. |
| `features/organizador/pantallas/PantallaPerfilOrganizador.tsx` y `.estilos.ts` | Presenta los datos de perfil del organizador y sus acciones disponibles. |
| `features/organizador/componentes/AccesoRapido.tsx` y `.estilos.ts` | Botón visual de acceso a una función del panel. |
| `features/organizador/componentes/BannerVerificacion.tsx` y `.estilos.ts` | Avisa el estado de verificación y conduce al formulario. |
| `features/organizador/componentes/BotonCrearEvento.tsx` y `.estilos.ts` | Botón para iniciar la acción de creación del evento. |
| `features/organizador/componentes/BotonCrearPestana.tsx` y `.estilos.ts` | Botón central de creación en la navegación por pestañas. |
| `features/organizador/componentes/ListaEventosOrganizador.tsx` y `.estilos.ts` | Renderiza estados vacío/cargando/error y tarjetas de los eventos propios. |
| `features/organizador/componentes/TarjetaMetrica.tsx` y `.estilos.ts` | Muestra una métrica del resumen del organizador. |

### `frontend/src/features/perfil/`

| Archivo | Función y conexiones |
|---|---|
| `features/perfil/index.ts` | Exporta la pantalla de perfil utilizada por asistente y administrador. |
| `features/perfil/pantallas/PantallaPerfil.tsx` y `PantallaPerfil.estilos.ts` | Presenta perfil y acciones de cuenta a través de la sesión compartida. |

### `frontend/src/compartido/`: interfaz, tema y utilidades

| Archivo | Función y conexiones |
|---|---|
| `compartido/componentes/index.ts` | Barrel de componentes compartidos utilizado por pantallas/features. |
| `compartido/componentes/BarraMarca.tsx` y `BarraMarca.estilos.ts` | Barra superior con marca, acción de regreso y contenido derecho opcional. |
| `compartido/componentes/BotonContorno.tsx` y `BotonContorno.estilos.ts` | Botón secundario con variantes visuales. |
| `compartido/componentes/BotonIcono.tsx` y `BotonIcono.estilos.ts` | Botón compacto de icono con etiqueta accesible. |
| `compartido/componentes/BotonPrimario.tsx` y `BotonPrimario.estilos.ts` | Acción primaria con estados de carga/deshabilitado. |
| `compartido/componentes/CampoTexto.tsx` y `CampoTexto.estilos.ts` | Campo de texto con icono, error y opciones de entrada; comparte estilos con selector. |
| `compartido/componentes/CampoSelector.tsx` | Campo de selección reutilizable para abrir opciones en un modal. |
| `compartido/componentes/FondoHero.tsx` | Fondo/cabecera decorativa tipo hero usada en pantallas principales. |
| `compartido/componentes/IconoTicket.tsx` | Icono visual de boleto compartido. |
| `compartido/componentes/ModalCentrado.tsx` y `ModalCentrado.estilos.ts` | Contenedor modal centrado reutilizable. |
| `compartido/componentes/PantallaEnConstruccion.tsx` y `PantallaEnConstruccion.estilos.ts` | Estado visual uniforme para rutas todavía no implementadas. |
| `compartido/componentes/PestanasSegmentadas.tsx` y `PestanasSegmentadas.estilos.ts` | Selector visual de pestañas segmentadas. |
| `compartido/componentes/SeparadorO.tsx` y `SeparadorO.estilos.ts` | Separador de opciones con texto central. |
| `compartido/navegacion/useOpcionesPestanas.ts` | Configuración común para la barra de pestañas de Expo Router. |
| `compartido/tema/colores.ts` | Paleta de colores de interfaz. |
| `compartido/tema/medidas.ts` | Escala de tamaños/espaciados compartidos. |
| `compartido/tema/index.ts` | Exporta colores, medidas y valores de tema. |
| `compartido/tema/useFuentes.ts` | Carga las fuentes Montserrat usadas por la app. |
| `compartido/utilidades/proximamente.ts` | Presenta avisos para acciones aún no disponibles. |
| `compartido/utilidades/sanitizar.ts` | Normaliza texto introducido antes de guardarlo. |
| `compartido/utilidades/seleccionarImagen.ts` | Solicita permisos y obtiene fotos con Expo Image Picker/cámara. |
| `compartido/utilidades/useBarraEstado.ts` | Ajusta el estilo de la barra de estado por pantalla. |

### `frontend/src/config/` e `infraestructura/`

| Archivo | Función y conexiones |
|---|---|
| `config/entorno.ts` | Lee variables Expo públicas para Firebase, emuladores y exigencia de correo verificado. |
| `config/cloudinary.ts` | Lee nombre de nube y preset público de Cloudinary; no contiene ni debe contener el API Secret. |
| `infraestructura/firebase/index.ts` | Reexporta la instancia app, Auth y Firestore para el resto del frontend. |
| `infraestructura/firebase/cliente.ts` | Inicializa Firebase una sola vez, configura persistencia AsyncStorage y conecta emuladores opcionales. |
| `infraestructura/cloudinary/index.ts` | Reexporta las funciones/tipos de la integración con Cloudinary. |
| `infraestructura/cloudinary/subirImagen.ts` | Lee una imagen local y la sube a Cloudinary; devuelve URL y `publicId`. La usa el servicio de verificación. |

## 5. Firestore, reglas e índices

`backend/firestore.rules` y `backend/firestore.indexes.json` se conectan mediante `backend/firebase.json`. Las reglas son el control efectivo de acceso, tanto para la app como para clientes directos de Firestore.

- Un perfil público lo leen usuarios autenticados; sus datos privados los lee el titular o un administrador.
- El registro de cliente permite solo roles asistente u organizador; las reglas bloquean el cambio de rol.
- La solicitud de verificación la envía el organizador y la revisa el administrador; el titular y el administrador pueden leerla.
- Un organizador necesita verificación aprobada y cuenta activa para crear eventos. Los eventos aprobados son públicos; los no aprobados quedan limitados a su organizador y administradores.
- El cliente no escribe entradas, calificaciones ni notificaciones directamente. Hay colecciones que el backend debería administrar cuando estén implementados esos procesos.
- Favoritos y reportes tienen restricciones de identidad y forma de documento; las colecciones no declaradas quedan cerradas por defecto.
- El listener de eventos del organizador requiere el índice `(organizadorId ASC, creadoEn DESC)`.
- Hay una diferencia de estado que conviene resolver: el resumen administrativo cuenta reportes con `estado == pendiente`, pero las reglas y pruebas crean reportes con `estado == pendiente_moderacion`. Mientras los datos usen este último valor, el contador del dashboard no los incluirá.

El archivo de pruebas prepara perfiles/eventos de muestra con reglas desactivadas y luego prueba clientes autenticados y anónimos contra reglas reales del emulador. Esas pruebas demuestran autorización de Firestore; no prueban pantallas ni la disponibilidad en producción.

## 6. Documentación del modelo frente a la implementación

`docs/modelo-datos.md` es diseño funcional, pero su encabezado todavía lo presenta como anterior a reglas y código y afirma que nada está desplegado. En el repositorio sí existen reglas y pruebas, y también código de verificación de organizadores. El despliegue no se puede confirmar solo desde el código local.

El modelo también describe compras simuladas, generación/validación de QR, moderación de eventos, reportes, calificaciones, notificaciones y funciones administrativas. Esos flujos no deben interpretarse como implementados solo porque estén modelados o aparezcan en reglas/índices. Al ampliar el proyecto, actualizar el modelo y esta guía para dejar claro qué pasa a ser funcional.

## 7. Desarrollo y pruebas

### App Expo

1. En `frontend/`, prepara `.env` con base en `.env.example` sin subir los valores locales.
2. Si se usan emuladores, desde `backend/` ejecuta `firebase emulators:start --only auth,firestore` y configura el host que pueda alcanzar el dispositivo.
3. Instala dependencias si hacen falta (`npm install`) y ejecuta `npm start`, `npm run android`, `npm run ios` o `npm run web`.

### Firebase y pruebas

- Desde `backend/`: `npm run test:reglas` ejecuta las pruebas con el emulador de Firestore.
- Desde `backend/functions/`: `npm run build` compila TypeScript; `npm run lint` ejecuta ESLint.
- `backend/functions/scripts/crear-admin.cjs` está destinado al entorno de emuladores. Usa credenciales de administrador de Firebase y no debe apuntarse a producción.
- El despliegue de Functions compila y ejecuta lint mediante los hooks configurados en `backend/firebase.json`. Desplegar no implementa los flujos que aún no existen en el código.

## 8. Guía para ampliar el proyecto

1. Acordar el flujo y actualizar `docs/modelo-datos.md` si cambian colecciones, campos o estados.
2. Implementar cada ruta/pantalla en `frontend/src/app/` como adaptador y ubicar lógica reutilizable en `frontend/src/features/<dominio>/`.
3. Para operaciones privilegiadas o datos derivados, implementar la Function necesaria; no confiar en validación visual del cliente.
4. Ajustar `backend/firestore.rules` y agregar pruebas de autorización en `backend/tests/reglas.test.mjs`.
5. Agregar índices en `backend/firestore.indexes.json` para nuevas consultas compuestas y configurarlos con Firebase.
6. Reutilizar `compartido/` para UI/tema y `infraestructura/` para servicios externos. No inicializar SDKs desde pantallas.
7. Actualizar esta guía cuando una ruta pase de provisional a funcional y describir explícitamente qué queda pendiente.
