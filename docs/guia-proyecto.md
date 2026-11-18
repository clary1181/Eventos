# Guía del proyecto Eventos

## 1. Qué es y en qué estado está

Eventos es una aplicación móvil multiplataforma para descubrir y organizar eventos, enfocada en Ensenada. El cliente está construido con Expo, React Native y TypeScript; Firebase proporciona autenticación y Firestore.

**Estado real según el código de este repositorio:**

- Está implementado el flujo de crear cuenta, iniciar/cerrar sesión, verificar correo y recuperar contraseña.
- El perfil público y el privado se guardan en Firestore durante el registro.
- La pantalla `/inicio` es deliberadamente provisional: muestra el perfil y permite cerrar sesión.
- El botón «Continuar con Google» es solo una indicación de «Próximamente»; no inicia una autenticación con Google.
- No hay todavía pantallas ni servicios frontend para explorar eventos, comprar entradas, gestionar organizadores o administrar el sistema.
- `backend/firestore.rules` sí contiene reglas para esos dominios y `backend/tests/reglas.test.mjs` las prueba.
- En cambio, `backend/functions/src/index.ts` todavía es una plantilla: no exporta las funciones de negocio mencionadas en el modelo.
- `docs/modelo-datos.md` describe el modelo y los flujos previstos. Su encabezado todavía dice que es una propuesta previa a las reglas/código; ese estado está desactualizado porque las reglas y pruebas ya existen en el repositorio. La frase «nada está desplegado» tampoco se puede verificar solo leyendo el código local. No debe interpretarse el documento como evidencia de que las funciones estén disponibles en Firebase.

Por tanto, el producto que se puede recorrer hoy es principalmente **registro e inicio de sesión**. El resto es, según el caso, reglas de acceso preparadas o diseño futuro.

## 2. Arquitectura y dependencias

```text
frontend/src/app (rutas Expo Router)
        │
        ├── layouts y pantallas de auth ── features/auth
        │                                    ├── hooks: estado y acciones de formulario
        │                                    ├── servicios: Firebase Auth y Firestore
        │                                    ├── contexto: sesión compartida
        │                                    └── componentes/utilidades de auth
        │
        ├── compartido (componentes, tema y utilidades)
        └── infraestructura/firebase ── config/entorno ── Firebase Auth + Firestore

backend/firebase.json
        ├── firestore.rules ── autorización de operaciones Firestore
        ├── firestore.indexes.json ── índices compuestos
        ├── functions/src/index.ts ── Cloud Functions (plantilla actual)
        ├── tests/reglas.test.mjs ── pruebas de reglas con emulador
        └── public/ ── contenido de Firebase Hosting (página inicial de plantilla)

docs/modelo-datos.md ── diseño previsto de colecciones, estados y flujos
```

La app importa la capa Firebase a través de `@/infraestructura/firebase`. El alias `@/` apunta a `frontend/src/` según `frontend/tsconfig.json`. Expo Router convierte los archivos dentro de `frontend/src/app/` en rutas; los componentes y la lógica reutilizable permanecen fuera de esa carpeta.

### Flujo de sesión

1. `src/app/_layout.tsx` envuelve la navegación con `SesionProvider`.
2. `SesionProvider` escucha Firebase Auth y, cuando hay un usuario válido, consulta `usuarios/{uid}`.
3. La ruta inicial espera a que termine esa comprobación: si existe perfil, redirige a `/inicio`; de lo contrario, a `/iniciar-sesion`.
4. El grupo `(auth)` evita mostrar login/registro cuando ya hay una sesión válida.
5. Si se exige correo verificado (por defecto sí), la sesión no se acepta hasta verificarlo. Un perfil inexistente o una cuenta bloqueada también provoca salida de sesión.

### Flujo de registro

1. `useRegistro` gestiona un formulario de dos pasos, validaciones y selección de rol/ciudad.
2. `servicioAuth.registrarCuenta` crea la cuenta de Firebase Auth.
3. `servicioUsuarios` revisa el nombre de usuario y escribe en un lote `nombresUsuario/{nombre}`, `usuarios/{uid}` y `usuarios/{uid}/privado/perfil`.
4. Se envía el correo de verificación y se cierra la sesión. La persona regresa al login para entrar después de verificar.
5. Las reglas de Firestore validan los campos y limitan la creación de perfiles a los roles `asistente` y `organizador`; el frontend no ofrece crear administradores.

### Entorno Firebase

`frontend/src/config/entorno.ts` lee variables `EXPO_PUBLIC_*`. `frontend/src/infraestructura/firebase/cliente.ts` crea una sola instancia de Firebase, configura persistencia de Auth con AsyncStorage y, si `EXPO_PUBLIC_USAR_EMULADORES=true`, conecta Auth al puerto `9099` y Firestore al `8080`.

En un teléfono con Expo Go, `EXPO_PUBLIC_EMULADOR_HOST` debe ser la IP de la computadora en la red local; `127.0.0.1` apunta al propio teléfono. El `.env` local no se debe compartir ni guardar en Git. `.env.example` es la plantilla y usa un valor de ejemplo para la IP.

## 3. Estructura de archivos y responsabilidad de cada uno

### Raíz del repositorio

| Archivo/carpeta | Contenido y función |
|---|---|
| `frontend/` | Aplicación Expo y su código, configuración y recursos. |
| `backend/` | Configuración de Firebase, reglas, funciones, Hosting y pruebas de reglas. |
| `docs/modelo-datos.md` | Diseño previsto de colecciones Firestore, roles, permisos y estados. |
| `docs/guia-proyecto.md` | Esta guía del estado actual y el mapa de dependencias. |

### `frontend/`: configuración y recursos

| Archivo/carpeta | Contenido y función |
|---|---|
| `package.json` | Dependencias Expo/React Native/Firebase y comandos `start`, `android`, `ios`, `web`. |
| `package-lock.json` | Versiones exactas resueltas por npm; mantenerlo junto a cambios de dependencias. |
| `app.json` | Identidad, iconos, orientación, plugins y opciones de Expo Router/Web. |
| `tsconfig.json` | TypeScript estricto, tipos de Expo y alias `@/*`. |
| `expo-env.d.ts` | Referencia de tipos generada/administrada por Expo; normalmente no se edita. |
| `.env.example` | Plantilla de configuración para Firebase, emuladores y verificación de correo. |
| `.env` | Configuración local real, ignorada por Git; no documentar ni publicar sus valores. |
| `.gitignore` | Archivos generados/locales que Git debe ignorar. |
| `AGENTS.md` | Instrucciones de trabajo para Expo, navegación, dependencias y validación. |
| `CLAUDE.md` | Archivo que remite a `AGENTS.md` para reutilizar las instrucciones del proyecto. |
| `.claude/settings.json` | Ajustes locales de Claude para el frontend. |
| `.vscode/settings.json` | Preferencias de VS Code del proyecto. |
| `.vscode/extensions.json` | Extensiones recomendadas para VS Code. |
| `assets/imagenes/ensenada.jpg` | Fotografía local usada en el encabezado de las pantallas de autenticación. |
| `assets/images/icon.png` | Icono principal de la app. |
| `assets/images/android-icon-background.png` | Fondo del icono adaptativo de Android. |
| `assets/images/android-icon-foreground.png` | Primer plano del icono adaptativo de Android. |
| `assets/images/android-icon-monochrome.png` | Variante monocromática del icono adaptativo. |
| `assets/images/favicon.png` | Favicon de la versión web. |
| `assets/images/splash-icon.png` | Imagen de la pantalla de inicio (splash). |

### `frontend/src/app/`: rutas y navegación

| Archivo | Contenido y función |
|---|---|
| `_layout.tsx` | Layout raíz; instala el proveedor global de sesión y el navegador Stack. |
| `index.tsx` | Ruta `/`: indicador de carga inicial y redirección al inicio o al login. |
| `inicio.tsx` | Ruta `/inicio`; pantalla provisional que muestra nombre, usuario y rol, y permite cerrar sesión. |
| `(auth)/_layout.tsx` | Layout del grupo de acceso; si hay perfil activo redirige a `/inicio`. |
| `(auth)/iniciar-sesion.tsx` | Enruta `/iniciar-sesion` al componente `PantallaInicioSesion`. |
| `(auth)/registro.tsx` | Enruta `/registro` al componente `PantallaRegistro`. |

Los paréntesis indican un grupo de navegación de Expo Router; no forman parte de la URL.

### `frontend/src/features/auth/`: autenticación

| Archivo | Contenido y función |
|---|---|
| `index.ts` | API pública de la feature; exporta proveedor, hook, pantallas, cierre de sesión y tipos. |
| `tipos.ts` | Tipos de rol, estados de verificación, perfil público y datos del registro. |
| `constantes.ts` | Lista de ciudades de Baja California que ofrece el formulario. |
| `contexto/SesionContexto.ts` | Forma y valor inicial del estado compartido de sesión. |
| `contexto/SesionProvider.tsx` | Observa Firebase Auth, carga perfil Firestore y rechaza sesiones no válidas. |
| `hooks/useSesion.ts` | Acceso al contexto desde pantallas y componentes. |
| `hooks/useInicioSesion.ts` | Estado y acciones del formulario de login, reenvío de verificación y aviso para Google. |
| `hooks/useRegistro.ts` | Estado de los dos pasos del registro, errores, ciudades, rol y confirmación de éxito. |
| `hooks/useRecuperarContrasenia.ts` | Estado y envío del flujo de recuperación de contraseña. |
| `servicios/servicioAuth.ts` | Operaciones de Firebase Auth: registrar, verificar/re-enviar correo, entrar, recuperar y salir. |
| `servicios/servicioUsuarios.ts` | Consulta del perfil y disponibilidad del usuario; creación atómica de los tres documentos de perfil. |
| `utilidades/validaciones.ts` | Validación de correo, nombres, usuario, contraseña, confirmación y edad/fecha; también formatea fechas. |
| `utilidades/errores.ts` | Traducción de códigos de error de Firebase a mensajes para la interfaz. |
| `componentes/EncabezadoAuth.tsx` | Cabecera visual con foto de Ensenada, marca, icono y onda decorativa. |
| `componentes/EncabezadoAuth.estilos.ts` | Estilos y altura de la cabecera de acceso. |
| `componentes/SelectorRol.tsx` | Selector de los roles registrables: asistente u organizador. |
| `componentes/SelectorRol.estilos.ts` | Estilos del selector de rol. |
| `componentes/ModalRecuperarContrasenia.tsx` | Modal que presenta el campo de correo y la acción para enviar enlace de recuperación. |
| `componentes/ModalRecuperarContrasenia.estilos.ts` | Estilos del modal de recuperación. |
| `pantallas/PantallaInicioSesion.tsx` | Interfaz de login; combina campos, botones, recuperación y navegación al registro. |
| `pantallas/PantallaInicioSesion.estilos.ts` | Estilos de la pantalla de login. |
| `pantallas/PantallaRegistro.tsx` | Interfaz de registro; datos personales, datos de cuenta, selector de rol/ciudad y confirmación. |
| `pantallas/PantallaRegistro.estilos.ts` | Estilos de la pantalla de registro. |

La carpeta `frontend/src/features/` también contiene directorios vacíos `componentes/`, `contexto/`, `hooks/`, `pantallas/`, `servicios/` y `utilidades/` reservados para otras funciones; no representan una implementación.

### `frontend/src/compartido/`, `config/` e `infraestructura/`

| Archivo | Contenido y función |
|---|---|
| `compartido/componentes/index.ts` | Barrel de exportación de los componentes reutilizables. |
| `compartido/componentes/BotonPrimario.tsx` | Botón principal con estados de carga y deshabilitado. |
| `compartido/componentes/BotonPrimario.estilos.ts` | Apariencia del botón principal. |
| `compartido/componentes/BotonContorno.tsx` | Botón secundario con soporte opcional de icono. |
| `compartido/componentes/BotonContorno.estilos.ts` | Apariencia del botón secundario. |
| `compartido/componentes/CampoTexto.tsx` | Campo de texto con icono, error y opción de mostrar/ocultar contraseña. |
| `compartido/componentes/CampoTexto.estilos.ts` | Estilos compartidos por `CampoTexto` y `CampoSelector`. |
| `compartido/componentes/CampoSelector.tsx` | Campo de solo lectura que abre un selector, usado para ciudad. |
| `compartido/componentes/ModalCentrado.tsx` | Contenedor modal centrado que se cierra al tocar fuera o volver en Android. |
| `compartido/componentes/ModalCentrado.estilos.ts` | Estilos del fondo y tarjeta modal. |
| `compartido/componentes/SeparadorO.tsx` | Separador visual con texto central configurable. |
| `compartido/componentes/SeparadorO.estilos.ts` | Estilos del separador. |
| `compartido/tema/colores.ts` | Paleta de colores compartida por la interfaz. |
| `compartido/tema/medidas.ts` | Valores base de espaciado, radios y tamaños de tipografía. |
| `compartido/tema/index.ts` | Exportaciones centralizadas de colores y medidas. |
| `compartido/utilidades/sanitizar.ts` | Limpieza básica de texto antes de guardar; no sustituye las reglas de seguridad. |
| `config/entorno.ts` | Lectura tipada de variables de entorno y valores para emuladores/Firebase. |
| `infraestructura/firebase/cliente.ts` | Inicialización única de Firebase, persistencia de Auth y conexión opcional a emuladores. |
| `infraestructura/firebase/index.ts` | Punto de exportación de `app`, `auth` y `db`. |

### `backend/`: Firebase

| Archivo/carpeta | Contenido y función |
|---|---|
| `.firebaserc` | Proyecto Firebase seleccionado por defecto: `eventos-ensenada`. |
| `.gitignore` | Exclusiones locales y generadas de Firebase/Node. |
| `firebase.json` | Configura Firestore, Functions, Hosting y puertos de emuladores. |
| `firestore.rules` | Reglas de acceso y validación para perfiles, nombres, verificación, eventos, entradas, favoritos, reportes, calificaciones y notificaciones. |
| `firestore.indexes.json` | Índices compuestos previstos para consultas de eventos, entradas y otras colecciones. |
| `package.json` | Dependencias de pruebas y comando `test:reglas`. |
| `package-lock.json` | Versiones exactas de dependencias del paquete backend. |
| `tests/reglas.test.mjs` | Pruebas de autorización y validación de reglas usando el emulador Firestore. |
| `functions/package.json` | Dependencias y comandos para compilar, lint, emular y desplegar Cloud Functions; usa Node 24. |
| `functions/package-lock.json` | Versiones exactas de dependencias de Functions. |
| `functions/tsconfig.json` | Configuración TypeScript estricta; compila `src/` a `lib/`. |
| `functions/tsconfig.dev.json` | Configuración auxiliar de TypeScript para la configuración ESLint. |
| `functions/.eslintrc.js` | Reglas de lint de las Functions. |
| `functions/.gitignore` | Exclusiones propias del paquete Functions. |
| `functions/src/index.ts` | Actualmente solo configura `maxInstances: 10`; no exporta triggers ni funciones callable. |
| `functions/lib/` | Salida JavaScript/mapas generados al compilar; no es fuente de verdad. |
| `public/index.html` | Página inicial de plantilla «Firebase Hosting Setup Complete», no la aplicación Expo. |
| `public/404.html` | Página 404 de plantilla de Firebase Hosting. |

Los archivos `firestore-debug.log` que puedan aparecer en `backend/` o `backend/functions/` son logs locales de depuración, no código ni documentación funcional.

## 4. Qué hacen las reglas y qué queda pendiente

Las reglas de Firestore son la barrera de autorización de la base de datos; las validaciones del cliente solo mejoran la experiencia y no son seguridad. En la versión actual:

- Los perfiles públicos requieren sesión para leerse; el documento privado solo lo lee su titular o un administrador.
- El rol se establece durante el registro y no se puede cambiar desde el cliente.
- Los eventos aprobados son legibles sin iniciar sesión; los no aprobados quedan limitados a su organizador y administradores.
- Solo organizadores verificados y activos pueden crear eventos.
- Las entradas no admiten escrituras directas desde el cliente.
- Las reglas también limitan quién crea/lee favoritos, reportes, calificaciones y notificaciones.
- `backend/tests/reglas.test.mjs` verifica tanto operaciones permitidas como intentos que deben fallar. Ejecutar `npm run test:reglas` desde `backend/` levanta el emulador de Firestore para la prueba.

El diseño en `docs/modelo-datos.md` contempla además compras simuladas, validación de QR, moderación, dictámenes de eventos, cambios con entradas vendidas, avisos y promedios. Para hacer esos procesos operativos aún se necesita implementar las funciones de backend y las pantallas/servicios del cliente que las invoquen. Tener reglas o índices no crea esos flujos automáticamente.

## 5. Cómo ejecutar en desarrollo

### Aplicación Expo

1. Copiar `frontend/.env.example` a `frontend/.env`.
2. Para usar emuladores, mantener `EXPO_PUBLIC_USAR_EMULADORES=true`, establecer el ID de proyecto que coincida con Firebase y reemplazar `EXPO_PUBLIC_EMULADOR_HOST` por la IP alcanzable desde el dispositivo.
3. En `frontend/`, instalar dependencias con `npm install` si aún no existen y arrancar con `npm start`.
4. Para ejecutar directamente: `npm run android`, `npm run ios` o `npm run web`.

El archivo de configuración dispone los puertos de emulador de Auth y Firestore; para arrancarlos se usa Firebase CLI desde `backend/`, por ejemplo `firebase emulators:start --only auth,firestore`. El host emulador configurado escucha en `0.0.0.0`; no expongas esos puertos a redes que no sean de desarrollo.

### Pruebas de reglas y Functions

- Desde `backend/`: `npm run test:reglas`.
- Desde `backend/functions/`: `npm run build` compila TypeScript; `npm run lint` ejecuta ESLint.
- `firebase deploy --only functions` está configurado como comando de despliegue, pero hoy solo desplegaría la plantilla vacía/configuración actual; no habilita los flujos de negocio descritos como futuros.

## 6. Flujo recomendado para ampliar el proyecto

1. Definir el flujo/casos de uso y ajustar `docs/modelo-datos.md` si cambia el modelo.
2. Implementar la operación confiable de negocio en Functions cuando implique dinero, permisos elevados, cambios derivados, QR o notificaciones.
3. Agregar o actualizar las reglas y sus pruebas en `backend/firestore.rules` y `backend/tests/reglas.test.mjs`.
4. Crear la feature del frontend bajo `frontend/src/features/<nombre>/` y conectar una ruta/pantalla en `frontend/src/app/`.
5. Reutilizar `compartido/` para elementos comunes y `infraestructura/firebase/` para conexiones; evitar inicializar Firebase desde cada pantalla.
6. Probar primero reglas y tipos; documentar qué quedó implementado frente a qué sigue siendo diseño.
