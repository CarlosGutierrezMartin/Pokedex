import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

const TechnicalPage = lazy(() => import('../features/technical/TechnicalPage'));
const Workspace = lazy(() => import('../features/collection/Workspace'));
const Explore = lazy(() => import('../features/collection/Explore'));
const CollectionPage = lazy(() => import('../features/collection/CollectionPage'));
const SpeciesPage = lazy(() => import('../features/collection/SpeciesPage'));
const Capture = lazy(() => import('../features/collection/Capture'));
const Journal = lazy(() => import('../features/collection/Journal'));
const EncounterPage = lazy(() => import('../features/collection/EncounterPage'));
const Settings = lazy(() => import('../features/collection/Settings'));

export function App() {
  return <BrowserRouter><Suspense fallback={<p role="status">Cargando…</p>}><Routes>
    <Route path="/" element={<Welcome />} /><Route path="/tecnica" element={<TechnicalPage />} />
    <Route path="/:space" element={<Workspace />}><Route index element={<Explore />} /><Route path="coleccion" element={<CollectionPage />} /><Route path="colecciones/:collectionId" element={<CollectionPage />} /><Route path="ficha/:id" element={<SpeciesPage />} /><Route path="escanear" element={<Capture />} /><Route path="cuaderno" element={<Journal />} /><Route path="encuentro/:id" element={<EncounterPage />} /><Route path="ajustes" element={<Settings />} /></Route>
    <Route path="*" element={<div className="shell"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></div>} />
  </Routes></Suspense></BrowserRouter>;
}

function Welcome() {
  const [showDetails, setShowDetails] = useState(false);
  const [name, setName] = useState('');

  return (
    <div className="shell">
      <header><a className="brand" href="/" aria-label="Fauna, inicio">fauna<span aria-hidden="true"> ✳</span></a><span className="badge">Modo demo</span></header>
      <main>
        <p className="eyebrow">MADRID · PILOTO LOCAL</p>
        <h1>Un encuentro.<br />Una historia<br /><em>por descubrir.</em></h1>
        <p className="intro">Una colección que empieza mirando a tu alrededor. Pasea, observa y conoce la fauna a tu ritmo.</p>
        <div className="landscape" role="img" aria-label="Ilustración abstracta de colinas y un sol"><span className="sun" /><span className="hill back" /><span className="hill front" /><span className="landscape-label">MIRA CERCA. DESCUBRE MÁS.</span></div>
        <section aria-labelledby="welcome-title" className="card">
          <p className="eyebrow">PRIMEROS PASOS</p>
          <h2 id="welcome-title">Tu próxima salida empieza aquí</h2>
          <p>Algete y San Agustín de Guadalix son los lugares del piloto. El catálogo local todavía está por revisar.</p>
          <button aria-expanded={showDetails} aria-controls="demo-details" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Cerrar detalles' : 'Conocer la demostración'} <span aria-hidden="true">↗</span></button>
          {showDetails ? <div id="demo-details" className="details"><h3>Una primera mirada</h3><p>Explora una colección de ejemplo, simula un encuentro y confirma tu elección para encontrarla en el cuaderno.</p><p>No analiza fotografías en este recorrido. Los encuentros demo se guardan en un espacio separado de tus registros reales.</p></div> : null}
          <label className="file-label" htmlFor="welcome-name">Tu nombre (opcional)</label><input id="welcome-name" maxLength={60} value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" />
          <Link className="button-link" to="/demo" state={{ name }}>Probar demostración</Link><Link className="cancel-link" to="/real" state={{ name }}>Entrar en mi espacio real</Link>
        </section>
        <p className="note">Observa a distancia y deja que cada animal siga su camino.</p>
      </main>
      <footer><span>V0 · Piloto local</span><span>IA real pendiente de validación</span><Link to="/tecnica">Prueba técnica T01</Link></footer>
    </div>
  );
}
