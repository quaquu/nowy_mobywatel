// Stan aplikacji, zdarzenia (dla trybu testowego) i wspólne elementy interfejsu.
import { ic } from './icons.js';
import { wysun, schowaj, wyskocz } from './ruch.js';

const KLUCZ = 'mobywatel-proto-v1';
const POCZATEK = () => ({
  zrobione: {},          // id zadania -> true
  wyslane: [],           // historia wysłanych spraw {tytul, kiedy, do}
  noweDostepy: [],       // wpisy do rejestru dostępu powstałe w trakcie pokazu
  imieDziecka: '',
  autopilot: {},
  ustawienia: { prosty: false, duzy: false, kontrast: false, czytaj: false },
  przeczytane: {},
  zgloszoneDostepy: {},
  poparcia: {},          // id inicjatywy -> kiedy poparta
  sprawdzoneNumery: 0,
  badanie: null,         // rezerwacja na stacji kontroli {stacja, kiedy, krotko}
});

function wczytaj() {
  try { return Object.assign(POCZATEK(), JSON.parse(localStorage.getItem(KLUCZ)) || {}); } catch { return POCZATEK(); }
}
export const stan = wczytaj();
export function zapisz() { try { localStorage.setItem(KLUCZ, JSON.stringify(stan)); } catch {} }
export function resetuj() { Object.assign(stan, POCZATEK()); zapisz(); }

// Wygląd: automatycznie (za systemem), jasny albo ciemny. Osobny klucz, żeby „Zacznij od nowa” nie zmieniało motywu.
// Pierwsze ustawienie robi skrypt w <head> (bez mignięcia złego motywu), tu tylko zmiana i odczyt.
const KLUCZ_MOTYWU = 'mobywatel-motyw';
export function motyw() { try { const m = localStorage.getItem(KLUCZ_MOTYWU); return m === 'light' || m === 'dark' ? m : 'auto'; } catch { return 'auto'; } }
export function ustawMotyw(m) {
  try { m === 'auto' ? localStorage.removeItem(KLUCZ_MOTYWU) : localStorage.setItem(KLUCZ_MOTYWU, m); } catch {}
  const h = document.documentElement;
  m === 'auto' ? h.removeAttribute('data-theme') : h.setAttribute('data-theme', m);
  document.querySelectorAll('meta[name="theme-color"]').forEach(t => t.content = m === 'auto' ? (t.media.includes('dark') ? '#000000' : '#f2f2f7') : (m === 'dark' ? '#000000' : '#f2f2f7'));
  document.querySelectorAll('input[name^="motyw"]').forEach(i => { i.checked = i.value === m; });
}
// Główne działanie długiego formularza przypięte nad paskiem kart, dopóki właściwy przycisk na końcu formularza
// jest poza ekranem (jak pasek narzędzi w iOS). Przycisk wysyła ten sam formularz, więc walidacja jest jedna.
export function przypnijAkcje(root, przycisk) {
  const pasek = document.createElement('div');
  pasek.className = 'akcja-pasek';
  pasek.innerHTML = `<button type="submit" form="${przycisk.form.id}" class="btn glowny szeroki">${przycisk.innerHTML}</button>`;
  root.append(pasek);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([w]) => {
    if (!pasek.isConnected) return io.disconnect();
    pasek.classList.toggle('widoczny', !w.isIntersecting && w.boundingClientRect.top > (w.rootBounds?.top ?? 0));
  }, { root: document.querySelector('html.ramka .aplikacja'), rootMargin: '0px 0px -140px 0px' }); // w ramce przewija się ekran telefonu, nie okno
  io.observe(przycisk);
}

// Przełącznik segmentowy jak w iOS (Ustawienia → Ekran i jasność). Obsługa zmian: jeden słuchacz w app.js.
export const wyborMotywu = (nazwa = 'motyw') => `<fieldset class="segment"><legend class="sr">Wygląd</legend>${[['auto', 'Automatycznie'], ['light', 'Jasny'], ['dark', 'Ciemny']].map(([v, t]) => `<label><input type="radio" name="${nazwa}" value="${v}" ${motyw() === v ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>`;

// Szyna zdarzeń: tryb testowy słucha celów („cel osiągnięty”) i kliknięć.
const sluchacze = {};
export const on = (n, f) => (sluchacze[n] ||= []).push(f);
export const emit = (n, d) => (sluchacze[n] || []).forEach(f => { try { f(d); } catch (e) { console.error(e); } });
export const cel = id => emit('cel', id);

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Komunikaty dla czytników ekranu.
export function ogloszenie(t) {
  const r = $('#ogloszenia'); if (!r) return;
  r.textContent = ''; setTimeout(() => { r.textContent = t; }, 30);
  if (stan.ustawienia.czytaj) czytaj(t);
}

export function czytaj(t) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g, ''));
    u.lang = 'pl-PL'; u.rate = 0.95; speechSynthesis.speak(u);
  } catch {}
}

export function toast(t) {
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = t;
  document.body.append(el);
  setTimeout(() => el.classList.add('on'), 10);
  setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.remove(), 300); }, 2600);
}

// Arkusz zgody: zawsze ta sama struktura, wzorowana na liście kontrolnej przed startem.
// Co wyślemy, do kogo, jakie dane, czego nie da się cofnąć. Bez tego nic nie wychodzi.
export function arkuszZgody({ tytul, pozycje, dane = [], cofniecie, przycisk = 'Podpisz i wyślij', cel: idCelu }) {
  return new Promise(res => {
    const d = document.createElement('dialog');
    d.className = 'arkusz';
    d.setAttribute('aria-labelledby', 'arkusz-t');
    d.innerHTML = `
      <form method="dialog" class="arkusz-in">
        <div class="uchwyt" aria-hidden="true"></div>
        <h2 id="arkusz-t" tabindex="-1" autofocus>${esc(tytul)}</h2>
        <p class="maly">Sprawdź przed podpisem. Bez Twojego podpisu nic nie zostanie wysłane.</p>
        <h3 class="nag">Co wyślemy i dokąd</h3>
        <ol class="kontrolna">${pozycje.map(p => `<li>${ic('check', 'ok')}<span><b>${esc(p.co)}</b><small>do: ${esc(p.do)}</small></span></li>`).join('')}</ol>
        ${dane.length ? `<h3 class="nag">Jakie Twoje dane zostaną użyte</h3><p class="maly">${dane.map(esc).join(' · ')}</p>` : ''}
        ${cofniecie ? `<p class="uwaga">${ic('info')}<span>${esc(cofniecie)}</span></p>` : ''}
        <div class="przyciski pion">
          <button value="ok" class="btn glowny" id="arkusz-ok">${ic('key')}${esc(przycisk)}</button>
          <button value="anuluj" class="btn tekst">Wróć</button>
        </div>
      </form>`;
    document.body.append(d);
    // Zamknięcie z animacją: arkusz zjeżdża w dół, dopiero potem znika.
    // Po „Podpisz” od razu podpis (bez czekania na arkusz), po „Wróć” arkusz zjeżdża.
    $('form', d).addEventListener('submit', async e => { e.preventDefault(); const v = e.submitter?.value || 'anuluj'; if (v !== 'ok') await schowaj(d); if (d.open) d.close(v); });
    d.addEventListener('cancel', async e => { e.preventDefault(); await schowaj(d); if (d.open) d.close('anuluj'); });
    d.addEventListener('close', async () => {
      const ok = d.returnValue === 'ok';
      d.remove();
      if (!ok) return res(false);
      await podpis();
      if (idCelu) cel(idCelu);
      res(true);
    });
    d.showModal();
    wTelefonie(d);
    wysun(d);
    // Fokus na tytule, nie na przycisku podpisu: Safari przewijał do przycisku całą stronę (arkusz wyjeżdżał
    // poza telefon) i rysował wokół niego obwódkę. Czytnik ekranu zaczyna od tytułu, przycisk jest o jeden Tab dalej.
    $('#arkusz-t', d).focus({ preventScroll: true }); d.querySelector('.arkusz-in').scrollTop = 0; d.scrollTop = 0;
  });
}

// W symulacji telefonu okno wysuwa się z dołu ekranu telefonu, a nie okna przeglądarki.
// `pelny`: okno zajmuje cały ekran telefonu (skaner).
export function wTelefonie(d, pelny = false) {
  const tel = document.documentElement.classList.contains('ramka') && document.getElementById('telefon');
  if (!tel) return;
  const r = tel.getBoundingClientRect(), rog = Math.round(46 * r.width / 390);
  // Okno pełnoekranowe zaczyna się pod paskiem stanu telefonu, a jego wnętrze skalujemy jak telefon.
  const s = r.width / 390, pasek = 54 * s;
  if (pelny) d.style.setProperty('--sk-skala', s);
  Object.assign(d.style, pelny
    ? { position: 'fixed', margin: '0', left: r.left + 'px', top: (r.top + pasek) + 'px', width: r.width + 'px', height: (r.height - pasek) + 'px', maxWidth: 'none', maxHeight: 'none', borderRadius: `0 0 ${rog}px ${rog}px` }
    : { position: 'fixed', margin: '0', left: (r.left + 8 * s) + 'px', width: (r.width - 16 * s) + 'px', maxWidth: (r.width - 16 * s) + 'px', top: 'auto', bottom: (innerHeight - r.bottom + 8 * s) + 'px', maxHeight: 'none', overflow: 'hidden', borderRadius: (rog - 8 * s) + 'px' }); // pływający arkusz, rogi współśrodkowe z ekranem
  // Arkusz leży nad stroną, a nie w telefonie, więc jego treść skalujemy jak telefon (tekst tej samej wielkości co w aplikacji).
  const tresc = !pelny && d.querySelector('.arkusz-in');
  if (!tresc) return;
  tresc.classList.add('w-ramce');
  Object.assign(tresc.style, { width: (390 - 16) + 'px', maxHeight: Math.round(844 * 0.9) + 'px', overflowY: 'auto', transform: `scale(${s})`, transformOrigin: '0 0' });
  const dopasuj = () => { d.style.height = tresc.offsetHeight * s + 'px'; };
  dopasuj(); new ResizeObserver(dopasuj).observe(tresc);
}

// Symulacja podpisu biometrycznego/PIN-em (w prawdziwej aplikacji: podpis mObywatela).
// Rozpoznanie twarzy (jak Face ID w iPhonie): ramka, oczy, nos, uśmiech; po sukcesie znak w kółku.
const TWARZ = '<svg class="fid" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15v-5a4 4 0 0 1 4-4h5M33 6h5a4 4 0 0 1 4 4v5M42 33v5a4 4 0 0 1-4 4h-5M15 42h-5a4 4 0 0 1-4-4v-5"/><path class="fid-tw" d="M17 18v3M31 18v3M24 18v8h-2M18 32s2.4 2.6 6 2.6 6-2.6 6-2.6"/></svg>';
const ZNAK_OK = '<svg class="fid-ok" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path class="rysuj-l" d="m16 24.5 5.5 5.5L32 19"/></svg>';

// `gdzie`: w otwartym oknie (np. skanerze) animacja musi być w nim, inaczej zostanie pod spodem.
export function podpis(gdzie = document.body) {
  // W symulacji iPhone'a Face ID pokazuje się w Dynamic Island, jak w prawdziwym telefonie.
  const wyspa = document.documentElement.classList.contains('ramka') && document.getElementById('wyspa');
  if (wyspa && gdzie === document.body) return podpisWyspa(wyspa); // skaner zasłania wyspę: tam okienko w skanerze
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'podpis'; el.setAttribute('role', 'status');
    el.innerHTML = `<div>${TWARZ}<span>Face ID</span></div>`;
    gdzie.append(el);
    wyskocz(el.firstElementChild);
    const t = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__SZYBKO ? 50 : 700;
    setTimeout(() => { el.classList.add('ok'); el.innerHTML = `<div>${ZNAK_OK}<span>Podpisano</span></div>`; }, t);
    setTimeout(() => { el.classList.add('znika'); }, t * 1.8 - 160);
    setTimeout(() => { el.remove(); res(); }, t * 1.8);
  });
}

function podpisWyspa(w) {
  return new Promise(res => {
    const t = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__SZYBKO ? 50 : 700;
    w.setAttribute('role', 'status');
    w.classList.add('fid-on'); w.innerHTML = `${TWARZ}<span>Face ID</span>`;
    // Znak „podpisano” zastępuje twarz od razu (bez opóźnionego wejścia), żeby wyspa nie była przez chwilę pusta.
    setTimeout(() => { w.classList.add('ok'); w.innerHTML = `${ZNAK_OK}<span>Podpisano</span>`; ogloszenie('Podpisano'); }, t);
    // Zwijanie: treść gaśnie razem z kurczeniem się wyspy, a znika z drzewa dopiero po animacji.
    setTimeout(() => { w.classList.remove('fid-on'); w.removeAttribute('role'); setTimeout(() => { if (!w.classList.contains('fid-on')) { w.innerHTML = ''; w.classList.remove('ok'); } }, 340); }, Math.max(t * 1.8 - 120, t * 1.5)); // wyspa zwija się tuż przed końcem
    setTimeout(res, t * 1.8);
  });
}

export function dodajWyslane(tytul, doKogo) {
  stan.wyslane.unshift({ tytul, do: doKogo, kiedy: Date.now() });
  zapisz();
}
