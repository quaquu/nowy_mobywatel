// Ekrany poza przebiegami spraw: start, dokumenty, skrzynka, prywatność, bliscy, ustawienia.
import { ic } from './icons.js';
import { stan, zapisz, resetuj, esc, $, $$, arkuszZgody, ogloszenie, toast, cel, dodajWyslane, wyborMotywu, przewinDo } from './core.js';
import { portret, yarisCross, niemowle } from './grafiki.js';
import { ja, dziecko, mama, dokumenty, zadania, naleznosci, autopilot, dostep, skrzynka, za, fmt, fmtPelna, zl, OSOBA, OSOBY, osoba, adresOsoby, emerytalne, rataOpis, zaRob } from './data.js';

// Awatar osoby albo dziecka: klucz z danych („corka”, „mama”, osoba z pokazu) albo nazwa ikony.
// Awatar osoby: ten sam portret co na dokumencie, przybliżony na twarz w kółku; córka: portret niemowlęcia.
const AWATARY = { corka: () => niemowle(), ...Object.fromEntries(['anna', 'halina', 'jakub', 'kasia'].map(k => [k, () => portret(k, null, 'awatar')])), mama: () => portret('halina', null, 'awatar') };
const awatar = k => AWATARY[k] ? AWATARY[k]() : k;

const wiersz = (k, v) => `<div class="wiersz"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
// `ikona`: nazwa ikony albo gotowy rysunek SVG (awatar osoby).
const poz = (href, ikona, t, opis, extra = '') => `<li><a class="poz" href="${href}">${(ikona = awatar(ikona)).startsWith('<') ? `<span class="awatar">${ikona}</span>` : ic(ikona, 'okr')}<span><b>${esc(t)}</b>${opis ? `<small>${opis}</small>` : ''}</span>${extra}${ic('right', 'strz')}</a></li>`;
const otwarte = () => zadania.filter(z => !stan.zrobione[z.id]);
// Badanie techniczne po rezerwacji: zamiast „stacje w pobliżu” termin i stacja.
const rezerwacja = () => { const r = stan.badanie; if (!r) return null; const t = new Date(r.kiedy); return `zarezerwowane: ${fmt(t, { weekday: 'short', day: 'numeric', month: 'long' })}, ${t.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} · ${r.krotko}`; };
// Do zrobienia jak księga terminów: z lewej data w kroju nagłówków (dzień i miesiąc), potem sprawa.
const dataZad = d => { const dni = Math.round((d - za(0)) / 864e5); return dni <= 0 ? '<b>dziś</b>' : `<b>${d.getDate()}</b><small>${fmt(d, { month: 'short' })}</small>`; };
const wierszZad = z => `<li><a class="poz zad" href="${z.cel}"><span class="zad-data">${dataZad(z.termin)}</span><span><b>${esc(z.tytul)}</b><small>${esc(z.id === 'badanie' && rezerwacja() || z.opis)}</small></span>${z.pilne ? '<span class="plak czerwona">pilne</span>' : ''}${ic('right', 'strz')}</a></li>`;
const nowePisma = () => skrzynka.filter(p => p.nowa && !stan.przeczytane[p.id]).length;
export const licznikSkrzynki = nowePisma;


// Stos kart dokumentów jak w portfelu mObywatela: karty z tyłu wystają paskiem z nazwą, przednia jest cała.
// Pozorny kod QR (wzór dekoracyjny, nic nie koduje): 21×21 modułów, trzy znaczniki narożne.
function kodQR(ziarno = 7) {
  let x = ziarno, rects = '';
  const los = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
  const znacznik = (r, c) => r >= 0 && c >= 0 && r < 7 && c < 7 && (r === 0 || r === 6 || c === 0 || c === 6 || (r > 1 && r < 5 && c > 1 && c < 5));
  for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
    const wNarozniku = (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
    const pelny = wNarozniku ? (znacznik(r, c) || znacznik(r, c - 14) || znacznik(r - 14, c)) : los() > 0.52;
    if (pelny) rects += `<rect x="${c}" y="${r}" width="1" height="1"/>`;
  }
  return `<svg viewBox="-2 -2 25 25" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><rect x="-2" y="-2" width="25" height="25" fill="#fff"/><g fill="#111216">${rects}</g></svg>`;
}
function kartaDok(d, przod) {
  const dolna = przod
    ? `<span class="kd-duch" aria-hidden="true">${portret(OSOBA)}</span><span class="kd-dol"><span class="kd-foto">${portret(OSOBA)}</span><span class="kd-imie">${esc(ja.imie.toUpperCase())}<small>${esc(ja.nazwisko.toUpperCase())}</small></span><span class="kd-pill" aria-hidden="true">${ic('eye')}</span></span>`
    : '';
  return `<a class="kd kd-${d.kolor}${przod ? ' kd-przod' : ''}" href="${d.href || '#/dokument/' + d.id}" aria-label="${esc(d.nazwa)}: ${esc(d.linia)}${d.alert ? ', ' + esc(d.alert) : ''}">
    <span class="kd-gora"><b class="kd-t">${esc(d.nazwa)}</b>${d.alert && !przod ? '<span class="kd-kropka" aria-hidden="true"></span>' : ''}<span class="kd-holo" aria-hidden="true"></span></span>
    ${przod ? `<span class="kd-linia">${esc(d.linia)}</span>` : ''}${dolna}</a>`;
}
export function stos(lista, kompakt = false) {
  // ostatnia karta jest z przodu (cała), pozostałe wystają nad nią; na Starcie niższa, żeby liczby były na pierwszym ekranie
  return `<div class="stos${kompakt ? ' kompakt' : ''}" role="list">${lista.map((d, i) => `<div role="listitem">${kartaDok(d, i === lista.length - 1)}</div>`).join('')}</div>`;
}
const dokumentyDoStosu = () => {
  const l = dokumenty.slice(1).reverse(); // pierwszy dokument (mDowód) jest z przodu
  if (OSOBA === 'anna' && stan.zrobione.narodziny) l.unshift({ id: 'corka', nazwa: `${stan.imieDziecka} ${ja.nazwisko}`, linia: 'córka · PESEL i odpis aktu w drodze', kolor: 'zielony', href: '#/bliscy' });
  return [...l, dokumenty[0]];
};

/* ---------------- Start ---------------- */
// Szybkie akcje jak w aplikacji bankowej: trzy ulubione, które każdy wybiera sam, i „Dostosuj” na końcu.
// Katalog bez tego, co na Starcie już jest (skaner i pisma w nagłówku, dowód jako karta pod spodem).
const AKCJE = {
  pesel: () => { const z = peselStan().zastrzezony; return { href: '#/pesel', ik: z ? 'lock' : 'shield', t: z ? 'PESEL zastrzeżony' : 'Zastrzeż PESEL', nazwa: 'Zastrzeżenie PESEL', opis: 'stan, cofnięcie na czas kredytu', stan: z ? 'ok' : 'uwaga', aria: z ? 'PESEL zastrzeżony. Cofnij albo sprawdź' : 'PESEL nie jest zastrzeżony. Zastrzeż' }; },
  dzwoni: () => ({ href: '#/kto-dzwoni', ik: 'callcheck', t: 'Kto dzwoni?', opis: 'sprawdź numer, zanim cokolwiek powiesz' }),
  glos: () => ({ href: '#/asystent?mow=1', ik: 'mic', t: 'Asystent głosowy', opis: 'powiedz, czego szukasz, i przejdź do rozmowy' }),
  emerytura: () => emerytalne && ({ href: '#/emerytura', ik: 'sun', t: 'Emerytura', opis: 'ZUS, PPK, IKE i IKZE, prognoza' }),
  zdrowie: () => ({ href: '#/zdrowie', ik: 'heart', t: 'Zdrowie', opis: 'recepty, wyniki badań, wizyty' }),
  skorzystaj: () => ({ href: '#/naleznosci', ik: 'gift', t: 'Możesz skorzystać', opis: 'świadczenia i ulgi dla Ciebie' }),
  bliscy: () => ({ href: '#/bliscy', ik: 'users', t: 'Bliscy', opis: 'sprawy dzieci i rodziców' }),
  dane: () => ({ href: '#/dane/dostep', ik: 'eye', t: 'Moje dane', opis: 'kto sprawdzał moje dane' }),
  schrony: () => ({ href: '#/schrony', ik: 'home', t: 'Schrony', opis: 'najbliższe miejsca ochronne, także bez internetu' }),
  zgubione: () => ({ href: '#/sprawa/utrata', ik: 'alert', t: 'Zgubiony portfel', opis: 'zastrzeż dowód i karty od razu' }),
  poparcie: () => ({ href: '#/poparcie', ik: 'pen', t: 'Podpisy', opis: 'projekty ustaw, referenda, kandydaci' }),
  pomoc: () => ({ href: '#/konsultant', ik: 'phone', t: 'Pomoc', opis: 'rozmowa z konsultantem' }),
  zlecenia: () => ({ href: '#/zlecenia', ik: 'clock', t: 'Zlecenia', opis: 'przypomnienia i sprawy robione za Ciebie' }),
};
export const ULUBIONE_MAX = 3, ULUBIONE_DOMYSLNE = ['pesel', 'dzwoni', 'zgubione']; // bezpieczeństwo pod ręką; asystent ma własną zakładkę
const ulubione = () => (stan.szybkie || ULUBIONE_DOMYSLNE).filter(k => AKCJE[k]?.());
const szybkie = () => `<nav class="szybkie" aria-label="Szybkie akcje">
  ${ulubione().map(k => { const a = AKCJE[k](); return `<a href="${a.href}"${a.aria ? ` aria-label="${a.aria}"` : ''}><span class="sz-ik">${ic(a.ik)}${a.stan ? `<i class="sz-stan ${a.stan}" aria-hidden="true"></i>` : ''}</span>${a.t}</a>`; }).join('')}
  <a href="#/szybkie" class="sz-dostosuj"><span class="sz-ik">${ic('more')}</span>Dostosuj</a>
</nav>`;
// Wybór ulubionych: lista z przełącznikami, najwyżej trzy; kolejność jak w katalogu.
export function szybkieWidok() {
  const wyb = new Set(ulubione());
  const dostepne = Object.entries(AKCJE).map(([k, f]) => [k, f()]).filter(([, a]) => a);
  return {
    tytul: 'Szybkie akcje',
    html: `<h1 tabindex="-1">Szybkie akcje</h1>
    <p class="wstep">Wybierz ${ULUBIONE_MAX}, których używasz najczęściej. Pojawią się na Starcie.</p>
    <p class="maly" id="sz-licz" aria-live="polite"></p>
    <ul class="lista ustaw">${dostepne.map(([k, a]) => `<li><label class="przel-duzy"><span class="sz-wybor">${ic(a.ik, 'okr')}<span><b>${a.nazwa || a.t}</b><small>${a.opis}</small></span></span><input type="checkbox" role="switch" name="szybka" value="${k}" ${wyb.has(k) ? 'checked' : ''}></label></li>`).join('')}</ul>
    <div class="przyciski pion"><a class="btn glowny" href="#/start">Gotowe</a><button type="button" class="btn tekst" id="sz-domyslne">Przywróć domyślne</button></div>`,
    po(root) {
      const pola = $$('input[name=szybka]', root);
      const odswiez = () => {
        const n = pola.filter(i => i.checked).length;
        pola.forEach(i => { i.disabled = !i.checked && n >= ULUBIONE_MAX; });
        $('#sz-licz', root).textContent = `Wybrane: ${n} z ${ULUBIONE_MAX}.${n >= ULUBIONE_MAX ? ' Żeby dodać inną, wyłącz jedną z wybranych.' : ''}`;
      };
      pola.forEach(i => i.onchange = () => { stan.szybkie = pola.filter(x => x.checked).map(x => x.value); zapisz(); odswiez(); cel('szybkie-zmienione'); });
      $('#sz-domyslne', root).onclick = () => { stan.szybkie = null; zapisz(); pola.forEach(i => { i.checked = ULUBIONE_DOMYSLNE.includes(i.value); }); odswiez(); toast('Przywrócono domyślne szybkie akcje.'); };
      odswiez();
    },
  };
}
// Widżety z jedną liczbą każdy: emerytura, płatności, auto, świadczenia. Tylko te, które dotyczą tej osoby.
function widzety() {
  const w = [];
  const E = emerytalne;
  if (E?.pozycje) {
    const s = E.pozycje.reduce((a, p) => a + p.kwota, 0);
    const grupy = ['zus', 'sub', 'ppk', 'dobr'].map((g, i) => [i + 1, E.pozycje.filter(p => p.grupa === g).reduce((a, p) => a + p.kwota, 0)]).filter(x => x[1]);
    w.push(`<a class="widzet szeroki-w" href="#/emerytura"><span class="w-etyk">${ic('sun')}Twoja emerytura</span><span class="w-liczba">${zl(s)}</span><span class="w-pod">ZUS, PPK, IKE i IKZE w jednym miejscu</span><span class="udzialy maly-pasek" aria-hidden="true">${grupy.map(([i, v]) => `<span class="udz s${i}" style="flex-grow:${v}"></span>`).join('')}</span></a>`);
  } else if (E?.wyplata) {
    w.push(`<a class="widzet szeroki-w" href="#/emerytura"><span class="w-etyk">${ic('sun')}Twoja emerytura</span><span class="w-liczba">${zl(E.wyplata.kwota)}</span><span class="w-pod">brutto, ${E.wyplata.dzien}. dnia miesiąca</span></a>`);
  }
  const doZap = OSOBA === 'anna' ? [!stan.zrobione.mandat && 200, !stan.zrobione.podatek && 186].filter(Boolean) : [];
  if (doZap.length) w.push(`<a class="widzet" href="#/skrzynka"><span class="w-etyk">${ic('coin')}Do zapłaty</span><span class="w-liczba">${zl(doZap.reduce((a, b) => a + b, 0))}</span><span class="w-pod">${doZap.length === 2 ? 'mandat i podatek' : 'jedna płatność'}, BLIK</span></a>`);
  const badanie = zadania.find(z => z.id === 'badanie');
  if (badanie && !stan.badanie) {
    const dni = Math.round((badanie.termin - za(0)) / 864e5), proc = Math.max(0, Math.min(1, dni / 365));
    w.push(`<a class="widzet" href="#/badanie"><span class="w-etyk">${ic('car')}Badanie auta</span><span class="w-pierscien" style="--p:${proc}"><b>${dni}</b><small>dni</small></span><span class="w-pod">do ${fmt(badanie.termin)}</span></a>`);
  }
  // Kwota zamiast liczby pozycji: suma tego, co pewne w ciągu roku (pole `rok`); świadczenia warunkowe się nie liczą.
  if (naleznosci.length) {
    const n = naleznosci.length, rok = naleznosci.reduce((a, x) => a + (x.rok || 0), 0);
    const ile = `${n} ${n === 1 ? 'świadczenie' : n < 5 ? 'świadczenia i ulgi' : 'świadczeń i ulg'}`;
    w.push(`<a class="widzet" href="#/naleznosci"><span class="w-etyk">${ic('gift')}Możesz skorzystać</span><span class="w-liczba">${rok ? zl(Math.round(rok / 100) * 100) : n}</span><span class="w-pod">${rok ? `w ciągu roku · ${ile}` : ile}</span></a>`);
  }
  const zwrot = skrzynka.find(p => p.id === 'us' && /zwrot/i.test(p.tytul));
  if (zwrot && OSOBA === 'kasia') w.push(`<a class="widzet" href="#/pismo/us"><span class="w-etyk">${ic('coin')}Zwrot podatku</span><span class="w-liczba">380 zł</span><span class="w-pod">przyjdzie sam do ${fmt(za(14))}ni</span></a>`);
  // nieparzysta liczba małych kafli: ostatni na całą szerokość, bez dziury w siatce
  const male = w.filter(x => !x.includes('szeroki-w'));
  if (male.length % 2) w[w.lastIndexOf(male.at(-1))] = male.at(-1).replace('class="widzet"', 'class="widzet szeroki-w"');
  return w.length ? `<section aria-label="W liczbach" class="widzety">${w.join('')}</section>` : '';
}
// Trwający alarm (ćwiczenie) widać na Starcie, dopóki go nie zakończysz, najwyżej 2 godziny.
const baner = () => stan.alarm?.aktywny && Date.now() - stan.alarm.aktywny < 72e5 ? `<a class="alarm-baner" href="#/alarm">${ic('alert')}<span><b>Trwa alarm powietrzny (ćwiczenie)</b><small>Dotknij, żeby zobaczyć najbliższe miejsce ochronne</small></span>${ic('right')}</a>` : '';
export function start() {
  if (stan.ustawienia.prosty) return startProsty();
  const h = osoba.hero, heroOtwarte = h && !stan.zrobione[h.id];
  const zad = otwarte().filter(z => !(heroOtwarte && z.id === h.id)).sort((a, b) => a.termin - b.termin); // sprawa z karty na górze nie powtarza się; najbliższy termin pierwszy
  // 1 zlecenie, 2–4 zlecenia, 0 i 5+ zleceń (12–14: zleceń)
  const odm = (n, j, k, w) => `${n} ${n === 1 ? j : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? k : w}`;
  const ileWl = rodzaj => autopilot.filter(a => a.rodzaj === rodzaj && (stan.autopilot[a.id] ?? a.wl)).length;
  const godz = new Date().getHours();
  const powitanie = godz < 5 || godz >= 18 ? 'Dobry wieczór' : 'Dzień dobry';
  return {
    tytul: 'Start',
    html: `
    ${baner()}
    <h1 tabindex="-1" class="powitanie">${powitanie}, ${esc(ja.wolacz)}</h1>
    ${szybkie()}
    ${heroOtwarte ? `
    <a class="hero sprawa" href="${h.cel}" aria-label="${esc(h.aria)}">
      ${h.awatar ? `<span class="awatar hero-aw">${awatar(h.awatar)}</span>` : `<span class="hero-aw hero-ikona">${ic(h.ikona)}</span>`}
      <span class="hero-tr"><b class="hero-t">${esc(h.tytul)}</b><span class="hero-o">${esc(h.opis)}</span></span>
      <span class="hero-go">${esc(h.przycisk)}${ic('right')}</span>
    </a>` : ''}
    ${stos(dokumentyDoStosu(), true)}
    ${widzety()}
    <form class="zapytaj" action="#/asystent" role="search" id="f-zap">
      <label for="zap" class="sr">Co chcesz załatwić?</label>
      <input id="zap" name="q" placeholder="Co chcesz załatwić?" autocomplete="off" enterkeyhint="send">
      <button class="ib" aria-label="Zapytaj asystenta">${ic('send')}</button>
    </form>


    <section aria-labelledby="h-zad">
      <h2 id="h-zad" class="sekcja">Do zrobienia <span class="licz">${zad.length}</span></h2>
      ${zad.length ? `<ul class="lista">${zad.slice(0, 3).map(wierszZad).join('')}</ul>
      ${zad.length > 3 ? `<details class="rozw reszta"><summary>Pokaż wszystkie (${zad.length})</summary><ul class="lista">${zad.slice(3).map(wierszZad).join('')}</ul></details>` : ''}` : '<p class="pusto">Nic pilnego. Przypomnimy, gdy coś się zbliży.</p>'}
    </section>

    <section aria-labelledby="h-dla">
      <h2 id="h-dla" class="sekcja">Dla Ciebie</h2>
      <ul class="lista">
        ${OSOBA === 'anna' ? `${poz('#/bliscy/mama', 'mama', `Mama: ${mama.imie} ${mama.nazwisko}`, stan.zrobione.mama ? 'Wszystko załatwione' : 'Dowód traci ważność ' + fmt(za(77)), stan.zrobione.mama ? '' : '<span class="plak pomaranczowa">1</span>')}` : ``}
        ${OSOBA === 'anna' ? '' : osoba.bliscy.osoby.map(([href, a, t, o]) => poz(href, a, t, esc(o))).join('')}
        ${poz('#/zdrowie', 'heart', 'Zdrowie', { anna: 'termin szczepienia córki do potwierdzenia; nowe wyniki morfologii', halina: 'recepta na Metformax; diabetolog ' + fmt(zaRob(17)), jakub: 'badanie lekarskie do prawa jazdy', kasia: 'recepta roczna; badania okresowe ' + fmt(zaRob(40)) }[OSOBA] || 'recepty, wyniki badań, wizyty')}
        ${poz('#/zlecenia', 'clock', 'Przypomnienia i zlecenia', `włączone: ${odm(ileWl('przypomnienie'), 'przypomnienie', 'przypomnienia', 'przypomnień')}, ${odm(ileWl('zlecenie'), 'zlecenie', 'zlecenia', 'zleceń')}`)}
      </ul>
    </section>

    ${stan.wyslane.length ? `<section aria-labelledby="h-wys"><h2 id="h-wys" class="sekcja">Ostatnio wysłane</h2><ul class="lista mala">${stan.wyslane.slice(0, 4).map(w => `<li class="poz">${ic('check', 'okr zielona')}<span><b>${esc(w.tytul)}</b><small>do: ${esc(w.do)}</small></span></li>`).join('')}</ul></section>` : ''}

    <p class="stopka-info">Niezależny prototyp. Dane są fikcyjne. To nie jest usługa administracji publicznej. <a href="#/jury">Dla jury</a></p>`,
    po(root) {
      $('#f-zap', root).onsubmit = e => { e.preventDefault(); const q = $('#zap', root).value.trim(); location.hash = '#/asystent' + (q ? '?q=' + encodeURIComponent(q) : ''); };
    },
  };
}

function startProsty() {
  const zad = otwarte();
  const h = osoba.hero;
  const najwazniejsza = h && !stan.zrobione[h.id] ? { t: h.tytul, h: h.cel } : zad[0] ? { t: zad[0].tytul, h: zad[0].cel } : null;
  return {
    tytul: 'Start',
    html: `
    ${baner()}
    <h1 tabindex="-1" class="powitanie">Dzień dobry, ${esc(ja.wolacz)}</h1>
    ${najwazniejsza ? `<a class="hero prosty-hero" href="${najwazniejsza.h}"><b class="hero-t">${esc(najwazniejsza.t)}</b><span class="btn glowny">Zacznij${ic('right')}</span></a>` : ''}
    <ul class="kafle">
      <li><a href="#/dokumenty">${ic('wallet')}<span>Moje dokumenty</span></a></li>
      <li><a href="#/asystent?mow=1">${ic('mic')}<span>Powiedz, co chcesz załatwić</span></a></li>
      <li><a href="#/skrzynka">${ic('mail')}<span>Pisma i płatności${nowePisma() ? ` <b class="licz">${nowePisma()}</b>` : ''}</span></a></li>
      <li><a href="#/konsultant">${ic('phone')}<span>Pomoc człowieka</span></a></li>
    </ul>
    <p class="stopka-info">Tryb prosty. Wyłączysz go w <a href="#/ustawienia">Ustawieniach</a>.</p>`,
  };
}

/* ---------------- Dokumenty ---------------- */
export function dokumentyWidok() {
  return {
    tytul: 'Dokumenty',
    html: `<h1 tabindex="-1">Dokumenty</h1>
    ${stos(dokumentyDoStosu())}
    <a class="karta link-karta" href="#/pokaz">${ic('eye', 'okr')}<span><b>Pokaż tylko to, co potrzebne</b><small>Np. że masz 18 lat, bez pokazywania daty urodzenia i adresu.</small></span>${ic('right', 'strz')}</a>
    <p class="notka"><b>O prototypie.</b> Dokumenty w telefonie działają już w obecnym mObywatelu. Tu dodajemy źródło i datę aktualizacji każdej danej oraz zgłaszanie błędów. Karty są stylizowane: bez godła i bez oznaczeń urzędowych.</p>`,
  };
}

export function dokument(id) {
  const d = dokumenty.find(x => x.id === id);
  if (!d) return null;
  return {
    tytul: d.nazwa,
    html: `<h1 tabindex="-1">${esc(d.nazwa)}</h1>
    <div class="kd kd-${d.kolor} kd-przod kd-sam"><span class="kd-gora"><b class="kd-t">${esc(d.nazwa)}</b><span class="kd-holo" aria-hidden="true"></span></span><span class="kd-linia">${esc(d.linia)}</span>${id === 'pojazd' ? `<span class="kd-auto">${yarisCross({ kolor: 'bialy', opis: 'Toyota Yaris Cross, biała, czarny dach' })}</span>` : `<span class="kd-duch" aria-hidden="true">${portret(OSOBA)}</span><span class="kd-dol"><span class="kd-foto">${portret(OSOBA, 'Zdjęcie: ' + ja.imie + ' ' + ja.nazwisko)}</span><span class="kd-imie">${esc(ja.imie.toUpperCase())}<small>${esc(ja.nazwisko.toUpperCase())}</small></span></span>`}</div>
    ${id === 'dowod' || id === 'prawo' ? `<a class="karta link-karta" href="#/pokaz">${ic('shield', 'okr')}<span><b>Pokaż tylko to, co potrzebne</b><small>Sklep, hotel, wynajem auta: zaznaczymy tylko potrzebne dane.</small></span>${ic('right', 'strz')}</a>` : ''}
    <details class="karta kod-qr"><summary>${ic('eye')}Pokaż cały dokument kodem</summary><span class="qr duzy" role="img" aria-label="Kod do sprawdzenia dokumentu">${kodQR(13)}</span><p class="maly srodek">Kod ważny 2 minuty. Sprawdzający zobaczy go w swojej aplikacji.</p></details>
    <section class="karta">${d.pola.map(p => wiersz(...p)).join('')}
      <p class="zrodlo">${ic('info')}<span>Źródło: ${esc(d.zrodlo)}. Aktualne na: dziś, ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}.</span></p>
      <button class="btn tekst" id="blad-dan">Te dane są błędne? Zgłoś to</button>
    </section>
    ${id === 'pojazd' ? `<a class="karta link-karta" href="#/badanie">${ic('clock', 'okr')}<span><b>Badanie techniczne za 19 dni</b><small>Stacje kontroli w pobliżu na mapie i wolne terminy.</small></span>${ic('right', 'strz')}</a>` : ''}
    ${d.akcja ? `<a class="btn glowny szeroki" href="${d.akcja[1]}">${esc(d.akcja[0])}</a>` : ''}`,
    po(root) { $('#blad-dan', root).onclick = () => toast(`Zgłoszenie trafiło do: ${d.zrodlo}. Odpowiedź dostaniesz w skrzynce.`); },
  };
}

// Pokaż tylko to, co potrzebne: wybierasz cel, a aplikacja zaznacza dane niezbędne do niego (zasada minimalizacji danych).
// Możesz coś dołożyć albo odznaczyć; reszta zostaje ukryta. Kod jest jednorazowy i ważny 2 minuty.
const DANE_POKAZ = () => {
  const prawo = dokumenty.find(d => d.id === 'prawo');
  return [
    ['18', 'Ukończone 18 lat', 'tak, bez daty urodzenia'],
    ['imie', 'Imię i nazwisko', `${ja.imie} ${ja.nazwisko}`],
    ['foto', 'Zdjęcie', 'z dowodu osobistego'],
    ...(prawo ? [['prawo', 'Ważne prawo jazdy kat. B', 'tak, nie zatrzymane']] : []),
    ['adres', 'Adres zameldowania', ja.adres],
    ['urodz', 'Data urodzenia', ja.urodzona || ''],
    ['pesel', 'Numer PESEL', ja.pesel],
  ];
};
const CELE = [
  ['sklep', 'Zakupy 18+', ['18', 'foto']],
  ['hotel', 'Hotel', ['imie', 'foto']],
  ['auto', 'Wynajem auta', ['imie', 'foto', 'prawo']],
  ['kurier', 'Odbiór przesyłki', ['imie', 'foto']],
  ['urzad', 'Urząd lub bank', ['imie', 'foto', 'urodz', 'pesel']],
];
export function pokaz() {
  const dane = DANE_POKAZ();
  return {
    tytul: 'Pokaż tylko to, co potrzebne',
    html: `<h1 tabindex="-1">Pokaż tylko to, co potrzebne</h1>
    <p class="wstep">Wybierz, po co pokazujesz dokument. Zaznaczymy tylko dane potrzebne do tego celu. Resztę dodasz, jeśli chcesz.</p>
    <form id="f-pok" class="karta" novalidate>
      <fieldset class="grupa"><legend class="etyk">Po co</legend>
        <div class="chipy">${CELE.filter(([, , d]) => d.every(k => dane.some(x => x[0] === k))).map(([id, t], i) => `<label class="chip-r"><input type="radio" name="cel" value="${id}" ${i === 0 ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>
      </fieldset>
      <ul class="lista ustaw pok-dane">${dane.map(([k, t, v]) => `<li><label class="przel-duzy"><span><b>${esc(t)}</b><small>${esc(v)}</small></span><input type="checkbox" role="switch" name="dana" value="${k}"></label></li>`).join('')}</ul>
      <p class="maly" id="pok-ukryte" aria-live="polite"></p>
      <button class="btn glowny szeroki">${ic('scan')}Pokaż kod</button>
    </form>
    <div id="kod" aria-live="polite"></div>`,
    po(root) {
      const pola = $$('input[name=dana]', root);
      const nazwa = k => dane.find(x => x[0] === k)[1];
      // pierwsza litera mała, skróty zostają: „Numer PESEL” -> „numer PESEL”
      const ukryte = () => { const n = pola.filter(p => !p.checked).map(p => { const t = nazwa(p.value); return t.charAt(0).toLowerCase() + t.slice(1); }); $('#pok-ukryte', root).textContent = n.length ? `Ukryte: ${n.join(', ')}.` : 'Pokazujesz wszystkie dane.'; };
      const ustawCel = () => { const c = CELE.find(x => x[0] === $('input[name=cel]:checked', root).value); pola.forEach(p => { p.checked = c[2].includes(p.value); }); ukryte(); $('#kod', root).innerHTML = ''; };
      $$('input[name=cel]', root).forEach(r => r.onchange = ustawCel);
      pola.forEach(p => p.onchange = () => { ukryte(); $('#kod', root).innerHTML = ''; });
      ustawCel();
      $('#f-pok', root).onsubmit = e => {
        e.preventDefault();
        const wyb = dane.filter(([k]) => pola.find(p => p.value === k).checked);
        if (!wyb.length) { $('#pok-ukryte', root).textContent = 'Zaznacz przynajmniej jedną daną.'; return; }
        $('#kod', root).innerHTML = `<div class="karta srodek"><span class="qr duzy" role="img" aria-label="Kod do zeskanowania">${kodQR(Date.now() % 997)}</span>
          <ul class="pok-wynik">${wyb.map(([, t, v]) => `<li><span>${esc(t)}</span><b>${esc(v)}</b></li>`).join('')}</ul>
          <p class="maly">Kod jednorazowy, ważny 2 minuty. Sprawdzający zobaczy tylko zaznaczone dane; zapiszemy to w „Kto sprawdzał moje dane”.</p></div>`;
        przewinDo($('#kod', root), { block: 'start' });
      };
    },
  };
}

/* ---------------- Skrzynka ---------------- */
export function skrzynkaWidok() {
  const doZap = OSOBA !== 'anna' ? [] : [!stan.zrobione.mandat && ['#/mandat', 'Mandat z fotoradaru', '200 zł do ' + fmt(za(6))], !stan.zrobione.podatek && ['#/podatek', 'Podatek od nieruchomości', '186 zł, ' + rataOpis()]].filter(Boolean);
  return {
    tytul: 'Skrzynka',
    html: `<h1 tabindex="-1">Pisma i płatności</h1>
    ${doZap.length ? `<h2 class="sekcja">Do zapłaty</h2><ul class="lista">${doZap.map(p => poz(p[0], 'coin', p[1], esc(p[2]))).join('')}</ul>` : ''}
    <h2 class="sekcja">Pisma</h2>
    <ul class="lista">${skrzynka.map(p => poz('#/pismo/' + p.id, 'mail', p.tytul, `${esc(p.od)} · ${fmt(p.data)}`, p.nowa && !stan.przeczytane[p.id] ? '<span class="plak niebieska">nowe</span>' : '')).join('')}</ul>
    <p class="notka"><b>O prototypie.</b> Pisma przychodzą przez e-Doręczenia, które już działają. Nowe są: wersja prostym językiem i przycisk, który od razu załatwia sprawę.</p>`,
  };
}

export function pismo(id) {
  const p = skrzynka.find(x => x.id === id);
  if (!p) return null;
  stan.przeczytane[id] = true; zapisz();
  return {
    tytul: p.tytul,
    html: `<h1 tabindex="-1">${esc(p.tytul)}</h1>
    <p class="maly">${esc(p.od)} · ${fmtPelna(p.data)}</p>
    <section class="karta prosto" aria-labelledby="h-pr"><h2 id="h-pr" class="nag">${ic('chat')}Prostym językiem</h2><p>${esc(p.prosto)}</p></section>
    ${p.cel ? `<a class="btn glowny szeroki" href="${p.cel}">Załatw tę sprawę</a>` : ''}
    <details class="rozw"><summary>Oryginalna treść pisma</summary><p>${esc(p.tresc)}</p></details>
    <p class="zrodlo">${ic('info')}<span>Wersję prostym językiem przygotowuje nadawca razem z pismem i odpowiada za nią tak samo jak za oryginał.</span></p>`,
  };
}

/* ---------------- Możesz skorzystać, przypomnienia i zlecenia ---------------- */
export function naleznosciWidok() {
  return {
    tytul: 'Możesz skorzystać',
    html: `<h1 tabindex="-1">Możesz skorzystać</h1>
    <p class="wstep">Sprawdziliśmy to w rejestrach, do których państwo już ma dostęp. Nic nie musisz wpisywać.</p>
    ${naleznosci.length ? '' : '<p class="pusto">Na razie nic nowego. Sprawdzamy rejestry co miesiąc i damy znać, gdy coś Ci przysługuje.</p>'}
    <ul class="lista-kart">${naleznosci.map(n => {
      const zalatwione = stan.zrobione.narodziny && (n.id === 'becikowe' || n.id === '800');
      return `<li class="karta"><h2 class="nag">${ic('gift')}${esc(n.tytul)}</h2><p class="kwota">${esc(n.kwota)}</p><p><b>Dlaczego Tobie:</b> ${esc(n.dlaczego)}</p>
      <p class="maly">${zalatwione ? 'Wniosek wysłany.' : esc(n.status)}</p>
      <p class="zrodlo">${ic('info')}<span><a href="${n.zrodlo[1]}" target="_blank" rel="noopener">${esc(n.zrodlo[0])}</a></span></p>
      ${!zalatwione && n.cel !== '#/naleznosci' ? `<a class="btn drugi" href="${n.cel}">Złóż wniosek</a>` : ''}</li>`;
    }).join('')}</ul>`,
  };
}

export function autopilotWidok() {
  return {
    tytul: 'Przypomnienia i zlecenia',
    html: `<h1 tabindex="-1">Przypomnienia i zlecenia</h1>
    <p class="wstep"><b>Przypomnienie</b> tylko daje znać o terminie. <b>Zlecenie</b> robi coś za Ciebie, jak zlecenie stałe w banku. Zlecenie działa tylko wtedy, gdy je włączysz, i zawsze uprzedzamy przed jego wykonaniem.</p>
    ${['przypomnienie', 'zlecenie'].map(r => `<h2 class="sekcja">${r === 'przypomnienie' ? 'Przypomnienia' : 'Zlecenia'}</h2>
    <ul class="lista-kart">${autopilot.filter(a => a.rodzaj === r).map(a => `<li class="karta"><label class="przel-duzy"><span><b>${esc(a.tytul)}</b><small>${esc(a.opis)}</small></span><input type="checkbox" role="switch" data-ap="${a.id}" data-rodzaj="${a.rodzaj}" ${(stan.autopilot[a.id] ?? a.wl) ? 'checked' : ''}></label></li>`).join('')}</ul>`).join('')}
    <p class="stopka-info">Każde przypomnienie i zlecenie wyłączysz tutaj w każdej chwili.</p>
    <p class="notka"><b>O prototypie.</b> Wzór: usługa AutoGov w Abu Zabi i usługi proaktywne w Estonii.</p>`,
    po(root) {
      $$('[data-ap]', root).forEach(i => i.onchange = () => {
        stan.autopilot[i.dataset.ap] = i.checked; zapisz();
        const zl = i.dataset.rodzaj === 'zlecenie';
        toast(i.checked ? (zl ? 'Zlecenie włączone. Przed każdym wykonaniem damy znać.' : 'Przypomnienie włączone.') : (zl ? 'Zlecenie wyłączone. Będziemy tylko przypominać.' : 'Przypomnienie wyłączone.'));
      });
    },
  };
}

/* ---------------- Prywatność ---------------- */
export function dane() {
  const n = dostep.length + stan.noweDostepy.length;
  return {
    tytul: 'Twoje dane',
    html: `<h1 tabindex="-1">Twoje dane i prywatność</h1>
    <ul class="lista">
      ${poz('#/dane/dostep', 'eye', 'Kto sprawdzał moje dane', `odczyty w ostatnich 60 dniach: ${n}${dostep.some(d => d.podejrzane) ? ' · <b class="tekst-ostrz">1 do wyjaśnienia</b>' : ''}`)}
      ${poz('#/dane/rejestry', 'doc', 'Co państwo o mnie wie', `rejestry: ${osoba.rejestry.length}, źródło i data każdej danej`)}
      ${poz('#/zlecenia', 'clock', 'Przypomnienia i zlecenia', 'co robimy za Ciebie i za jaką zgodą')}
      ${poz('#/pokaz', 'shield', 'Pokaż tylko to, co potrzebne', 'np. pełnoletność bez daty urodzenia')}
    </ul>`,
  };
}

export function dostepWidok() {
  const wpisy = [...stan.noweDostepy.map(d => ({ ...d, kiedy: new Date(d.kiedy), nowy: true })), ...dostep];
  return {
    tytul: 'Kto sprawdzał moje dane',
    html: `<h1 tabindex="-1">Kto sprawdzał moje dane</h1>
    <p class="wstep">Każdy odczyt Twoich danych przez urząd, policję czy bank: kto, kiedy, po co i na jakiej podstawie.</p>
    <ul class="lista-kart">${wpisy.map((d, i) => `<li><details class="karta wpis${d.podejrzane ? ' podejrzane' : ''}" data-wpis="${d.id || 'n' + i}">
      <summary><span><b>${esc(d.kto)}</b><small>${fmt(d.kiedy)} · ${esc(d.po)}</small></span>${d.podejrzane ? '<span class="plak pomaranczowa">sprawdź</span>' : d.nowy ? '<span class="plak niebieska">nowe</span>' : ''}</summary>
      ${wiersz('Jakie dane', d.co)}${wiersz('Po co', d.po)}${d.podstawa ? wiersz('Podstawa prawna', d.podstawa) : wiersz('Podstawa', 'Twój wniosek')}
      ${d.podejrzane ? '<p class="ostrz">' + ic('alert') + `<span>${esc(d.podejrzane)}</span></p>` : ''}
      <button class="btn tekst" data-zglos="${esc(d.kto)}">To nie ja, zgłoś ten odczyt</button>
    </details></li>`).join('')}</ul>
    <p class="notka"><b>O prototypie.</b> Już dziś w mObywatelu w przeglądarce sprawdzisz historię weryfikacji numeru PESEL przez firmy i instytucje, a z gov.pl pobierzesz plik z odbiorcami danych z rejestru PESEL i Rejestru Dowodów Osobistych. Tu rozwijamy tę usługę: na bieżąco, ze wszystkich rejestrów, z celem i podstawą prawną oraz z ostrzeżeniem o podejrzanym odczycie. Wzór: estoński „Andmejälgija” (Data Tracker).</p>`,
    po(root) {
      $$('details[data-wpis]', root).forEach(d => d.addEventListener('toggle', () => { if (d.open && d.dataset.wpis === 'policja') cel('dostep-policja'); }));
      $$('[data-zglos]', root).forEach(b => b.onclick = () => toast('Zgłoszenie wysłane do inspektora ochrony danych: ' + b.dataset.zglos));
    },
  };
}

export function rejestry() {
  // Administrator każdego rejestru; dane z rejestrów różnią się między osobami w pokazie.
  const ADMIN = { 'Rejestr PESEL': 'Ministerstwo Cyfryzacji', 'Centralna Ewidencja Pojazdów i Kierowców': 'Ministerstwo Cyfryzacji', 'Centralna Ewidencja Kierowców': 'Ministerstwo Cyfryzacji', 'Rejestr Dowodów Osobistych': 'Ministerstwo Cyfryzacji', 'Krajowa Administracja Skarbowa': 'Ministerstwo Finansów', ZUS: 'ZUS', 'NFZ / Internetowe Konto Pacjenta': 'Centrum e-Zdrowia, NFZ', 'System Informacji Oświatowej': 'Ministerstwo Edukacji Narodowej' };
  const R = osoba.rejestry.map(([n, co]) => [n, co, ADMIN[n] || '']);
  return {
    tytul: 'Co państwo o mnie wie',
    html: `<h1 tabindex="-1">Co państwo o mnie wie</h1>
    <ul class="lista-kart">${R.map(r => `<li class="karta"><h2 class="nag">${esc(r[0])}</h2><p>${esc(r[1])}</p><p class="maly">Administrator: ${esc(r[2])}</p><button class="btn tekst" data-blad="${esc(r[0])}">Zgłoś błąd w tych danych</button></li>`).join('')}</ul>`,
    po(root) { $$('[data-blad]', root).forEach(b => b.onclick = () => toast('Zgłoszenie trafiło do: ' + b.dataset.blad)); },
  };
}

/* ---------------- Bliscy ---------------- */
export function bliscy() {
  if (OSOBA !== 'anna') return {
    tytul: 'Bliscy',
    html: `<h1 tabindex="-1">Bliscy</h1>
    <p class="wstep">${esc(osoba.bliscy.wstep)}</p>
    <ul class="lista">${osoba.bliscy.osoby.map(([href, a, t, o]) => poz(href, a, t, esc(o))).join('')}</ul>
    <details class="rozw"><summary>Jak zmienić albo cofnąć upoważnienie</summary><p>Upoważnienie podpisuje osoba, która go udziela: w swoim mObywatelu albo w urzędzie. Cofnąć je możesz w każdej chwili tutaj; bliska osoba od razu traci dostęp.</p></details>`,
  };
  return {
    tytul: 'Bliscy',
    html: `<h1 tabindex="-1">Bliscy</h1>
    <p class="wstep">Załatwiaj sprawy w imieniu osób, które Cię upoważniły, i dzieci. One widzą wszystko, co robisz w ich imieniu.</p>
    <ul class="lista">
      ${poz('#/bliscy/mama', 'mama', `${mama.imie} ${mama.nazwisko}, ${mama.wiek} lat`, `upoważnienie: ${esc(mama.pelnomocnictwo)}`, stan.zrobione.mama ? '' : '<span class="plak pomaranczowa">1</span>')}
      ${stan.zrobione.narodziny ? poz('#/dokumenty', 'corka', `${stan.imieDziecka} ${ja.nazwisko}`, 'córka · PESEL nadawany, odpis aktu w drodze') : poz('#/sprawa/narodziny', 'corka', 'Córka', 'najpierw zgłoś urodzenie')}
      ${poz('#/sprawa/smierc', 'leaf', 'Tadeusz Nowicki, tata', 'zmarł ' + fmt(za(-42)) + ' · zasiłek pogrzebowy i renta wdowia dla mamy')}
    </ul>
    <button class="btn drugi szeroki" id="dodaj-bl">${ic('users')}Dodaj bliską osobę</button>
    <p class="stopka-info">Upoważnienie podpisuje osoba, która go udziela: w swoim mObywatelu albo w urzędzie, jeśli nie ma telefonu.</p>`,
    po(root) { $('#dodaj-bl', root).onclick = () => toast('Wyślemy prośbę o upoważnienie. Bliska osoba podpisze ją u siebie albo w urzędzie.'); },
  };
}

export function blMama() {
  return {
    tytul: 'Mama',
    html: `<div class="osoba-nag"><span class="awatar duzy">${awatar('mama')}</span><h1 tabindex="-1">${esc(mama.imie)} ${esc(mama.nazwisko)}</h1></div>
    <p class="maly">Działasz z upoważnienia mamy (${esc(mama.pelnomocnictwo)}) do ${fmtPelna(mama.pelnomocnictwoDo)}. Mama widzi w swojej aplikacji albo w liście z urzędu, co robisz w jej imieniu.</p>
    ${stan.zrobione.mama ? `<div class="karta">${ic('check', 'okr zielona')} <b>Urzędnik przyjedzie do mamy ${fmt(za(12))}</b><p class="maly">Przyjmie wniosek o dowód i pobierze odciski palców w domu.</p></div>` : `
    <section class="karta">
      <h2 class="nag">${ic('id')}Dowód mamy traci ważność ${fmt(za(77))}</h2>
      <p>Mama ma kłopot z chodzeniem. Urzędnik może przyjść do domu, przyjąć wniosek i pobrać odciski palców.</p>
      <button class="btn glowny szeroki" id="wizyta">Zamów wizytę urzędnika u mamy</button>
    </section>`}
    <section class="karta"><h2 class="nag">${ic('doc')}Recepta gotowa</h2>${wiersz('Lek', 'Metformax 500, 60 tabl.')}${wiersz('Kod', '4821')}<p class="maly">Z Internetowego Konta Pacjenta mamy, na podstawie upoważnienia.</p></section>
    <section class="karta"><h2 class="nag">${ic('coin')}Renta wdowia</h2><p>Po śmierci taty mama może dostawać całą emeryturę i 15% renty rodzinnej, około 434 zł więcej co miesiąc. Wniosek złożysz w jej imieniu razem z zasiłkiem pogrzebowym.</p><a class="btn drugi szeroki" href="#/sprawa/smierc">Sprawy po śmierci taty</a></section>`,
    po(root) {
      const b = $('#wizyta', root);
      if (b) b.onclick = async () => {
        const ok = await arkuszZgody({ tytul: 'Wizyta urzędnika u mamy', pozycje: [{ co: 'Wniosek o przyjęcie wniosku o dowód w miejscu pobytu', do: 'Urząd Miasta Zgierza' }], dane: ['dane mamy z rejestru PESEL', 'Twoje upoważnienie', 'adres mamy'], cofniecie: 'Termin wizyty zmienisz albo odwołasz tutaj.', przycisk: 'Podpisz w imieniu mamy', cel: 'mama' });
        if (!ok) return;
        stan.zrobione.mama = true; dodajWyslane('Wizyta urzędnika u mamy', 'Urząd Miasta Zgierza'); zapisz();
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Problem z logowaniem (najczęstsza skarga w recenzjach) ---------------- */
let dostepKrok = 'diagnoza';
export function odzyskaj() {
  if (dostepKrok === 'gotowe') {
    return { tytul: 'Dostęp odzyskany', html: `<h1 tabindex="-1">Dostęp odzyskany</h1><div class="gotowe"><div class="gotowe-ik">${ic('check', 'duza')}</div><h2>mDowód znów działa</h2><p>Nowy certyfikat jest ważny do ${fmtPelna(za(365 * 2))}. Przypomnimy Ci miesiąc przed końcem, żeby to się nie powtórzyło.</p><div class="przyciski pion"><a class="btn glowny" href="#/start">Wróć na start</a></div></div>` };
  }
  // Dowód z chipem: kod CAN z przodu dowodu, przyłożenie do telefonu (NFC), PIN 1 ustalony przy odbiorze dowodu.
  if (dostepKrok === 'nfc') {
    return {
      tytul: 'Dowód z chipem',
      html: `<h1 tabindex="-1">Dowód z chipem</h1>
      <ol class="postep" aria-label="Postęp"><li class="ok">Wybór sposobu</li><li class="teraz" aria-current="step">Dowód</li><li>Gotowe</li></ol>
      <form id="f-nfc" class="karta" novalidate>
        <label class="etyk" for="can">Kod CAN</label>
        <input id="can" class="pole" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6 cyfr" aria-describedby="can-pom">
        <p class="maly" id="can-pom">Sześć cyfr w prawym dolnym rogu, z przodu dowodu.</p>
        <label class="etyk" for="pin1">PIN do dowodu (PIN 1)</label>
        <input id="pin1" class="pole" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 cyfry" aria-describedby="pin-pom">
        <p class="maly" id="pin-pom">Ustala się go przy odbiorze dowodu. Nie znasz go? Wybierz bank albo pomoc człowieka.</p>
        <p class="blad" id="nfc-blad" role="alert" hidden></p>
        <p class="maly" id="nfc-st" role="status"></p>
        <button class="btn glowny szeroki" id="nfc-ok">${ic('id')}Przyłóż dowód do telefonu</button>
      </form>
      <button type="button" class="btn tekst szeroki" id="dost-wroc">Wybierz inny sposób</button>`,
      po(root) {
        $('#dost-wroc', root).onclick = () => { dostepKrok = 'diagnoza'; dispatchEvent(new HashChangeEvent('hashchange')); };
        $('#f-nfc', root).onsubmit = async e => {
          e.preventDefault();
          const can = $('#can', root).value.trim(), pin = $('#pin1', root).value.trim(), bl = $('#nfc-blad', root);
          if (!/^\d{6}$/.test(can)) { bl.textContent = 'Kod CAN ma 6 cyfr.'; bl.hidden = false; $('#can', root).focus(); return; }
          if (!/^\d{4}$/.test(pin)) { bl.textContent = 'PIN 1 ma 4 cyfry.'; bl.hidden = false; $('#pin1', root).focus(); return; }
          bl.hidden = true;
          const b = $('#nfc-ok', root); b.disabled = true; $('#nfc-st', root).textContent = 'Przyłóż dowód do tyłu telefonu i nie ruszaj go…';
          await new Promise(r => setTimeout(r, window.__SZYBKO ? 50 : 1400));
          dostepKrok = 'gotowe'; cel('dostep'); ogloszenie('Dowód odczytany. Dostęp odzyskany.');
          dispatchEvent(new HashChangeEvent('hashchange'));
        };
      },
    };
  }
  // Profil zaufany: logowanie na login.gov.pl i powrót w to samo miejsce, jak przy banku.
  if (dostepKrok === 'pz') {
    return {
      tytul: 'Profil zaufany',
      html: `<h1 tabindex="-1">Profil zaufany</h1>
      <ol class="postep" aria-label="Postęp"><li class="ok">Wybór sposobu</li><li class="teraz" aria-current="step">Profil zaufany</li><li>Gotowe</li></ol>
      <section class="karta"><p>Otworzymy login.gov.pl. Zaloguj się profilem zaufanym, a <b>wrócisz dokładnie w to miejsce</b>. Nie zaczynasz od nowa.</p>
        <p class="maly">Potrzebujesz loginu i hasła do profilu zaufanego oraz kodu SMS.</p>
        <button class="btn glowny szeroki" id="pz-ok">${ic('shield')}Otwórz login.gov.pl i wróć</button></section>
      <button type="button" class="btn tekst szeroki" id="dost-wroc">Wybierz inny sposób</button>`,
      po(root) {
        $('#dost-wroc', root).onclick = () => { dostepKrok = 'diagnoza'; dispatchEvent(new HashChangeEvent('hashchange')); };
        $('#pz-ok', root).onclick = async () => {
          const b = $('#pz-ok', root); b.disabled = true; b.textContent = 'Czekam na potwierdzenie z login.gov.pl…';
          await new Promise(r => setTimeout(r, window.__SZYBKO ? 50 : 1200));
          dostepKrok = 'gotowe'; cel('dostep'); ogloszenie('Profil zaufany potwierdził tożsamość. Dostęp odzyskany.');
          dispatchEvent(new HashChangeEvent('hashchange'));
        };
      },
    };
  }
  if (dostepKrok === 'bank') {
    return {
      tytul: 'Potwierdzenie w banku',
      html: `<h1 tabindex="-1">Potwierdzenie w banku</h1>
      <ol class="postep" aria-label="Postęp"><li class="ok">Wybór sposobu</li><li class="teraz" aria-current="step">Bank</li><li>Gotowe</li></ol>
      <section class="karta"><p>Otworzymy aplikację Twojego banku. Gdy potwierdzisz tam tożsamość, <b>wrócisz dokładnie w to miejsce</b>. Nie zaczynasz od nowa.</p>
      <label class="etyk" for="bank">Twój bank</label><select id="bank" class="pole"><option>PKO BP</option><option>Pekao</option><option>mBank</option><option>ING</option><option>Santander</option></select>
      <button class="btn glowny szeroki" id="bank-ok">Otwórz bank i wróć</button></section>
      <details class="rozw"><summary>Co, jeśli bank nie odpowie?</summary><p>Pokażemy jasny komunikat, co poszło nie tak, i zaproponujemy inny sposób. Nigdy nie wrócisz do pierwszego ekranu bez wyjaśnienia.</p></details>`,
      po(root) {
        $('#bank-ok', root).onclick = async () => {
          const b = $('#bank-ok', root); b.disabled = true; b.textContent = 'Czekam na potwierdzenie z banku…';
          await new Promise(r => setTimeout(r, window.__SZYBKO ? 50 : 1200));
          dostepKrok = 'gotowe'; cel('dostep'); ogloszenie('Bank potwierdził tożsamość. Dostęp odzyskany.');
          dispatchEvent(new HashChangeEvent('hashchange'));
        };
      },
    };
  }
  return {
    tytul: 'Nie możesz się zalogować?',
    html: `<h1 tabindex="-1">Nie możesz się zalogować?</h1>
    <section class="karta diag"><h2 class="nag">${ic('info')}Co się stało</h2>
      <p>Certyfikat Twojego mDowodu wygasł 2 dni temu. <b>To nie Twoja wina i Twoje dane są bezpieczne.</b> Potrzebujesz jednego potwierdzenia tożsamości.</p>
      <p class="maly">Do czasu odnowienia dokumenty w telefonie możesz okazać przez 30 dni w trybie „tylko do wglądu”.</p></section>
    <h2 class="sekcja">Wybierz jeden sposób</h2>
    <ul class="lista">
      <li><button class="poz" data-sp="bank">${ic('key', 'okr')}<span><b>Przez bank</b><small>ok. 2 minuty · działa dla 15 banków</small></span><span class="plak zielona">polecane</span>${ic('right', 'strz')}</button></li>
      <li><button class="poz" data-sp="nfc">${ic('id', 'okr')}<span><b>Dowodem z chipem (NFC)</b><small>ok. 1 minuta · potrzebny kod CAN i PIN dowodu</small></span>${ic('right', 'strz')}</button></li>
      <li><button class="poz" data-sp="pz">${ic('shield', 'okr')}<span><b>Profilem zaufanym</b><small>ok. 3 minuty</small></span>${ic('right', 'strz')}</button></li>
      <li><a class="poz" href="#/konsultant">${ic('phone', 'okr')}<span><b>Z pomocą człowieka</b><small>oddzwonimy albo umówimy wizytę w urzędzie</small></span>${ic('right', 'strz')}</a></li>
    </ul>
    <p class="notka"><b>O prototypie.</b> Ten ekran odpowiada na najczęstszą skargę w recenzjach mObywatela: 33% ocen 1–2★ dotyczy logowania i „pętli” przy potwierdzaniu tożsamości.</p>`,
    po(root) {
      $$('[data-sp]', root).forEach(b => b.onclick = () => {
        dostepKrok = b.dataset.sp; dispatchEvent(new HashChangeEvent('hashchange'));
      });
    },
  };
}
export function resetDostepu() { dostepKrok = 'diagnoza'; }

/* ---------------- Konsultant, ustawienia, menu ---------------- */
// Pomoc człowieka: telefon z numeru, który da się sprawdzić w „Kto dzwoni?” (oszuści podszywają się pod urzędy).
const NR_POMOCY = '42 000 11 00';
export function konsultant() {
  const z = stan.konsultant;
  if (z) return {
    tytul: 'Pomoc człowieka',
    html: `<h1 tabindex="-1">Konsultant zadzwoni</h1>
    <section class="karta">
      ${wierszK('Kiedy', z.kiedy)}${wierszK('Temat', z.temat)}${wierszK('Zadzwoni z numeru', NR_POMOCY)}
      <p class="uwaga">${ic('callcheck')}<span>Tylko z tego numeru. Konsultant nie zapyta o hasło, PIN ani kod BLIK. Jeśli ktoś zadzwoni z innego numeru i powie, że jest z mObywatela, rozłącz się.</span></p>
      ${z.kontekst ? `<p class="maly">Konsultant zobaczy, na czym utknęłaś: ${esc(z.temat.toLowerCase())}. Nie zobaczy reszty Twoich danych.</p>` : ''}
    </section>
    <div class="przyciski pion">
      <a class="btn drugi" href="#/kto-dzwoni">${ic('search')}Sprawdź ten numer w „Kto dzwoni?”</a>
      <button type="button" class="btn tekst" id="kon-odwolaj">Odwołaj telefon</button>
    </div>
    <p class="notka"><b>O prototypie.</b> Nikt nie zadzwoni: to pokaz.</p>`,
    po(root) { $('#kon-odwolaj', root).onclick = () => { stan.konsultant = null; zapisz(); toast('Telefon odwołany.'); dispatchEvent(new HashChangeEvent('hashchange')); }; },
  };
  const teraz = new Date(), za15 = new Date(teraz.getTime() + 15 * 6e4);
  const godz = d => d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  // Konsultanci pracują od 8 do 20; poza tymi godzinami najbliższy telefon jest rano.
  const h = teraz.getHours(), wGodzinach = h >= 8 && za15.getHours() < 20;
  const pory = [...(wGodzinach ? [[`dziś, około ${godz(za15)}`, 'najszybciej, za około 15 minut']] : []), ...(h < 17 ? [['dziś, 17:00–18:00', 'po pracy']] : []), ['jutro, 9:00–10:00', 'rano'], ...(wGodzinach ? [] : [['jutro, 12:00–13:00', 'w południe']])];
  const ostatnia = stan.wyslane[0]?.tytul;
  const tematy = [...(ostatnia ? [ostatnia] : []), 'Logowanie i dostęp do aplikacji', 'Pismo z urzędu, którego nie rozumiem', 'Inna sprawa'];
  return {
    tytul: 'Pomoc człowieka',
    html: `<h1 tabindex="-1">Pomoc człowieka</h1>
    <p class="wstep">Asystent nie wie wszystkiego. Konsultant oddzwoni i, jeśli się zgodzisz, zobaczy, na czym utknęłaś, więc nie musisz tłumaczyć od początku.</p>
    <form id="f-kon" class="karta" novalidate>
      <fieldset class="grupa"><legend class="etyk">W czym pomóc</legend>${tematy.map((t, i) => `<label class="opcja"><input type="radio" name="temat" value="${esc(t)}" ${i === 0 ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</fieldset>
      <fieldset class="grupa"><legend class="etyk">Kiedy zadzwonić</legend>${pory.map(([t, o], i) => `<label class="opcja"><input type="radio" name="kiedy" value="${esc(t)}" ${i === 0 ? 'checked' : ''}> <span>${esc(t)}<small class="maly">${esc(o)}</small></span></label>`).join('')}</fieldset>
      <div class="wiersz"><span>Zadzwonimy na numer z Twojego profilu</span><b class="nowrap">+48 600 ••• 412</b></div>
      <label class="opcja"><input type="checkbox" id="kon-kontekst" checked> Pokaż konsultantowi, gdzie utknęłam</label>
      <button class="btn glowny szeroki">${ic('phone')}Poproś o telefon</button>
    </form>
    <p class="stopka-info">Konsultant zadzwoni z numeru ${NR_POMOCY}.</p>
    <p class="notka"><b>O prototypie.</b> Nikt nie zadzwoni: to pokaz.</p>`,
    po(root) {
      $('#f-kon', root).onsubmit = e => {
        e.preventDefault();
        stan.konsultant = { kiedy: $('input[name=kiedy]:checked', root).value, temat: $('input[name=temat]:checked', root).value, kontekst: $('#kon-kontekst', root).checked };
        zapisz(); cel('konsultant'); ogloszenie(`Konsultant zadzwoni ${stan.konsultant.kiedy}.`);
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}
const wierszK = (k, v) => `<div class="wiersz"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;

export function ustawienia() {
  const U = stan.ustawienia;
  const prz = (id, t, o) => `<li><label class="przel-duzy"><span><b>${t}</b><small>${o}</small></span><input type="checkbox" role="switch" data-ust="${id}" ${U[id] ? 'checked' : ''}></label></li>`;
  return {
    tytul: 'Ustawienia',
    html: `<h1 tabindex="-1">Ustawienia</h1>
    <ul class="lista">${poz('#/osoby', OSOBA, `${ja.imie} ${ja.nazwisko}`, 'Zmień osobę w pokazie')}</ul>
    <ul class="lista">${poz('#/szybkie', 'star', 'Szybkie akcje na Starcie', ulubione().map(k => AKCJE[k]().t).join(', '))}</ul>
    <h2 class="grupa-t" id="wyglad-t">Wygląd</h2>
    <div class="karta" role="group" aria-labelledby="wyglad-t">${wyborMotywu()}<p class="maly">„Automatycznie” zmienia wygląd razem z telefonem.</p></div>
    <h2 class="grupa-t">Dostępność</h2>
    <ul class="lista ustaw">
      ${prz('prosty', 'Tryb prosty', 'Duże przyciski, najważniejsze rzeczy na starcie, krótkie zdania.')}
      ${prz('duzy', 'Większy tekst', 'Tekst o 20% większy.')}
      ${prz('kontrast', 'Wysoki kontrast', 'Mocniejsze kolory i obramowania.')}
      ${prz('czytaj', 'Czytaj na głos', 'Odpowiedzi asystenta i komunikaty czytane głosem.')}
    </ul>
    <h2 class="grupa-t">Pokaz</h2>
    <ul class="lista ustaw">
      ${prz('bezNotek', 'Ukryj notatki o prototypie', 'Bez ramek „O prototypie”: co już działa, a co jest nowe. Aplikacja wygląda wtedy jak gotowy produkt.')}
    </ul>
    <h2 class="grupa-t">Pomoc i prototyp</h2>
    <ul class="lista">
      ${poz('#/dostep', 'lock', 'Problem z logowaniem', 'pokaz: wygasły certyfikat mDowodu')}
      ${poz('#/test', 'test', 'Tryb testowy', 'zadania dla testerów z pomiarem czasu')}
      ${poz('#/jury', 'info', 'O prototypie i dla jury', '')}
    </ul>
    <button class="btn drugi szeroki" id="reset">Zacznij pokaz od nowa</button>`,
    po(root) {
      $$('[data-ust]', root).forEach(i => i.onchange = () => { U[i.dataset.ust] = i.checked; zapisz(); dispatchEvent(new Event('ustawienia')); });
      $('#reset', root).onclick = () => { resetuj(); resetDostepu(); dispatchEvent(new Event('ustawienia')); toast('Pokaz zaczyna się od nowa.'); location.hash = '#/start'; };
    },
  };
}

export function wiecej() {
  return {
    tytul: 'Więcej',
    html: `<h1 tabindex="-1">Więcej</h1>
    <h2 class="grupa-t">Twoje sprawy</h2>
    <ul class="lista">
      ${poz('#/skrzynka', 'mail', 'Pisma i płatności', nowePisma() ? nowePisma() + ' nowe' : '')}
      ${emerytalne ? poz('#/emerytura', 'sun', 'Twoja emerytura', emerytalne.wyplata ? 'wypłata, waloryzacja, renta wdowia' : 'ZUS, PPK, IKE i IKZE, prognoza') : ''}
      ${poz('#/zdrowie', 'heart', 'Zdrowie', 'recepty, wyniki badań, wizyty, szczepienia')}
      ${poz('#/naleznosci', 'gift', 'Możesz skorzystać', naleznosci.length ? naleznosci.map(n => n.tytul.split(':')[0]).join(', ') : 'sprawdzamy co miesiąc')}
      ${poz('#/bliscy', 'users', 'Bliscy', esc(osoba.bliscyOpis))}
      ${poz('#/zlecenia', 'clock', 'Przypomnienia i zlecenia', 'terminy i sprawy, które robimy za Ciebie')}
    </ul>
    <h2 class="grupa-t">Bezpieczeństwo i dane</h2>
    <ul class="lista">
      ${poz('#/dane', 'eye', 'Twoje dane i prywatność', 'kto sprawdzał moje dane')}
      ${poz('#/pesel', 'shield', 'Zastrzeżenie PESEL', peselStan().zastrzezony ? 'zastrzeżony' : 'nie jest zastrzeżony')}
      ${poz('#/kto-dzwoni', 'callcheck', 'Kto dzwoni?', 'sprawdź numer, zanim cokolwiek powiesz')}
      ${poz('#/schrony', 'home', 'Miejsca ochronne', 'najbliższe, także bez internetu')}
      ${poz('#/dostep', 'lock', 'Problem z logowaniem', '')}
    </ul>
    <h2 class="grupa-t">Udział w życiu publicznym</h2>
    <ul class="lista">
      ${poz('#/poparcie', 'pen', 'Podpisy i poparcie', 'projekty ustaw, referenda, kandydaci')}
    </ul>
    <h2 class="grupa-t">Pomoc i ustawienia</h2>
    <ul class="lista">
      ${poz('#/konsultant', 'phone', 'Pomoc człowieka', '')}
      ${poz('#/ustawienia', 'gear', 'Ustawienia i dostępność', 'tryb prosty, większy tekst, czytanie na głos')}
    </ul>
    <h2 class="grupa-t">O prototypie</h2>
    <ul class="lista">
      ${poz('#/osoby', 'users', 'Zmień osobę w pokazie', `teraz: ${esc(OSOBY[OSOBA].nazwa)}`)}
      ${poz('#/jury', 'info', 'Dla jury', 'co mierzyliśmy i jak to sprawdzić')}
      ${poz('#/test', 'test', 'Tryb testowy', '')}
    </ul>`,
  };
}

/* ---------------- Zastrzeżenie PESEL ---------------- */
// Stan: zapisany w pokazie albo początkowy z danych osoby. Czasowe cofnięcie po terminie wraca samo (jak w mObywatelu).
export function peselStan() {
  const s = stan.pesel || { zastrzezony: !!osoba.pesel?.zastrzezony, od: osoba.pesel?.od ? +osoba.pesel.od : null };
  if (!s.zastrzezony && s.doKiedy && Date.now() > s.doKiedy) return { zastrzezony: true, od: s.doKiedy };
  return s;
}
const kiedyDo = t => { const d = new Date(t); return `${fmt(d)} (${d.toLocaleDateString('pl-PL', { weekday: 'long' })}), ${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`; };
const kiedyDokl = t => { const d = new Date(t); return `${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}, ${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`; };
const koniecDnia = n => { const d = za(n); d.setHours(23, 59, 0, 0); return +d; };
export function peselWidok() {
  const s = peselStan(), z = s.zastrzezony, czasowo = !z && s.doKiedy;
  const spr = dostep.filter(d => /zastrze/i.test(d.co)); // tylko sprawdzenia samego zastrzeżenia, nie każdy odczyt z PESEL-em
  const glowa = z
    ? `<b>Twój PESEL jest zastrzeżony</b><small>${s.od ? 'od ' + fmtPelna(new Date(s.od)) + '. ' : ''}Bank, firma pożyczkowa ani operator nie zawrą umowy na Twoje dane.</small>`
    : czasowo
      ? `<b>Zastrzeżenie cofnięte do ${esc(kiedyDo(s.doKiedy))}</b><small>Potem PESEL zastrzeże się sam. Przypomnimy Ci dzień wcześniej.</small>`
      : `<b>Twój PESEL nie jest zastrzeżony</b><small>Ktoś, kto zna Twoje dane, może wziąć na nie kredyt albo kartę SIM.</small>`;
  let akcja;
  if (osoba.pesel?.niepelnoletni) {
    akcja = `<p>W aplikacji zastrzeżesz PESEL od 18. urodzin. Przypomnimy Ci o tym w dniu urodzin.</p>`;
  } else if (z) {
    akcja = `<form id="f-pesel" class="karta" novalidate>
      <h2 class="nag">Bierzesz kredyt, kartę SIM albo zakładasz konto?</h2>
      <p class="maly">Cofnij zastrzeżenie tylko na czas tej sprawy. Potem PESEL zastrzeże się sam.</p>
      <fieldset class="segment pesel-czas"><legend class="sr">Na jak długo cofnąć zastrzeżenie</legend>
        ${[['1', 'do jutra'], ['3', 'na 3 dni'], ['7', 'na 7 dni'], ['0', 'bez terminu']].map(([v, t], i) => `<label><input type="radio" name="czas" value="${v}" ${i === 0 ? 'checked' : ''}><span>${t}</span></label>`).join('')}
      </fieldset>
      <p class="maly" id="pesel-do" aria-live="polite"></p>
      <button class="btn drugi szeroki" id="pesel-cofnij">Cofnij zastrzeżenie</button>
    </form>`;
  } else {
    akcja = `<button class="btn glowny szeroki" id="pesel-zastrzez">${ic('shield')}${czasowo ? 'Zastrzeż ponownie teraz' : 'Zastrzeż PESEL'}</button>
    <p class="maly srodek">Działa od razu. Cofniesz je jednym dotknięciem.</p>`;
  }
  return {
    tytul: 'Zastrzeżenie PESEL',
    html: `<h1 tabindex="-1">Zastrzeżenie PESEL</h1>
    <section class="pesel-st ${z ? 'tak' : 'nie'}" role="status">${ic(z ? 'lock' : 'shield', 'okr')}<span>${glowa}</span></section>
    ${akcja}
    <h2 class="sekcja">Kto sprawdzał zastrzeżenie</h2>
    ${spr.length ? `<ul class="lista">${spr.map(d => poz('#/dane/dostep', d.podejrzane ? 'alert' : 'eye', d.kto, `${esc(d.po)} · ${fmt(d.kiedy)}`)).join('')}</ul>` : '<p class="pusto">Na razie nikt. Każde sprawdzenie zobaczysz tutaj i w „Twoje dane”.</p>'}
    <p class="notka"><b>O prototypie.</b> Zastrzeżenie i cofnięcie PESEL, także czasowe z automatycznym powrotem, już działa w mObywatelu (od 1 czerwca 2024 r. banki i operatorzy muszą je sprawdzać). Nowe: stan zastrzeżenia na Starcie jednym spojrzeniem, cofnięcie w dwóch dotknięciach i lista, kto sprawdzał Twój PESEL.</p>
    ${zrodloPesel}`,
    po(root) {
      const doKiedy = () => { const v = +$('input[name=czas]:checked', root).value; return v ? koniecDnia(v) : null; };
      const pokazDo = () => { const t = doKiedy(), el = $('#pesel-do', root); if (el) el.textContent = t ? `Zastrzeże się samo: ${kiedyDokl(t)}.` : 'Zostanie cofnięte, dopóki sam go nie zastrzeżesz.'; };
      if ($('#f-pesel', root)) {
        pokazDo(); $$('input[name=czas]', root).forEach(i => i.onchange = pokazDo);
        $('#f-pesel', root).onsubmit = async e => {
          e.preventDefault();
          const t = doKiedy();
          const ok = await arkuszZgody({
            tytul: 'Cofnięcie zastrzeżenia PESEL',
            pozycje: [{ co: t ? `Cofnięcie do ${kiedyDo(t)}, potem automatyczne zastrzeżenie` : 'Cofnięcie bez terminu', do: 'Rejestr zastrzeżeń numerów PESEL' }],
            dane: ['Twój numer PESEL'],
            cofniecie: 'Zastrzeżesz PESEL ponownie jednym dotknięciem, w każdej chwili.',
            przycisk: 'Podpisz i cofnij', cel: 'pesel-cofniecie',
          });
          if (!ok) return;
          stan.pesel = { zastrzezony: false, od: s.od, doKiedy: t }; zapisz();
          toast(t ? `Zastrzeżenie cofnięte do ${kiedyDokl(t)}.` : 'Zastrzeżenie cofnięte.');
          dispatchEvent(new HashChangeEvent('hashchange'));
        };
      }
      const zb = $('#pesel-zastrzez', root);
      if (zb) zb.onclick = async () => {
        const ok = await arkuszZgody({
          tytul: 'Zastrzeżenie PESEL',
          pozycje: [{ co: 'Zastrzeżenie numeru PESEL od teraz', do: 'Rejestr zastrzeżeń numerów PESEL' }],
          dane: ['Twój numer PESEL'],
          cofniecie: 'Cofniesz je w każdej chwili, także tylko na kilka dni.',
          przycisk: 'Podpisz i zastrzeż', cel: 'pesel-zastrzezenie',
        });
        if (!ok) return;
        stan.pesel = { zastrzezony: true, od: Date.now() }; zapisz();
        toast('PESEL zastrzeżony. Działa od teraz.');
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}
const zrodloPesel = `<p class="zrodlo">${ic('info')}<span>Na podstawie: <a href="https://www.gov.pl/web/gov/zastrzez-swoj-numer-pesel-lub-cofnij-zastrzezenie" target="_blank" rel="noopener">gov.pl: Zastrzeż swój numer PESEL lub cofnij zastrzeżenie</a></span></p>`;

/* ---------------- Osoby w pokazie (jak „Wybierz osobę” w prototypie referencyjnym) ---------------- */
// Zmiana osoby przeładowuje stronę z ?osoba=…; pozostałe parametry adresu (np. widok) zostają.
export function osoby() {
  return {
    tytul: 'Osoby w pokazie',
    html: `<h1 tabindex="-1">Osoby w pokazie</h1>
    <p class="wstep">Każda osoba ma swoje dokumenty, sprawy i pisma. Wszystkie są fikcyjne. To, co zrobisz jako jedna osoba, zostaje zapisane osobno.</p>
    <ul class="lista">${Object.entries(OSOBY).map(([id, o]) => `<li><a class="poz" href="${adresOsoby(id)}"${id === OSOBA ? ' aria-current="true"' : ''}><span class="awatar">${awatar(id)}</span><span><b>${esc(o.nazwa)}</b><small>${esc(o.opis)}</small></span>${id === OSOBA ? '<span class="plak niebieska">teraz</span>' : ''}${ic('right', 'strz')}</a></li>`).join('')}</ul>`,
  };
}
export function innaOsoba(wlasciciel) {
  const o = OSOBY[wlasciciel];
  return {
    tytul: 'Sprawa innej osoby',
    html: `<h1 tabindex="-1">Ta sprawa dotyczy innej osoby</h1>
    <section class="karta osoba-karta"><span class="awatar duzy">${awatar(wlasciciel)}</span><div><h2 class="nag">${esc(o.nazwa)}</h2><p class="maly">${esc(o.opis)}</p></div></section>
    <p class="wstep">W pokazie każda osoba ma swoje sprawy. ${esc(ja.imie)} nie ma tej sprawy, więc pokażemy ją u osoby, której dotyczy.</p>
    <a class="btn glowny szeroki" href="${adresOsoby(wlasciciel, location.hash)}">Pokaż jako ${esc(o.nazwa.split(' ')[0])}</a>
    <a class="btn tekst szeroki" href="#/sprawy">Wróć do spraw</a>`,
  };
}
