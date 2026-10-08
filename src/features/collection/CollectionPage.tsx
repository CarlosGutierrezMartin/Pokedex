import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { collectionProgress, discoveries } from '../../domain/collection';
import { groupNames } from '../../test-support/catalog';
import { AnimalArt } from '../../ui/AnimalArt';
import { Empty, useWorkspace } from './Workspace';
import { BackButton } from './BackButton';

export default function CollectionPage() {
  const { observations, species, collections, base } = useWorkspace();
  const { collectionId } = useParams();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const collection = collections.find((entry) => entry.id === collectionId);
  const known = discoveries(observations);
  const search = params.get('buscar') ?? '';
  const group = params.get('grupo') ?? '';
  const state = params.get('estado') ?? '';
  const update = (key: string, value: string) => { const next = new URLSearchParams(window.location.search); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true, state: location.state }); };
  if (collectionId && !collection) return <Empty><h1>Colección no disponible</h1><Link to={base}>Volver a explorar</Link></Empty>;
  const progress = collection ? collectionProgress(collection, observations) : null;
  const filtered = species.filter((entry) => (!collection || collection.memberSpeciesIds.includes(entry.id)) && (!group || entry.group === group) && `${entry.commonName} ${entry.scientificName}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')) && (!state || (state === 'discovered' ? known.has(entry.id) : !known.has(entry.id))));
  return <><BackButton fallback={base} /><p className="eyebrow">UNA HISTORIA POR ESPECIE</p><h1>{collection?.title ?? 'Tu colección'}</h1>
    {collection ? <section className="rule-card"><p>{collection.rule}</p><strong>{progress!.count} / {progress!.total} {progress!.complete ? '✦ Colección completa' : 'especies que cumplen la regla'}</strong><p>Lista fija · {collection.version} · Ejemplo sin presencia verificada.</p></section> : <p>{known.size} descubiertas de {species.length} fichas de ejemplo.</p>}
    <label htmlFor="search-species">Buscar especie</label><input id="search-species" type="search" value={search} onChange={(event) => update('buscar', event.target.value)} placeholder="Nombre común o científico" />
    <div className="filter-row"><div><label htmlFor="group-filter">Grupo</label><select id="group-filter" value={group} onChange={(event) => update('grupo', event.target.value)}><option value="">Todos</option>{Object.entries(groupNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div><div><label htmlFor="state-filter">Estado</label><select id="state-filter" value={state} onChange={(event) => update('estado', event.target.value)}><option value="">Todos</option><option value="pending">Pendientes</option><option value="discovered">Descubiertas</option></select></div></div>
    {filtered.length ? <div className="species-grid">{filtered.map((entry) => <Link className={`species-tile ${known.has(entry.id) ? 'discovered' : ''}`} key={entry.id} to={`${base}/ficha/${entry.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}><AnimalArt group={entry.group} discovered={known.has(entry.id)} /><span className="species-state">{known.has(entry.id) ? 'Descubierta' : 'Por descubrir'}</span><h2>{entry.commonName}</h2><small>{groupNames[entry.group]}</small></Link>)}</div> : <Empty><h2>{species.length ? 'Ninguna ficha coincide' : 'Catálogo real pendiente'}</h2><p>{species.length ? 'Prueba otro nombre o elimina los filtros.' : 'Las fichas demo no se usan en el espacio real.'}</p>{species.length ? <button onClick={() => setParams({}, { replace: true, state: location.state })}>Limpiar filtros</button> : <Link to={`${base}/escanear`}>Guardar un encuentro pendiente</Link>}</Empty>}
  </>;
}
