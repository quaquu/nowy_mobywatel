// Router i powłoka aplikacji.
import { ic } from './icons.js';
import { stan, $, $$, ogloszenie } from './core.js';
import * as W from './widoki.js';
import * as S from './sprawy.js';
import { asystent } from './asystent.js';
import { jury } from './jury.js';
import { testWidok, podlacz } from './test.js';

const TRASY = [
  [/^\/?(start)?$/, () => W.start()],
  [/^\/sprawy$/, () => S.katalog()],
  [/^\/sprawa\/narodziny$/, () => S.narodziny()],
  [/^\/sprawa\/przeprowadzka$/, () => S.przeprowadzka()],
  [/^\/sprawa\/auto$/, () => S.auto()],
  [/^\/sprawa\/utrata$/, () => S.utrata()],
  [/^\/sprawa\/utrata\/znaleziony$/, () => S.znaleziony()],
  [/^\/sprawa\/dowod$/, () => S.dowod()],
  [/^\/sprawa\/([a-z]+)$/, m => S.podglad(m[1])],
  [/^\/mandat$/, () => S.mandat()],
  [/^\/podatek$/, () => S.podatek()],
  [/^\/asystent$/, (m, q) => asystent(q)],
  [/^\/dokumenty$/, () => W.dokumentyWidok()],
  [/^\/dokument\/([a-z]+)$/, m => W.dokument(m[1])],
  [/^\/pokaz$/, () => W.pokaz()],
  [/^\/skrzynka$/, () => W.skrzynkaWidok()],
  [/^\/pismo\/([a-z]+)$/, m => W.pismo(m[1])],
  [/^\/naleznosci$/, () => W.naleznosciWidok()],
  [/^\/autopilot$/, () => W.autopilotWidok()],
  [/^\/dane$/, () => W.dane()],
  [/^\/dane\/dostep$/, () => W.dostepWidok()],
  [/^\/dane\/rejestry$/, () => W.rejestry()],
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
  ['#/sprawy', 'list', 'Sprawy', /^\/(sprawy|sprawa|mandat|podatek)/],
  ['#/asystent', 'chat', 'Asystent', /^\/asystent/],
  ['#/dokumenty', 'wallet', 'Dokumenty', /^\/(dokument|pokaz)/],
  ['#/wiecej', 'more', 'Więcej', /^\/(wiecej|skrzynka|pismo|naleznosci|autopilot|dane|bliscy|dostep|konsultant|ustawienia|jury|test)/],
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

let pierwszy = true;
function pokaz() {
  const [sciezka, qs] = location.hash.replace(/^#/, '').split('?');
  const q = new URLSearchParams(qs || '');
  let widok = null;
  for (const [re, f] of TRASY) { const m = sciezka.match(re); if (m) { widok = f(m, q); if (widok) break; } }
  if (!widok) widok = { tytul: 'Nie ma takiej strony', html: `<h1 tabindex="-1">Nie ma takiej strony</h1><p>Wróć na <a href="#/start">start</a>.</p>` };
  const main = $('#tresc');
  main.innerHTML = widok.html;
  widok.po?.(main);
  document.title = `${widok.tytul} · mObywatel (prototyp)`;
  $$('#nawigacja a').forEach((a, i) => { const akt = ZAKLADKI[i][3].test(sciezka); a.classList.toggle('akt', akt); akt ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  naglowek();
  scrollTo(0, 0);
  if (!pierwszy) { $('h1', main)?.focus({ preventScroll: true }); ogloszenie(widok.tytul); }
  pierwszy = false;
}

function powloka() {
  $('#nawigacja').innerHTML = ZAKLADKI.map(([h, i, t]) => `<a href="${h}">${ic(i)}<span>${t}</span></a>`).join('');
  $('#ustawienia-btn').innerHTML = ic('gear');
  zastosujUstawienia();
  addEventListener('ustawienia', () => { zastosujUstawienia(); pokaz(); });
  addEventListener('hashchange', pokaz);
  podlacz();
  pokaz();
  if ('serviceWorker' in navigator && location.protocol === 'https:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
    navigator.serviceWorker?.register('sw.js').catch(() => {});
  }
}

powloka();
