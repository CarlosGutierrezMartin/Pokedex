# 08 · Dirección de la aplicación final iOS y Android

**Documento de límites y evolución. No es backlog autorizado para V0.** Producto futuro para público general; la comercialización es una posibilidad, no un requisito del piloto.

## Qué cambia de verdad

| Área | V0 de prueba | App final |
| --- | --- | --- |
| Distribución | Instalación privada y paquete local | Instalación/actualización iOS y Android, publicación y soporte |
| Público | Jóvenes/adultos del piloto | Audiencia general; definir edades y experiencia para familias antes del lanzamiento |
| Identidad | Perfil del dispositivo | Cuenta recuperable, uso invitado, sincronización y eliminación/exportación |
| Territorio | Madrid, dos municipios de pruebas | España por paquetes, grupos y cobertura contrastada |
| IA | Candidato local evaluado en iPhone 14 | Matriz de móviles, modelos optimizados/versionados y límites comunicados |
| Datos | Catálogo curado pequeño | Ingesta incremental, revisión editorial, licencias, taxonomía cambiante |
| Persistencia | IndexedDB y backup local | Base móvil durable, sincronización con conflictos y migraciones |
| Operación | Diagnóstico local | Monitorización, costes, atención y versiones recuperables |

## Ruta técnica preferida, revisable
React Native + Expo como punto de partida multiplataforma, con development builds cuando se necesiten módulos nativos de cámara/inferencia. No asumir Expo Go suficiente. Evaluar Core ML/LiteRT/ONNX Mobile según modelos y soporte; no prometer misma aceleración o calidad en todos los Android.

Reusar dominio TypeScript, esquemas, contenido, reglas y pruebas. Rehacer/adaptar UI móvil, cámara, permisos, almacenamiento y ciclo de vida. Una PWA no se vuelve nativa por copiar sus archivos; tampoco se promete reutilización de un porcentaje fijo.

Supabase puede apoyar Auth, PostgreSQL/PostGIS, Storage y políticas de acceso, después de inspeccionar esquema y diseñar seguridad. Primera arquitectura backend modular sencilla; no microservicios por anticipación. Modelos y paquetes estáticos distribuidos por almacenamiento/CDN; inferencia local reduce dependencia online. Si se añade inferencia remota opcional, requiere decisión sobre consentimiento, costes y privacidad.

## Escalabilidad por evidencia
- Medir tamaño de paquetes, actividad, consultas, coste por usuario y descargas antes de ampliar infraestructura.
- Versionar catálogo y colecciones; resolver sinónimos y fusiones taxonómicas sin borrar recuerdos.
- Sincronización idempotente con colas locales, tombstones/conflictos definidos y pruebas entre dispositivos; no confiar en last-write-wins para todo.
- Proteger fotos/coordenadas y separar observaciones personales de evidencia pública. No crear rankings científicos a partir de confirmaciones sin validar.
- Operación con monitorización mínima y recuperación, no una plataforma de observabilidad antes de tener usuarios.

## Oportunidades posteriores a validar
Colecciones estacionales, expediciones cooperativas, sonido, accesibilidad ampliada, mejoras de fotografía, contenidos por hábitat y biblioteca 3D. Rankings públicos, monetización y funciones sociales necesitan hipótesis de valor propias. No basta con que sean posibles.

## Proyecto 3D independiente
Piloto de tres animales con anatomías distintas. Referencias con derechos adecuados → malla → revisión anatómica → texturas → optimización → animación → exportación glTF/GLB. Guardar autoría, licencia, taxón, sexo/edad representados y versión de revisión.
El MCP de Blender facilita operaciones; no garantiza reconstrucción ni fidelidad. Sus integraciones de generación pueden usar servicios externos. Muchas imágenes de distintos individuos no equivalen a fotogrametría de un sujeto estable.
Los assets aprobados pueden producir fichas, siluetas y animaciones. No deben bloquear V0 ni convertirse automáticamente en imágenes de entrenamiento/evaluación.

## Cuándo abrir V1
Después de evidencia de uso repetido, problemas UX principales resueltos, ruta de inferencia móvil viable y decisión explícita sobre inversión/publicación. Preparar entonces un plan propio con objetivos de escala y costes reales. No fijar aquí precios, servidores ni requisitos legales detallados para un producto aún no definido.
