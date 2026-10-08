import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { collectionProgress, discoveries } from '../../domain/collection';
import { municipalityNames } from '../../test-support/catalog';
import { Empty, useWorkspace } from './Workspace';

export default function Explore() {
  const { profile, source, observations, collections, base, scenario } = useWorkspace();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const municipality = params.get('municipio') ?? '';
  return <>
    <p className="eyebrow">TU CUADERNO DE CAMPO</p><h1>Hola{profile.name ? `, ${profile.name}` : ''}.<br /><em>Mira cerca.</em></h1>
    <p className="intro">Cada encuentro cuenta una historia. Observa a distancia, sin perseguir animales ni acercarte a nidos.</p>
    <div className="stats"><span><strong>{discoveries(observations).size}</strong> especies descubiertas</span><span><strong>{observations.length}</strong> encuentros</span></div>
    <label htmlFor="town-filter">Municipio para explorar</label><select id="town-filter" value={municipality} onChange={(event) => setParams(event.target.value ? { municipio: event.target.value } : {})}><option value="">Todos / sin ubicación</option>{Object.entries(municipalityNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
    <p className="hint">No hace falta GPS. Este filtro no asigna el lugar de un encuentro.</p>
    {source === 'demo' ? <p className="notice">Fichas de ejemplo: no certifican presencia en estos municipios.</p> : <Empty><h2>Contenido local por preparar</h2><p>El catálogo revisado y el modelo aún no están disponibles. Puedes guardar un encuentro pendiente con tus notas y foto.</p><Link className="button-link" to={`${base}/escanear`}>Guardar un encuentro</Link></Empty>}
    {scenario === 'pack' && source === 'demo' ? <p role="alert" className="error">Escenario simulado: paquete incompleto. Las fichas de ejemplo siguen disponibles; no hay paquete real activado.</p> : null}
    <h2>Colecciones para empezar</h2><div className="collection-list">{collections.filter((collection) => !municipality || !collection.municipality || collection.municipality === municipality).map((collection) => {
      const progress = collectionProgress(collection, observations);
      return <Link className="collection-tile" key={collection.id} to={`${base}/colecciones/${collection.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}><span className="collection-seal" aria-hidden="true">{progress.complete ? '✦' : '✳'}</span><span><strong>{collection.title}</strong><small>{progress.count} de {progress.total} · {progress.complete ? 'Distintivo conseguido' : 'Por descubrir'}</small><progress value={progress.count} max={progress.total} aria-label={`Progreso de ${collection.title}`} /></span><span aria-hidden="true">↗</span></Link>;
    })}</div>
    {source === 'demo' ? <Link className="button-link" to={`${base}/escanear`}>Probar un encuentro demo</Link> : null}
  </>;
}
