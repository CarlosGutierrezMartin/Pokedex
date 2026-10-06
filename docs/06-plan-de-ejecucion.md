# 06 · Plan de ejecución

## Método
SDD ligero: requisitos Rxx de [01](01-producto-y-alcance.md), contratos y criterios escritos antes de implementar. Harness mínimo: instrucciones, comandos reproducibles, fixtures, tests y evidencia de pantalla/dispositivo. No hace falta adoptar un framework ceremonial para aplicar ambos.

Un agente principal. Trabajo por capacidades completas, no semanas de infraestructura. La especificación inicial se lee una vez por área; cambios posteriores por diff. No una revisión ni aprobación humana por cada documento. Una revisión acotada al cerrar UX y otra al cerrar CAMPO. Uso de modelos fuertes disponible, sin conmutación automática ni equipos de agentes por defecto.

## Orden y tareas

| Tarea | Dependencias | Leer además de AGENTS/ESTADO | Entregable y condición de cierre |
| --- | --- | --- | --- |
| T00 · Base ejecutable | Ninguna | 01, 04, 07 | Proyecto instalado, versiones fijadas, pantalla inicial, scripts del harness con smoke test real, guía HTTPS Mac→iPhone y modo demo visible |
| T01 · Viabilidad móvil | T00 | 05, 07 | Artefactos/modelos exactos, mini pantalla técnica, resultados de ordenador y protocolo iPhone; estado viable/no viable/pendiente de dispositivo |
| T02 · Recorrido UX completo | T00; no esperar T01 | 01, 02 | Explorar→colección→captura demo→confirmar→tarjeta→cuaderno, filtros y estados. Datos de ejemplo separados |
| T03 · Persistencia y reglas | T02 | 03, 07 | Confirmación atómica/idempotente, edición/borrado, progreso, perfil y fotos; exportación/restauración con pruebas |
| T04 · Catálogo y paquete | T00; coordinar selección con T01 | 03, 05 | Paquete versionado, fuentes/licencias, selección curada, validación y cobertura declarada; fixtures UX no se presentan como fauna verificada |
| T05 · Entrega V0-UX | T02, T03 | 02, 07 | Build instalable local, panel escenarios, pruebas automáticas UX, instrucciones para 3–5 participantes; revisión de errores bloqueantes |
| T06 · Cámara e IA real | T01 viable, T03, T04 | 04, 05 | Cámara real, bbox/manual, clasificación local, errores/cancelación y confirmación; ausencia de llamadas externas |
| T07 · Offline y resistencia | T04, T06 | 04, 07 | Instalación/actualización de paquete sin corrupción, arranque frío offline, backup, fallos de espacio y persistencia |
| T08 · Campo y cierre | T05, T07 y dispositivo | 07 | Evidencia física de iPhone, feedback consolidado, correcciones principales y estado honesto de aceptación |

Ejecutar secuencialmente por defecto. Si T01 requiere manos del usuario, marcar pendiente de hardware y avanzar T02–T05 y partes independientes de T04. Esto no autoriza T06 sin modelo viable ni afirmar autonomía. Preparar una única solicitud concreta de prueba física cuando sea útil; no preguntar repetidamente por lo mismo.

T05 puede entregarse antes de completar todo el contenido curado. En tal caso no presentar esas fichas como datos reales ni cerrar T04. La prueba UX no necesita una carga nacional ni administración remota.

## Resultados de T01
- Viable: continuar con candidato único fijado; no seguir comparando por curiosidad.
- Pendiente físico: evidencia de escritorio no sustituye teléfono. Dejar procedimiento y continuar independientes.
- No viable tras máximo dos candidatos/una optimización: conservar UX y preparar propuesta concreta de spike React Native/Expo con inferencia nativa. Requiere decidir cambio de plataforma, no alargar indefinidamente conversiones web.

## Bucle por tarea
1. Inspeccionar el estado real y leer únicamente fuentes relevantes.
2. Hacer un plan breve dentro de la tarea si hace falta; no crear otro documento de planificación.
3. Implementar el recorrido más pequeño que satisface los criterios, incluyendo error/recuperación.
4. Ejecutar verificación relevante. Corregir fallos de esa tarea; no esconderlos desactivando tests.
5. Actualizar ESTADO y continuar con la siguiente tarea desbloqueada.

## Presupuesto de complejidad
- Un repositorio, una app, un gestor de paquetes y un único lockfile.
- Sin CMS, autenticación remota, microservicios, colas, Kubernetes ni sistema de agentes dentro de la app.
- Máximo un documento nuevo de evidencia por hito y datos de benchmark compactos; no informes extensos por cada componente.
- No escribir test unitario para cada clase CSS; sí conservar una captura de estados representativos y tests de invariantes.
- No entrenar desde cero. No descargar pesos gigantes antes de comprobar tamaño/licencia/cobertura.
- Si una librería no resuelve una necesidad actual, no incorporarla “para escalar”.
- No estimar fechas ni tokens con precisión ficticia. Mostrar tareas terminadas, bloqueos y retrabajo.

## Qué implica terminar
V0-UX terminada: criterios automáticos de UX satisfechos, accesible localmente y revisión visual realizada; resultados con participantes se registran aparte. V0-CAMPO terminada: además pasan gates de identificación y dispositivo. Si solo una está lista, decir exactamente cuál. V1 no se inicia por inercia.
