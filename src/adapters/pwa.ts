import { registerSW } from 'virtual:pwa-register';

let state = { ready: false, update: false, error: '' };
const listeners = new Set<() => void>();
function change(values: Partial<typeof state>) {
  state = { ...state, ...values };
  for (const listener of listeners) listener();
}
let registration: ServiceWorkerRegistration | undefined;
async function checkCachedShell() {
  try {
    const cached = await caches.match('/index.html', { ignoreSearch: true });
    change({ ready: Boolean(cached), error: cached ? '' : 'La interfaz aún no está en caché. Comprueba la preparación con el servidor disponible.' });
  } catch { change({ ready: false, error: 'No se pudo verificar la caché local.' }); }
}
const update = registerSW({
  immediate: true,
  onOfflineReady: () => { void checkCachedShell(); },
  onNeedRefresh: () => change({ update: true }),
  onRegisteredSW: (_url, registered) => {
    registration = registered;
    if (registered?.active) void checkCachedShell();
  },
  onRegisterError: () => change({ error: 'No se pudo preparar la app sin conexión. Reintenta con el servidor disponible.' }),
});

export const pwa = {
  snapshot: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  async check() {
    try {
      if (!registration) { window.location.reload(); return; }
      await registration.update();
      await checkCachedShell();
    } catch { change({ error: 'No se pudo comprobar la actualización. La versión instalada se conserva.' }); }
  },
  apply: () => update(true),
};
