# 03 · Datos y colecciones

## Adquisición
Mantener un catálogo propio y versionado a partir de fuentes, con procedencia. GBIF sirve para taxonomía y registros; MITECO/EIDOS y fuentes especializadas contrastan presencia y atributos. Fotografías propias o reutilizables con autor/licencia/URL. Preferir API/exportación a scraping. Licencia del registro y licencia de la foto se comprueban separadamente.

Proceso acotado: proponer 20–30 especies observables → revisar presencia regional y contenido → contrastar cobertura del modelo → publicar un paquete local. Incluir domésticos. No inventar una lista de Algete/San Agustín ni incluir todas las especies de una familia global.

Durante UX se admiten fixtures sintéticos identificados como tales. Para CAMPO cada ficha necesita identidad taxonómica, fuente y contenido revisado; si no existe foto licenciada, usar marcador neutro explícito. Una imagen generada no es evidencia biológica ni imagen de evaluación.

Entrega UX: `src/test-support/demo-pack.json` identifica el paquete `fauna-ux-demo@demo-1`, su esquema, miembros fijos, procedencia interna y ausencia de modelos/cobertura real aprobada. Declara la situación de licencias sin atribuir permisos externos inventados. `check:data` comprueba versiones, referencias, bytes y SHA-256 de las fuentes de catálogo/ilustraciones; el build incorpora este contenido y la PWA lo conserva con la interfaz. Esta integridad de fuentes no es el instalador de paquetes CAMPO por staging. El catálogo curado de 20–30 fichas, sus fuentes/licencias externas y su cobertura de modelo siguen pendientes de T04.

Registros externos: exigir identidad resoluble y coordenadas válidas; comprobar `occurrenceStatus`, problemas geográficos, incertidumbre, fecha y tipo de registro. Descartes y datos desconocidos quedan contabilizados. No tratar incertidumbre nula/desconocida como precisión perfecta. Un registro antiguo no prueba presencia actual. Cuadrícula y punto son geometrías diferentes.

Normalizar sinónimos con UUID propio estable y mapa de identificadores externos. Conservar fuente/taxonomía/fecha consultadas; una clave externa puede cambiar. Deduplicar por fuente+identificador y revisar registros compartidos entre proveedores antes de sumar evidencia. No hacer ingesta masiva en V0.

## Entidades y contratos conceptuales

| Entidad | Campos mínimos relevantes |
| --- | --- |
| Taxon | id propio, nombre aceptado, nombres comunes, rango, parentId, identificadores externos |
| SpeciesProfile | taxonId de rango especie, grupo de navegación, descripción, rasgos, hábitats, actividad, atributos regionales, fuentes |
| Media | id, taxonId, archivo local, autor, licencia, URL origen, variante/sexo/edad si se conocen |
| Collection | id, versión, título, memberSpeciesIds fijos, reglas de lugar/fecha/contexto, distintivo |
| Observation | id, operationId, profileId, speciesId nullable, grupo sugerido nullable, fecha/lugar, contexto, fotos, notas, estado |
| Identification | observationDraftId, modo demo/real/manual, modelId+versión, candidatos, puntuaciones internas, resolución final |
| LocalProfile | id, nombre opcional, preferencias; separado del espacio demo |
| ContentPack | id, versión, schemaVersion, especies, colecciones, assets, modelos y manifiesto de integridad |

No hacer obligatorios campos sin información. Biometría: rango + unidad + contexto, no peso/altura único para todas las especies. Conservación: categoría, ámbito, autoridad, fecha; protección legal en campo distinto. Rasgos ecológicos regionales pueden ser desconocidos. Para V0 priorizar rasgos diagnósticos y dos párrafos útiles sobre una enciclopedia exhaustiva.

## Observación e identificación
- `status`: pending o confirmed. `identificationMethod`: manual, model o guided. Confirmed significa aceptada por la persona.
- `speciesId=null` para pendiente o identificación solo a género/familia; estas últimas conservan su taxonId sugerido, pero no cuentan como especie.
- `context`: wild, domestic, captive o unknown. No inferirlo siempre de la taxonomía.
- `observedAt` guarda instante/zona horaria o fecha con precisión explícita; no inventar hora cuando solo se conoce el día. `createdAt` es otro dato.
- Lugar: lat/lon/accuracy cuando existe GPS; municipio declarado o desconocido como alternativa. Guardar source=gps/exif/manual/unknown. Nunca sustituir lugar de una foto antigua por GPS actual sin confirmación.
- Fotos: copia normalizada local, miniatura y tamaño/orientación corregidos. No modificar el original de la fototeca. Presupuesto inicial: hasta 2 MiB por copia normalizada y 60 MiB de fotos por perfil; avisar antes de superar el límite y ofrecer exportar/liberar espacio. No compartir metadatos de posición por defecto.
- Conservar candidatos y elección final por separado. No sobrescribir el historial de sugerencia con la respuesta del usuario.

## Progreso determinista
Observations es la fuente de verdad. Con solo 20–30 especies, calcular la proyección de descubrimientos y colecciones desde observaciones; no crear un segundo sistema de escrituras obligatorio.

Una especie está descubierta si existe al menos una observación confirmed de esa especie en ese perfil/espacio. Guardar `confirmedAt`; la primera es la de menor confirmedAt entre las observaciones actualmente válidas, con id como desempate. Corrección/eliminación la recalcula. `operationId` único hace idempotente el reintento de la misma confirmación. Un segundo encuentro voluntario lleva otro operationId.

Cada colección usa un conjunto fijo de speciesIds y predicados explícitos sobre observaciones. Una especie cuenta una vez si alguna observación confirmada satisface **todos** los predicados. El progreso general no basta para completar colecciones municipales o estacionales.

Reglas iniciales:
- Primeros encuentros: lista curada; cualquier contexto admitido definido en su manifiesto.
- Municipales: encuentro asignado al municipio (GPS con límites locales o elección manual marcada); contexto wild. Lugar desconocido no cuenta. Si precisión GPS solapa frontera, pedir municipio o dejar desconocido.
- Entre calles y jardines: contexto wild y hábitat declarado urban/garden; no inferir hábitat solo del municipio.
- Animales que nos acompañan: lista curada y contexto domestic.
- Futuras estacionales: fecha local del encuentro dentro de intervalo definido. No usar fecha de subida; desconocida no cuenta.

Ejemplo normativo: una observación silvestre de A en Algete y otra doméstica de B en San Agustín descubren ambas especies; solo A avanza la colección silvestre de Algete. Repetir A no duplica progreso. Corregir A→C recalcula los conjuntos y distintivos. Eliminar la única observación válida retira ese progreso. La regla debe ser visible al usuario.

## Persistencia y copias
Preparar imagen/miniatura y validaciones antes de entrar en la transacción IndexedDB. Guardar observación, identificación vinculada y blobs de foto de forma atómica. No efectuar peticiones de red o inferencia dentro de la transacción.

Implementación T03: los adaptadores exponen `Blob`, pero serializan foto y miniatura a `ArrayBuffer` antes de la transacción. La escritura directa de Blob falló en el WebKit probado (`Error preparing Blob/File data`); bytes, observación e identificación mantienen la misma atomicidad. La lectura admite también registros Blob anteriores, sin borrado ni migración destructiva. No usar base64 dentro de IndexedDB; se reserva para la copia JSON portable.

Exportar un único archivo con manifiesto JSON, observaciones, preferencias y fotos; no incluir pesos de modelo que puedan volver a instalarse. Importación valida esquema, tamaños comprimidos/descomprimidos, rutas y referencias; límite inicial de 100 MiB por copia importada, error recuperable y sin modificar datos si falla. El exportador respeta los mismos límites y verifica que su copia sea reimportable; presupuestos de fotos mantienen margen. Restaurar en un perfil nuevo para evitar merges ambiguos. Verificar fotos y recuentos antes de activar el perfil. Borrado de perfil requiere confirmación y opción de exportar.

## Relación con el Supabase existente
Solo conocemos parte del esquema por el documento inicial. No recrear ni migrar tablas remotas. A futuro: Taxon/SpeciesProfile → species y referencias; Observation → observations; Identification → identifications; proyecciones → user_species/user_achievements; ContentPack es un concepto nuevo. El catálogo local puede proceder de una exportación revisada, nunca de credenciales privilegiadas incluidas en el cliente.
