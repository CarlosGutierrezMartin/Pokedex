import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { collectionProgress, discoveries } from '../../domain/collection';
import type { Observation } from '../../domain/collection';
import { contextNames, municipalityNames } from '../../test-support/catalog';
import { AnimalArt } from '../../ui/AnimalArt';
import { EncounterFields } from './EncounterFields';
import { Empty, ErrorMessage, useWorkspace } from './Workspace';
import { Photo } from './Photo';
import { BackButton } from './BackButton';

export default function EncounterPage() {
  const { id } = useParams();
  const workspace = useWorkspace();
  const observation = workspace.observations.find((entry) => entry.id === id);
  if (!observation) return <Empty><h1>Encuentro no encontrado</h1><Link to={`${workspace.base}/cuaderno`}>Volver al cuaderno</Link></Empty>;
  return <EncounterDetail key={observation.id} observation={observation} />;
}

function EncounterDetail({ observation }: { observation: Observation }) {
  const { source, base, repository, refresh, observations, species, collections } = useWorkspace();
  const [params, setParams] = useSearchParams();
  const [edit, setEdit] = useState<Observation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const entry = species.find((candidate) => candidate.id === observation.speciesId);
  const first = observation.speciesId ? discoveries(observations).get(observation.speciesId)?.id === observation.id : false;
  const reveal = params.get('revelar') === '1';
  const advanced = collections.filter((collection) => collectionProgress(collection, [observation]).count > 0);

  async function saveEdit() {
    if (!edit || busy) return;
    setBusy(true); setError('');
    try {
      await repository.update({ ...edit, status: edit.speciesId ? 'confirmed' : 'pending', confirmedAt: edit.speciesId ? (observation.confirmedAt ?? new Date().toISOString()) : null, identificationMethod: edit.speciesId !== observation.speciesId ? 'manual' : observation.identificationMethod });
      await refresh(); setEdit(null);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'No se pudo guardar el cambio.'); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (busy) return;
    setBusy(true); setError('');
    try { await repository.deleteObservation(observation.profileId, observation.id); await refresh(); navigate(`${base}/cuaderno`, { replace: true }); }
    catch { setError('No se pudo eliminar. Puedes volver a intentarlo.'); setBusy(false); }
  }

  return <><BackButton fallback={`${base}/cuaderno`} label="← Cuaderno" />
    {reveal ? <section className="revelation"><p className="eyebrow">GUARDADO EN TU CUADERNO</p><h1>{entry ? first ? 'Un nuevo descubrimiento' : 'Otro encuentro, otra historia' : 'Encuentro pendiente'}</h1><p>{entry ? first ? 'Tu colección suma una especie.' : 'Suma historial, sin duplicar especie ni distintivo.' : 'Conservas el encuentro sin sumar una especie.'}</p><button className="text-button" onClick={() => setParams({})}>Continuar sin revelación</button></section> : null}
    {entry ? <div className="species-hero"><AnimalArt group={entry.group} discovered /><h2>{entry.commonName}</h2><i>{entry.scientificName}</i></div> : <h1>Encuentro pendiente</h1>}
    {observation.photoIds.map((id) => <Photo key={id} id={id} large />)}{!observation.photoIds.length ? <p className="notice">Este encuentro no tiene foto.</p> : null}
    <p className="confirmation">{observation.status === 'confirmed' ? 'Confirmado por ti · sin validación científica' : 'Pendiente de resolver'}</p>
    {edit ? <section className="card"><h2>Editar encuentro</h2><label htmlFor="edit-species">Especie</label><select id="edit-species" value={edit.speciesId ?? ''} disabled={busy} onChange={(event) => setEdit({ ...edit, speciesId: event.target.value || null })}><option value="">Dejar pendiente</option>{source === 'demo' ? species.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.commonName}</option>) : null}</select><EncounterFields value={edit} disabled={busy} onChange={(value) => setEdit({ ...edit, ...value })} /><button disabled={busy} onClick={() => void saveEdit()}>Guardar cambios</button><button className="secondary" disabled={busy} onClick={() => setEdit(null)}>Cancelar edición</button></section> : <section className="card"><dl><dt>Fecha del encuentro</dt><dd>{observation.observedDate ?? 'Desconocida'}</dd><dt>Lugar</dt><dd>{observation.municipality ? `${municipalityNames[observation.municipality]} · declarado manualmente` : 'Desconocido'}</dd><dt>Contexto</dt><dd>{contextNames[observation.context]}</dd><dt>Origen</dt><dd>{source === 'demo' ? 'Ejemplo demo' : 'Registro real manual'} · {observation.identificationMethod === 'model' ? 'sugerencia simulada' : 'selección manual'}</dd><dt>Notas</dt><dd>{observation.notes || 'Sin notas'}</dd></dl><button className="secondary" onClick={() => setEdit({ ...observation })}>Editar encuentro</button></section>}
    {entry ? <><Link className="button-link" to={`${base}/ficha/${entry.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}>Ver ficha e historial</Link><h2>Colecciones que cumple</h2>{advanced.length ? advanced.map((collection) => <Link className="collection-tile" key={collection.id} to={`${base}/colecciones/${collection.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}>{collection.title}</Link>) : <p>Ninguna regla de colección se cumple con los datos actuales.</p>}</> : null}
    <ErrorMessage message={error} />
    {deleting ? <section className="danger-box"><h2>¿Eliminar este encuentro y su foto?</h2><p>Se recalculará el progreso. Puedes exportar una copia desde Ajustes antes de continuar.</p><button disabled={busy} onClick={() => void remove()}>Sí, eliminar encuentro</button><button className="secondary" disabled={busy} onClick={() => setDeleting(false)}>Conservar encuentro</button></section> : <button className="text-button danger" onClick={() => setDeleting(true)}>Eliminar encuentro</button>}
  </>;
}
