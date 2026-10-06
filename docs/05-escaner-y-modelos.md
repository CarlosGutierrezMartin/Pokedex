# 05 · Escáner y modelos

## Separación imprescindible
Detector: localizar un animal/grupo con rectángulo. Clasificador: sugerir taxón. Segmentador: máscara del cuerpo. V0 usa los dos primeros, con encuadre manual alternativo. Segmentación precisa y 3D quedan fuera. La cámara puede verse fluida aunque el modelo procese pocas imágenes por segundo.

## Contrato de identificación
Entrada: requestId, imagen/recorte, contexto opcional de fecha, ubicación y hábitat, packVersion. Salida: requestId, source=real|demo, modelId/version, candidates con taxonId/rango/puntuación, outcome=candidates|insufficient|unsupported, tiempos medidos y motivos estructurados disponibles. Error de ejecución es otro resultado manejable, no una predicción.

Guardar la propuesta, confirmar mediante acción explícita y persistir después. Rangos superiores no desbloquean una especie. No convertir automáticamente un score en probabilidad ni fabricar razones visuales con un LLM.

## Máquina de estados
idle → requesting_camera → searching → target_selected → capturing → identifying → candidates/insufficient/unsupported → confirming → saved.
Desde captura/identificación, permitir cancelar y conservar borrador. Errores de permiso, memoria, modelo, almacenamiento y cámara interrumpida tienen salida recuperable. Mostrar cámara lista no significa modelo listo.

Si el animal detectado sale de escena, limpiar candidato obsoleto. Si hay varios, selección del usuario. Si el detector falla, tocar/recortar o subir foto. A partir de captura estable, usar una sola petición y priorizar una imagen adecuada sobre análisis continuo. BBox estabilizada suavemente; no dibujar un marco aleatorio en modo real.

## T01: experimento técnico acotado
Máximo dos candidatos documentados y una ronda de optimización por candidato. Este límite controla exploración, no autoriza llamar “éxito” a un fallo. Al agotarlo, entregar evidencia y decisión, continuar UX independiente. No empezar entrenamiento desde cero ni una búsqueda abierta de decenas de modelos.

Primer candidato: revisar modelos pequeños públicos de iNaturalist, su licencia, taxonomía efectiva y formato. No asumir que incluyen la fauna del piloto ni que los pesos completos de Seek sean públicos. Segundo candidato solo si es necesario: un modelo compacto publicado de identificación biológica con pesos, licencia y etiquetas verificables. Codex debe registrar artefacto exacto y checksum; “usar MobileNet” o “usar BioCLIP” no identifica pesos válidos.

BioCLIP puede servir de referencia de investigación; no se elige su versión grande automáticamente para Safari. Restringir 30 etiquetas no reduce por sí mismo memoria/cómputo del encoder. Si no hay candidato móvil admisible, declarar el bloqueo; modelo grande en el Mac o API remota no cumplen autonomía.

Ficha de comparación obligatoria, breve:
modelo+URL, licencia de pesos y código, tamaño descargado, runtime/opset si procede, cobertura taxonómica, preprocesado exacto, soporte iPhone medido, latencia fría/caliente, errores/memoria, calidad y limitaciones. Marcar desconocido cuando no se ha medido.

## Inferencia y contexto
Probar ONNX Runtime Web o MediaPipe según compatibilidad del artefacto; no convertir formatos a ciegas ni suponer soporte de aceleración en Safari por el soporte de escritorio. Instalar en el propio teléfono los pesos/runtime necesarios. No asumir que se accede al Neural Engine desde una PWA.

V0 conserva contexto para ordenar candidatos con prudencia. Empezar midiendo imagen sola; activar reordenación geográfica/estacional solo si los datos y evaluación apoyan la mejora. No exclusión dura por 10 km, municipio o mes. Ante contexto desconocido mantener predicción visual y explicitar limitación. No umbrales improvisados que eliminan hallazgos válidos.

## Evaluación de calidad
Crear conjunto local pequeño con procedencia/licencia: mínimo 100 fotos repartidas entre 8 o más especies soportadas, incluidas silvestres; y 30 negativas/fuera de catálogo/sin animal. Incluir confusiones, poca luz y animales pequeños. Separar imágenes para ajustar umbrales de un conjunto reservado de al menos 40 positivas + 15 negativas, sin mismo encuentro duplicado. Si el origen de entrenamiento es desconocido, declarar posible solapamiento y complementar con fotos nuevas de campo.

Medir top-1, top-3, cobertura (% que recibe propuesta) y errores entre propuestas, además de fallos fuera de catálogo. Publicar denominadores y resultados por grupo; no confundir detección de “ave” con especie correcta. El objetivo es un piloto exploratorio, no validación científica.

Gates iniciales CAMPO, decisiones de ingeniería revisables con el usuario, no resultados ya obtenidos:
- Propuestas top-3 correctas en al menos 80% de positivas reservadas, contando abstenciones como fallo de este indicador.
- Al menos 80% de negativas reservadas termina en insuficiente/fuera de cobertura, no una propuesta afirmativa.
- Cobertura real declarada en la app; especies no soportadas se pueden guardar manualmente, sin falsa sugerencia.
- Latencia caliente p95 de identificación ≤3 s en 20 capturas del iPhone 14; registrar fría aparte.
- Sesión de 10 minutos sin cierre/recarga inesperada; medir batería y calor percibido, sin prometer un consumo específico.

Si falla precisión, reducir cobertura declarada solo con nueva evaluación reservada o presentar el bloqueo. No retirar casos difíciles del test para aprobar ni modificar silenciosamente umbrales de aceptación. La alternativa manual es útil pero no prueba identificación automática.
