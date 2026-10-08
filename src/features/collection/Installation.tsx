import { useSyncExternalStore } from 'react';
import { pwa } from '../../adapters/pwa';

export function Installation() {
  const state = useSyncExternalStore(pwa.subscribe, pwa.snapshot);
  return <section className="card"><h2>Instalación local</h2>
    <p>{state.ready ? 'Interfaz UX preparada sin conexión en este navegador.' : 'Interfaz UX aún no preparada sin conexión. Abre el build con HTTPS local y espera la preparación.'}</p>
    <p>En Safari del iPhone: Compartir → Añadir a pantalla de inicio. Abre esa app con el Mac disponible y espera aquí la confirmación antes de desconectar.</p>
    <p className="hint">Solo incluye interfaz y ejemplos. No incluye pesos ni runtime de IA. No acredita autonomía CAMPO ni permanencia del almacenamiento.</p>
    <button className="secondary" onClick={() => void pwa.check()}>Comprobar preparación / actualización</button>
    {state.update ? <><p>Hay una versión nueva. Guarda antes los encuentros abiertos en otras pestañas: actualizar recarga la app.</p><button onClick={() => void pwa.apply()}>Actualizar y recargar</button></> : null}
    {state.error ? <p role="alert" className="error">{state.error}</p> : null}
  </section>;
}
