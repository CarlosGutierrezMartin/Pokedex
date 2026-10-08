import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { municipalityNames } from '../../test-support/catalog';
import { Empty, useWorkspace } from './Workspace';
import { Photo } from './Photo';

export default function Journal() {
  const { observations, species, base } = useWorkspace();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const status = params.get('estado') ?? '';
  const entries = observations.filter((entry) => !status || entry.status === status).sort((first, second) => second.createdAt.localeCompare(first.createdAt) || first.id.localeCompare(second.id));
  return <><p className="eyebrow">TUS HISTORIAS</p><h1>Cuaderno</h1><p>{observations.length} encuentros guardados en este perfil local.</p>
    <label htmlFor="journal-state">Estado del encuentro</label><select id="journal-state" value={status} onChange={(event) => setParams(event.target.value ? { estado: event.target.value } : {}, { replace: true })}><option value="">Todos</option><option value="pending">Pendientes</option><option value="confirmed">Confirmados por ti</option></select>
    {entries.length ? <div className="journal-list">{entries.map((observation) => <Link className="journal-row" key={observation.id} to={`${base}/encuentro/${observation.id}`} state={{ returnTo: `${location.pathname}${location.search}` }}>{observation.photoIds[0] ? <Photo id={observation.photoIds[0]} /> : <span className="photo-placeholder">Sin foto</span>}<span><strong>{species.find((entry) => entry.id === observation.speciesId)?.commonName ?? 'Encuentro pendiente'}</strong><small>{observation.observedDate ?? 'Fecha desconocida'} · {observation.municipality ? municipalityNames[observation.municipality] : 'Lugar desconocido'}</small><small>{observation.status === 'confirmed' ? 'Confirmado por ti' : 'Por resolver'}</small></span><span aria-hidden="true">↗</span></Link>)}</div> : <Empty><h2>{observations.length ? 'Sin encuentros con este filtro' : 'Tu primera página está por escribir'}</h2><p>Los encuentros confirmados y pendientes se conservan aquí.</p><Link className="button-link" to={`${base}/escanear`}>Registrar un encuentro</Link></Empty>}
  </>;
}
