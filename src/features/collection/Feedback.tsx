import { useState } from 'react';
import { screens } from '../../adapters/diagnostics';
import type { Screen } from '../../adapters/diagnostics';
import { useWorkspace } from './Workspace';

export function Feedback() {
  const { diagnostics } = useWorkspace();
  const [enabled, setEnabled] = useState(() => { try { return diagnostics.read().enabled; } catch { return false; } });
  const [screen, setScreen] = useState<Screen>('explorar');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function perform(action: () => void) {
    setError(''); setMessage('');
    try { action(); }
    catch { setError('No se pudo guardar o leer el diagnóstico local. Puedes borrarlo sin afectar a tus encuentros.'); }
  }
  return <details className="card"><summary>Feedback y diagnóstico local</summary>
    <p>No se envía nada. Eventos desactivados por defecto; máximo 200 eventos y 30 comentarios por perfil. No se registran fotos, GPS, nombres ni notas del cuaderno. Revisa el archivo antes de compartirlo.</p>
    <label className="check-label"><input type="checkbox" checked={enabled} onChange={(event) => perform(() => { const checked = event.target.checked; diagnostics.enable(checked); setEnabled(checked); if (checked) diagnostics.record('session_started', 'ajustes'); })} />Registrar eventos locales</label>
    <label htmlFor="feedback-screen">Pantalla del comentario</label><select id="feedback-screen" value={screen} onChange={(event) => setScreen(event.target.value as Screen)}>{screens.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <label htmlFor="feedback-comment">Comentario de prueba (sin datos personales ni ubicación)</label><textarea id="feedback-comment" maxLength={1000} value={comment} onChange={(event) => setComment(event.target.value)} />
    <button disabled={!comment.trim()} onClick={() => perform(() => { diagnostics.feedback(screen, comment); setComment(''); setMessage('Comentario guardado solo en este perfil.'); })}>Guardar comentario local</button>
    <button className="secondary" onClick={() => perform(() => { const url = URL.createObjectURL(new Blob([diagnostics.export()], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'fauna-feedback-local.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Diagnóstico preparado para descarga local.'); })}>Exportar feedback y eventos</button>
    <button className="text-button" onClick={() => perform(() => { diagnostics.clear(); setEnabled(false); setMessage('Diagnóstico borrado y eventos desactivados. Encuentros conservados.'); })}>Borrar diagnóstico local</button>
    {message ? <p role="status">{message}</p> : null}{error ? <p role="alert">{error}</p> : null}
  </details>;
}
