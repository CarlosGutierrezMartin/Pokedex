# Instrucciones del repositorio

## Objetivo
Construir V0-UX y V0-CAMPO de una colección de fauna en Madrid. Piloto en Algete y San Agustín de Guadalix, jóvenes/adultos, iPhone 14 autónomo. Alcance canónico: [producto](docs/01-producto-y-alcance.md). V1 iOS/Android es una dirección futura, no una tarea actual.

## Contexto mínimo
1. Leer [ESTADO](docs/ESTADO.md) y la tarea actual del [plan](docs/06-plan-de-ejecucion.md).
2. Leer solo los documentos indicados para esa tarea y las instrucciones aplicables del repositorio.
3. Inspeccionar archivos existentes antes de crear o reemplazar; conservar cambios del usuario.
4. Instrucción explícita reciente del usuario prevalece sobre estas decisiones. Registrar únicamente cambios materiales.

## Autonomía y foco
- Una vez solicitada implementación, continuar tareas desbloqueadas sin aprobación por cada archivo o fase.
- Resolver detalles reversibles con criterio. No convertir cada duda de estilo en pregunta.
- Pedir intervención solo por acceso/hardware realmente necesario, conflicto material de alcance, gasto, publicación o riesgo de pérdida de datos reales. Preparar primero la opción concreta.
- Ante fallo de un gate: diagnosticar y corregir; nunca marcarlo pasado ni ampliar alcance para ocultarlo. Continuar trabajo independiente útil.
- No publicar, añadir telemetría remota, gastar dinero, subir fotos personales ni mutar Supabase remoto sin autorización específica.
- No introducir agentes adicionales salvo petición expresa. No implementar 3D, nube, cuentas sociales ni entrenamientos grandes en V0.

## Forma de trabajo
- Especificación corta → implementación de una capacidad completa → comprobaciones relevantes → evidencia.
- No generar nuevos PRD/planes paralelos por defecto. Cambiar el documento que sea fuente de verdad.
- Dominio en TypeScript puro; UI, IndexedDB, cámara e inferencia como adaptadores. Un único proyecto, sin microservicios ni monorepo inicial.
- Versiones compatibles verificadas al instalar; un lockfile. No usar dependencias beta sin necesidad demostrada.
- `rg` primero; agrupar lecturas independientes. Evitar volcados completos, logs enormes y exploración repetida.
- Datos de demostración e inferencia real tienen indicadores y almacenamiento separados.
- La IA propone; la persona confirma. Nunca convertir la confirmación en certificación científica.
- No inventar cobertura local, imágenes autorizadas, exactitud del modelo, pruebas físicas ni benchmarks.

## Harness implementado en T00
Scripts disponibles en `package.json`; ampliar sus comprobaciones con cada capacidad:
- `npm run dev`: desarrollo local.
- `npm run check`: tipos + lint + reglas de datos + pruebas de dominio.
- `npm run build`: build de producción.
- `npm run preview:local`: servir build con HTTPS local según guía creada en T00.
- `npm run test:e2e`: recorridos Playwright críticos sobre build de producción.
- `npm run verify`: check + build + e2e. No incluye pruebas físicas del iPhone.

## Verificación proporcionada
- Tests de invariantes, transacciones, contratos, recuperación y recorridos; no tests que copian la implementación ni objetivos de cobertura arbitrarios.
- Un cambio cosmético se revisa visualmente; ejecutar más pruebas solo si toca comportamiento o hay una regresión concreta.
- Comprobar estados de error además del camino feliz. Playwright WebKit no equivale a Safari en un iPhone real.
- Usar fixtures pequeños reproducibles. No descargar GBIF entero ni pesos de modelos sin presupuesto de tamaño.
- Antes de cerrar un hito, revisar el diff y documentar los fallos materiales corregidos.

## Continuidad
Actualizar ESTADO al cerrar una tarea o detectar un bloqueo: resultado, comando/evidencia, limitación y siguiente acción. Mantenerlo corto. No guardar transcripciones ni razonamientos internos.
Una tarea solo es completa con su evidencia. El estado pendiente de hardware no se convierte en aprobado por pasar CI.
