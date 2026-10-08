import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { normalizePhoto } from '../../adapters/photos';
import type { PhotoRecord } from '../../adapters/storage/repository';
import type { Identification, Observation } from '../../domain/collection';
import { AnimalArt } from '../../ui/AnimalArt';
import { EncounterFields, emptyEncounter } from './EncounterFields';
import { ErrorMessage, useWorkspace } from './Workspace';

export default function Capture() {
  const { source, base, profile, repository, refresh, species, scenario, diagnostics } = useWorkspace();
  const navigate = useNavigate();
  const [values, setValues] = useState(emptyEncounter);
  const [phase, setPhase] = useState<'capture' | 'result'>('capture');
  const [selected, setSelected] = useState('');
  const [method, setMethod] = useState<'model' | 'manual'>('model');
  const [photo, setPhoto] = useState<PhotoRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ids] = useState(() => ({ id: crypto.randomUUID(), operationId: crypto.randomUUID() }));
  const saving = useRef(false);
  const failedOnce = useRef(false);
  const [started] = useState(() => performance.now());
  const candidates = source === 'demo' && scenario !== 'doubt' ? species.filter((entry) => ['demo-gorrion', 'demo-mirlo', 'demo-paloma'].includes(entry.id)) : [];

  async function choosePhoto(file?: File) {
    if (!file) return;
    setBusy(true); setError('');
    try { setPhoto(await normalizePhoto(file, profile.id)); }
    catch { setError('No se pudo preparar la imagen. Prueba un JPEG de hasta 20 MiB; el borrador sigue aquí.'); }
    finally { setBusy(false); }
  }

  async function save(pending: boolean) {
    if (saving.current || busy) return;
    saving.current = true; setBusy(true); setError('');
    try {
      if (!pending && (!selected || source !== 'demo')) throw new Error('Elige una especie de ejemplo o guarda pendiente.');
      if (scenario === 'storage' && source === 'demo' && !failedOnce.current) {
        failedOnce.current = true;
        throw new Error('Fallo de espacio simulado. El borrador se conserva; pulsa de nuevo para reintentar.');
      }
      const now = new Date().toISOString();
      const observation: Observation = { ...ids, ...values, profileId: profile.id, source, speciesId: pending ? null : selected, status: pending ? 'pending' : 'confirmed', identificationMethod: source === 'real' || phase === 'capture' ? 'manual' : method, createdAt: now, confirmedAt: pending ? null : now, notes: values.notes.trim(), photoIds: photo ? [photo.id] : [] };
      const identification: Identification = { observationId: ids.id, profileId: profile.id, source, modelId: source === 'demo' && phase === 'result' ? 'demo-fixture@1' : null, candidates: phase === 'result' ? candidates.map((entry) => ({ speciesId: entry.id, rank: 'species' as const })) : [], chosenSpeciesId: observation.speciesId };
      const saved = await repository.save(observation, identification, photo ? [photo] : []);
      diagnostics.recordElapsed('observation_saved', 'escanear', started);
      if (error) diagnostics.record('recovery_used', 'escanear');
      await refresh();
      navigate(`${base}/encuentro/${saved.id}?revelar=1`, { replace: true });
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'No se pudo guardar. El borrador se conserva.'); }
    finally { saving.current = false; setBusy(false); }
  }

  return <><p className="eyebrow">{source === 'demo' ? 'ENCUENTRO DE EJEMPLO' : 'REGISTRO LOCAL'}</p><h1>{phase === 'capture' ? 'Mira, observa, recuerda.' : candidates.length ? '¿A quién has visto?' : 'Está bien tener dudas.'}</h1>
    {phase === 'capture' ? <>
      <div className="viewfinder"><AnimalArt group="birds" /><span>{source === 'demo' ? 'Encuadre ilustrado · no es una cámara' : 'Cámara e identificación pendientes de validación'}</span></div>
      {scenario === 'permission' && source === 'demo' ? <p className="notice">Simulación: permiso de cámara denegado. Puedes elegir una foto o continuar sin ella.</p> : null}
      <p>{source === 'demo' ? 'La demostración propone resultados prefijados; no analiza la imagen.' : 'Sin modelo aprobado no hay sugerencias. Guarda una foto y notas como pendiente, sin inventar especie.'}</p>
      <label className="file-label" htmlFor="photo-input">Elegir foto local (opcional)</label><input id="photo-input" type="file" accept="image/*" disabled={busy} onChange={(event) => { void choosePhoto(event.target.files?.[0]); event.target.value = ''; }} />
      {photo ? <p role="status">Copia preparada: {Math.ceil(photo.blob.size / 1024)} KiB. El original no se modifica. <button className="text-button" disabled={busy} onClick={() => setPhoto(null)}>Quitar foto</button></p> : <p className="hint">También puedes continuar sin foto. No se solicitará GPS.</p>}
      {source === 'demo' ? <button disabled={busy} onClick={() => { diagnostics.record('capture_taken', 'escanear'); diagnostics.recordElapsed('candidates_shown', 'escanear', started); setPhase('result'); setSelected(''); }}>Simular captura</button> : null}
    </> : <>
      <p className="notice">{candidates.length ? 'Sugerencias simuladas. Selecciona una o conserva el encuentro pendiente.' : 'Escenario demo: información insuficiente. No hay una propuesta afirmativa.'}</p>
      <fieldset className="candidate-list"><legend>Sugerencias</legend>{candidates.map((candidate) => <label className="candidate" key={candidate.id}><input type="radio" name="candidate" value={candidate.id} checked={selected === candidate.id} onChange={() => { setSelected(candidate.id); setMethod('model'); }} /><AnimalArt group={candidate.group} /><span>{candidate.commonName}<small>{candidate.scientificName}</small></span></label>)}</fieldset>
      <label htmlFor="manual-species">Elegir manualmente una ficha demo</label><select id="manual-species" value={selected} onChange={(event) => { setSelected(event.target.value); setMethod('manual'); }}><option value="">Sin resolver</option>{species.map((entry) => <option key={entry.id} value={entry.id}>{entry.commonName}</option>)}</select>
      <p className="hint">Confirmar expresa tu elección personal; no una validación científica.</p>
    </>}
    <EncounterFields value={values} onChange={setValues} disabled={busy} /><ErrorMessage message={error} />
    {phase === 'result' && source === 'demo' ? <button disabled={busy || !selected} onClick={() => void save(false)}>{busy ? 'Guardando…' : 'Confirmar y guardar'}</button> : null}
    <button className="secondary" disabled={busy} onClick={() => void save(true)}>Guardar pendiente</button>
    <Link className="cancel-link" aria-disabled={busy} onClick={(event) => { if (busy) event.preventDefault(); }} to={`${base}/cuaderno`}>Cancelar y volver al cuaderno</Link>
  </>;
}
