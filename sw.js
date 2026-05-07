// Service worker disabilitato — l'app usa sempre la rete per aggiornarsi
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Nessun fetch handler = il browser usa la rete normalmente
