# Fauna: paquete de trabajo para Codex

Versión de definición: 0.1 · 7 de octubre de 2026. Nombre de trabajo, no marca final.

Este paquete especifica el producto y el trabajo; **no contiene una app implementada ni un modelo validado**. Copiar su contenido a la raíz del repositorio del proyecto, conservando `docs/`. Si ya existen instrucciones, integrarlas sin sobrescribir trabajo ajeno. No se ha inspeccionado la base Supabase del compañero.

## Decisión de desarrollo

**SDD ligero + harness mínimo.** Una especificación breve define resultados observables; Codex implementa recorridos completos y los verifica con herramientas reproducibles. No instalar Spec Kit, BMAD, orquestadores de agentes ni un sistema de gobierno propio para este piloto. El valor está en instrucciones claras, contexto selectivo y feedback rápido, no en más ceremonias.

| Entrega | Para qué sirve | Qué no demuestra |
| --- | --- | --- |
| V0-UX: prototipo PWA local | Funcionalidades, navegación, estética y jugabilidad; admite demostración explícita | Precisión real del identificador |
| V0-CAMPO: mismo piloto, inferencia real local | Experiencia autónoma en iPhone 14, sin Mac ni red tras preparar el paquete | Preparación para publicación masiva |
| V1: aplicación iOS/Android futura | Público general, catálogo ampliable, distribución y operación comercial potencial | No se implementa en este encargo |

V0-UX es un hito utilizable, no sustituye V0-CAMPO. Si la inferencia web no pasa la prueba, se documenta el bloqueo y se propone una alternativa móvil acotada; no se anuncia completado el piloto autónomo.

## Archivos y lectura selectiva

| Archivo | Fuente de verdad |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Cómo trabaja Codex y cuándo debe detenerse |
| [01-producto-y-alcance.md](docs/01-producto-y-alcance.md) | Requisitos y frontera V0/V1 |
| [02-ux-ui-y-jugabilidad.md](docs/02-ux-ui-y-jugabilidad.md) | Pantallas, estados y dirección visual |
| [03-datos-y-colecciones.md](docs/03-datos-y-colecciones.md) | Datos, adquisición y reglas de progreso |
| [04-arquitectura.md](docs/04-arquitectura.md) | Stack, límites y funcionamiento local |
| [05-escaner-y-modelos.md](docs/05-escaner-y-modelos.md) | Viabilidad y contrato de identificación |
| [06-plan-de-ejecucion.md](docs/06-plan-de-ejecucion.md) | Orden, dependencias y entregables |
| [07-validacion.md](docs/07-validacion.md) | Aceptación, pruebas y sesiones de usuario |
| [08-app-movil-futura.md](docs/08-app-movil-futura.md) | Evolución futura, expresamente fuera de V0 |
| [09-decisiones-y-fuentes.md](docs/09-decisiones-y-fuentes.md) | Motivos, supuestos y referencias oficiales |
| [ESTADO.md](docs/ESTADO.md) | Progreso real, evidencia y siguiente acción |

No leer todos los documentos en cada tarea. Empezar por AGENTS, ESTADO y la fila de tarea correspondiente.

## Prompt de arranque

Copiar en Codex desde la raíz del repositorio:

```text
Implementa la V0 descrita en este repositorio. Lee AGENTS.md, docs/ESTADO.md
y docs/06-plan-de-ejecucion.md; carga los demás documentos solo según la tarea.
Empieza por T00 y avanza por las tareas desbloqueadas, con verificación automática
y sin pedir confirmación para decisiones reversibles dentro del alcance.
Entrega pronto V0-UX y continúa hacia V0-CAMPO. No implementes V1.
Mantén distinguibles demostración y reconocimiento real. No finjas pruebas
en el iPhone. Si necesitas una comprobación física, prepara el procedimiento
y continúa las tareas independientes. No publiques, contrates servicios ni
modifiques el Supabase existente. Registra evidencia y siguiente paso en ESTADO.
```

## Prompt para continuar o revisar

```text
Continúa desde docs/ESTADO.md y la siguiente tarea desbloqueada del plan.
Comprueba el estado real del repositorio antes de repetir trabajo. Actualiza
solo decisiones afectadas y ejecuta las verificaciones pertinentes.
```

Para revisión: pedir una revisión del diff contra los criterios de la tarea, centrada en defectos concretos; no solicitar una nueva arquitectura completa. No hace falta cambiar de modelo o sesión para cada pantalla.

## Uso de modelos y tokens

- Un agente principal y un buen modelo de programación. Razonamiento más intenso en arquitectura, inferencia, persistencia y fallos difíciles; ajuste normal para UI y cambios acotados.
- No fijar nombres de modelos que dependan de la cuenta. Usar los disponibles en Codex; no añadir una API de LLM a la aplicación.
- Una revisión acotada al cerrar cada hito, no una cadena de revisores por archivo.
- Contexto por tarea, búsquedas dirigidas, resúmenes cortos de evidencia y versiones fijadas. Sin reescribir documentos completos para registrar un cambio menor.
- No prometer ahorro porcentual de tokens. Medir iteraciones y retrabajo; simplificar si el proceso supera el trabajo de producto.

## Qué se necesita del equipo

MacBook Air 2023 para desarrollo e iPhone 14 para pruebas físicas. Confirmar versión real de iOS y memoria disponible durante T00; no bloquear las pantallas por ello. El propietario realizará las pruebas de cámara/campo que Codex no pueda ejecutar físicamente. No hay servicios de pago ni publicación autorizados por este paquete.
