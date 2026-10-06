# 02 · UX, UI y jugabilidad

## Dirección
Instrumento de campo retro, cálido y táctil. Animal protagonista, sensación de colección y acciones claras. No reproducir personajes, logotipos, Poké Balls, sonidos ni pantallas exactas de Pokémon. Las referencias de conversación inspiran la dirección; no son assets incluidos ni recursos con permiso de publicación.

## Navegación
Barra inferior: Explorar, Colección, Cuaderno; botón central destacado Escanear. Ajustes en el encabezado. Navegación con rutas y retorno que conserve filtro y posición. No abrir modales encadenados para acciones básicas.

| Pantalla | Contenido y acción principal | Estados necesarios |
| --- | --- | --- |
| Bienvenida | Promesa breve, nombre opcional, entrar; preparar paquete cuando corresponda | Primera visita, progreso existente, demo/real |
| Explorar | Colección sugerida, municipio seleccionado, pista de observación | Sin GPS, datos escasos, paquete incompleto |
| Colección | Tarjetas/siluetas, buscador y filtros de grupo/estado | Vacía, pendiente, descubierta, todos los filtros sin resultado |
| Detalle de colección | Objetivo, lista fija de miembros, progreso y recompensa | Parcial, completa, regla doméstico/silvestre |
| Ficha | Animal, nombres, identificación, hábitat/actividad, taxonomía y mis encuentros | Datos desconocidos, foto ausente, procedencia accesible |
| Escáner | Cámara, marco, selección manual, capturar, subir foto | Cargando, permiso denegado, varios animales, modelo no disponible |
| Resultado | Hasta 3 candidatos, comparación breve, confirmar o dejar pendiente | Duda, fuera de cobertura, error, nuevo/ya descubierto |
| Revelación | Tarjeta, foto propia, colecciones que avanzan | Nuevo o encuentro repetido; omitir animación |
| Cuaderno/detalle | Fotos, fecha/lugar, notas, editar especie/contexto y eliminar | Pendiente, sin foto/GPS, error de guardado |
| Ajustes/prueba | Perfil, paquetes, exportar/restaurar, sonido/movimiento, feedback | Sin espacio, paquete corrupto, copia incompatible |

La revelación sucede después de guardar correctamente. Nunca mostrar “guardado” antes de completar la transacción. Si falla, conservar la captura y ofrecer reintento.

## Recorridos
1. Primera sesión: entrar sin cuenta → elegir colección → escanear o probar demo → confirmar → revelación → volver a colección.
2. Duda: capturar → candidatos insuficientes → guardar pendiente → volver al cuaderno y corregir.
3. Repetición: misma especie → nuevo encuentro → historial, sin celebrar una primera captura inexistente.
4. Sin permisos: explicar motivo al activar función → alternativa subir foto/selección manual de lugar; no insistir con diálogos.
5. Recuperación: exportar → abrir otro espacio local vacío → restaurar → mismo progreso/fotos.

## Jugabilidad V0
- Colecciones iniciales: Primeros encuentros; Vecinos de Algete; Vecinos de San Agustín; Entre calles y jardines; Animales que nos acompañan.
- Una especie/observación puede avanzar varias colecciones. Mostrar un resumen breve en la revelación.
- Denominador fijo por versión de colección; no cambiarlo al mover el mapa o llegar otra estación.
- Un distintivo visual al completar una colección y el recuento de especies son suficientes. Sin economía de monedas, árbol de niveles ni rachas que castiguen ausencias.
- Las repeticiones permiten foto favorita y notas; no multiplican logros.
- Pistas educativas con información contrastada. No mandar a buscar especies raras o aproximarse a nidos.

## Diseño inicial a implementar
- Paleta orientativa: carcasa coral `#D94B43`, pantalla crema `#F7F3E8`, tinta `#172A2D`, acento turquesa `#147D79`. Verificar contraste de cada combinación; no asumir accesibilidad por estos valores.
- Texto de lectura con tipografía del sistema. Numeración e indicadores con estilo monoespaciado; pixel art en detalles opcionales.
- Espaciado base 4/8 px, controles táctiles de al menos 44 × 44 CSS px, una acción primaria por estado, safe areas y controles al alcance del pulgar.
- Animación de revelación corta y saltable; sonido desactivado de inicio. No depender de vibración para comprender acciones.
- Retrato móvil primero; escritorio como marco ancho de prueba, sin construir otro producto.
- Fuente, iconos y assets empaquetados localmente. Sin vídeos de fondo ni librerías pesadas de animación.
- Ficha taxonómica: nombre común primero, científico después; rangos completos en sección expandible. No obligar a entender taxonomía para navegar.

## Demo y confianza
Entrada explícita “Probar demostración”; banda persistente “Demostración: resultados simulados”. La animación no se describe como análisis real. Perfil/espacio demo separado con reset propio. En modo real, si falta modelo, ofrecer guardar pendiente; jamás sustituirlo silenciosamente por resultados ficticios.
Mostrar “Sugerencia”/“Confirmado por ti”, no “Verificado”. Calidad de encuadre y certeza de especie son mensajes distintos. No mostrar porcentajes de confianza sin calibración.

## Pruebas de usabilidad
Un panel local de escenarios permite abrir: primer descubrimiento, repetición, duda, sin GPS, permiso cámara denegado, falta de espacio y fallo de paquete. Los controles no aparecen como parte de la experiencia normal. Feedback local con pantalla, comentario y versión; sin grabación automática de cámara.

Primera ronda: 3–5 adultos, cinco tareas de [07](07-validacion.md). Clasificar problemas por bloqueo/fricción/preferencia. Corregir primero bloqueos, luego navegación y legibilidad, finalmente efectos. Evitar un sistema A/B remoto; comparar sesiones y versiones manualmente.
