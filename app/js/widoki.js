// Ekrany poza przebiegami spraw: start, dokumenty, skrzynka, prywatność, bliscy, ustawienia.
import { ic } from './icons.js';
import { stan, zapisz, resetuj, esc, $, $$, arkuszZgody, ogloszenie, toast, cel, dodajWyslane, wyborMotywu } from './core.js';
import { zdjecieAnny, twarzMamy, twarzCorki, autoZBoku } from './grafiki.js';
import { ja, dziecko, mama, dokumenty, zadania, naleznosci, autopilot, dostep, skrzynka, za, fmt, fmtPelna } from './data.js';

const wiersz = (k, v) => `<div class="wiersz"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
// `ikona`: nazwa ikony albo gotowy rysunek SVG (awatar osoby).
const poz = (href, ikona, t, opis, extra = '') => `<li><a class="poz" href="${href}">${ikona.startsWith('<') ? `<span class="awatar">${ikona}</span>` : ic(ikona, 'okr')}<span><b>${esc(t)}</b>${opis ? `<small>${opis}</small>` : ''}</span>${extra}${ic('right', 'strz')}</a></li>`;
const otwarte = () => zadania.filter(z => !stan.zrobione[z.id]);
// Badanie techniczne po rezerwacji: zamiast „stacje w pobliżu” termin i stacja.
const rezerwacja = () => { const r = stan.badanie; if (!r) return null; const t = new Date(r.kiedy); return `zarezerwowane: ${fmt(t, { weekday: 'short', day: 'numeric', month: 'long' })}, ${t.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} · ${r.krotko}`; };
const wierszZad = z => poz(z.cel, z.ikona, z.tytul, esc(z.id === 'badanie' && rezerwacja() || z.opis), z.pilne ? '<span class="plak czerwona">pilne</span>' : '');
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
    ? `<span class="kd-dol"><span class="kd-foto">${zdjecieAnny()}</span><span class="kd-imie">${esc(ja.imie.toUpperCase())}<small>${esc(ja.nazwisko.toUpperCase())}</small></span><span class="kd-pill">${ic('eye')}Pokaż dane</span></span>`
    : '';
  return `<a class="kd kd-${d.kolor}${przod ? ' kd-przod' : ''}" href="${d.href || '#/dokument/' + d.id}" aria-label="${esc(d.nazwa)}: ${esc(d.linia)}${d.alert ? ', ' + esc(d.alert) : ''}">
    <span class="kd-gora"><b class="kd-t">${esc(d.nazwa)}</b>${d.alert && !przod ? '<span class="kd-kropka" aria-hidden="true"></span>' : ''}<span class="kd-holo" aria-hidden="true"></span></span>
    ${przod ? `<span class="kd-linia">${esc(d.linia)}</span>` : ''}${dolna}</a>`;
}
export function stos(lista) {
  // ostatnia karta jest z przodu (cała), pozostałe wystają nad nią
  return `<div class="stos" role="list">${lista.map((d, i) => `<div role="listitem">${kartaDok(d, i === lista.length - 1)}</div>`).join('')}</div>`;
}
const dokumentyDoStosu = () => {
  const l = [dokumenty[2], dokumenty[1]];
  if (stan.zrobione.narodziny) l.unshift({ id: 'corka', nazwa: `${stan.imieDziecka} ${ja.nazwisko}`, linia: 'córka · PESEL i odpis aktu w drodze', kolor: 'zielony', href: '#/bliscy' });
  return [...l, dokumenty[0]];
};

/* ---------------- Start ---------------- */
export function start() {
  if (stan.ustawienia.prosty) return startProsty();
  const zad = otwarte();
  const narodzinyOtwarte = !stan.zrobione.narodziny;
  // 1 zlecenie, 2–4 zlecenia, 0 i 5+ zleceń (12–14: zleceń)
  const odm = (n, j, k, w) => `${n} ${n === 1 ? j : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? k : w}`;
  const ileWl = rodzaj => autopilot.filter(a => a.rodzaj === rodzaj && (stan.autopilot[a.id] ?? a.wl)).length;
  const godz = new Date().getHours();
  const powitanie = godz < 5 || godz >= 18 ? 'Dobry wieczór' : 'Dzień dobry';
  return {
    tytul: 'Start',
    html: `
    <h1 tabindex="-1" class="powitanie">${powitanie}, ${esc(ja.wolacz)}</h1>
    ${narodzinyOtwarte ? `
    <a class="hero sprawa" href="#/sprawa/narodziny" aria-label="Sprawa przyszła do Ciebie: urodziła się Twoja córka. 5 spraw w 4 instytucjach, jeden podpis. Załatw wszystko naraz.">
      <span class="awatar hero-aw">${twarzCorki()}</span>
      <span class="hero-tr"><b class="hero-t">Urodziła się Twoja córka</b><span class="hero-o">5 spraw w 4 instytucjach, jeden podpis</span></span>
      <span class="hero-go">Załatw wszystko naraz${ic('right')}</span>
    </a>` : ''}
    ${stos(dokumentyDoStosu())}
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
        ${poz('#/naleznosci', 'gift', 'Możesz skorzystać', stan.zrobione.narodziny ? '2 świadczenia przyznane, 2 przyjdą same' : '4 świadczenia dla Twojej rodziny')}
        ${poz('#/bliscy/mama', twarzMamy(), `Mama: ${mama.imie} ${mama.nazwisko}`, stan.zrobione.mama ? 'Wszystko załatwione' : 'Dowód traci ważność ' + fmt(za(77)), stan.zrobione.mama ? '' : '<span class="plak pomaranczowa">1</span>')}
        ${poz('#/zlecenia', 'clock', 'Przypomnienia i zlecenia', `włączone: ${odm(ileWl('przypomnienie'), 'przypomnienie', 'przypomnienia', 'przypomnień')}, ${odm(ileWl('zlecenie'), 'zlecenie', 'zlecenia', 'zleceń')}`)}
      </ul>
    </section>

    ${stan.wyslane.length ? `<section aria-labelledby="h-wys"><h2 id="h-wys" class="sekcja">Ostatnio wysłane</h2><ul class="lista mala">${stan.wyslane.slice(0, 4).map(w => `<li class="poz">${ic('check', 'okr zielona')}<span><b>${esc(w.tytul)}</b><small>do: ${esc(w.do)}</small></span></li>`).join('')}</ul></section>` : ''}

    <p class="stopka-info">Niezależny prototyp na mObywatel Challenge. Dane są fikcyjne. To nie jest usługa administracji publicznej. <a href="#/jury">Dla jury</a></p>`,
    po(root) {
      $('#f-zap', root).onsubmit = e => { e.preventDefault(); const q = $('#zap', root).value.trim(); location.hash = '#/asystent' + (q ? '?q=' + encodeURIComponent(q) : ''); };
    },
  };
}

function startProsty() {
  const zad = otwarte();
  const najwazniejsza = !stan.zrobione.narodziny ? { t: 'Urodziła się córka: załatw sprawy', h: '#/sprawa/narodziny' } : zad[0] ? { t: zad[0].tytul, h: zad[0].cel } : null;
  return {
    tytul: 'Start',
    html: `
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
    <p class="stopka-info">Dokumenty w telefonie działają już w obecnym mObywatelu. Tu dodajemy źródło i datę aktualizacji każdej danej oraz zgłaszanie błędów. Karty są stylizowane: bez godła i bez oznaczeń urzędowych.</p>`,
  };
}

export function dokument(id) {
  const d = dokumenty.find(x => x.id === id);
  if (!d) return null;
  return {
    tytul: d.nazwa,
    html: `<h1 tabindex="-1">${esc(d.nazwa)}</h1>
    <div class="kd kd-${d.kolor} kd-przod kd-sam"><span class="kd-gora"><b class="kd-t">${esc(d.nazwa)}</b><span class="kd-holo" aria-hidden="true"></span></span><span class="kd-linia">${esc(d.linia)}</span>${id === 'pojazd' ? `<span class="kd-auto">${autoZBoku({ kolor: 'czerwony', opis: 'Toyota Yaris, czerwona' })}</span>` : `<span class="kd-dol"><span class="kd-foto">${zdjecieAnny('Zdjęcie: ' + ja.imie + ' ' + ja.nazwisko)}</span><span class="kd-imie">${esc(ja.imie.toUpperCase())}<small>${esc(ja.nazwisko.toUpperCase())}</small></span></span>`}</div>
    <details class="karta kod-qr"><summary>${ic('eye')}Pokaż kod do sprawdzenia dokumentu</summary><span class="qr duzy" role="img" aria-label="Kod do sprawdzenia dokumentu">${kodQR(13)}</span><p class="maly srodek">Kod ważny 2 minuty. Sprawdzający zobaczy go w swojej aplikacji.</p></details>
    <section class="karta">${d.pola.map(p => wiersz(...p)).join('')}
      <p class="zrodlo">${ic('info')}<span>Źródło: ${esc(d.zrodlo)}. Aktualne na: dziś, ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}.</span></p>
      <button class="btn tekst" id="blad-dan">Te dane są błędne? Zgłoś to</button>
    </section>
    ${id === 'pojazd' ? `<a class="karta link-karta" href="#/badanie">${ic('clock', 'okr')}<span><b>Badanie techniczne za 19 dni</b><small>Stacje kontroli w pobliżu na mapie i wolne terminy.</small></span>${ic('right', 'strz')}</a>` : ''}
    ${id === 'dowod' ? `<a class="btn glowny szeroki" href="#/sprawa/dowod">Złóż wniosek o nowy dowód</a>` : ''}`,
    po(root) { $('#blad-dan', root).onclick = () => toast(`Zgłoszenie trafiło do: ${d.zrodlo}. Odpowiedź dostaniesz w skrzynce.`); },
  };
}

export function pokaz() {
  return {
    tytul: 'Pokaż tylko to, co potrzebne',
    html: `<h1 tabindex="-1">Pokaż tylko to, co potrzebne</h1>
    <p class="wstep">Wybierz, co chcesz potwierdzić. Odbiorca zobaczy tylko to, a nie cały dowód.</p>
    <form id="f-pok" class="karta">
      <fieldset class="grupa"><legend class="etyk">Co potwierdzić</legend>
        <label class="opcja"><input type="radio" name="co" value="18" checked> Mam ukończone 18 lat</label>
        <label class="opcja"><input type="radio" name="co" value="tozs"> Imię, nazwisko i zdjęcie (np. w hotelu)</label>
        <label class="opcja"><input type="radio" name="co" value="adres"> Adres zameldowania</label>
      </fieldset>
      <button class="btn glowny szeroki">Pokaż kod</button>
    </form>
    <div id="kod" aria-live="polite"></div>`,
    po(root) {
      $('#f-pok', root).onsubmit = e => {
        e.preventDefault();
        const co = $('input[name=co]:checked', root).value;
        const t = { 18: 'Ta osoba ma ukończone 18 lat', tozs: `${ja.imie} ${ja.nazwisko}`, adres: ja.adres }[co];
        $('#kod', root).innerHTML = `<div class="karta srodek"><span class="qr duzy" role="img" aria-label="Kod do zeskanowania">${kodQR(Date.now() % 997)}</span><p><b>${esc(t)}</b></p><p class="maly">Kod ważny 2 minuty. Data urodzenia, PESEL i adres ${co === 'adres' ? 'poza adresem ' : ''}pozostają ukryte.</p></div>`;
      };
    },
  };
}

/* ---------------- Skrzynka ---------------- */
export function skrzynkaWidok() {
  const doZap = [!stan.zrobione.mandat && ['#/mandat', 'Mandat z fotoradaru', '200 zł do ' + fmt(za(6))], !stan.zrobione.podatek && ['#/podatek', 'Podatek od nieruchomości', '186 zł do ' + fmt(za(23))]].filter(Boolean);
  return {
    tytul: 'Skrzynka',
    html: `<h1 tabindex="-1">Pisma i płatności</h1>
    ${doZap.length ? `<h2 class="sekcja">Do zapłaty</h2><ul class="lista">${doZap.map(p => poz(p[0], 'coin', p[1], esc(p[2]))).join('')}</ul>` : ''}
    <h2 class="sekcja">Pisma</h2>
    <ul class="lista">${skrzynka.map(p => poz('#/pismo/' + p.id, 'mail', p.tytul, `${esc(p.od)} · ${fmt(p.data)}`, p.nowa && !stan.przeczytane[p.id] ? '<span class="plak niebieska">nowe</span>' : '')).join('')}</ul>
    <p class="stopka-info">Pisma przychodzą przez e-Doręczenia, które już działają. Nowość: każde pismo ma wersję prostym językiem i przycisk do załatwienia sprawy.</p>`,
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
    <p class="zrodlo">${ic('info')}<span>Wersję prostym językiem przygotowuje urząd razem z pismem i odpowiada za nią tak samo jak za oryginał.</span></p>`,
  };
}

/* ---------------- Możesz skorzystać, przypomnienia i zlecenia ---------------- */
export function naleznosciWidok() {
  return {
    tytul: 'Możesz skorzystać',
    html: `<h1 tabindex="-1">Możesz skorzystać</h1>
    <p class="wstep">Sprawdziliśmy to w rejestrach, do których państwo już ma dostęp. Nic nie musisz wpisywać.</p>
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
    <p class="stopka-info">Każde przypomnienie i zlecenie wyłączysz tutaj w każdej chwili. Wzór: usługa AutoGov w Abu Zabi i usługi proaktywne w Estonii.</p>`,
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
      ${poz('#/dane/dostep', 'eye', 'Kto sprawdzał moje dane', `${n} odczytów w ostatnich 60 dniach`, '<span class="plak pomaranczowa">1 do wyjaśnienia</span>')}
      ${poz('#/dane/rejestry', 'doc', 'Co państwo o mnie wie', '5 rejestrów, źródło i data każdej danej')}
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
      ${d.podejrzane ? '<p class="ostrz">' + ic('alert') + '<span>Nie kupowałaś karty SIM? Ktoś mógł próbować użyć Twoich danych. Zastrzeżenie PESEL zadziałało i operator odmówił.</span></p>' : ''}
      <button class="btn tekst" data-zglos="${esc(d.kto)}">To nie ja / zgłoś nieuprawniony dostęp</button>
    </details></li>`).join('')}</ul>
    <p class="stopka-info">Już dziś w mObywatelu w przeglądarce sprawdzisz historię weryfikacji numeru PESEL przez firmy i instytucje, a z gov.pl pobierzesz plik z odbiorcami danych z rejestru PESEL i Rejestru Dowodów Osobistych. Tu rozwijamy tę usługę: na bieżąco, ze wszystkich rejestrów, z celem i podstawą prawną oraz z ostrzeżeniem o podejrzanym odczycie. Wzór: estoński „Andmejälgija” (Data Tracker).</p>`,
    po(root) {
      $$('details[data-wpis]', root).forEach(d => d.addEventListener('toggle', () => { if (d.open && d.dataset.wpis === 'policja') cel('dostep-policja'); }));
      $$('[data-zglos]', root).forEach(b => b.onclick = () => toast('Zgłoszenie wysłane do inspektora ochrony danych: ' + b.dataset.zglos));
    },
  };
}

export function rejestry() {
  const R = [
    ['Rejestr PESEL', 'imię, nazwisko, PESEL, adres, stan cywilny, dzieci', 'Ministerstwo Cyfryzacji'],
    ['Centralna Ewidencja Pojazdów i Kierowców', 'Toyota Yaris EL 4K217, prawo jazdy kat. B, 2 punkty', 'Ministerstwo Cyfryzacji'],
    ['Krajowa Administracja Skarbowa', 'dochody za 2025 r., nadpłata 214 zł', 'Ministerstwo Finansów'],
    ['ZUS', 'zatrudnienie: ' + ja.pracodawca + ', zasiłek macierzyński', 'ZUS'],
    ['NFZ / Internetowe Konto Pacjenta', 'ubezpieczenie, recepty, skierowania', 'NFZ, Ministerstwo Zdrowia'],
  ];
  return {
    tytul: 'Co państwo o mnie wie',
    html: `<h1 tabindex="-1">Co państwo o mnie wie</h1>
    <ul class="lista-kart">${R.map(r => `<li class="karta"><h2 class="nag">${esc(r[0])}</h2><p>${esc(r[1])}</p><p class="maly">Administrator: ${esc(r[2])}</p><button class="btn tekst" data-blad="${esc(r[0])}">Zgłoś błąd w tych danych</button></li>`).join('')}</ul>`,
    po(root) { $$('[data-blad]', root).forEach(b => b.onclick = () => toast('Zgłoszenie trafiło do: ' + b.dataset.blad)); },
  };
}

/* ---------------- Bliscy ---------------- */
export function bliscy() {
  return {
    tytul: 'Bliscy',
    html: `<h1 tabindex="-1">Bliscy</h1>
    <p class="wstep">Załatwiaj sprawy w imieniu osób, które Cię upoważniły, i dzieci. One widzą wszystko, co robisz w ich imieniu.</p>
    <ul class="lista">
      ${poz('#/bliscy/mama', twarzMamy(), `${mama.imie} ${mama.nazwisko}, ${mama.wiek} lat`, `upoważnienie: ${esc(mama.pelnomocnictwo)}`, stan.zrobione.mama ? '' : '<span class="plak pomaranczowa">1</span>')}
      ${stan.zrobione.narodziny ? poz('#/dokumenty', twarzCorki(), `${stan.imieDziecka} ${ja.nazwisko}`, 'córka · PESEL nadawany, odpis aktu w drodze') : poz('#/sprawa/narodziny', twarzCorki(), 'Córka', 'najpierw zgłoś urodzenie')}
    </ul>
    <button class="btn drugi szeroki" id="dodaj-bl">${ic('users')}Dodaj bliską osobę</button>
    <p class="stopka-info">Upoważnienie podpisuje osoba, która go udziela: w swoim mObywatelu albo w urzędzie, jeśli nie ma telefonu.</p>`,
    po(root) { $('#dodaj-bl', root).onclick = () => toast('Wyślemy prośbę o upoważnienie. Bliska osoba podpisze ją u siebie albo w urzędzie.'); },
  };
}

export function blMama() {
  return {
    tytul: 'Mama',
    html: `<div class="osoba-nag"><span class="awatar duzy">${twarzMamy()}</span><h1 tabindex="-1">${esc(mama.imie)} ${esc(mama.nazwisko)}</h1></div>
    <p class="maly">Działasz z upoważnienia mamy (${esc(mama.pelnomocnictwo)}) do ${fmtPelna(mama.pelnomocnictwoDo)}. Mama widzi w swojej aplikacji albo w liście z urzędu, co robisz w jej imieniu.</p>
    ${stan.zrobione.mama ? `<div class="karta">${ic('check', 'okr zielona')} <b>Urzędnik przyjedzie do mamy ${fmt(za(12))}</b><p class="maly">Przyjmie wniosek o dowód i pobierze odciski palców w domu.</p></div>` : `
    <section class="karta">
      <h2 class="nag">${ic('id')}Dowód mamy traci ważność ${fmt(za(77))}</h2>
      <p>Mama ma kłopot z chodzeniem. Urzędnik może przyjść do domu, przyjąć wniosek i pobrać odciski palców.</p>
      <button class="btn glowny szeroki" id="wizyta">Zamów wizytę urzędnika u mamy</button>
    </section>`}
    <section class="karta"><h2 class="nag">${ic('doc')}Recepta gotowa</h2>${wiersz('Lek', 'Metformax 500, 60 tabl.')}${wiersz('Kod', '4821')}<p class="maly">Z Internetowego Konta Pacjenta mamy, na podstawie upoważnienia.</p></section>
    <section class="karta"><h2 class="nag">${ic('coin')}Emerytura</h2><p>Od marca wyższa o waloryzację. Mama nie musi nic robić.</p></section>`,
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
    <p class="stopka-info">Ten ekran odpowiada na najczęstszą skargę w recenzjach mObywatela: 33% ocen 1–2★ dotyczy logowania i „pętli” przy potwierdzaniu tożsamości.</p>`,
    po(root) {
      $$('[data-sp]', root).forEach(b => b.onclick = () => {
        if (b.dataset.sp === 'bank') { dostepKrok = 'bank'; dispatchEvent(new HashChangeEvent('hashchange')); }
        else toast('W prototypie pokazujemy ścieżkę przez bank. Pozostałe działają tak samo: wracasz w to samo miejsce.');
      });
    },
  };
}
export function resetDostepu() { dostepKrok = 'diagnoza'; }

/* ---------------- Konsultant, ustawienia, menu ---------------- */
export function konsultant() {
  return {
    tytul: 'Pomoc człowieka',
    html: `<h1 tabindex="-1">Pomoc człowieka</h1>
    <p class="wstep">Asystent nie wie wszystkiego. Konsultant widzi, na czym utknęłaś, więc nie musisz tłumaczyć od początku (jeśli się zgodzisz).</p>
    <form id="f-kon" class="karta">
      <label class="opcja"><input type="checkbox" checked> Pokaż konsultantowi, gdzie utknęłam</label>
      <button class="btn glowny szeroki">${ic('phone')}Poproś o telefon</button>
    </form>
    <p class="stopka-info">W prototypie nie łączymy się z nikim.</p>`,
    po(root) { $('#f-kon', root).onsubmit = e => { e.preventDefault(); cel('konsultant'); toast('Konsultant oddzwoni w ciągu 15 minut (symulacja).'); }; },
  };
}

export function ustawienia() {
  const U = stan.ustawienia;
  const prz = (id, t, o) => `<li><label class="przel-duzy"><span><b>${t}</b><small>${o}</small></span><input type="checkbox" role="switch" data-ust="${id}" ${U[id] ? 'checked' : ''}></label></li>`;
  return {
    tytul: 'Ustawienia',
    html: `<h1 tabindex="-1">Ustawienia</h1>
    <h2 class="grupa-t" id="wyglad-t">Wygląd</h2>
    <div class="karta" role="group" aria-labelledby="wyglad-t">${wyborMotywu()}<p class="maly">„Automatycznie” zmienia wygląd razem z telefonem.</p></div>
    <h2 class="grupa-t">Dostępność</h2>
    <ul class="lista ustaw">
      ${prz('prosty', 'Tryb prosty', 'Duże przyciski, najważniejsze rzeczy na starcie, krótkie zdania.')}
      ${prz('duzy', 'Większy tekst', 'Tekst o 20% większy.')}
      ${prz('kontrast', 'Wysoki kontrast', 'Mocniejsze kolory i obramowania.')}
      ${prz('czytaj', 'Czytaj na głos', 'Odpowiedzi asystenta i komunikaty czytane głosem.')}
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
      ${poz('#/naleznosci', 'gift', 'Możesz skorzystać', '4 świadczenia i ulgi')}
      ${poz('#/bliscy', 'users', 'Bliscy', 'mama, córka')}
      ${poz('#/zlecenia', 'clock', 'Przypomnienia i zlecenia', 'terminy i sprawy, które robimy za Ciebie')}
    </ul>
    <h2 class="grupa-t">Bezpieczeństwo i dane</h2>
    <ul class="lista">
      ${poz('#/dane', 'eye', 'Twoje dane i prywatność', 'kto sprawdzał moje dane')}
      ${poz('#/kto-dzwoni', 'callcheck', 'Kto dzwoni?', 'sprawdź numer, zanim cokolwiek powiesz')}
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
      ${poz('#/jury', 'info', 'Dla jury', 'co mierzyliśmy i jak to sprawdzić')}
      ${poz('#/test', 'test', 'Tryb testowy', '')}
    </ul>`,
  };
}
