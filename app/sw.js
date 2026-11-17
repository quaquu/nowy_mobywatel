// Service worker: po pierwszym otwarciu prototyp działa bez internetu (cache-first dla plików aplikacji).
const WERSJA = 'proto-v28';
const PLIKI = ['./', 'index.html', 'css/app.css', 'icon.svg', 'manifest.webmanifest',
  'js/app.js', 'js/core.js', 'js/icons.js', 'js/data.js', 'js/intents.js', 'js/sprawy.js', 'js/zycie.js', 'js/emerytura.js', 'js/widoki.js', 'js/asystent.js', 'js/jury.js', 'js/test.js', 'js/obywatel.js', 'js/ruch.js', 'js/grafiki.js', 'js/skaner.js', 'vendor/jsQR.js', 'img/kod-sklep.svg', 'img/kod-urzad.svg', 'img/kod-logowanie.svg', 'img/kod-parkometr.svg', 'js/wyniki.js', 'fonts/lato-latin-400.woff2', 'fonts/lato-latin-700.woff2', 'fonts/lato-latin-900.woff2', 'fonts/lato-pl-400.woff2', 'fonts/lato-pl-700.woff2', 'fonts/lato-pl-900.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(WERSJA).then(c => c.addAll(PLIKI.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); }); // pliki z serwera, nie z pamięci przeglądarki
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== WERSJA).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  if (e.request.headers.has('range') || e.request.destination === 'video') return; // film: przeglądarka sama obsługuje zakresy (Safari tego wymaga)
  // Sieć najpierw, z pytaniem serwera o zmiany (no-cache): nowa wersja widać od razu, a nie po 10 minutach pamięci przeglądarki.
  // Bez sieci: pamięć podręczna.
  e.respondWith(fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(r => { const c = r.clone(); caches.open(WERSJA).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
