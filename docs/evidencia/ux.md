# Evidencia V0-UX

## T00 · Base ejecutable · 7 de octubre de 2026 (histórico)

Base Git: `4c51cc3`; cambios T00 sin commit. Build `fauna-piloto@0.0.1`, assets `index-Dt248sYm.js` y `index-gQ2AQqhp.css`. Entorno macOS arm64, Node 24.14.0, npm 11.9.0. Dependencias exactas en `package.json` y resolución reproducible en `package-lock.json`.

| Comprobación | Resultado observado |
| --- | --- |
| `npm ci --offline --no-audit --no-fund` | 186 paquetes instalados desde lockfile; código 0 |
| `npm run verify` | Código 0: TypeScript, ESLint, reglas de fixture, 4 tests Vitest, build y 4 E2E |
| Chromium + WebKit, build de producción | Bienvenida, límites demo, abrir/cerrar detalles, recarga, sin errores JS ni solicitudes externas en el smoke |
| 320 × 740 y 390 × 844 CSS px | Sin desbordamiento horizontal; navegación y activación por teclado; captura visual revisada |
| Auditoría de instalación final | 0 vulnerabilidades reportadas por npm; sin `--force` ni excepciones |
| `npm run preview:local`, sin certificados | Código 1 y mensaje hacia la guía HTTPS; sin fallback HTTP |
| `npm run preview:local`, certificado temporal | HTTP 200 sobre TLS mediante `curl --cacert`, sin `-k`; servidor detenido al terminar |
| `git check-ignore` | Dependencias, build, caché, fotos, modelos y claves excluidos |
| `git diff --check` | Sin errores de whitespace |

Capturas conservadas, sin fotos personales:

- [Bienvenida · WebKit · 390 px](t00-bienvenida-webkit-390.png).
- [Detalles demo y foco · Chromium · 320 px](t00-demo-chromium-320.png).

Fallos corregidos: la primera combinación en caché incluía Vitest vulnerable; se sustituyó por 5.0.3 y ESLint por una línea soportada, con comprobación de peers y auditoría limpia. Playwright 1.60 esperaba un WebKit ausente; 1.63 coincide con los binarios instalados. El test asumía Tab universal: ahora usa Option+Tab en WebKit/macOS para recorrer enlace y botón, sin quitar las aserciones de foco/activación ni modificar preferencias del sistema. Ese comportamiento está documentado en [WebKit](https://bugs.webkit.org/show_bug.cgi?id=199671). Fallos DNS iniciales se resolvieron combinando caché y consulta renovada de metadatos, sin relajar la compatibilidad.

Límites: estas pruebas cubren T00, no A01–A12 completos. El fixture está vacío y marcado demo; la regla rechaza atribuirle presencia verificada o modelo. No hay persistencia, cámara, identificación, paquete, service worker ni prueba de autonomía. El certificado de comprobación solo se confió mediante `curl --cacert`, no se instaló en llavero o iPhone. Versión de iOS, memoria disponible, Safari físico y participantes siguen pendientes. Siguiente tarea: T01 según el plan existente.

## T02/T03/T05 · Entrega V0-UX · 7 de octubre de 2026

Base Git `4c51cc3`, cambios locales sin commit. Build `0.0.1-ux-demo1`, entrada `index-BnINZ9NN.js`, estilos `index-DVqSTPeU.css`. Node 24.14.0/npm 11.9.0; Chromium 1243 y WebKit 2359 de Playwright 1.63.0 en macOS arm64. Ocho fichas y cinco colecciones **demo**, no catálogo local revisado.

| Comprobación | Evidencia observada |
| --- | --- |
| Instalación desde lockfile | `npm ci --offline --no-audit --no-fund`: 461 paquetes, código 0 |
| Harness completo | `npm run verify`: tipos, ESLint, datos, 24 tests Vitest en 5 archivos, build y 18 E2E; código 0 |
| A01–A04 | Descubrimiento/repetición, filtro vacío/limpieza/volver, doble toque, recarga, edición/borrado; reglas de municipio/contexto en la misma observación y fecha desconocida |
| A02/A03/A05 | Foto sintética normalizada, IndexedDB real, exportar/restaurar en perfil nuevo; copia inválida intacta. Tests de rollback de guardado/restauración, reintento y corrección sin perder candidatos originales |
| A06/A09 UX | Bases demo/real separadas; importar demo en real rechazado; real sin propuestas simuladas; fecha vacía y lugar desconocido, sin pedir GPS |
| A11 | Capturas 390 × 844 y 320 × 740 CSS px, teclado, sin overflow horizontal; selectores ≥44 px también en WebKit; movimiento reducido configurable |
| A12 | Activación voluntaria, feedback por pantalla, exportación local sin notas/fotos/coordenadas automáticas, desactivación/limpieza sin borrar encuentros; perfiles/orígenes separados y límites probados |
| PWA de interfaz | Manifiesto, iconos propios y precaché de 21 entradas / 514,39 KiB. Modelos, runtime WASM y worker técnico excluidos. Actualización manual desde Ajustes |
| Reapertura sin servidor | Caché inspeccionada; cerrar página, apagar servidor del origen y verificar conexión rechazada; abrir página nueva, recuperar un encuentro, guardar otro y recargar. Pasa en ambos motores, cero solicitudes a otros orígenes |
| Privacidad/repositorio | `git check-ignore` confirma exclusiones de dependencias/build/caché/fotos/pesos/runtime/certificados; sin publicación ni fotos personales |

Revisión visual conservada: [bienvenida](ux-bienvenida-webkit-390.png), [exploración](ux-explorar-webkit-390.png), [ficha](ux-ficha-webkit-390.png), [escáner demo](ux-escanear-webkit-390.png), [duda](ux-duda-webkit-390.png), [revelación](ux-revelacion-webkit-390.png), [cuaderno 320 px](ux-cuaderno-webkit-320.png). Las capturas de página completa pueden mostrar la barra fija sobre contenido intermedio; el contenido se accede desplazando y existe espacio inferior reservado. La fecha pálida del control nativo vacío no es una fecha guardada: el E2E verifica valor vacío.

Fallos materiales corregidos:
- Filtro que reutilizaba parámetros anteriores tras limpiar: toma la URL vigente al aplicar cambios rápidos.
- WebKit rechazaba escribir Blob en IndexedDB: se serializan bytes antes de la transacción; lectura/exportación reconstruyen Blob, sin perder atomicidad. Foto/restauración pasan en ambos motores.
- Precaché registraba los iconos dos veces con revisiones incompatibles: una única inclusión por asset. La UI también comprueba la presencia del HTML en CacheStorage antes de anunciar preparación.
- `setOffline(true)` de WebKit 2359 fallaba al navegar por service worker; coincide con [Playwright #42775](https://github.com/microsoft/playwright/issues/42775). Se apagó realmente el servidor aislado, no se omitió la comprobación ni se cambió a red disponible. La prueba técnica de 404 bloquea SW solo para poder interceptar pesos; la prueba PWA mantiene SW real.
- Selectores nativos WebKit ignoraban el alto táctil con su apariencia original: apariencia CSS y aserción geométrica de ≥44 px.

Avisos no bloqueantes: npm advierte deprecación transitoria de `glob@11.1.0`; la auditoría al instalar PWA reportó cero vulnerabilidades. Rollup descarta dos anotaciones PURE de Zod. No se cambian paquetes sin necesidad ni se silencian warnings.

Límites: entrega **V0-UX**, no V0-CAMPO. A07/A08/A10 de campo, expulsión de caché, actualización de pesos, calidad del modelo y Safari/iPhone físico siguen pendientes. La prueba con servidor apagado no reinicia físicamente el navegador/teléfono ni apaga radios. No se han realizado las sesiones con personas: [guía de 3–5 participantes](../07-validacion.md#preparación-de-la-sesión-v0-ux). T04 todavía debe curar contenido y licencias. La evidencia técnica T01 se conserva aparte, sin convertir sus tiempos sintéticos en precisión.

### Auditoría final y parte UX de T04 · 7 de octubre de 2026

Build final: entrada `index-CZU3yN6g.js`, estilos `index-DVqSTPeU.css`, precaché 21 entradas / 515,57 KiB. `npm run verify` vuelve a pasar con código 0: tipos, lint, datos, 24 tests y 18 E2E Chromium/WebKit. Tras añadir únicamente la captura del panel, `npm run test:e2e -- --grep "escenarios y pantallas"` pasa otros 2 recorridos. `git diff --check` sin errores. El sandbox rechazó el bind de la revisión local; se repitió con autorización, sin cambiar servidor ni criterios.

Parte de T04 necesaria para UX: manifiesto `src/test-support/demo-pack.json`, `fauna-ux-demo@demo-1`, esquema 1, ocho fichas/cinco colecciones, procedencia de catálogo e ilustraciones internos y estado de licencias explícito sin permisos externos inventados. Declara cero especies con identificación real aprobada y ninguna presencia local verificada. Ajustes muestra esta información; E2E verifica su visibilidad en ambos motores. `check:data` comprueba referencias/versiones y bytes/SHA-256 de los dos archivos fuente. Dos alteraciones controladas (checksum y presencia local) fueron rechazadas con código 1; el manifiesto original se restauró y el gate vuelve a pasar. No sustituye el paquete curado ni la instalación por staging de CAMPO.

[Panel de procedencia · WebKit · 390 × 844 CSS px](ux-paquete-demo-webkit-390.png): revisado, texto legible y contenido accesible mediante scroll. Los pares principales de CSS calculados con luminancia sRGB dan: tinta/crema 13,48:1; texto secundario/tarjeta 6,22:1; blanco/coral 5,60:1; blanco/botón verde 11,82:1; error/fondo 8,41:1. Esta comprobación no certifica todos los controles nativos ni Safari físico.

Auditoría de alcance: R01–R03 con perfiles, filtros, siluetas y progreso; R04–R07 con pendientes/confirmación/repetición, transacciones y corrección/borrado; R08 con foto sintética, copia y restauración en perfil nuevo; R09 con bases/orígenes separados; R13–R14 con fecha/lugar desconocidos, alternativa sin GPS, teclado, controles y revisión visual; R15 con feedback y eventos voluntarios exportables. R12 se cubre en UX con elección explícita y pendiente; su recorrido con inferencia real, R10 y R11 continúan pendientes de CAMPO. T00 incluye la guía HTTPS y evidencia TLS histórica; T01 conserva dos candidatos exactos y resultados sintéticos, y sus archivos locales se volvieron a verificar contra tamaño/SHA-256. No se repitió el benchmark ni se atribuyó nueva calidad.

Entrega detenida en V0-UX según el encargo. Instrucciones del recorrido en README y sesión de 3–5 participantes en 07; pendientes: sesiones reales, iPhone/T01-calidad y catálogo/paquete CAMPO. No se ha publicado ni iniciado V1.

### Corrección del review V0-UX · 7 de octubre de 2026

El P1 era reproducible: la implementación estaba en archivos sin seguimiento y el diff solo contenía documentación. Se añadieron al índice aplicación, configuración, `package.json`, lockfile, scripts, pruebas, iconos y evidencia: 82 archivos en el cambio contra `4c51cc3`, sin commit ni publicación. Se comprobaron las rutas del índice: no contiene dependencias, fotos personales, certificados, runtime ni pesos. El cambio se revisa completo con `git diff --cached` (incluidas imágenes mediante diff binario).

Reproducción: `git checkout-index --all --prefix=<directorio vacío>/` en `/private/tmp/fauna-ux-review-vvnkhke6`; `npm ci --offline --no-audit --no-fund` instala 461 paquetes desde el lockfile; `npm run verify` termina con código 0: tipos/lint/datos, 26 pruebas y 22 E2E Chromium/WebKit. No se copiaron `node_modules`, `dist`, modelos o runtime del workspace. La instalación usa la caché npm local y los navegadores Playwright ya instalados, como herramientas de desarrollo. El build prepara su runtime desde la dependencia fijada sin descargar pesos. Entrada final `index-Chmv8uIY.js`; precaché 22 entradas / 516,26 KiB. `git diff --cached --check` pasa.

Correcciones y evidencia:
- Navegación: «Volver» desde una URL directa permanece en el espacio local. Los enlaces internos conservan la ruta de origen; los filtros reemplazan su entrada de historial sin perder ese origen. El test detectó y permitió corregir el retorno a `/demo?municipio=algete`, que se trataba erróneamente como origen no local. Retorno a colección municipal, grupo y cuaderno filtrado verificado en ambos motores.
- Separación: el repositorio real rechaza `identificationMethod=model/guided` aunque el pendiente carezca de modelo/candidatos. Regresión del rechazo y del guardado manual permitido; los recorridos guardan un pendiente real, recargan y comprueban que no aparece en demo. La importación demo→real sigue rechazada.
- Correcciones/persistencia: fallo al escribir la identificación revierte también el cambio de especie. Foto restaurada conservada al resolver un pendiente y recargar. Cambiar especie/borrar recalcula descubrimientos; cambiar contexto o municipio y volver a pendiente recalcula colecciones. Estas comprobaciones usan IndexedDB real en ambos motores además de la prueba transaccional de adaptador.

Fallos de verificación resueltos: servidor local de la entrega anterior ocupaba 4173 y se detuvo antes de repetir; los nuevos tests de recarga adelantaban la navegación al commit, ahora esperan que cierre la edición o aparezca el encuentro guardado antes de comprobar persistencia. Una ejecución con fuentes antiguas se canceló y se reexportó el índice actualizado; no se cuenta como pasada. El gate de tipos detectó el posible valor ausente al separar la ruta del retorno, corregido con valor vacío explícito. La verificación final completa pasa sin omisiones ni reintentos automáticos.

Pendientes sin cambio: sesiones con participantes, Safari/iPhone físico, calidad de identificación y catálogo/paquete CAMPO. La copia limpia prueba reproducibilidad de V0-UX, no aceptación de CAMPO.
