# Evidencia CAMPO

## T01 · 7 de octubre de 2026 · Pendiente de dispositivo y calidad

Dos candidatos examinados; no se buscarán más por inercia. Los pesos están fuera de Git. `src/test-support/model-artifacts.json` registra URLs, bytes y SHA-256; `npm run prepare:models` verifica antes de activar cada archivo. Presupuesto inicial: 26 MB de pesos y <200 KB de taxonomía/avisos; runtime MediaPipe 1.1.0, 40,6 MB npm descomprimido, se sirve localmente. Sin fotos descargadas ni enviadas.

| Dimensión | iNaturalist Small 2 | Google Coral Birds |
| --- | --- | --- |
| Artefacto | `INatVision_Small_2_fact256_8bit.tflite`, release `v25.01.15` | `mobilenet_v2_1.0_224_inat_bird_quant.tflite`, commit `104342d2d3480b3e66203073dac24f4e2dbb4c41` |
| Fuente/pesos | [Release oficial](https://github.com/inaturalist/model-files/releases/tag/v25.01.15) | [Repositorio oficial](https://github.com/google-coral/test_data/tree/104342d2d3480b3e66203073dac24f4e2dbb4c41) |
| Licencias publicadas | Repositorio de pesos MIT; código de entrenamiento MIT | Repositorio de pesos/código Apache-2.0; avisos conservados |
| Tamaño descargado | 22.197.168 bytes | 3.579.500 bytes (CPU, no Edge TPU) |
| Taxonomía efectiva | CSV: 1.985 nodos, 507 hojas de rango especie; incluye `Passer domesticus` y `Turdus merula` | Etiquetas del propio artefacto; solo aves, no catálogo completo de fauna ni presencia local verificada |
| Runtime / formato | MediaPipe 1.1.0 / TFLite; no ONNX ni opset | MediaPipe 1.1.0 / TFLite; no ONNX ni opset |
| Preprocesado | Entrada float32; normalización no declarada en metadatos. No se ha supuesto un rango ni convertido a ciegas | Entrada RGB uint8, 224×224 según [ficha oficial](https://coral.ai/models/image-classification/); cuadro gris uniforme, resize gestionado por MediaPipe. Recorte/fotos reales todavía no evaluados |
| Escritorio | Falla carga en ambos motores: `NormalizationOptions` ausente | Arranca y devuelve 3 salidas en ambos motores |
| Inicialización Chromium / WebKit | No completada | 202,8 / 200 ms |
| Primera inferencia Chromium / WebKit | No medida | 55,1 / 142 ms |
| p95 caliente Chromium / WebKit | No medido | 20,1 / 22 ms; 20 repeticiones sintéticas por motor |
| Memoria / calidad / iPhone | No medidos | No medidos |

Comando: `npm run build && npm run probe:t01`. El probe devuelve código 1 porque conserva el fallo del primer candidato; **no es un gate aprobado**. [JSON completo](t01-desktop.json), con navegador y muestras. No hubo optimización ni entrenamiento. Coral queda como candidato técnico para la prueba siguiente, no como identificador aprobado. Un cuadro gris también obtiene clases: falta calibrar abstención con negativas antes de mostrar sugerencias reales.

### Prueba preparada para el iPhone

1. Seguir HTTPS en 04; registrar iPhone, iOS y espacio libre reales. En Mac: `npm ci`, `npm run prepare:models`, `npm run build`, `npm run preview:local`.
2. En Safari abrir `/tecnica`, mantener seleccionado Coral Birds y ejecutar 1 + 20 inferencias. Exportar el JSON local; anotar errores, pausas, calentamiento percibido. Cancelar y reintentar. No atribuir a esas mediciones calidad ni autonomía.
3. Para completar T01 faltan el conjunto con licencia/procedencia de al menos 100 positivas/8 especies + 30 negativas, separación reservada 40/15 sin encuentros compartidos, calibración y métricas por grupo. Cero fotos evaluadas hasta ahora; posible solapamiento con entrenamiento desconocido.
4. La sesión de 10 minutos, captura real y arranque sin Mac/red requieren las capacidades T06/T07 y el protocolo 07. T06 no está autorizada por estos resultados parciales. La pantalla técnica actual necesita servidor.

No se pide una instalación nativa ni cambio de plataforma mientras Coral sea un candidato técnico pendiente. El trabajo UX independiente continúa. No se declara autonomía ni compatibilidad Safari real desde WebKit de escritorio.
