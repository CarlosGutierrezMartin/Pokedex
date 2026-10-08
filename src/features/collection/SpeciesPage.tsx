import { Link, useParams } from 'react-router-dom';
import { discoveries } from '../../domain/collection';
import { groupNames } from '../../test-support/catalog';
import { AnimalArt } from '../../ui/AnimalArt';
import { Empty, useWorkspace } from './Workspace';
import { Photo } from './Photo';
import { BackButton } from './BackButton';

export default function SpeciesPage() {
  const { id } = useParams();
  const { species, observations, base } = useWorkspace();
  const entry = species.find((candidate) => candidate.id === id);
  if (!entry) return <Empty><h1>Ficha no disponible</h1><Link to={`${base}/coleccion`}>Volver a la colección</Link></Empty>;
  const encounters = observations.filter((observation) => observation.status === 'confirmed' && observation.speciesId === id);
  const first = discoveries(encounters).get(entry.id);
  return <><BackButton fallback={`${base}/coleccion`} /><div className="species-hero"><AnimalArt group={entry.group} discovered={Boolean(first)} /><span className="eyebrow">{first ? 'DESCUBIERTA POR TI · DEMO' : 'POR DESCUBRIR · DEMO'}</span><h1>{entry.commonName}</h1><p><i>{entry.scientificName}</i></p></div>
    <section className="card"><h2>Una ficha para explorar</h2><p>Ilustración y nombres de ejemplo para probar la colección. Hábitat, actividad, rasgos y presencia local pendientes de revisión.</p><details><summary>Taxonomía y procedencia</summary><p>Grupo: {groupNames[entry.group]}. Rango de ejemplo: especie. Otros rangos no incorporados.</p><p>Fuente: fixture interno demo-1. Sin registros locales contrastados ni fotografía biológica. No se utiliza en modo real.</p></details></section>
    <h2>Mis encuentros · {encounters.length}</h2>{encounters.length ? encounters.map((observation) => <Link className="journal-row" key={observation.id} to={`${base}/encuentro/${observation.id}`}>{observation.photoIds[0] ? <Photo id={observation.photoIds[0]} /> : <span className="photo-placeholder">Sin foto</span>}<span>{observation.observedDate ?? 'Fecha desconocida'}<small>{observation.id === first?.id ? 'Primer encuentro confirmado' : 'Encuentro repetido'}</small></span></Link>) : <Empty>Tu primer encuentro aparecerá aquí cuando lo confirmes.</Empty>}
    <Link className="button-link" to={`${base}/escanear`}>Probar encuentro demo</Link>
  </>;
}
