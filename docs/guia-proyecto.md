# Guía actual del proyecto Eventos

## 1. Propósito y alcance

Eventos es una aplicación para descubrir y publicar eventos, comprar entradas simuladas y gestionar su acceso. El cliente móvil/web está hecho con Expo, React Native y TypeScript. Firebase Authentication identifica a las personas; Cloud Firestore guarda los datos y aplica reglas de acceso; Cloud Functions ejecuta algunos procesos privilegiados; Cloudinary almacena imágenes.

Esta guía describe el código que existe en el repositorio, no confirma qué servicios están desplegados en Firebase. La referencia de implementación es el código de `frontend/src/` y `backend/`; `docs/modelo-datos.md` conserva decisiones de diseño que pueden diferir de lo ya programado.

### Estado funcional que se observa en el código

- **Cuenta:** registro e inicio de sesión con correo y contraseña, verificación/recuperación por correo, perfil público y privado, restauración de sesión y cierre de sesión. No se encontró un flujo de acceso con Google.
- **Asistente:** catálogo y detalle de eventos aprobados, favoritos, compra simulada, entradas y QR, historial, reseñas, reportes, perfil público del organizador y seguimiento de organizadores.
- **Organizador:** panel, perfil, solicitud de verificación, creación/edición y listado de eventos, estadísticas, respuesta a reportes del organizador y escaneo/validación de QR.
- **Administrador:** resumen y estadísticas, revisión de solicitudes de organizadores y eventos, moderación de reportes y calificaciones, y suspensión/reactivación de eventos y organizadores.
- **Backend:** existe un trigger para sincronizar la aprobación de verificación con el perfil, además de una función callable de compra. La app actual compra mediante escrituras directas a Firestore, no invoca esa función callable.
- **Hosting:** `backend/public/` contiene las páginas estáticas de Firebase Hosting; no aloja el cliente Expo.

“Funcional” aquí significa que hay pantallas y conexiones a servicios en el código. No significa que los emuladores, credenciales, reglas o Functions estén desplegados o configurados en el entorno de ejecución.

La pestaña `organizador/(pestanas)/estadisticas.tsx` usa las estadísticas implementadas; la ruta alternativa `organizador/estadisticas.tsx` todavía muestra “próximamente”.

## 2. Arquitectura y conexiones

```text
Expo Router: frontend/src/app/
  ├─ (auth) ── features/auth ── Firebase Authentication + usuarios/{uid}
  ├─ asistente ── features/asistente ── eventos, entradas, favoritos, seguidos,
  │                                      calificaciones y reportes en Firestore
  ├─ organizador ── features/organizador, crear-evento, eventos, estadisticas,
  │                  verificacion, validar-qr, reportes-organizador
  └─ administrador ── features/administrador ── revisión y moderación en Firestore
                               │
                  compartido (componentes, tema, navegación, utilidades)
                               │
         infraestructura/firebase ─ config/entorno ─ Firebase
         infraestructura/cloudinary ─ config/cloudinary ─ Cloudinary

backend/firebase.json
  ├─ firestore.rules + firestore.indexes.json
  ├─ functions/src (trigger de verificación y callable de compra)
  ├─ tests/reglas.test.mjs
  └─ public/ (Firebase Hosting estático)
```

`frontend/tsconfig.json` configura el alias `@/` hacia `frontend/src/`. Los archivos de `app/` son rutas/adaptadores Expo Router; el trabajo de pantalla, estado y acceso a datos se organiza por dominio dentro de `features/`. Los servicios SDK se inicializan en `infraestructura/`, no en cada pantalla.

### Sesión y protección por rol

1. `app/_layout.tsx` carga fuentes y monta `SesionProvider`.
2. `SesionProvider` escucha Firebase Auth y consulta el perfil `usuarios/{uid}`. La configuración de correo verificado se controla en entorno.
3. La ruta raíz `app/index.tsx` envía a acceso o a la ruta inicial según el rol.
4. Los layouts de asistente, organizador y administrador aplican `GuardiaRol`. El layout de organizador también comparte `ProveedorPerfilOrganizador`.
5. `backend/firestore.rules` comprueba identidad, rol y propiedad de los datos en el servidor. Ocultar una pantalla en el cliente no reemplaza estas reglas.

### Flujo de registro

`PantallaRegistro` → `useRegistro` y validaciones → `servicioAuth` crea la cuenta Auth → `servicioUsuarios` escribe el perfil público, privado y reserva del nombre de usuario → se envía correo de verificación y se cierra la sesión. Las reglas permiten registrarse como `asistente` u `organizador`, no como administrador. `crear-admin.cjs` es un script para crear el rol administrador usando emuladores.

### Flujo de verificación del organizador

`PantallaVerificacion` → hooks de `features/verificacion` → `servicioVerificacion` guarda `solicitudesVerificacion/{uid}` y utiliza `subirImagen` para enviar documentos a Cloudinary → la bandeja del administrador modifica el estado → `alCambiarSolicitudVerificacion` sincroniza `estadoVerificacion` y `estaVerificado` en `usuarios/{uid}`. Las reglas limitan quién puede leer y modificar cada documento.

### Flujo de eventos

- El organizador verificado completa `PantallaCrearEvento`; `servicioCrearEvento` sube la portada y crea el evento como `pendiente_aprobacion`.
- `servicioEventos` alimenta el listado del organizador. El catálogo del asistente consulta solo eventos aprobados.
- El administrador revisa el contenido y puede aprobar, devolver para corrección o rechazarlo.
- Las ediciones siguen las reglas: un cambio sensible en evento con ventas se presenta como propuesta; el organizador no puede editar campos de venta ni saltarse la revisión.
- `servicioGestionEvento` permite borrar solo un evento propio sin entradas vendidas.

### Flujo de compra y validación: diferencia importante

La compra de la app es simulada: el formulario no procesa pagos reales. `useCompra` coordina la experiencia y `features/asistente/servicios/servicioEntradas.ts` crea entradas y actualiza `vendidas` directamente en una transacción de Firestore. Las reglas actuales permiten esa escritura bajo límites y validaciones.

También existe `backend/functions/src/modulos/entradas/comprarEntradas.ts`, una función callable que valida rol, cupo y límite y crea entradas con Firebase Admin. Está exportada desde `functions/src/index.ts`, pero el servicio de compra frontend revisado no la llama. Por tanto, no se debe describir la compra actual como exclusivamente ejecutada por backend. La forma de entrada generada por el callable tampoco es el ID determinista que espera la ruta directa; son dos implementaciones que deben mantenerse alineadas si se conecta la callable.

El QR contiene los datos de identificación y token de la entrada. El organizador selecciona un evento y `servicioValidacion` comprueba evento/token/ventana de acceso y marca la entrada como usada mediante transacción; las reglas reservan esa actualización al organizador dueño.

### Variables y servicios externos

- `frontend/src/config/entorno.ts` lee variables Expo públicas para Firebase, emuladores y exigencia de correo verificado.
- `frontend/src/infraestructura/firebase/cliente.ts` inicializa Firebase, configura persistencia de Auth con AsyncStorage y, opcionalmente, conecta emuladores.
- `frontend/src/config/cloudinary.ts` lee nube y presets de carga. El secreto de API de Cloudinary no debe incluirse en la app.
- `frontend/.env.example` es la plantilla de entorno. `frontend/.env` es local: esta guía no publica sus valores.
- Para un dispositivo físico, `EXPO_PUBLIC_EMULADOR_HOST` debe ser una IP alcanzable de la computadora; `127.0.0.1` apunta al dispositivo mismo.

## 3. Funciones por rol

| Rol | Acceso y funciones conectadas | Restricciones principales |
|---|---|---|
| **Asistente** | Registro y perfil; explorar y abrir eventos aprobados; guardar favoritos; seguir organizadores; comprar entradas de forma simulada; consultar entradas/QR e historial; calificar eventos terminados; reportar eventos; consultar reportes propios y perfiles públicos de organizadores. | Solo lee/escribe sus datos propios. La compra no cobra dinero real. No administra eventos ni valida entradas. |
| **Organizador** | Perfil y panel; solicitar/re-enviar verificación; ver eventos propios y sus estados; crear/editar eventos; consultar ventas, asistencia y reseñas; ver reportes recibidos y responderlos; seleccionar eventos y validar QR. | Debe estar verificado, con cuenta activa y sin suspensión vigente para crear/editar eventos. No puede aprobar sus eventos, cambiar ventas ni validar entradas de otro organizador. |
| **Administrador** | Consultar panel/estadísticas; revisar solicitudes de verificación y eventos; moderar reportes y reseñas; suspender/reactivar eventos y suspender/rehabilitar organizadores. | El rol no se ofrece en el registro normal; se provisiona mediante el script de administrador. Las acciones deben cumplir `firestore.rules`. |

## 4. Inventario completo de archivos del proyecto

El inventario incluye los archivos propios de configuración, documentación, fuentes y recursos presentes en esta copia. Para que sea legible se listan los nombres por carpeta, no las dependencias de `node_modules/`, el contenido de `.git/` ni archivos internos generados por herramientas.

### Raíz, documentación y backend

```text
estructura.txt
docs/
  guia-proyecto.md
  modelo-datos.md
backend/
  .firebaserc
  .gitignore
  firebase.json
  firestore-debug.log                         (local/generado)
  firestore.indexes.json
  firestore.rules
  package.json
  package-lock.json
  public/
    404.html
    index.html
  tests/
    reglas.test.mjs
  functions/
    .eslintrc.js
    .gitignore
    firebase-debug.log                        (local/generado)
    firestore-debug.log                       (local/generado)
    package.json
    package-lock.json
    tsconfig.json
    tsconfig.dev.json
    scripts/
      crear-admin.cjs
    src/
      index.ts
      modulos/
        entradas/
          comprarEntradas.ts
        verificacion/
          alCambiarSolicitudVerificacion.ts
    lib/                                       (salida generada por TypeScript)
      index.js
      index.js.map
      modulos/entradas/                        (JS y mapas compilados)
      modulos/verificacion/                    (JS y mapas compilados)
    firebase-export-1795151321132RmHd1x/       (exportación local del emulador)
      firebase-export-metadata.json
      auth_export/
        accounts.json
        config.json
      firestore_export/
        firestore_export.overall_export_metadata
```

### Frontend: configuración y recursos

```text
frontend/
  .claude/settings.json
  .env                                      (local; no publicar su contenido)
  .env.example
  .gitignore
  .vscode/extensions.json
  .vscode/settings.json
  AGENTS.md
  CLAUDE.md
  app.json
  expo-env.d.ts
  package.json
  package-lock.json
  tsconfig.json
  assets/
    imagenes/
      concierto.jpg
      ensenada.jpg
    images/
      android-icon-background.png
      android-icon-foreground.png
      android-icon-monochrome.png
      favicon.png
      icon.png
      splash-icon.png
```

### Frontend: rutas `src/app/`

Cada ruta importa/reexporta una pantalla de `features/`; los grupos entre paréntesis organizan navegación sin agregarse a la URL.

```text
src/app/
  _layout.tsx
  index.tsx
  (auth)/
    _layout.tsx
    iniciar-sesion.tsx
    registro.tsx
  asistente/
    _layout.tsx
    (pestanas)/
      _layout.tsx
      entradas.tsx
      explorar.tsx
      favoritos.tsx
      perfil.tsx
    entrada/[id].tsx
    evento/[id].tsx
    historial.tsx
    mis-calificaciones.tsx
    mis-reportes.tsx
    organizador/[id].tsx
    organizadores-seguidos.tsx
  organizador/
    _layout.tsx
    (pestanas)/
      _layout.tsx
      crear.tsx
      estadisticas.tsx
      inicio.tsx
      mis-eventos.tsx
      perfil.tsx
      validar-qr.tsx
    crear.tsx
    editar-evento.tsx
    estadisticas-evento.tsx
    estadisticas.tsx
    inicio.tsx
    mis-eventos.tsx
    perfil.tsx
    reportes.tsx
    validar-qr.tsx
    verificacion.tsx
  administrador/
    _layout.tsx
    (pestanas)/
      _layout.tsx
      estadisticas.tsx
      eventos.tsx
      inicio.tsx
      organizadores.tsx
      reportes.tsx
    moderacion.tsx
    perfil.tsx
```

### Frontend: `src/features/`

En cada dominio, `pantallas/` compone la interfaz, `componentes/` contiene piezas reutilizables, `hooks/` mantiene estado/listeners, `servicios/` accede a Firestore/Firebase/Cloudinary y `tipos.ts`/`utilidades/` define contratos y transformaciones. No todas las carpetas tienen todos esos subdirectorios.

```text
features/
  auth/
    constantes.ts, index.ts, tipos.ts
    componentes/
      DecoracionConcierto.tsx, EncabezadoAuth.estilos.ts, EncabezadoAuth.tsx,
      GuardiaRol.tsx, IconoTicket.tsx, ModalAviso.estilos.ts, ModalAviso.tsx,
      ModalRecuperarContrasenia.estilos.ts, ModalRecuperarContrasenia.tsx,
      SelectorFecha.estilos.ts, SelectorFecha.tsx, SelectorRol.estilos.ts, SelectorRol.tsx
    contexto/SesionContexto.ts, contexto/SesionProvider.tsx
    hooks/
      useInicioSesion.ts, useRecuperarContrasenia.ts, useRegistro.ts,
      useSesion.ts, useTecladoScroll.ts
    pantallas/
      PantallaInicioSesion.estilos.ts, PantallaInicioSesion.tsx,
      PantallaRegistro.estilos.ts, PantallaRegistro.tsx
    servicios/servicioAuth.ts, servicios/servicioUsuarios.ts
    utilidades/errores.ts, utilidades/rutas.ts, utilidades/validaciones.ts
  asistente/
    index.ts, tipos.ts, servicioCalificaciones.ts, servicioReportes.ts
    componentes/
      BarraCompra.tsx, BotonCorazon.tsx, BotonSeguir.tsx, CabeceraDetalle.tsx,
      CampoPago.tsx, ChipsCategoria.tsx, DatosPrincipalesEvento.tsx,
      EncabezadoAsistente.tsx, EncabezadoSimple.tsx, Estrellas.tsx,
      FilaOrganizador.tsx, InsigniaEntrada.tsx, MetricasEvento.tsx,
      ModalCalificar.tsx, ModalCompra.tsx, ModalEditarPerfil.tsx, ModalReportar.tsx,
      SeccionCalificaciones.tsx, TarjetaEntrada.tsx, TarjetaEventoAsistente.tsx,
      TarjetaOrganizadorDetalle.tsx, TarjetaUbicacion.tsx, VistaTarjeta.tsx
    hooks/
      useAccionesEvento.ts, useBarraEstadoAsistente.ts, useCalificaciones.ts,
      useCatalogo.ts, useCompra.ts, useEntrada.ts, useEntradasDelEvento.ts,
      useEventoPublico.ts, useEventosDelOrganizador.ts, useEventosFavoritos.ts,
      useFavoritos.ts, useHistorialEventos.ts, useMisCalificacionesYReportes.ts,
      useMisEntradas.ts, useOrganizadorPublico.ts, usePerfilAsistente.ts,
      useReporteEvento.ts, useSeguidos.ts
    pantallas/
      PantallaDetalleEvento.estilos.ts, PantallaDetalleEvento.tsx,
      PantallaEntradaQR.estilos.ts, PantallaEntradaQR.tsx, PantallaExplorar.estilos.ts,
      PantallaExplorar.tsx, PantallaFavoritos.tsx, PantallaHistorialEventos.tsx,
      PantallaMisCalificaciones.tsx, PantallaMisEntradas.estilos.ts,
      PantallaMisEntradas.tsx, PantallaMisReportes.tsx,
      PantallaOrganizadorPublico.estilos.ts, PantallaOrganizadorPublico.tsx,
      PantallaOrganizadoresSeguidos.tsx, PantallaPerfilAsistente.estilos.ts,
      PantallaPerfilAsistente.tsx
    servicios/
      servicioCalificaciones.ts, servicioCatalogo.ts, servicioEntradas.ts,
      servicioFavoritos.ts, servicioMisEntradas.ts, servicioOrganizador.ts,
      servicioPerfilAsistente.ts, servicioReportes.ts, servicioSeguidos.ts
    utilidades/categorias.ts, utilidades/entradas.ts, utilidades/formato.ts,
    utilidades/tarjeta.ts
  administrador/
    index.ts, tipos.ts
    componentes/
      AccesoRapidoAdmin.tsx, EncabezadoAdmin.estilos.ts, EncabezadoAdmin.tsx,
      EncabezadoSeccionAdmin.tsx, FilaTarea.tsx, SelectorPeriodoAdmin.tsx,
      TarjetaRanking.tsx, TarjetaResumen.tsx, BarrasDistribucion.tsx
    hooks/useBarraClara.ts, hooks/useResumenAdministrador.ts
    pantallas/PantallaInicioAdministrador.estilos.ts,
    pantallas/PantallaInicioAdministrador.tsx
    servicios/servicioResumenAdmin.ts
    estadisticas/index.ts, estadisticas/pantallas/PantallaEstadisticasAdmin.tsx
    eventos/index.ts, eventos/tipos.ts, eventos/hooks/useRevisionEventos.ts,
    eventos/servicios/servicioRevisionEventos.ts,
    eventos/pantallas/PantallaRevisionEventos.tsx,
    eventos/componentes/ModalRevisionEvento.tsx,
    eventos/componentes/TarjetaEventoAdmin.tsx
    moderacion/index.ts, moderacion/constantes.ts,
    moderacion/hooks/useModerarContenido.ts,
    moderacion/pantallas/PantallaModerarContenido.tsx,
    moderacion/servicios/servicioModerarContenido.ts
    reportes/index.ts, reportes/tipos.ts, reportes/hooks/useModeracion.ts,
    reportes/servicios/servicioModeracion.ts, reportes/pantallas/PantallaModeracion.tsx,
    reportes/componentes/ModalReporte.tsx, reportes/componentes/TarjetaCalificacionAdmin.tsx,
    reportes/componentes/TarjetaReporte.tsx
    utilidades/calculosPlataforma.ts
    verificaciones/index.ts, verificaciones/tipos.ts,
    verificaciones/hooks/useBandejaVerificacion.ts,
    verificaciones/servicios/servicioBandeja.ts,
    verificaciones/pantallas/PantallaBandejaVerificacion.tsx,
    verificaciones/componentes/ModalExpediente.tsx,
    verificaciones/componentes/TarjetaSolicitud.tsx
  crear-evento/
    categorias.ts, index.ts, tipos.ts
    componentes/CampoFechaHora.tsx, componentes/CampoFormulario.tsx,
    componentes/FormularioEvento.tsx, componentes/SelectorFoto.tsx
    hooks/useEventoParaEditar.ts, hooks/useFormularioEvento.ts
    pantallas/PantallaCrearEvento.estilos.ts, pantallas/PantallaCrearEvento.tsx,
    pantallas/PantallaEditarEvento.tsx
    servicios/servicioCrearEvento.ts, servicios/servicioEditarEvento.ts
    utilidades/validaciones.ts
  estadisticas/
    tipos.ts, index.ts, hooks/useDatosOrganizador.ts,
    servicios/servicioEstadisticas.ts, utilidades/calculos.ts
    pantallas/PantallaEstadisticas.tsx, pantallas/PantallaEstadisticasEvento.tsx
    componentes/BarraProgreso.tsx, componentes/DistribucionEstrellas.tsx,
    componentes/FilaRendimientoEvento.tsx, componentes/GraficaVentas.tsx,
    componentes/ListaCalificaciones.tsx, componentes/PanelEstadisticas.tsx,
    componentes/SelectorPeriodo.tsx, componentes/TarjetaKpi.tsx
  eventos/
    constantes.ts, index.ts, tipos.ts, hooks/useEventosOrganizador.ts,
    servicios/servicioEventos.ts, utilidades/formato.ts
    componentes/InsigniaEstadoEvento.estilos.ts, componentes/InsigniaEstadoEvento.tsx,
    componentes/TarjetaEvento.estilos.ts, componentes/TarjetaEvento.tsx
  gestion-evento/
    index.ts, hooks/useGestionEvento.tsx,
    servicios/servicioGestionEvento.ts, componentes/HojaAccionesEvento.tsx
  organizador/
    index.ts, tipos.ts, contexto/PerfilOrganizadorContexto.tsx,
    hooks/useAccionCrearEvento.ts, hooks/useEstadoVerificacion.ts,
    hooks/useResumenOrganizador.ts, servicios/servicioPerfilOrganizador.ts
    pantallas/PantallaInicioOrganizador.estilos.ts, pantallas/PantallaInicioOrganizador.tsx,
    pantallas/PantallaMisEventos.estilos.ts, pantallas/PantallaMisEventos.tsx,
    pantallas/PantallaPerfilOrganizador.estilos.ts, pantallas/PantallaPerfilOrganizador.tsx
    componentes/AccesoRapido.estilos.ts, componentes/AccesoRapido.tsx,
    componentes/BannerVerificacion.estilos.ts, componentes/BannerVerificacion.tsx,
    componentes/BotonCrearEvento.estilos.ts, componentes/BotonCrearEvento.tsx,
    componentes/BotonCrearPestana.estilos.ts, componentes/BotonCrearPestana.tsx,
    componentes/ListaEventosOrganizador.estilos.ts, componentes/ListaEventosOrganizador.tsx,
    componentes/TarjetaMetrica.estilos.ts, componentes/TarjetaMetrica.tsx
  perfil/
    index.ts, pantallas/PantallaPerfil.estilos.ts, pantallas/PantallaPerfil.tsx
  reportes-organizador/
    index.ts, tipos.ts, hooks/useReportesOrganizador.ts,
    servicios/servicioReportesOrganizador.ts,
    pantallas/PantallaReportesOrganizador.tsx,
    componentes/ListaReportesOrganizador.tsx
  suspension-organizador/
    index.ts, hooks/useSuspensionOrganizador.ts,
    componentes/AvisoSuspension.tsx
  validar-qr/
    index.ts, tipos.ts, hooks/useEscaner.ts, hooks/useEventosValidables.ts,
    servicios/servicioValidacion.ts, utilidades/qr.ts
    pantallas/PantallaValidarQR.estilos.ts, pantallas/PantallaValidarQR.tsx
    componentes/ListaEventosValidar.tsx, componentes/ResultadoEscaneo.tsx,
    componentes/VisorEscaner.tsx
  verificacion/
    index.ts, tipos.ts, hooks/useFormularioVerificacion.ts,
    hooks/useSolicitudVerificacion.ts, servicios/servicioVerificacion.ts,
    utilidades/validaciones.ts
    pantallas/PantallaVerificacion.estilos.ts, pantallas/PantallaVerificacion.tsx
    componentes/AvisoObservaciones.estilos.ts, componentes/AvisoObservaciones.tsx,
    componentes/CampoDocumento.estilos.ts, componentes/CampoDocumento.tsx,
    componentes/FilaTerminos.estilos.ts, componentes/FilaTerminos.tsx,
    componentes/TarjetaEstadoSolicitud.estilos.ts, componentes/TarjetaEstadoSolicitud.tsx
```

### Frontend: módulos compartidos e infraestructura

```text
src/compartido/
  componentes/
    BarraMarca.estilos.ts, BarraMarca.tsx, BotonContorno.estilos.ts, BotonContorno.tsx,
    BotonIcono.estilos.ts, BotonIcono.tsx, BotonPrimario.estilos.ts, BotonPrimario.tsx,
    CampoSelector.tsx, CampoTexto.estilos.ts, CampoTexto.tsx, EncabezadoPantalla.tsx,
    FondoHero.tsx, IconoTicket.tsx, ModalCentrado.estilos.ts, ModalCentrado.tsx,
    PantallaEnConstruccion.estilos.ts, PantallaEnConstruccion.tsx,
    PestanasIconoArriba.tsx, PestanasSegmentadas.estilos.ts, PestanasSegmentadas.tsx,
    SeparadorO.estilos.ts, SeparadorO.tsx, index.ts
  navegacion/useOpcionesPestanas.ts
  tema/colores.ts, tema/index.ts, tema/medidas.ts, tema/useFuentes.ts
  utilidades/proximamente.ts, utilidades/sanitizar.ts,
  utilidades/seleccionarImagen.ts, utilidades/useBarraEstado.ts
src/config/cloudinary.ts, src/config/entorno.ts
src/infraestructura/
  cloudinary/index.ts, cloudinary/subirImagen.ts
  firebase/cliente.ts, firebase/index.ts
```

Los archivos `.estilos.ts` son las hojas de estilo de sus componentes/pantallas homónimos; las imágenes son recursos de marca o contenido y no ejecutan lógica. `frontend/.env`, logs, exportaciones de emulador y `functions/lib/` son locales/generados, no fuentes canónicas ni documentación de secretos. No se expanden `node_modules/` ni `.git/`.

## 5. Firestore: datos, autorización e índices

`backend/firebase.json` enlaza Firestore con `firestore.rules` y `firestore.indexes.json`. Las colecciones y los permisos efectivos deben consultarse en esas reglas; los comentarios y la propuesta del modelo no las reemplazan.

| Datos | Uso actual en la aplicación |
|---|---|
| `usuarios/{uid}`, `usuarios/{uid}/privado/perfil`, `nombresUsuario/{nombre}` | Perfil público, datos privados y reserva del nombre en el registro. |
| `solicitudesVerificacion/{uid}` | Expediente y estado de verificación del organizador. |
| `eventos/{id}` | Catálogo, paneles, publicación/revisión, edición y moderación. |
| `entradas/{id}` | Entradas simuladas, datos para el QR y estado de acceso. |
| `favoritos/{asistenteId_eventoId}`, `seguidos/{asistenteId_organizadorId}` | Preferencias del asistente. |
| `reportes/{asistenteId_eventoId}`, `reportesOrganizador/{id}` | Denuncias, resolución administrativa y respuesta del organizador. |
| `calificaciones/{asistenteId_eventoId}` | Reseñas y su moderación. |
| `notificaciones/{id}` | Las reglas permiten lectura/actualización del destinatario, pero no se encontró un productor activo en Functions. |

Las reglas verifican pertenencia, roles y cambios permitidos. En particular, solo eventos aprobados son públicos; el organizador verificado/activo crea eventos pendientes; el administrador los dictamina; el comprador y la función callable están limitados por reglas/validaciones distintas; y el organizador dueño valida una entrada una sola vez. Las colecciones no declaradas no tienen permisos.

Los índices compuestos están declarados en `backend/firestore.indexes.json` para catálogo por estado/fecha/categoría, eventos por organizador/estado y cambios propuestos, entradas por asistente/evento, reportes, reportes de organizador, calificaciones, favoritos, notificaciones y solicitudes de verificación. Si una consulta nueva requiere combinación de filtros/orden, debe actualizarse ese archivo.

### Divergencia entre especificación y código

`docs/modelo-datos.md` fue escrito como diseño y varias afirmaciones ya no describen el código. En el repositorio actual:

- La app crea entradas directamente y las reglas permiten esa operación; la callable `comprarEntradas` también existe, pero no está conectada al servicio frontend.
- El modelo dice que entradas, calificaciones y validación QR solo se escriben en backend; las reglas actuales permiten escritura de entradas y calificaciones desde el cliente, y actualización de uso de entradas por el organizador.
- Hay colecciones y funcionalidades actuales de seguimiento, calificaciones, reportes y moderación que no coincidían con el alcance descrito en el modelo.
- Los reportes/estadísticas se consultan desde la aplicación; no hay una función backend que recalcule promedios o cree notificaciones.

Si se modifica cualquiera de esos contratos, actualizar juntos el servicio frontend, la callable (si aplica), las reglas y las pruebas. No tomar el modelo como prueba de despliegue o como descripción exacta de permisos actuales.

## 6. Backend y operaciones

- `functions/src/index.ts` establece límite global de instancias y exporta las funciones.
- `alCambiarSolicitudVerificacion.ts` escucha escrituras en solicitudes y copia cambios de estado al perfil del organizador.
- `comprarEntradas.ts` realiza compra callable transaccional, comprueba usuario/evento/cupo/límite y crea entradas mediante Firebase Admin. El cliente actual aún no la invoca.
- `scripts/crear-admin.cjs` crea una cuenta administradora con emuladores; no apuntarlo a producción sin un proceso de aprovisionamiento seguro.
- `firestore.rules` es control de acceso; `tests/reglas.test.mjs` prueba reglas con el emulador. Ninguna de estas piezas confirma que la configuración esté desplegada.
- `public/index.html` y `public/404.html` son páginas estáticas de Hosting, no forman parte del bundle Expo.

## 7. Desarrollo y pruebas

### Ejecutar Expo

1. Preparar `frontend/.env` a partir de `frontend/.env.example` sin subir los valores locales.
2. Opcionalmente arrancar Auth y Firestore Emulator desde `backend/` y configurar un host accesible desde el dispositivo.
3. Desde `frontend/`, usar `npm start`, `npm run android`, `npm run ios` o `npm run web`.

### Firebase, reglas y Functions

- Desde `backend/`: `npm run test:reglas` inicia el emulador de Firestore y ejecuta `tests/reglas.test.mjs`.
- Desde `backend/functions/`: `npm run build` compila TypeScript y `npm run lint` ejecuta ESLint.
- `backend/firebase.json` configura emuladores, Hosting y hooks de lint/build antes del despliegue de Functions.
- El script de administrador es para emuladores. No se debe ejecutar con credenciales o proyecto de producción.

Las pruebas de reglas validan autorización en el emulador; no validan por sí solas las pantallas, los flujos de compra callable ni el despliegue.

## 8. Convenciones para cambios futuros

1. Mantener `app/` como capa de rutas y layouts, y poner comportamiento reutilizable en `features/<dominio>/`.
2. Compartir UI/tema desde `compartido/` y centralizar SDKs externos en `infraestructura/`.
3. Al tocar datos, revisar en conjunto servicios frontend, reglas, índices y pruebas de reglas.
4. Para acciones que deban ser privilegiadas, usar una Cloud Function y conectarla explícitamente desde el cliente; no basta con exportarla.
5. Mantener `docs/modelo-datos.md` como modelo/diseño y esta guía como descripción del código actual. Indicar con claridad qué es propuesta y qué está implementado.
6. No incluir secretos ni valores locales de `.env`, exportaciones de Firebase o logs en documentación o control de versiones.
