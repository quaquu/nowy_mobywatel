// Tryb testowy: zadania dla testerów, pomiar czasu, kliknięć i sukcesu, kwestionariusz SUS, eksport JSON.
// Nic nie jest wysyłane w sieć. Wyniki zapisują się w tej przeglądarce i można je pobrać jako plik.
import { ic } from './icons.js';
import { stan, zapisz, resetuj, on, esc, $, $$, toast } from './core.js';
import { resetDostepu } from './widoki.js';

export const ZADANIA = [
  { id: 'T1', cel: 'narodziny', start: '#/start', tekst: 'Urodziła się Twoja córka. Daj jej na imię Zofia i załatw wszystkie sprawy urzędowe z tym związane.' },
  { id: 'T2', cel: 'mandat', start: '#/start', tekst: 'Dostałaś mandat z fotoradaru. Prowadziłaś Ty. Zapłać go (kod BLIK: 123456).' },
  { id: 'T3', cel: 'dostep-policja', start: '#/start', tekst: 'Sprawdź, czy policja sprawdzała ostatnio Twoje dane, i dowiedz się, w jakim celu.' },
  { id: 'T4', cel: 'przeprowadzka', start: '#/start', tekst: 'Przeprowadzasz się na ul. Piotrkowską 210 w Łodzi. Zamelduj się pod nowym adresem.' },
  { id: 'T5', cel: 'dostep', start: '#/start', tekst: 'Wyobraź sobie, że nie możesz się zalogować, bo wygasł certyfikat mDowodu. Odzyskaj dostęp.' },
];
const SUS = [
  'Myślę, że chciał(a)bym często korzystać z tej aplikacji.',
  'Aplikacja jest niepotrzebnie skomplikowana.',
  'Aplikacja jest łatwa w użyciu.',
  'Potrzebował(a)bym pomocy technicznej, żeby z niej korzystać.',
  'Różne funkcje są dobrze ze sobą połączone.',
  'W aplikacji jest za dużo niespójności.',
  'Większość ludzi szybko nauczy się z niej korzystać.',
  'Korzystanie z aplikacji jest bardzo niewygodne.',
  'Czułem/czułam się pewnie, korzystając z aplikacji.',
  'Musiał(a)bym się dużo nauczyć, zanim zacznę z niej korzystać.',
];
const KLUCZ = 'mobywatel-proto-test';
let sesja = (() => { try { return JSON.parse(localStorage.getItem(KLUCZ)); } catch { return null; } })();
const zapiszSesje = () => { try { localStorage.setItem(KLUCZ, JSON.stringify(sesja)); } catch {} };

export const aktywny = () => sesja && sesja.biezace != null && sesja.biezace < ZADANIA.length;

// Liczymy kliknięcia w elementy interaktywne i odwiedzone ekrany podczas zadania.
export function podlacz() {
  document.addEventListener('click', e => {
    if (!aktywny() || e.target.closest('#pasek-testu')) return;
    if (e.target.closest('a,button,input,select,summary,label')) { sesja.wyniki[sesja.biezace].klikniecia++; zapiszSesje(); }
  }, true);
  addEventListener('hashchange', () => { if (aktywny()) { sesja.wyniki[sesja.biezace].ekrany.push(location.hash.split('?')[0]); zapiszSesje(); } });
  on('cel', id => {
    if (!aktywny()) return;
    const z = ZADANIA[sesja.biezace], w = sesja.wyniki[sesja.biezace];
    if (id === z.cel && !w.sukces) { w.sukces = true; w.czasS = +((Date.now() - w.start) / 1000).toFixed(1); zapiszSesje(); setTimeout(() => pasek(true), 600); }
  });
  pasek();
}

function rozpocznij(i) {
  resetuj(); resetDostepu();
  const z = ZADANIA[i];
  sesja.biezace = i;
  sesja.wyniki[i] = { id: z.id, cel: z.cel, start: Date.now(), klikniecia: 0, ekrany: [], sukces: false, poddane: false, czasS: null };
  zapiszSesje();
  location.hash = z.start;
  dispatchEvent(new Event('ustawienia'));
  pasek();
}

function pasek(sukces) {
  let p = $('#pasek-testu');
  if (!aktywny()) { p?.remove(); document.body.classList.remove('testuje'); return; }
  if (!p) { p = document.createElement('aside'); p.id = 'pasek-testu'; p.setAttribute('aria-label', 'Zadanie testowe'); document.body.prepend(p); }
  document.body.classList.add('testuje');
  const i = sesja.biezace, z = ZADANIA[i], w = sesja.wyniki[i];
  p.innerHTML = w.sukces || sukces
    ? `<p><b>Zadanie ${i + 1} z ${ZADANIA.length} wykonane.</b> Czas: ${w.czasS} s.</p><button class="btn glowny maly-btn" id="t-dalej">Dalej</button>`
    : `<p><b>Zadanie ${i + 1} z ${ZADANIA.length}:</b> ${esc(z.tekst)}</p><button class="btn tekst maly-btn" id="t-podd">Nie wiem, jak to zrobić</button>`;
  $('#t-dalej', p)?.addEventListener('click', nastepne);
  $('#t-podd', p)?.addEventListener('click', () => { w.poddane = true; w.czasS = +((Date.now() - w.start) / 1000).toFixed(1); zapiszSesje(); nastepne(); });
}

function nastepne() {
  const i = sesja.biezace + 1;
  if (i < ZADANIA.length) return rozpocznij(i);
  sesja.biezace = null; zapiszSesje(); pasek();
  location.hash = '#/test/sus';
}

export function sus(odp) { // standardowe liczenie SUS (Brooke 1996): 0–100
  let s = 0; odp.forEach((v, i) => { s += i % 2 === 0 ? v - 1 : 5 - v; }); return s * 2.5;
}

export function testWidok(podstrona) {
  if (podstrona === 'sus') {
    return {
      tytul: 'Ankieta',
      html: `<h1 tabindex="-1">Ostatni krok: 10 krótkich pytań</h1>
      <p class="wstep">Zaznacz, na ile się zgadzasz: 1 = zdecydowanie nie, 5 = zdecydowanie tak.</p>
      <form id="f-sus" class="karta">${SUS.map((q, i) => `<fieldset class="sus"><legend>${i + 1}. ${esc(q)}</legend><div class="skala">${[1, 2, 3, 4, 5].map(v => `<label><input type="radio" name="q${i}" value="${v}" required><span>${v}</span></label>`).join('')}</div></fieldset>`).join('')}
      <button class="btn glowny szeroki">Zakończ i pokaż wyniki</button></form>`,
      po(root) {
        $('#f-sus', root).onsubmit = e => {
          e.preventDefault();
          const odp = SUS.map((_, i) => +$(`input[name=q${i}]:checked`, root).value);
          sesja.sus = { odpowiedzi: odp, wynik: sus(odp) }; sesja.koniec = Date.now(); zapiszSesje();
          location.hash = '#/test/wyniki';
        };
      },
    };
  }
  if (podstrona === 'wyniki' && sesja) {
    const json = JSON.stringify({ wersja: 1, ...sesja, przegladarka: navigator.userAgent, szerokosc: innerWidth }, null, 2);
    const ok = sesja.wyniki.filter(w => w?.sukces).length;
    return {
      tytul: 'Wyniki testu',
      html: `<h1 tabindex="-1">Dziękujemy!</h1>
      <section class="karta">${sesja.wyniki.map(w => `<div class="wiersz"><span>${w.id}</span><b>${w.sukces ? '✓' : '✗'} ${w.czasS ?? '–'} s · ${w.klikniecia} klik.</b></div>`).join('')}
      <div class="wiersz"><span>Zadania wykonane</span><b>${ok} z ${ZADANIA.length}</b></div>${sesja.sus ? `<div class="wiersz"><span>Wynik SUS</span><b>${sesja.sus.wynik}</b></div>` : ''}</section>
      <p>Wyślij plik z wynikami osobie, która prowadzi test.</p>
      <div class="przyciski pion"><button class="btn glowny" id="pobierz">Pobierz wyniki (JSON)</button><button class="btn drugi" id="kopiuj">Skopiuj wyniki</button></div>
      <details class="rozw"><summary>Podgląd danych</summary><pre class="json">${esc(json)}</pre></details>`,
      po(root) {
        $('#pobierz', root).onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = `test-${sesja.tester || 'anon'}-${new Date().toISOString().slice(0, 10)}.json`; a.click(); };
        $('#kopiuj', root).onclick = async () => { try { await navigator.clipboard.writeText(json); toast('Skopiowano.'); } catch { toast('Nie udało się skopiować. Użyj podglądu.'); } };
      },
    };
  }
  return {
    tytul: 'Tryb testowy',
    html: `<h1 tabindex="-1">Tryb testowy</h1>
    <p class="wstep">Dla osób, które testują prototyp. Dostaniesz ${ZADANIA.length} zadań. Mierzymy czas i liczbę kliknięć. Na końcu 10 pytań. Nic nie jest wysyłane do internetu.</p>
    <form id="f-test" class="karta">
      <label class="etyk" for="tester">Kod testera (bez imienia i nazwiska)</label>
      <input id="tester" class="pole" placeholder="np. T03" autocomplete="off">
      <fieldset class="grupa"><legend class="etyk">Wiek</legend>${['18–34', '35–49', '50–64', '65+'].map(w => `<label class="opcja"><input type="radio" name="wiek" value="${w}" required> ${w}</label>`).join('')}</fieldset>
      <fieldset class="grupa"><legend class="etyk">Czy korzystasz z obecnego mObywatela?</legend>${['często', 'czasem', 'nie'].map(w => `<label class="opcja"><input type="radio" name="mob" value="${w}" required> ${w}</label>`).join('')}</fieldset>
      <button class="btn glowny szeroki">${ic('test')}Zacznij test</button>
    </form>
    <h2 class="sekcja">Zadania</h2><ol class="punkty">${ZADANIA.map(z => `<li>${esc(z.tekst)}</li>`).join('')}</ol>`,
    po(root) {
      $('#f-test', root).onsubmit = e => {
        e.preventDefault();
        sesja = { tester: $('#tester', root).value.trim() || 'anon', wiek: $('input[name=wiek]:checked', root).value, mobywatel: $('input[name=mob]:checked', root).value, poczatek: Date.now(), wyniki: [], biezace: null };
        rozpocznij(0);
      };
    },
  };
}
