import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { LocalRepository } from '../../adapters/storage/repository';
import type { Observation, Profile } from '../../domain/collection';
import type { Workspace as WorkspaceSource } from '../../domain/workspace';
import { demoCollections, demoSpecies } from '../../test-support/catalog';
import { LocalDiagnostics } from '../../adapters/diagnostics';

export type Scenario = 'normal' | 'doubt' | 'permission' | 'storage' | 'pack';
interface WorkspaceContext {
  source: WorkspaceSource;
  profile: Profile;
  repository: LocalRepository;
  observations: Observation[];
  refresh: () => Promise<void>;
  activate: (profile: Profile) => Promise<void>;
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  diagnostics: LocalDiagnostics;
}
const Context = createContext<WorkspaceContext | null>(null);

export function useWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error('Espacio local no inicializado.');
  return { ...context, base: `/${context.source}`, species: context.source === 'demo' ? demoSpecies : [], collections: context.source === 'demo' ? demoCollections : [] };
}

export default function Workspace() {
  const { space } = useParams();
  if (space !== 'demo' && space !== 'real') return <div className="shell"><h1>Espacio no encontrado</h1><Link to="/">Volver al inicio</Link></div>;
  return <WorkspaceProvider key={space} source={space} />;
}

function WorkspaceProvider({ source }: { source: WorkspaceSource }) {
  const [repository] = useState(() => new LocalRepository(source));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [error, setError] = useState('');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const location = useLocation();
  const opening = useRef<Promise<Profile> | null>(null);
  const initialName = useRef(typeof location.state?.name === 'string' ? location.state.name.slice(0, 60) : '');
  const activeId = `fauna-active-${source}`;
  const profileId = profile?.id ?? '';
  const diagnostics = useMemo(() => new LocalDiagnostics(localStorage, source, profileId), [source, profileId]);

  useEffect(() => {
    let active = true;
    opening.current ??= (async () => {
      const saved = localStorage.getItem(activeId);
      const existing = saved ? await repository.database.profiles.get(saved) : undefined;
      const selected = existing ?? await repository.createProfile(initialName.current);
      localStorage.setItem(activeId, selected.id);
      return selected;
    })();
    opening.current.then(async (selected) => {
      const entries = await repository.observations(selected.id);
      if (active) { setProfile(selected); setObservations(entries); }
    }).catch(() => { if (active) setError('No se pudo abrir el almacenamiento local. Comprueba el modo privado y el espacio disponible, y vuelve a intentar.'); });
    return () => { active = false; };
  }, [activeId, repository]);

  async function refresh() {
    if (!profile) return;
    setObservations(await repository.observations(profile.id));
    setProfile(await repository.profile(profile.id));
  }

  async function activate(selected: Profile) {
    const entries = await repository.observations(selected.id);
    localStorage.setItem(activeId, selected.id);
    setProfile(selected);
    setObservations(entries);
  }

  if (error) return <div className="shell"><h1>No se ha abierto el cuaderno</h1><p role="alert">{error}</p><button onClick={() => window.location.reload()}>Reintentar</button><Link to="/">Volver al inicio</Link></div>;
  if (!profile) return <div className="shell"><p role="status">Abriendo tu espacio local…</p></div>;
  return <Context.Provider value={{ source, profile, repository, observations, refresh, activate, scenario, setScenario, diagnostics }}><div className={`instrument ${profile.reducedMotion ? 'reduce-motion' : ''}`}>
    <header className="app-header"><Link to={`/${source}`} className="brand">fauna ✳</Link><Link to={`/${source}/ajustes`} className="settings-link">Ajustes</Link></header>
    <div className={`mode-banner ${source === 'demo' ? '' : 'real-banner'}`}>{source === 'demo' ? 'Demostración: resultados simulados' : 'Espacio real · identificación no disponible'}</div>
    <main className="app-main"><ScrollPosition /><DiagnosticEvents /><Outlet /></main>
    <nav className="bottom-nav" aria-label="Navegación principal"><NavLink end to={`/${source}`}>Explorar</NavLink><NavLink to={`/${source}/coleccion`}>Colección</NavLink><NavLink className="scan-link" to={`/${source}/escanear`}>Escanear</NavLink><NavLink to={`/${source}/cuaderno`}>Cuaderno</NavLink></nav>
  </div></Context.Provider>;
}

function DiagnosticEvents() {
  const { diagnostics } = useWorkspace();
  const { pathname, key } = useLocation();
  const last = useRef('');
  const session = useRef<LocalDiagnostics | null>(null);
  useEffect(() => {
    if (session.current !== diagnostics) { diagnostics.record('session_started', 'explorar'); session.current = diagnostics; last.current = ''; }
    if (last.current === key) return;
    last.current = key;
    if (/\/coleccion(?:es\/[^/]+)?$/.test(pathname)) diagnostics.record('collection_opened', 'coleccion');
    if (pathname.endsWith('/escanear')) diagnostics.record('scanner_opened', 'escanear');
  }, [diagnostics, key, pathname]);
  return null;
}

const positions = new Map<string, number>();
function ScrollPosition() {
  const { key } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo(0, positions.get(key) ?? 0));
    const remember = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', remember, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', remember); };
  }, [key]);
  return null;
}

export function Empty({ children }: { children: ReactNode }) { return <div className="empty-state">{children}</div>; }
export function ErrorMessage({ message }: { message: string }) { return message ? <p className="error" role="alert">{message}</p> : null; }
