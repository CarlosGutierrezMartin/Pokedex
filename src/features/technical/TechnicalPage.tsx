import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BenchmarkWorker from '../../adapters/inference/benchmark.worker?worker';
import type { BenchmarkResult } from '../../domain/benchmark';
import manifest from '../../test-support/model-artifacts.json';

export default function TechnicalPage() {
  const workerRef = useRef<Worker | null>(null);
  const [modelId, setModelId] = useState('coral-birds');
  const [status, setStatus] = useState('Sin ejecutar');
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<BenchmarkResult | { modelId: string; error: string } | null>(null);
  useEffect(() => () => workerRef.current?.terminate(), []);

  function cancel() {
    workerRef.current?.terminate();
    workerRef.current = null;
    setBusy(false);
    setStatus('Prueba cancelada; puedes volver a intentarlo.');
  }

  function start() {
    if (workerRef.current) return;
    setBusy(true);
    setReport(null);
    setStatus('Iniciando worker…');
    const worker = new BenchmarkWorker();
    workerRef.current = worker;
    const finish = () => { worker.terminate(); workerRef.current = null; setBusy(false); };
    worker.onmessage = (event: MessageEvent<{ status: string; message?: string; result?: BenchmarkResult }>) => {
      if (workerRef.current !== worker) return;
      if (event.data.status === 'progress') setStatus(event.data.message ?? 'Procesando…');
      if (event.data.status === 'done' && event.data.result) {
        setReport(event.data.result);
        setStatus('Prueba técnica terminada; calidad e iPhone pendientes.');
        finish();
      }
      if (event.data.status === 'error') {
        setReport({ modelId, error: event.data.message ?? 'Error desconocido' });
        setStatus('Error de ejecución. No se ha generado una identificación.');
        finish();
      }
    };
    worker.onerror = () => {
      if (workerRef.current !== worker) return;
      setReport({ modelId, error: 'El worker no pudo arrancar. Consulta la consola local y vuelve a intentarlo.' });
      setStatus('Error de ejecución. Puedes reintentar.');
      finish();
    };
    worker.postMessage({ modelId, origin: location.origin });
  }

  function download() {
    if (!report) return;
    const blob = new Blob([JSON.stringify({ date: new Date().toISOString(), environment: navigator.userAgent, runtime: manifest.runtime, ...report }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'fauna-t01-tecnica.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="shell"><header><Link className="brand" to="/">fauna ✳</Link><span className="badge">Prueba técnica</span></header><main>
    <h1>Viabilidad móvil</h1><p>Inferencia real sobre un cuadro gris sintético. Mide ejecución, no reconocimiento de fauna. No usa cámara, no guarda observaciones y no envía imágenes.</p>
    <section className="card"><h2>Experimento T01</h2><label htmlFor="model">Candidato</label><select id="model" value={modelId} disabled={busy} onChange={(event) => setModelId(event.target.value)}>{manifest.models.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}</select>
      <p>Los archivos deben prepararse en el Mac con <code>npm run prepare:models</code> y <code>npm run build</code>. Esta pantalla aún necesita el servidor local; la instalación offline será T07.</p>
      <button disabled={busy} onClick={start}>Ejecutar 1 + 20 inferencias</button>{busy ? <button className="secondary" onClick={cancel}>Cancelar prueba</button> : null}
      <p role="status">{status}</p>
      {report ? <><pre data-testid="technical-report">{JSON.stringify(report, null, 2)}</pre><button onClick={download}>Exportar resultado técnico</button></> : null}
    </section>
    <p className="note">No constituye aprobación de CAMPO. Faltan fotos de evaluación, umbrales calibrados y prueba física del iPhone 14.</p>
  </main></div>;
}
