# 04 · Arquitectura de V0

## Stack elegido

| Parte | Elección | Motivo |
| --- | --- | --- |
| UI | React + TypeScript estricto + Vite | Iteración visual rápida y ecosistema conocido |
| Rutas | React Router, modo declarativo | Retorno, enlaces y estado de navegación sin framework de servidor |
| Estilo | CSS con variables/tokens y módulos | Identidad propia, pocas dependencias y coste de contexto bajo |
| Persistencia | IndexedDB mediante Dexie | Transacciones y blobs locales |
| Validación | Zod en manifiestos/importaciones | Rechazar datos incompatibles en fronteras |
| Offline | vite-plugin-pwa con service worker | Empaquetado controlado y apertura offline |
| IA | Adaptador intercambiable; runtime decidido en prueba T01 | Evitar casar el producto con un modelo sin evaluar |
| Calidad | ESLint, TypeScript, Vitest, Testing Library, Playwright | Feedback por comportamiento y recorrido |
| Entorno | Node LTS compatible + npm, lockfile | Reproducibilidad sin otro gestor |

Resolver versiones estables compatibles al implementar; fijar Node y dependencias. No usar “latest” en cada ejecución. Next.js/SSR no aportan valor al piloto local. No Tailwind/shadcn obligatorios, Redux, Storybook ni backend propio por defecto. Una página local de escenarios sustituye un catálogo de componentes separado.

## Organización prevista
Un único proyecto con `src/domain`, `src/features`, `src/adapters`, `src/ui` y `src/test-support`. El dominio no importa React, DOM, Dexie, cámara ni SDKs de modelos. No crear paquetes npm ni contenedores solo por esta separación.

Puertos mínimos, no framework de inyección: ObservationRepository (operaciones atómicas/exportación), CameraSource (captura), Identifier (candidatos), LocationSource (contexto) y PackRepository (contenido listo). Implementaciones directas por composición. Identificador demo solo en espacio demo; real no cae al demo por error.

Tres capas de datos en el iPhone:
1. Recursos de aplicación y modelos instalados/cacheados.
2. Catálogo/colecciones de solo lectura por versión.
3. Perfil, fotografías y observaciones mutables en IndexedDB.

El Mac importa/revisa catálogo y sirve la instalación local. No participa en la inferencia de campo. No hace falta arrancar Supabase ni Docker para probar UX.

## Instalación privada y offline
Crear una guía Mac→iPhone para servir el build de producción por HTTPS en una red de confianza, con certificado local aceptado por el iPhone. No basta `http://192.168...`; no desactivar seguridad del navegador. No abrir puertos a internet ni desplegar un túnel externo sin petición.

La primera preparación necesita conectarse al servidor local. Al terminar, el iPhone conserva app, pesos y assets. “Listo para salir” exige comprobar todos los recursos y una inferencia de calentamiento real. Desconectar Wi-Fi y datos y apagar servidor Mac para aceptación. Guardar solo fotos para analizarlas en casa no cumple V0-CAMPO.

Manifest de paquete: versión, schemaVersion, ficheros/tamaños/checksums, modelo y taxonomía asociados, fuente/licencia, lista de especies soportadas y estado de revisión. Instalación por staging: descargar, verificar, activar; si falla mantener paquete anterior. No autoactualizar una sesión de captura abierta. La app muestra versión y actualización pendiente.

Cachear pesos explícitamente y verificar límites reales del plugin; no asumir que el precache incluirá ficheros grandes. No CDN, fuentes, mapas ni API remotos en runtime. Si un recurso crítico no está, explicar y no mostrar offline ready.

Solicitar almacenamiento persistente cuando proceda, consultar espacio y manejar rechazo/expulsión. Preparar backup local: una PWA no garantiza conservación eterna. Ningún service worker debe interceptar resultados simulados como predicciones reales.

## Rendimiento y cámara
Separar frecuencia de dibujo, detección e identificación. Un worker o ejecución no bloqueante compatible procesa el modelo; no lanzar múltiples inferencias simultáneas. Cancelar/ignorar resultados de un encuadre anterior mediante requestId. Al ocultar la app o salir del escáner, detener cámara y trabajo; reanudar sin perder borrador.

Comprimir/crear miniaturas antes de persistir; mostrar tamaño. Cargar cámara/modelos cuando se necesitan. El calentamiento y la descarga se comunican, no se disfrazan de análisis de imagen.

## Local ahora, móvil después
Reutilizables: reglas TS, esquemas, catálogo, colecciones, fixtures y tests de dominio. Adaptables: repositorio, inferencia y permisos. UI DOM/CSS, service worker e IndexedDB no son código nativo reutilizable automáticamente.

La ruta futura preferida es React Native + Expo con builds de desarrollo y módulos nativos donde hagan falta. No se implementa hasta evaluar V0 y revisar el requisito multiplataforma. Si Safari bloquea el escáner autónomo, documentar prueba y proponer un spike nativo acotado; no reescribir toda la app sin una decisión material del usuario.

## Datos y privacidad
Sin analítica externa ni cuentas en V0. Fotos/GPS permanecen en el dispositivo; importar/exportar es una acción visible. Eventos de prueba guardan tipo de pantalla, duración y error, no fotos, coordenadas exactas ni texto sensible. Un perfil local no equivale a una cuenta autenticada segura: esa frontera se resuelve en V1.
