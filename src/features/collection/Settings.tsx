import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exportBackup, restoreBackup } from '../../adapters/storage/backup';
import { profileSchema } from '../../adapters/storage/schema';
import type { Profile } from '../../domain/collection';
import { ErrorMessage, useWorkspace } from './Workspace';
import type { Scenario } from './Workspace';
import { Feedback } from './Feedback';
import { Installation } from './Installation';
import demoPack from '../../test-support/demo-pack.json';

export default function Settings() {
  const { profile, source, repository, base, refresh, activate, scenario, setScenario, diagnostics } = useWorkspace();
  const [name, setName] = useState(profile.name);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { repository.database.profiles.toArray().then(setProfiles).catch(() => setError('No se pudo listar los perfiles.')); }, [repository, profile.id]);

  async function perform(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try { await action(); }
    catch (failure) { setError(failure instanceof Error && !failure.message.startsWith('[') ? failure.message : 'Archivo incompatible o datos inválidos. No se ha cambiado el perfil activo.'); }
    finally { setBusy(false); }
  }

  async function backup() {
    const blob = await exportBackup(repository, profile.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `fauna-${source}-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Copia preparada y enviada a las descargas del navegador. Guárdala en un lugar privado.');
  }

  return <><p className="eyebrow">TU ESPACIO, EN ESTE DISPOSITIVO</p><h1>Ajustes</h1>
    <section className="card"><h2>Perfil local</h2><label htmlFor="profile-name">Nombre (opcional)</label><input id="profile-name" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} /><button disabled={busy} onClick={() => void perform(async () => { await repository.database.profiles.put(profileSchema.parse({ ...profile, name: name.trim() })); await refresh(); setMessage('Nombre guardado.'); })}>Guardar nombre</button>
      <label className="check-label"><input type="checkbox" checked={profile.reducedMotion} disabled={busy} onChange={(event) => void perform(async () => { await repository.database.profiles.put({ ...profile, reducedMotion: event.target.checked }); await refresh(); })} />Reducir movimiento</label><p className="hint">Sonido desactivado. Esta versión no reproduce audio.</p>
      <label htmlFor="active-profile">Perfil activo</label><select id="active-profile" value={profile.id} disabled={busy} onChange={(event) => void perform(async () => { const selected = await repository.profile(event.target.value); await activate(selected); setName(selected.name); setMessage('Perfil cambiado.'); })}>{profiles.map((entry) => <option key={entry.id} value={entry.id}>{entry.name || 'Sin nombre'} · {entry.id.slice(0, 6)}</option>)}</select>
      <button className="secondary" disabled={busy} onClick={() => void perform(async () => { await activate(await repository.createProfile('')); setName(''); setMessage('Espacio vacío creado. Los perfiles anteriores se conservan.'); })}>Crear otro perfil vacío</button>
    </section>
    <section className="card"><h2>Copia local</h2><p>Incluye perfil, encuentros, propuestas y fotos. No incluye modelos. Restaurar crea un perfil nuevo y conserva el actual.</p><button disabled={busy} onClick={() => void perform(backup)}>Exportar copia</button><label className="file-label" htmlFor="restore-file">Restaurar copia JSON (máximo 100 MiB)</label><input id="restore-file" type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void perform(async () => { const restored = await restoreBackup(repository, file); await activate(restored); setName(restored.name); setMessage('Copia restaurada en un perfil nuevo.'); }); }} /><p className="hint">El navegador puede perder almacenamiento. Exporta con regularidad; no hay sincronización en nube.</p></section>
    <section className="card"><h2>Contenido y ayuda</h2><p>{source === 'demo' ? `Paquete de ejemplo ${demoPack.version}: ${demoPack.speciesIds.length} fichas, ${demoPack.collectionIds.length} colecciones. Sin fauna local verificada.` : 'Paquete real pendiente de revisión. Identificación y autonomía offline no aprobadas.'}</p>{source === 'demo' ? <details><summary>Procedencia y cobertura del paquete demo</summary><p>{demoPack.provenance}</p><p>{demoPack.coverage.statement}</p><p>{demoPack.licenseStatement}</p></details> : null}<Link className="cancel-link" to="/tecnica">Abrir prueba técnica T01</Link><Link className="cancel-link" to={source === 'demo' ? '/real' : '/demo'}>{source === 'demo' ? 'Cambiar al espacio real' : 'Probar demostración'}</Link><Link className="cancel-link" to="/">Volver a la bienvenida</Link></section>
    {source === 'demo' ? <details className="card"><summary>Panel local de escenarios</summary><p>Controles de prueba: los errores son simulados y no acreditan permisos, espacio ni modelo reales.</p><label htmlFor="scenario">Escenario demo</label><select id="scenario" value={scenario} onChange={(event) => setScenario(event.target.value as Scenario)}><option value="normal">Normal / sin GPS</option><option value="doubt">Duda: sin candidato</option><option value="permission">Permiso de cámara denegado</option><option value="storage">Fallo de guardado una vez</option><option value="pack">Paquete incompleto</option></select><Link className="button-link" to={`${base}/escanear`}>Abrir captura del escenario</Link><p>Primer descubrimiento: usar un perfil vacío. Repetición: confirmar dos encuentros de la misma especie.</p></details> : null}
    <Installation /><Feedback key={profile.id} />
    <ErrorMessage message={error} />{message ? <p role="status" className="notice">{message}</p> : null}
    {deleting ? <section className="danger-box"><h2>¿Borrar el perfil activo y sus fotos?</h2><p>Esta acción no se puede deshacer. Exporta primero si deseas conservarlo. Los otros perfiles y el otro espacio no cambian.</p><button disabled={busy} onClick={() => void perform(backup)}>Exportar antes de borrar</button><button className="secondary" disabled={busy} onClick={() => void perform(async () => { diagnostics.clear(); await repository.deleteProfile(profile.id); await activate(await repository.createProfile('')); navigate(base); })}>Sí, borrar este perfil</button><button className="text-button" onClick={() => setDeleting(false)}>Conservar perfil</button></section> : <button className="text-button danger" onClick={() => setDeleting(true)}>{source === 'demo' ? 'Reiniciar este perfil demo' : 'Borrar este perfil real'}</button>}
  </>;
}
