# 01 · Producto y alcance

## Propósito
Hacer agradable explorar fauna real, reconocerla y coleccionar encuentros. Inspiración: accesibilidad de Seek y sensación de exploración/progreso de Pokémon GO. Identidad gráfica, sonidos, textos y nombre propios.

Decisiones del usuario: piloto local, autónomo en iPhone 14, desarrollo en MacBook Air 2023, Madrid con primeras salidas en Algete y San Agustín de Guadalix; domésticos permitidos; catálogo ampliable; app final iOS/Android para público general. Se elimina el radio obligatorio de 10 km.

## Versiones

| Dimensión | V0-UX | V0-CAMPO | V1 futura |
| --- | --- | --- | --- |
| Objetivo | Refinar funcionalidad y UX/UI rápidamente | Validar recorrido real sin conexión | Producto distribuido y operable |
| Acceso | Navegador/PWA local; controles de prueba | PWA instalada y paquete preparado | iOS/Android, distribución por decidir |
| Identificación | Demostración explícita + entrada manual; real cuando disponible | Inferencia real en el teléfono, con abstención | Cobertura y rendimiento por grupos/dispositivos |
| Usuarios | Perfil local y espacios separados de prueba | Mismo perfil local | Cuentas/sincronización recuperables |
| Catálogo | Fixtures y contenido revisado disponible | 20–30 fichas objetivo, cobertura de modelo declarada | España por paquetes/versiones |
| Red durante uso | No necesaria tras preparación | No necesaria, tampoco para IA | Núcleo offline y servicios opcionales |
| Evidencia | Pruebas UX y automatizadas | También pruebas físicas de campo | Además matriz móvil, operación y publicación |

V0 es un único producto con dos hitos. No se necesita terminar el modelo para mostrar UX; no se puede aprobar V0-CAMPO usando el modo demo. Ampliar el catálogo no implica que el modelo reconozca todas sus especies.

## Requisitos observables

| ID | Requisito | Entrega |
| --- | --- | --- |
| R01 | Abrir, crear perfil local y explorar sin email/contraseña | UX |
| R02 | Consultar colecciones, filtrar por grupo/municipio y ver progreso | UX |
| R03 | Ver siluetas pendientes y tarjetas propias descubiertas | UX |
| R04 | Guardar una observación manual o pendiente sin inventar especie | UX |
| R05 | Confirmar una sugerencia crea observación y actualiza colección una sola vez | UX |
| R06 | Repetir encuentro suma historial, no duplica especie ni recompensa inicial | UX |
| R07 | Corregir/eliminar una observación recalcula progreso coherentemente | UX |
| R08 | Exportar/restaurar perfil, fotos y observaciones de forma local | UX |
| R09 | Probar estados demo sin contaminar colección real ni métricas de IA | UX |
| R10 | Instalar paquete y abrir tras cierre sin internet ni Mac | CAMPO |
| R11 | Usar cámara, encuadre automático/manual e identificación real local | CAMPO |
| R12 | Permitir rechazo, alternativas o pendiente; nunca registro automático | CAMPO |
| R13 | Registrar lugar/fecha del encuentro con fuente y precisión, o desconocidos | UX/CAMPO |
| R14 | Funcionar sin permiso de ubicación; respetar movimientos reducidos y legibilidad | UX |
| R15 | Recoger feedback y eventos locales exportables sin enviar fotos ni GPS | UX |

## Reglas de producto
- El descubrimiento personal persiste al cambiar de municipio. La visibilidad local no prueba presencia actual.
- Nombre + silueta + pista antes del descubrimiento; información básica educativa accesible. Revelar tarjeta personal e historial al descubrir. Decisión reversible a evaluar.
- Confirmación del usuario permite progreso personal; mostrar por separado origen manual/IA y certeza. Sin validación científica implícita.
- Domésticos/cautividad no desbloquean objetivos silvestres. No hay colección de razas en V0.
- Toda observación puede conservarse pendiente; no cuenta como especie hasta resolverla.
- Sin competir por rareza, persecución o coordenadas precisas. Las misiones se completan mediante encuentros reales.

## Incluido en el piloto
Cuatro destinos principales, 5 colecciones iniciales, ficha, cuaderno, escáner, permisos, errores, modo demo, ayuda, ajustes mínimos y copia local. Identificación guiada limitada a preguntas discriminantes curadas para un máximo de 3 pares de especies cuando existan datos; no un motor experto general.

## Fuera de alcance
Mapa continuo estilo juego, aparición de animales virtuales, AR espacial, 3D, audio identificador, chat, feed social, ranking público, pagos, anuncios, GPS en segundo plano, cuentas remotas, compartir ubicaciones, ingesta nacional completa y backend de producción. La app futura se trata en [08](08-app-movil-futura.md).

## Éxito
V0-UX: una persona entiende qué hacer, completa un descubrimiento demo, encuentra su historial y comprende el progreso sin explicación constante. V0-CAMPO: mismo recorrido con datos reales y sin red, dentro de los límites medidos del modelo. Criterios operativos en [07](07-validacion.md).
