// Stan aplikacji, zdarzenia (dla trybu testowego) i wspólne elementy interfejsu.
import { ic } from './icons.js';

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
});

function wczytaj() {
  try { return Object.assign(POCZATEK(), JSON.parse(localStorage.getItem(KLUCZ)) || {}); } catch { return POCZATEK(); }
}
export const stan = wczytaj();
export function zapisz() { try { localStorage.setItem(KLUCZ, JSON.stringify(stan)); } catch {} }
export function resetuj() { Object.assign(stan, POCZATEK()); zapisz(); }

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
        <h2 id="arkusz-t">${esc(tytul)}</h2>
        <p class="maly">Sprawdź przed podpisem. Bez Twojego podpisu nic nie zostanie wysłane.</p>
        <h3 class="nag">Co wyślemy i dokąd</h3>
        <ol class="kontrolna">${pozycje.map(p => `<li>${ic('check', 'ok')}<span><b>${esc(p.co)}</b><small>do: ${esc(p.do)}</small></span></li>`).join('')}</ol>
        ${dane.length ? `<h3 class="nag">Jakie Twoje dane zostaną użyte</h3><p class="maly">${dane.map(esc).join(' · ')}</p>` : ''}
        ${cofniecie ? `<p class="uwaga">${ic('info')}<span>${esc(cofniecie)}</span></p>` : ''}
        <div class="przyciski">
          <button value="anuluj" class="btn drugi">Wróć</button>
          <button value="ok" class="btn glowny" id="arkusz-ok">${ic('key')}${esc(przycisk)}</button>
        </div>
      </form>`;
    document.body.append(d);
    d.addEventListener('close', async () => {
      const ok = d.returnValue === 'ok';
      d.remove();
      if (!ok) return res(false);
      await podpis();
      if (idCelu) cel(idCelu);
      res(true);
    });
    d.showModal();
    // W symulacji telefonu arkusz wysuwa się z dołu ekranu telefonu, a nie okna przeglądarki.
    const tel = document.documentElement.classList.contains('ramka') && document.getElementById('telefon');
    if (tel) {
      const r = tel.getBoundingClientRect();
      Object.assign(d.style, { position: 'fixed', margin: '0', left: r.left + 'px', width: r.width + 'px', maxWidth: r.width + 'px', top: 'auto', bottom: (innerHeight - r.bottom) + 'px', maxHeight: (r.height * 0.9) + 'px', borderRadius: '24px 24px 46px 46px' });
    }
    // fokus na przycisku podpisu, ale bez przewijania: najpierw widać tytuł i listę
    $('#arkusz-ok', d).focus({ preventScroll: true }); d.querySelector('.arkusz-in').scrollTop = 0; d.scrollTop = 0;
  });
}

// Symulacja podpisu biometrycznego/PIN-em (w prawdziwej aplikacji: podpis mObywatela).
export function podpis() {
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'podpis'; el.setAttribute('role', 'status');
    el.innerHTML = `<div>${ic('key', 'duza')}<span>Podpisuję…</span></div>`;
    document.body.append(el);
    const t = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__SZYBKO ? 50 : 700;
    setTimeout(() => { el.innerHTML = `<div>${ic('check', 'duza')}<span>Podpisano</span></div>`; }, t);
    setTimeout(() => { el.remove(); res(); }, t * 1.8);
  });
}

export function dodajWyslane(tytul, doKogo) {
  stan.wyslane.unshift({ tytul, do: doKogo, kiedy: Date.now() });
  zapisz();
}
