# 07 · Validación y evidencia

Las cifras son objetivos iniciales del piloto, no mediciones ya obtenidas. No simular evidencia. Las pruebas de aceptación comprueban resultados y regresiones, sin buscar cobertura total de código.

## Matriz mínima

| Caso | Requisitos | Comprobación |
| --- | --- | --- |
| A01 | R01, R02, R03 | Perfil local, navegar/buscar/filtrar y estados vacío/pendiente/descubierto |
| A02 | R04, R05, R12 | Confirmar guarda observación+foto; pendiente conserva evidencia sin desbloquear especie |
| A03 | R05, R06 | Doble toque/reintento mismo operationId genera una observación; nuevo encuentro genera otra y una especie |
| A04 | R02, R07 | Reglas de municipio/contexto/fecha; corregir y borrar recalcula progreso y primer encuentro |
| A05 | R08 | Exportar/restaurar preserva fotos y recuentos; archivo inválido no altera perfil existente |
| A06 | R09 | Demo separada; nunca predicción demo o fixture contaminando perfil real |
| A07 | R10 | Arranque frío offline tras instalación completa, sin depender del Mac |
| A08 | R11, R12 | Modelo local real, bbox/manual, desconocido, varios animales, cancelar sin resultado obsoleto |
| A09 | R13, R14 | Sin permisos funciona la alternativa; foto antigua no toma GPS actual; fecha/lugar desconocidos preservados |
| A10 | R10 | Paquete incompleto no se activa; actualización fallida mantiene anterior; espacio insuficiente recuperable |
| A11 | R14 | Controles legibles/táctiles, foco, safe areas, movimiento reducido y contraste |
| A12 | R15 | Feedback/eventos exportables localmente, sin fotografías ni GPS en el registro de diagnóstico |

## Automatización
- Vitest: reglas de descubrimiento/colección, idempotencia y predicados con fechas desconocidas. Incluir casos negativos realmente distintos.
- Persistencia: tests de transacción fallida, versión/importación y vínculos de blobs. Probar al menos los recorridos críticos en IndexedDB real del navegador además del adaptador en tests.
- Playwright sobre build de producción: A01, A02, A03, A05, A06 y offline de app/paquete con recursos de prueba. Chromium y un smoke WebKit; los mocks de cámara/ML se identifican explícitamente.
- No afirmar precisión ML porque pase un mock. No afirmar compatibilidad iPhone porque pase emulación de tamaño o Playwright WebKit.
- Verificación visual de bienvenida, exploración, tarjeta, escáner, duda y revelación; 390 × 844 CSS px como viewport inicial, más pantalla estrecha. Registrar tamaños reales del dispositivo al probarlo.
- Ejecutar suite completa al cerrar hito; durante cambios ejecutar la parte afectada. No repetir todo por una errata.

## Prueba física iPhone 14
Registrar modelo, versión iOS/navegador, build, pack, modelo IA y fecha. Nunca asumirlos desde emulación.
1. Instalar desde HTTPS local y completar preparación. Probar permisos con usuario real.
2. Cerrar la PWA, apagar servidor Mac, quitar Wi-Fi y datos móviles, reabrir desde pantalla de inicio.
3. Capturar e identificar localmente un ejemplo admitido; confirmar, consultar ficha, cerrar/reabrir y ver foto/progreso.
4. Probar una imagen no admitida, contexto desconocido y selección manual del animal.
5. Hacer 20 identificaciones para latencia; medir primera y posteriores. Sesión continua 10 minutos y una pausa/reanudación.
6. Exportar backup. Anotar cualquier recarga, bloqueo, crecimiento de almacenamiento o calor molesto.

La ubicación se prueba además en exterior sin conexión; si no se obtiene, la alternativa manual debe seguir funcionando. No prometer GPS instantáneo. Pruebas de fauna se hacen a distancia y sin provocar comportamientos.

Gates CAMPO: criterios de [05](05-escaner-y-modelos.md), A07–A10 físicos relevantes, cero pérdida de observaciones confirmadas en el protocolo y ninguna conexión saliente necesaria en runtime. Verificación de tráfico y arranque sin red, no solo un icono “offline”.

## Sesión UX, 3–5 participantes adultos
Cinco tareas sin dirigir clics: entrar; encontrar colección municipal; realizar descubrimiento demo; localizar su foto; corregir observación y exportar copia. Preguntar qué creen que hizo realmente la IA y si confunden colección con cuaderno.

Registrar: completada/no, ayuda necesaria, duración, errores y comentario breve. Objetivo orientativo: al menos 4 de 5 tareas sin ayuda por persona y cero bloqueos sin recuperación. Con muestra pequeña no presentar significación estadística. Priorizar patrones y problemas concretos.

Eventos locales mínimos: session_started, collection_opened, scanner_opened, capture_taken, candidates_shown, observation_saved, recovery_used. Añadir source=demo/real, build y duraciones; no contenido sensible. Desactivar/limpiar desde ajustes.

## Evidencia compacta
Al implementar, crear `docs/evidencia/ux.md` y `docs/evidencia/campo.md` solo cuando haya resultados. Incluir: commit/build, comandos y resultado resumido, capturas pertinentes, dispositivo, limitaciones, defectos corregidos y pendientes. Resultados cuantitativos en CSV/JSON pequeño si ayudan a reproducirlos. No transcripciones enormes ni capturas con datos personales innecesarios.

Un gate pendiente de una persona permanece pendiente. Codex prepara pasos y recoge resultados; no declara observaciones que no ha visto. Hallazgos de UX ajustan 02; cambios a criterios de aceptación se registran en 09 con razón, nunca para ocultar un fallo.
