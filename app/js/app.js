// Router i powłoka aplikacji.
import { ic } from './icons.js';
import { stan, $, $$, ogloszenie, resetuj, ustawMotyw, wyborMotywu } from './core.js';
import * as W from './widoki.js';
// Ekrany spoza startu ładujemy dopiero, gdy są potrzebne: start rysuje się szybciej.
const S = () => import('./sprawy.js'), B = () => import('./obywatel.js'), K = () => import('./skaner.js');
const asystent = async q => (await import('./asystent.js')).asystent(q);
const jury = async () => (await import('./jury.js')).jury();
import { testWidok, podlacz } from './test.js';
import { wjazdEkranu, wyskocz, kaskada, spokojnie } from './ruch.js';

const TRASY = [
  [/^\/?(start)?$/, () => W.start()],
  [/^\/sprawy$/, async () => (await S()).katalog()],
  [/^\/sprawa\/narodziny$/, async () => (await S()).narodziny()],
  [/^\/sprawa\/przeprowadzka$/, async () => (await S()).przeprowadzka()],
  [/^\/sprawa\/auto$/, async () => (await S()).auto()],
  [/^\/sprawa\/utrata$/, async () => (await S()).utrata()],
  [/^\/sprawa\/utrata\/znaleziony$/, async () => (await S()).znaleziony()],
  [/^\/sprawa\/dowod$/, async () => (await S()).dowod()],
  [/^\/sprawa\/([a-z]+)$/, async m => (await S()).podglad(m[1])],
  [/^\/mandat$/, async () => (await S()).mandat()],
  [/^\/podatek$/, async () => (await S()).podatek()],
  [/^\/badanie$/, async () => (await S()).badanie()],
  [/^\/asystent$/, (m, q) => asystent(q)],
  [/^\/dokumenty$/, () => W.dokumentyWidok()],
  [/^\/dokument\/([a-z]+)$/, m => W.dokument(m[1])],
  [/^\/pokaz$/, () => W.pokaz()],
  [/^\/skrzynka$/, () => W.skrzynkaWidok()],
  [/^\/pismo\/([a-z]+)$/, m => W.pismo(m[1])],
  [/^\/naleznosci$/, () => W.naleznosciWidok()],
  [/^\/(zlecenia|autopilot)$/, () => W.autopilotWidok()],
  [/^\/dane$/, () => W.dane()],
  [/^\/dane\/dostep$/, () => W.dostepWidok()],
  [/^\/dane\/rejestry$/, () => W.rejestry()],
  [/^\/kod\/([a-z]+)$/, async m => (await K()).kodWidok(m[1])],
  [/^\/kto-dzwoni$/, async () => (await B()).ktoDzwoni()],
  [/^\/poparcie$/, async () => (await B()).poparcieWidok()],
  [/^\/poparcie\/([a-z]+)$/, async m => (await B()).inicjatywa(m[1])],
  [/^\/bliscy$/, () => W.bliscy()],
  [/^\/bliscy\/mama$/, () => W.blMama()],
  [/^\/dostep$/, () => W.odzyskaj()],
  [/^\/konsultant$/, () => W.konsultant()],
  [/^\/ustawienia$/, () => W.ustawienia()],
  [/^\/wiecej$/, () => W.wiecej()],
  [/^\/jury$/, () => jury()],
  [/^\/test(?:\/([a-z]+))?$/, m => testWidok(m[1])],
];

const ZAKLADKI = [
  ['#/start', 'home', 'Start', /^\/?(start)?$/],
  ['#/sprawy', 'list', 'Sprawy', /^\/(sprawy|sprawa|mandat|podatek|badanie)/],
  ['#/asystent', 'chat', 'Asystent', /^\/asystent/],
  ['#/dokumenty', 'wallet', 'Dokumenty', /^\/(dokument|pokaz)/],
  ['#/wiecej', 'more', 'Więcej', /^\/(wiecej|skrzynka|pismo|naleznosci|zlecenia|autopilot|dane|bliscy|dostep|konsultant|ustawienia|jury|test|kto-dzwoni|poparcie)/],
];

function zastosujUstawienia() {
  const U = stan.ustawienia, h = document.documentElement;
  h.classList.toggle('prosty', !!U.prosty);
  h.classList.toggle('duzy', !!U.duzy || !!U.prosty);
  h.classList.toggle('kontrast', !!U.kontrast);
}

function naglowek() {
  const n = W.licznikSkrzynki();
  $('#skrzynka-btn').innerHTML = ic('mail') + (n ? `<span class="kropka">${n}</span>` : '');
  $('#skrzynka-btn').setAttribute('aria-label', n ? `Pisma i płatności, ${n} nowe` : 'Pisma i płatności');
}

let pierwszy = true, poprzednia = null, bylGotowy = false, nrPokazu = 0;
// Kierunek przejścia: głębiej (dalej), płycej (wstecz) albo między zakładkami.
const glebokosc = s => s.split('/').filter(Boolean).length;
const korzen = s => ZAKLADKI.some(z => z[0].slice(1) === s) || s === '' || s === '/';
const odwiedzone = [];
function kierunek(z, na) {
  if (z === null || z === na) return null;
  const powrot = odwiedzone.at(-2) === na;
  if (powrot) odwiedzone.pop(); else odwiedzone.push(na);
  if (korzen(z) && korzen(na)) return 'zakladka';
  return powrot || glebokosc(na) < glebokosc(z) ? 'wstecz' : 'dalej';
}
async function pokaz() {
  const nr = ++nrPokazu;
  // Zmiana ekranu (np. przycisk „wstecz”) zamyka otwarty arkusz zgody i skaner bez wysyłania.
  $$('dialog.arkusz[open], dialog.skaner[open]').forEach(d => d.close('anuluj'));
  const [sciezka, qs] = location.hash.replace(/^#/, '').split('?');
  const q = new URLSearchParams(qs || '');
  let widok = null;
  for (const [re, f] of TRASY) { const m = sciezka.match(re); if (m) { widok = await f(m, q); if (widok) break; } }
  if (nr !== nrPokazu) return; // w międzyczasie przyszła nowsza nawigacja
  if (!widok) widok = { tytul: 'Nie ma takiej strony', html: `<h1 tabindex="-1">Nie ma takiej strony</h1><p>Wróć na <a href="#/start">start</a>.</p>` };
  const main = $('#tresc');
  main.innerHTML = widok.html;
  widok.po?.(main);
  document.title = `${widok.tytul} · mObywatel (prototyp)`;
  $$('#nawigacja a').forEach((a, i) => { const akt = ZAKLADKI[i][3].test(sciezka); a.classList.toggle('akt', akt); akt ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  naglowek();
  scrollTo(0, 0);
  const apl = $('.aplikacja'); if (apl) apl.scrollTop = 0;
  $$('.panel-kroki a').forEach(a => a.classList.toggle('akt', a.getAttribute('href').slice(1) === sciezka));
  if (!pierwszy) { $('h1', main)?.focus({ preventScroll: true }); ogloszenie(widok.tytul); }
  const kier = kierunek(poprzednia, sciezka), gotowy = !!$('.gotowe', main);
  // Po podpisie adres się nie zmienia, ale ekran tak: potwierdzenie też ma wejść.
  if (kier) wjazdEkranu(main, kier); else if (gotowy && !bylGotowy && !pierwszy) wjazdEkranu(main, 'zakladka');
  if (gotowy && (kier || !bylGotowy) && !pierwszy) { wyskocz($('.gotowe-ik', main)); kaskada($$('.os-czasu li', main)); }
  bylGotowy = gotowy;
  if (pierwszy) odwiedzone.push(sciezka);
  pierwszy = false; poprzednia = sciezka;
}

// Widok na komputerze: „telefon” (symulacja iPhone'a z panelem opisu) albo „pełny ekran”.
// Na wąskich ekranach (telefon) zawsze pełny ekran. Wybór zapamiętany; można go wymusić adresem ?widok=telefon|pelny.
const KLUCZ_WIDOKU = 'mobywatel-proto-widok';
function trybWidoku() {
  const z = new URLSearchParams(location.search).get('widok');
  if (z === 'telefon' || z === 'pelny') { try { localStorage.setItem(KLUCZ_WIDOKU, z); } catch {} return z; }
  try { return localStorage.getItem(KLUCZ_WIDOKU) || 'telefon'; } catch { return 'telefon'; }
}
function ustawWidok(tryb = trybWidoku()) {
  const h = document.documentElement;
  const szeroki = innerWidth >= 900 && innerHeight >= 600;
  h.classList.toggle('ramka', szeroki && tryb === 'telefon');
  h.classList.toggle('pelny', szeroki && tryb === 'pelny');
  $('#telefon-btn').hidden = !(szeroki && tryb === 'pelny');
  // Pasek trybu testowego zabiera górę okna: telefon ma się zmieścić pod nim w całości.
  const pasek = $('#pasek-testu')?.offsetHeight || 0;
  h.style.setProperty('--pasek-wys', pasek + 'px');
  h.style.setProperty('--skala-tel', Math.min(1, (innerHeight - 48 - pasek) / 868).toFixed(3));
}
function zmienWidok(tryb) {
  try { localStorage.setItem(KLUCZ_WIDOKU, tryb); } catch {}
  ustawWidok(tryb);
  try {
    if (tryb === 'pelny' && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    if (tryb === 'telefon' && document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  } catch {}
}
function zegar() {
  const z = $('#zegar'); if (z) z.textContent = new Date().toLocaleTimeString('pl-PL', { hour: 'numeric', minute: '2-digit' });
}

// Karty dokumentów przechylają się lekko za kursorem, odblask i hologram idą za światłem (tylko mysz, bez „ogranicz ruch”).
function przechylKarty() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  addEventListener('pointermove', e => {
    const k = e.target.closest?.('.kd');
    $$('.kd.ruch').forEach(x => { if (x !== k) { x.classList.remove('ruch'); x.style.cssText = ''; } });
    if (!k || spokojnie()) return;
    const r = k.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    k.classList.add('ruch');
    k.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg');
    k.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
    k.style.setProperty('--kat', Math.round(x * 220) + 'deg'); // hologram mieni się z kątem światła
    k.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    k.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  }, { passive: true });
}

function powloka() {
  przechylKarty();
  if (window.__SZYBKO) document.documentElement.classList.add('bez-ruchu'); // testy: bez animacji
  ustawWidok(); zegar(); setInterval(zegar, 30000);
  addEventListener('resize', () => ustawWidok());
  $('#pelny-btn').onclick = () => zmienWidok('pelny');
  $('#telefon-btn').onclick = () => zmienWidok('telefon');
  $('#od-nowa-btn').onclick = () => { resetuj(); location.hash = '#/start'; dispatchEvent(new Event('ustawienia')); };
  $('#nawigacja').innerHTML = ZAKLADKI.map(([h, i, t]) => `<a href="${h}">${ic(i, 'zwykla')}${ic(i + '-f', 'pelna')}<span>${t}</span></a>`).join('');
  $('#ustawienia-btn').innerHTML = ic('gear');
  $('#skan-btn').innerHTML = ic('scan');
  $('#skan-btn').onclick = async () => (await K()).otworzSkaner();
  zastosujUstawienia();
  $('#panel-wyglad').innerHTML = wyborMotywu('motyw-panel');
  addEventListener('change', e => { if (e.target.name?.startsWith('motyw')) ustawMotyw(e.target.value); });
  addEventListener('ustawienia', () => { zastosujUstawienia(); pokaz(); });
  addEventListener('hashchange', pokaz);
  podlacz();
  pokaz();
  if ('serviceWorker' in navigator && location.protocol === 'https:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
    navigator.serviceWorker?.register('sw.js').catch(() => {});
  }
}

powloka();
