// ─── VERSIONE CACHE — cambia questo numero ad ogni deploy ───
const CACHE_VERSION = 'odori-v12';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192.svg'
];

// Installazione: metti in cache i file
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting()) // attiva subito senza aspettare
  );
});

// Attivazione: elimina cache vecchie
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // prendi controllo di tutte le tab aperte
  );
});

// Fetch: rete prima, cache come fallback (così prende sempre i file aggiornati)
self.addEventListener('fetch', e => {
  // Solo richieste GET allo stesso dominio
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Aggiorna la cache con la risposta fresca
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request)) // offline: usa cache
  );
});

// Messaggio dall'app: forza aggiornamento immediato
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
