# 09 · Decisiones, supuestos y fuentes

Fecha de consulta: 7 de octubre de 2026. Estas referencias fundamentan capacidades; no prueban resultados del proyecto. Abrir de nuevo solo la documentación afectada si cambia una versión o se implementa una integración.

## Registro de decisiones

| ID | Decisión | Motivo y condición de revisión |
| --- | --- | --- |
| D01 | SDD ligero + harness mínimo | Evitar ambigüedad sin añadir burocracia. Revisar solo si falta feedback o reproducibilidad |
| D02 | PWA para V0 con gates UX/CAMPO separados | Iterar interfaz pronto, preservar autonomía exigida sin fingir inferencia |
| D03 | React/TS/Vite + CSS + Dexie | Stack pequeño con dominio portable. Reconsiderar plataforma si falla el spike iPhone |
| D04 | Modelo local seleccionado mediante experimento acotado | Pesos, etiquetas, licencia y rendimiento aún desconocidos; no prometer un modelo por su nombre |
| D05 | Sin radio obligatorio de 10 km | Evitar que ausencia de registros o movilidad borren posibilidades/progreso |
| D06 | Silueta con nombre/pista | Facilita objetivos comprensibles. Reversible tras sesiones UX |
| D07 | Progreso derivado de observaciones | Un origen de verdad; correcciones/eliminaciones coherentes |
| D08 | Demo y real separados | Testear UX sin confundir rendimiento científico o progreso |
| D09 | Perfil local y backup | Sin coste/auth remotos; no equivalente a identidad multiusuario de producción |
| D10 | React Native/Expo preferido para V1 | iOS/Android y módulos nativos; es dirección, no migración ya validada |

## Lo fijado por el usuario
Comunidad de Madrid; Algete/San Agustín como prueba; iPhone 14 autónomo; MacBook Air 2023; adultos/jóvenes para piloto; app final público general iOS/Android; domésticos incluidos; diseño inmersivo con inspiración Pokémon; eficiencia de tiempo/tokens con modelos de desarrollo capaces.

## Propuestas por defecto, modificables
20–30 fichas, cinco colecciones, estética coral/turquesa, PWA, perfiles locales, umbrales de evaluación y lectura progresiva de documentos. La autorización para elegir decisiones técnicas viene del encargo; no se presentan como resultados de pruebas.

## Pendientes que no bloquean toda la ejecución
Versión iOS, memoria/configuración exacta del Mac, licencias y artefactos de modelos, cobertura local de especies, esquema real de Supabase y disponibilidad de participantes. T00/T01/T04 resuelven lo necesario. No exigir tener todas las respuestas para empezar UX.

## Fuentes oficiales y primarias

| Fuente | Uso limitado en estas decisiones |
| --- | --- |
| [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md) | Instrucciones persistentes por repositorio |
| [Iterating Development Workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) | Contexto, planes y evidencia como convenciones adaptables; no copiamos sus gates humanos por fase |
| [Vite](https://vite.dev/guide/) | Base de desarrollo React/TypeScript |
| [Vite PWA](https://vite-pwa-org.netlify.app/guide/) | Integración del service worker y caché |
| [Dexie transactions](https://dexie.org/docs/Dexie/Dexie.transaction()) | Escrituras locales atómicas |
| [Playwright emulation](https://playwright.dev/docs/emulation) | Pruebas de navegación/emulación, distintas de hardware real |
| [MediaPipe Object Detector web](https://ai.google.dev/edge/mediapipe/solutions/vision/object_detector/web_js) | Detección con bbox; tareas síncronas requieren cuidar bloqueo de UI |
| [ONNX Runtime Web](https://onnxruntime.ai/docs/get-started/with-javascript/web.html) | Runtime posible; comprobar soporte concreto, no extrapolar aceleración |
| [iNaturalist Vision API](https://github.com/inaturalist/inatVisionAPI) | Disponibilidad de modelos pequeños; los completos no se presuponen públicos |
| [BioCLIP 2 model card](https://huggingface.co/imageomics/bioclip-2) | Candidato de investigación y límites; no elección automática para móvil |
| [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/) | Cuotas, persistencia y expulsión de almacenamiento web |
| [MDN PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching) | Preparación explícita para offline |
| [MDN cámara](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) | Permisos y contexto seguro |
| [GBIF descargas](https://techdocs.gbif.org/en/data-use/api-downloads) | Adquisición estructurada por lotes |
| [MITECO servicios interoperables](https://www.miteco.gob.es/eu/biodiversidad/servicios/banco-datos-naturaleza/informacion-disponible/bdn_recursos_servicios.html) | EIDOS/taxonomía y fuentes españolas |
| [Wikimedia reutilización](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) | Revisión de licencia por asset |
| [Expo código nativo](https://docs.expo.dev/workflow/customizing/) | Ruta futura con módulos nativos y builds locales |
| [Supabase local](https://supabase.com/docs/guides/local-development) | Catálogo de trabajo opcional; no runtime del iPhone |
| [MCP for Blender](https://github.com/ahujasid/mcp-for-blender) | Proyecto comunitario e integraciones de assets; separado de V0 |

## Cómo cambiar una decisión
Añadir fecha, motivo concreto y efecto sobre requisito/tarea; actualizar solo la fuente de verdad afectada. Si cambia plataforma, datos externos, privacidad, gasto o publicación, preparar opciones concretas para el usuario. Ajustes reversibles de UI y librerías compatibles se resuelven sin una nueva ronda de aprobaciones.
