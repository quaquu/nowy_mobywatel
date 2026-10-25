// Service worker: po pierwszym otwarciu prototyp działa bez internetu (cache-first dla plików aplikacji).
const WERSJA = 'proto-v7';
const PLIKI = ['./', 'index.html', 'css/app.css', 'icon.svg', 'manifest.webmanifest',
  'js/app.js', 'js/core.js', 'js/icons.js', 'js/data.js', 'js/intents.js', 'js/sprawy.js', 'js/widoki.js', 'js/asystent.js', 'js/jury.js', 'js/test.js', 'js/obywatel.js', 'js/wyniki.js', 'fonts/lato-latin-400.woff2', 'fonts/lato-latin-700.woff2', 'fonts/lato-pl-400.woff2', 'fonts/lato-pl-700.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(WERSJA).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== WERSJA).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // Sieć najpierw (świeże wersje), pamięć podręczna, gdy sieci brak.
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(WERSJA).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
