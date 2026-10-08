# Estado de ejecución

Actualizado: 8 de octubre de 2026.

## Situación
V0-UX implementada y verificada automáticamente: recorrido demo, perfiles separados, fotos, edición/borrado, copias, escenarios, feedback local y PWA de interfaz. T01 conserva dos candidatos fijados: Coral Birds ejecuta inferencia sintética en Mac; iNaturalist Small falla por normalización. Calidad e iPhone pendientes; V0-CAMPO no está aprobada. No se ha desplegado la app ni inspeccionado Supabase.

Review V0-UX resuelto: implementación, lockfile, harness y evidencia incluidos en el índice de Git. Reproducidos instalación y verificación desde una copia limpia del índice, sin pesos, runtime ni dependencias previas del workspace.

Código subido por petición del usuario a [CarlosGutierrezMartin/Pokedex](https://github.com/CarlosGutierrezMartin/Pokedex), rama `main`: implementación `e52a095`, integración del historial inicial remoto `a4083be` y push confirmado el 8 de octubre. La integración no cambia el árbol verificado. Dependencias, builds, fotos personales, certificados, runtime y pesos siguen excluidos; los manifiestos y scripts permiten preparar los recursos. GitHub contiene fuentes y evidencia, no un despliegue de la aplicación.

## Tareas

| Tarea | Estado | Evidencia |
| --- | --- | --- |
| T00 | completa | `npm ci --offline --no-audit --no-fund` y `npm run verify` pasan: 4 tests de dominio + 4 E2E Chromium/WebKit; HTTPS 200 con certificado temporal validado. [Evidencia](evidencia/ux.md) |
| T01 | pendiente de dispositivo | [Resultados de escritorio](evidencia/t01-desktop.json): Coral p95 sintético 20,1/22 ms; iNaturalist error explícito. Calidad sin evaluar. [Protocolo](evidencia/campo.md) |
| T02 | completa | Recorrido, filtros y estados; revisión visual a 390/320 px. [Evidencia UX](evidencia/ux.md#t02t03t05--entrega-v0-ux--7-de-octubre-de-2026) |
| T03 | completa | Transacciones/idempotencia, corrección/borrado, fotos y restauración en perfil nuevo; pruebas en IndexedDB Chromium/WebKit |
| T04 | pendiente | Parte necesaria para UX entregada: `fauna-ux-demo@demo-1`, manifiesto, procedencia y SHA-256 validados. Catálogo curado CAMPO sin completar; fixtures sin presencia/cobertura real |
| T05 | completa | Copia limpia del índice: `npm ci --offline --no-audit --no-fund` + `npm run verify`, 26 tests y 22 E2E. Pestaña nueva y guardado con servidor apagado en ambos motores. Guía de participantes preparada; sesiones pendientes |
| T06 | bloqueada | Requiere T01 viable y T04; no se integra inferencia no validada |
| T07 | pendiente | — |
| T08 | pendiente | — |

Estados permitidos: pendiente, en curso, bloqueada, pendiente de dispositivo, completa. Un resultado parcial se describe; no se marca completa la tarea con criterios pendientes.

## Siguiente acción
V0-UX entregada: probar el recorrido según [README](../README.md#probar-v0-ux-en-el-mac) y realizar las sesiones con participantes. Este encargo se detiene aquí. Próximo trabajo CAMPO, si se solicita: completar catálogo curado T04 y prueba física/calidad T01 según [protocolo](evidencia/campo.md). La caché UX no acredita identificación ni paquete CAMPO.

## Bloqueos conocidos
Sin bloqueo para preparar T04. Para el iPhone falta confiar el certificado según [guía HTTPS](04-arquitectura.md#guía-https-maciphone-t00); no se modificó el llavero. Registrar iOS/espacio libre, instalación física y calidad del modelo. Los participantes y la prueba física no se sustituyen por Playwright.

## Última verificación
7 de octubre, corrección del review: desde copia limpia del índice, instalación de 461 paquetes y `npm run verify` aprobados: tipos/lint/datos/build, 26 tests + 22 E2E. Corregidos retorno directo y conservación de filtros de municipio/lista/cuaderno; real rechaza atribución a modelo no aprobado. Pruebas de rollback de corrección, foto corregida/restaurada, progreso tras edición/borrado y aislamiento en ambos motores. Precaché: 22 entradas, 516,26 KiB. `git diff --cached --check` limpio. [Detalle](evidencia/ux.md#corrección-del-review-v0-ux--7-de-octubre-de-2026). Sin commit, push ni publicación; fotos personales, certificados, pesos y runtime fuera del índice. Limitaciones físicas y CAMPO sin cambios.
