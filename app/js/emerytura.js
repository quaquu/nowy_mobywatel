// Twoja emerytura: kapitał ze wszystkich filarów w jednym miejscu, prognoza, cel i to, co ją podnosi.
// Od 2026 r. ZUS ma udostępniać w mObywatelu dane z systemu powszechnego i z programów dobrowolnych
// (PPK, PPE, IKE, IKZE). Dane osób w pokazie są fikcyjne, prognoza poglądowa (model niżej, w „Jak liczymy”).
import { ic } from './icons.js';
import { esc, $ } from './core.js';
import { emerytalne as E, ja, dziecko, zl, za, OSOBA, WLASCICIEL } from './data.js';

const GRUPY = [
  ['zus', 'Konto w ZUS'],
  ['sub', 'Subkonto w ZUS'],
  ['ppk', 'PPK'],
  ['dobr', 'IKE i IKZE'],
];
// Założenia modelu (poglądowo, w złotych o dzisiejszej sile nabywczej):
const WALORYZACJA = 0.02;   // realny wzrost kapitału w ZUS rocznie
const ZWROT = 0.03;         // realny zwrot z PPK, IKE i IKZE rocznie
const SKLADKA = 0.1952;     // składka emerytalna od pensji: 12,22% na konto i 7,3% na subkonto
// średnie dalsze trwanie życia w miesiącach, w przybliżeniu (tablice GUS)
const MIESIACE = { 60: 264, 61: 256, 62: 248, 63: 239, 64: 229, 65: 218, 66: 210, 67: 201 };
const WYPLATA_DODATKOWA = 240; // PPK, IKE i IKZE rozłożone na 20 lat
const LIMIT_IKZE = 11304;   // limit wpłat na IKZE w 2026 r. (zatrudnieni)
const LIMIT_PIT0 = 85528;   // ulga dla pracujących seniorów: przychód zwolniony z PIT rocznie
const NAJNIZSZA = 1978.49;  // najniższa emerytura od 1 marca 2026 r.
const STAZ_GWARANCJA = { k: 20, m: 25 }; // lata stażu do gwarancji najniższej emerytury: kobiety, mężczyźni
const WIEK_MAX = 67;

const tys = n => n >= 1e6 ? (n / 1e6).toLocaleString('pl-PL', { maximumFractionDigits: 1 }) + ' mln zł' : Math.round(n / 1000).toLocaleString('pl-PL') + ' tys. zł';
const zlOkr = n => zl(Math.round(n));
const fv = (b, r, n) => b * (1 + r) ** n;
const fvRenta = (rocznie, r, n) => rocznie * (((1 + r) ** n - 1) / r);
const lata = n => { const l = Math.floor(n), m = Math.round((n - l) * 12); return `${l} ${l === 1 ? 'rok' : l % 10 >= 2 && l % 10 <= 4 && (l % 100 < 12 || l % 100 > 14) ? 'lata' : 'lat'}${m ? ` i ${m} mies.` : ''}`; };
const teraz = () => { const d = new Date(); return d.getFullYear() + d.getMonth() / 12; };
const kiedy = x => x === 'porod' ? dziecko.urodzone.getFullYear() + dziecko.urodzone.getMonth() / 12 : x === null ? teraz() : x[0] + (x[1] - 1) / 12;

function lataDo(wiek) { const [rok, mies] = E.ur; return Math.max(0, (rok + wiek + (mies - 1) / 12) - teraz()); }
export function suma() { return E?.pozycje ? E.pozycje.reduce((s, p) => s + p.kwota, 0) : 0; }
const sumaGrupy = g => E.pozycje.filter(p => p.grupa === g).reduce((s, p) => s + p.kwota, 0);

// Kapitał w roku t (od dziś) przy dopłacie do IKZE `ikze` zł miesięcznie.
function kapital(t, ikze) {
  const zus = sumaGrupy('zus') + sumaGrupy('sub'), dod = sumaGrupy('ppk') + sumaGrupy('dobr');
  const ppkMies = E.pozycje.find(p => p.id === 'ppk')?.wplata || 0;
  const kZus = fv(zus, WALORYZACJA, t) + fvRenta(E.pensja * 12 * SKLADKA, WALORYZACJA, t);
  const kDod = fv(dod, ZWROT, t) + fvRenta((ppkMies + ikze) * 12, ZWROT, t);
  return { kZus, kDod, razem: kZus + kDod };
}
export function prognoza(wiek, ikze) {
  const n = lataDo(wiek), k = kapital(n, ikze);
  const zZus = k.kZus / MIESIACE[wiek], zDod = k.kDod / WYPLATA_DODATKOWA;
  return { n, k, zZus, zDod, razem: zZus + zDod, zastapienie: zZus / E.pensja, ulga: Math.min(ikze * 12, LIMIT_IKZE) * E.pit, rok: E.ur[0] + wiek };
}

// Staż: okresy składkowe (praca) i opłacone przez budżet (urlop macierzyński). Studia i okresy bez składek się nie liczą.
function staz() {
  const liczone = E.okresy.filter(o => o.rodzaj === 'praca' || o.rodzaj === 'macierz');
  const lat = liczone.reduce((s, o) => s + Math.max(0, kiedy(o.do) - kiedy(o.od)), 0);
  const cel = STAZ_GWARANCJA.k; // osoby w pokazie z oszczędnościami to kobiety
  return { lat, cel, brakuje: Math.max(0, cel - lat), rokCelu: Math.ceil(teraz() + Math.max(0, cel - lat)) };
}

// Ulga dla pracujących seniorów (PIT-0), w przybliżeniu: skala 12%, składki pracownika 13,71%, koszty 3000 zł, kwota zmniejszająca 3600 zł.
function pit0() {
  const P = E.pensja * 12;
  const podatek = przychod => Math.max(0, (przychod * (1 - 0.1371) - 3000 * przychod / P) * 0.12 - 3600);
  const bez = podatek(P), z = podatek(Math.max(0, P - LIMIT_PIT0));
  return { rocznie: bez - z, miesiecznie: (bez - z) / 12 };
}

/* ---------- Wykresy ---------- */
// Udział filarów: jeden poziomy pasek, segmenty w stałej kolejności barw, 2 px przerwy, opis w legendzie pod spodem.
function pasekUdzialow() {
  const s = suma(), grupy = GRUPY.map(([g, n], i) => ({ g, n, i, v: sumaGrupy(g) })).filter(x => x.v > 0);
  return `<div class="udzialy" role="img" aria-label="Udział: ${grupy.map(x => `${x.n} ${Math.round(x.v / s * 100)}%`).join(', ')}">
    ${grupy.map(x => `<span class="udz s${x.i + 1}" style="flex-grow:${x.v}"></span>`).join('')}
  </div>`;
}
// Kapitał rok po roku do emerytury: pole pod linią, podpisane początek i koniec, najechanie pokazuje rok i kwotę.
function wykresKapitalu(wiek, ikze) {
  const n = Math.round(lataDo(wiek)), rok0 = new Date().getFullYear();
  const pkt = Array.from({ length: n + 1 }, (_, t) => ({ rok: rok0 + t, v: kapital(t, ikze).razem }));
  const W = 340, H = 150, L = 4, R = 4, T = 22, B = 24, max = Math.max(...pkt.map(p => p.v)) * 1.05;
  const x = i => L + i * (W - L - R) / n, y = v => T + (H - T - B) * (1 - v / max);
  const linia = pkt.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const pole = `${linia}L${x(n).toFixed(1)},${H - B}L${x(0).toFixed(1)},${H - B}Z`;
  const siatka = [0.5, 1].map(f => `<line class="wk-siatka" x1="${L}" x2="${W - R}" y1="${y(max / 1.05 * f).toFixed(1)}" y2="${y(max / 1.05 * f).toFixed(1)}"/>`).join('');
  const osie = [0, Math.round(n / 2), n].map(i => `<text class="wk-os" x="${x(i).toFixed(1)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === n ? 'end' : 'middle'}">${pkt[i].rok}</text>`).join('');
  return `<figure class="wykres" data-pkt='${JSON.stringify(pkt.map(p => [p.rok, Math.round(p.v)]))}'>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kapitał emerytalny: dziś ${tys(pkt[0].v)}, w ${pkt[n].rok} r. ${tys(pkt[n].v)} (w dzisiejszych złotych)">
      ${siatka}
      <path class="wk-pole" d="${pole}"/><path class="wk-linia" d="${linia}"/>
      <circle class="wk-pkt" cx="${x(0).toFixed(1)}" cy="${y(pkt[0].v).toFixed(1)}" r="4"/><circle class="wk-pkt" cx="${x(n).toFixed(1)}" cy="${y(pkt[n].v).toFixed(1)}" r="4"/>
      <text class="wk-etyk" x="${x(0).toFixed(1)}" y="${(y(pkt[0].v) - 10).toFixed(1)}">${tys(pkt[0].v)}</text>
      <text class="wk-etyk" x="${x(n).toFixed(1)}" y="${(y(pkt[n].v) - 10).toFixed(1)}" text-anchor="end">${tys(pkt[n].v)}</text>
      ${osie}
      <line class="wk-krzyz" x1="0" x2="0" y1="${T}" y2="${H - B}" hidden/><circle class="wk-wsk" r="5" hidden/>
    </svg>
    <span class="wk-dymek" hidden></span>
    <figcaption class="sr">Wykres pokazuje wzrost kapitału do roku ${pkt[n].rok}. Te same liczby są w tabeli poniżej.</figcaption>
  </figure>
  <details class="rozw wk-tabela"><summary>Pokaż w tabeli</summary>
    <table><thead><tr><th scope="col">Rok</th><th scope="col">Kapitał (dzisiejsze zł)</th></tr></thead>
    <tbody>${pkt.filter((p, i) => i % 5 === 0 || i === n).map(p => `<tr><th scope="row">${p.rok}</th><td>${zlOkr(p.v)}</td></tr>`).join('')}</tbody></table>
  </details>`;
}
function obsluzWykres(root) {
  const f = $('.wykres', root); if (!f) return;
  const svg = $('svg', f), pkt = JSON.parse(f.dataset.pkt), dymek = $('.wk-dymek', f), krzyz = $('.wk-krzyz', f), wsk = $('.wk-wsk', f);
  const linia = $('.wk-linia', f).getAttribute('d').split(/[ML]/).filter(Boolean).map(s => s.split(',').map(Number));
  svg.onpointermove = e => {
    const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * 340;
    let i = 0; linia.forEach((p, j) => { if (Math.abs(p[0] - vx) < Math.abs(linia[i][0] - vx)) i = j; });
    const [px, py] = linia[i];
    krzyz.setAttribute('x1', px); krzyz.setAttribute('x2', px); wsk.setAttribute('cx', px); wsk.setAttribute('cy', py);
    dymek.innerHTML = `<b>${pkt[i][0]}</b>${zl(pkt[i][1])}`;
    dymek.style.left = `${px / 340 * 100}%`; dymek.style.top = `${py / 150 * 100}%`;
    dymek.classList.toggle('lewo', px > 200);
    dymek.hidden = krzyz.hidden = wsk.hidden = false;
  };
  svg.onpointerleave = () => { dymek.hidden = krzyz.hidden = wsk.hidden = true; };
}
// „Schody”: miesięczna emerytura przy przejściu w kolejnych latach życia. Jedna seria; wybrany wiek pełnym kolorem.
function schody(wiek, ikze) {
  const wieki = Object.keys(MIESIACE).map(Number).filter(w => w >= E.wiek && w <= WIEK_MAX);
  const v = wieki.map(w => prognoza(w, ikze).razem), max = Math.max(...v) * 1.12;
  const W = 340, H = 168, T = 22, B = 26, kol = (W - 8) / wieki.length, szer = kol - 10;
  const y = x => T + (H - T - B) * (1 - x / max);
  const slupki = wieki.map((w, i) => {
    const x0 = 4 + i * kol + 5, yy = y(v[i]), wyb = w === wiek;
    return `<g class="sch${wyb ? ' wybrany' : ''}"><title>${w} lat: ${zlOkr(v[i])} miesięcznie</title>
      <path d="M${x0},${H - B}V${(yy + 4).toFixed(1)}q0,-4 4,-4h${szer - 8}q4,0 4,4V${H - B}Z"/>
      ${wyb || i === wieki.length - 1 ? `<text class="wk-etyk" x="${(x0 + szer / 2).toFixed(1)}" y="${(yy - 6).toFixed(1)}" text-anchor="middle">${(Math.round(v[i] / 100) / 10).toLocaleString('pl-PL')} tys.</text>` : ''}
      <text class="wk-os" x="${(x0 + szer / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${w}</text></g>`;
  }).join('');
  const i0 = wieki.indexOf(wiek), nast = i0 >= 0 && i0 < wieki.length - 1 ? v[i0 + 1] - v[i0] : 0;
  return `<p class="sch-teza">${nast > 0 ? `Rok dłużej: <b>+${zlOkr(nast)} miesięcznie</b> (+${Math.round(nast / v[i0] * 100)}%), do końca życia.` : `Przy ${wiek} latach to już najwyższa prognoza na tym wykresie.`}</p>
    <figure class="wykres-schody"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Miesięczna emerytura w zależności od wieku przejścia: ${wieki.map((w, i) => `${w} lat ${zlOkr(v[i])}`).join(', ')}">
      <line class="wk-siatka" x1="4" x2="${W - 4}" y1="${H - B}" y2="${H - B}"/>${slupki}</svg>
      <figcaption class="maly">Wiek przejścia na emeryturę (lata). Wybrany wiek jest pełnym kolorem.</figcaption></figure>
    <details class="rozw wk-tabela"><summary>Pokaż w tabeli</summary>
      <table><thead><tr><th scope="col">Wiek</th><th scope="col">Emerytura miesięcznie</th></tr></thead>
      <tbody>${wieki.map((w, i) => `<tr><th scope="row">${w} lat</th><td>${zlOkr(v[i])}</td></tr>`).join('')}</tbody></table>
    </details>`;
}
// Oś kariery: okresy w ZUS od pierwszej umowy do dziś; przerwa bez składek wyróżniona i opisana.
function osKariery() {
  const od = Math.min(...E.okresy.map(o => kiedy(o.od))), doo = teraz(), zakres = doo - od;
  const KL = { praca: 's1', macierz: 's3', brak: 'brak', nauka: 'nauka' };
  const NAZ = { praca: 'praca, składki płacone', macierz: 'urlop macierzyński, składki z budżetu', brak: 'brak składek', nauka: 'nauka, bez składek' };
  const segmenty = E.okresy.map(o => `<span class="ok-seg ${KL[o.rodzaj]}" style="left:${((kiedy(o.od) - od) / zakres * 100).toFixed(2)}%;width:${Math.max(0.8, (kiedy(o.do) - kiedy(o.od)) / zakres * 100).toFixed(2)}%"></span>`).join('');
  const rok = x => Math.floor(x);
  return `<div class="os-kariery" role="img" aria-label="Okresy w ZUS od ${rok(od)} do dziś: ${E.okresy.map(o => `${NAZ[o.rodzaj]} od ${rok(kiedy(o.od))}`).join(', ')}">${segmenty}</div>
    <div class="ok-osie" aria-hidden="true"><span>${rok(od)}</span><span>dziś</span></div>
    <ul class="ok-lista">${E.okresy.map(o => `<li><span class="kropka-s ok-${KL[o.rodzaj]}" aria-hidden="true"></span><span><b>${rok(kiedy(o.od))}–${o.do === null ? 'dziś' : rok(kiedy(o.do))}</b> ${esc(o.opis)}</span></li>`).join('')}</ul>`;
}

/* ---------- Ekrany ---------- */
function wybor(nazwa, opcje, legenda, wartosc) {
  return `<fieldset class="segment-pole"><legend class="etyk">${esc(legenda)}</legend><div class="segment">${opcje.map(([v, t]) => `<label><input type="radio" name="${nazwa}" value="${v}"${String(v) === String(wartosc) ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`;
}
function wynik(wiek, ikze) {
  const p = prognoza(wiek, ikze);
  return `<p class="pr-kwota"><span class="pr-liczba">${zlOkr(p.razem)}</span><small>miesięcznie, brutto, w dzisiejszych złotych</small></p>
    <ul class="pr-rozbicie">
      <li><span class="kropka-s s1"></span><span>Z ZUS, dożywotnio</span><b>${zlOkr(p.zZus)}</b></li>
      <li><span class="kropka-s s3"></span><span>Z PPK, IKE i IKZE, przez 20 lat</span><b>${zlOkr(p.zDod)}</b></li>
    </ul>
    <p class="maly">Emerytura z ZUS zastąpi <b>${Math.round(p.zastapienie * 100)}%</b> dzisiejszej pensji (${zl(E.pensja)} brutto). Przejście na emeryturę: ${p.rok} r., za ${Math.round(p.n)} lat.</p>
    ${ikze ? `<p class="pr-ulga">${ic('coin')}<span>Wpłaty na IKZE odliczysz od dochodu: <b>ok. ${zlOkr(p.ulga)} mniej podatku rocznie</b> (stawka 12%, limit ${zl(LIMIT_IKZE)} w 2026 r.).</span></p>` : ''}
    ${wykresKapitalu(wiek, ikze)}`;
}
// Cel jako procent dzisiejszej pensji; luka i dwa sposoby, żeby ją domknąć.
function celWynik(wiek, ikze, proc) {
  const cel = E.pensja * proc / 100, p = prognoza(wiek, ikze), luka = cel - p.razem;
  const pasek = `<div class="cel-pasek" role="img" aria-label="Prognoza to ${Math.round(p.razem / cel * 100)}% celu"><span style="width:${Math.min(100, p.razem / cel * 100).toFixed(1)}%"></span></div>`;
  if (luka <= 0) return `<p class="cel-teza">${ic('check')}<span>Prognoza (${zlOkr(p.razem)}) przekracza cel ${zlOkr(cel)} o <b>${zlOkr(-luka)}</b>.</span></p>${pasek}`;
  const wiekDo = Object.keys(MIESIACE).map(Number).find(w => w > wiek && w <= WIEK_MAX && prognoza(w, ikze).razem >= cel);
  const nZl = fvRenta(12, ZWROT, lataDo(wiek)) / WYPLATA_DODATKOWA; // ile zł emerytury daje 1 zł miesięcznie na IKZE
  const ikzeDo = Math.ceil((luka / nZl + ikze) / 10) * 10, wLimicie = ikzeDo * 12 <= LIMIT_IKZE;
  return `<p class="cel-teza">${ic('star')}<span>Do celu ${zlOkr(cel)} brakuje <b>${zlOkr(luka)} miesięcznie</b>. Każda z tych zmian go domyka:</span></p>${pasek}
    <ul class="cel-sposoby">
      ${wiekDo ? `<li>${ic('clock')}<span>Pracuj do <b>${wiekDo} lat</b>: o ${wiekDo - wiek} ${wiekDo - wiek === 1 ? 'rok' : wiekDo - wiek < 5 ? 'lata' : 'lat'} dłużej</span></li>` : ''}
      <li>${ic('coin')}<span>${wLimicie ? `Wpłacaj <b>${zl(ikzeDo)} miesięcznie</b> na IKZE (w limicie ${zl(LIMIT_IKZE)} rocznie)` : `Sama dopłata do IKZE nie wystarczy: potrzeba więcej niż limit ${zl(LIMIT_IKZE)} rocznie`}</span></li>
    </ul>`;
}

export function emeryturaWidok() {
  if (!E) return {
    tytul: 'Twoja emerytura',
    html: `<h1 tabindex="-1">Twoja emerytura</h1>
    <section class="karta pusta-emer">${ic('sun', 'okr')}<h2 class="nag">Zaczniesz od pierwszej pracy</h2>
      <p>Z każdej umowy o pracę i większości umów zlecenia płyną składki na Twoje konto w ZUS. Po 18. urodzinach pracodawca zapisze Cię też do PPK, chyba że zrezygnujesz.</p>
      <p class="maly">Gdy pojawią się pierwsze składki, zobaczysz tu stan konta i prognozę.</p></section>`,
  };
  if (E.wyplata) return {
    tytul: 'Twoja emerytura',
    html: `<h1 tabindex="-1">Twoja emerytura</h1>
    <section class="emer-glowa"><p class="emer-etyk">Wypłata z ZUS co miesiąc</p><p class="emer-suma">${zl(E.wyplata.kwota)}</p><p class="emer-pod">brutto, ${E.wyplata.dzien}. dnia miesiąca na konto ${esc(ja.konto)}</p></section>
    <ul class="lista">
      <li class="poz">${ic('clock', 'okr')}<span><b>Następna waloryzacja</b><small>${esc(E.wyplata.waloryzacja)}, z urzędu; nic nie musisz robić</small></span></li>
      <li><a class="poz" href="#/sprawa/renta">${ic('coin', 'okr')}<span><b>Renta wdowia: ok. 434 zł więcej</b><small>emerytura w całości i część renty po mężu</small></span>${ic('right', 'strz')}</a></li>
    </ul>
    <p class="zrodlo">${ic('info')}<span>Źródło: ZUS. Aktualne na dziś.</span></p>`,
  };
  const s = suma(), dziedz = E.pozycje.filter(p => p.dziedziczne).reduce((a, p) => a + p.kwota, 0);
  const mojaLuka = WLASCICIEL.emerytura === OSOBA, st = staz(), ulgaPit = pit0();
  const ppk = E.pozycje.find(p => p.id === 'ppk'), ikzeKonto = E.pozycje.find(p => p.id === 'ikze');
  const dniDoKonca = Math.ceil((new Date(new Date().getFullYear(), 11, 31) - za(0)) / 864e5);
  const ikzeZostalo = Math.max(0, LIMIT_IKZE - E.ikzeWplacone);
  return {
    tytul: 'Twoja emerytura',
    html: `<h1 tabindex="-1">Twoja emerytura</h1>
    <section class="emer-glowa" aria-labelledby="h-zgr">
      <p class="emer-etyk" id="h-zgr">Zgromadzone na emeryturę</p>
      <p class="emer-suma">${zl(s)}</p>
      <p class="emer-pod">z tego ${zl(dziedz)} przejdzie na bliskich w spadku</p>
      ${pasekUdzialow()}
    </section>
    <ul class="lista emer-lista">${E.pozycje.map(p => {
      const i = GRUPY.findIndex(g => g[0] === p.grupa) + 1;
      return `<li class="poz"><span class="kropka-s s${i}" aria-hidden="true"></span><span><b>${esc(p.nazwa)}</b><small>${esc(p.opis)}<br>dane: ${esc(p.zrodlo)}</small></span><span class="emer-kw">${zl(p.kwota)}<small>${Math.round(p.kwota / s * 100)}%</small></span></li>`;
    }).join('')}</ul>
    <p class="maly emer-stan">Stan kont w ZUS na ${E.stanNa}, po waloryzacji. PPK, IKE i IKZE: na wczoraj.</p>

    <section class="karta prognoza" aria-labelledby="h-prog">
      <h2 class="nag" id="h-prog">${ic('sun')}Prognoza</h2>
      <form id="f-prog">
        ${wybor('wiek', Object.keys(MIESIACE).map(Number).filter(w => [60, 62, 65].includes(w) && w >= E.wiek).map(w => [w, `${w} ${w === 62 ? 'lata' : 'lat'}`]), 'Kiedy przejdziesz na emeryturę', E.wiek)}
        ${wybor('ikze', [[0, 'bez dopłat'], [200, '200 zł'], [500, '500 zł']], 'Dopłata do IKZE miesięcznie', 0)}
      </form>
      <div id="prog-wynik" aria-live="polite">${wynik(E.wiek, 0)}</div>
    </section>

    <section class="karta" aria-labelledby="h-cel">
      <h2 class="nag" id="h-cel">${ic('star')}Twój cel</h2>
      <form id="f-cel">${wybor('cel', [[50, '50% pensji'], [60, '60%'], [70, '70%']], 'Ile chcesz dostawać na emeryturze (z dzisiejszej pensji)', 70)}</form>
      <div id="cel-wynik" aria-live="polite">${celWynik(E.wiek, 0, 70)}</div>
    </section>

    <section class="karta" aria-labelledby="h-sch">
      <h2 class="nag" id="h-sch">${ic('clock')}Każdy rok pracy więcej</h2>
      <div id="schody-wynik">${schody(E.wiek, 0)}</div>
    </section>

    <section class="karta pit0" aria-labelledby="h-pit0">
      <h2 class="nag" id="h-pit0">${ic('gift')}Pracujesz po 60. urodzinach? Bez podatku</h2>
      <p class="pit0-kwota">ok. ${zlOkr(ulgaPit.miesiecznie)} <small>więcej na rękę co miesiąc</small></p>
      <p class="maly">Jeśli po osiągnięciu wieku emerytalnego pracujesz i nie pobierasz emerytury, przychody z pracy do ${zl(LIMIT_PIT0)} rocznie są zwolnione z PIT. Przy dzisiejszej pensji to ok. ${zlOkr(ulgaPit.rocznie)} rocznie (w przybliżeniu; składki ZUS i zdrowotna bez zmian). A emerytura w tym czasie dalej rośnie.</p>
    </section>

    <section class="karta" aria-labelledby="h-staz">
      <h2 class="nag" id="h-staz">${ic('shield')}Twój staż</h2>
      <p class="staz-liczba"><b>${lata(st.lat)}</b> z ${st.cel} lat</p>
      <div class="cel-pasek staz" role="img" aria-label="Staż: ${lata(st.lat)} z ${st.cel} lat"><span style="width:${Math.min(100, st.lat / st.cel * 100).toFixed(1)}%"></span></div>
      <p class="maly">${st.brakuje ? `Po ${st.cel} latach stażu masz gwarancję najniższej emerytury (dziś ${zl(NAJNIZSZA)} brutto), nawet jeśli składki dałyby mniej. Przy pracy bez przerw osiągniesz to w ${st.rokCelu} r.` : `Masz już staż, który gwarantuje co najmniej najniższą emeryturę (dziś ${zl(NAJNIZSZA)} brutto).`}</p>
      ${osKariery()}
      ${mojaLuka ? `<a class="btn drugi szeroki" href="#/sprawa/emerytura">Sprawdź lata 2013–2015 bez składek</a>` : ''}
    </section>

    ${ikzeKonto && ikzeZostalo ? `<section class="karta termin-ikze" aria-labelledby="h-ikze">
      <h2 class="nag" id="h-ikze">${ic('clock')}IKZE: do końca roku ${dniDoKonca} ${dniDoKonca === 1 ? 'dzień' : 'dni'}</h2>
      <p>W ${new Date().getFullYear()} r. wpłaciłaś ${zl(E.ikzeWplacone)}. Do 31 grudnia możesz dopłacić jeszcze <b>${zl(ikzeZostalo)}</b> i odliczyć to w zeznaniu: ok. <b>${zlOkr(ikzeZostalo * E.pit)} zwrotu</b> podatku.</p>
    </section>` : ''}

    ${ppk ? `<section class="karta" aria-labelledby="h-ppk">
      <h2 class="nag" id="h-ppk">${ic('users')}PPK: dopłaty, których nie widać na pasku</h2>
      <p>Do każdych 100 zł, które wpłacasz z pensji, pracodawca dokłada 75 zł. Państwo dopłaca co roku 240 zł. U Ciebie to ok. <b>${zlOkr(E.pensja * 0.015 * 12 + 240)} rocznie</b> ponad to, co wpłacasz sama.</p>
      <p class="maly">Z PPK możesz zrezygnować, ale tracisz te dopłaty.</p>
    </section>` : ''}

    <details class="rozw"><summary>Jak liczymy</summary>
      <p class="maly">To prognoza poglądowa, w dzisiejszych złotych. Kapitał w ZUS rośnie realnie o ${WALORYZACJA * 100}% rocznie, a co miesiąc dochodzi ${String(SKLADKA * 100).replace('.', ',')}% pensji (12,22% na konto i 7,3% na subkonto). PPK, IKE i IKZE rosną realnie o ${ZWROT * 100}% rocznie. Emerytura z ZUS to kapitał podzielony przez średnie dalsze trwanie życia (przyjęte w przybliżeniu: 60 lat ${MIESIACE[60]} mies., 62 lata ${MIESIACE[62]}, 65 lat ${MIESIACE[65]}, 67 lat ${MIESIACE[67]}). Pieniądze z PPK, IKE i IKZE dzielimy na 20 lat wypłat. Zakładamy pracę bez przerw i pensję stałą w dzisiejszych złotych, więc przerwy w pracy obniżą wynik. Ulgę w PIT liczymy w przybliżeniu (skala 12%, składki pracownika 13,71%, koszty 3000 zł, kwota zmniejszająca 3600 zł). Oficjalną prognozę przygotowuje ZUS.</p>
    </details>
    <p class="zrodlo">${ic('info')}<span>ZUS ma pokazywać w mObywatelu kapitał z systemu powszechnego i z PPK, PPE, IKE oraz IKZE: <a href="https://www.money.pl/emerytury/nowa-funkcja-w-mobywatelu-zus-pokaze-wszystkie-dane-o-przyszlych-emeryturach-7188147795806976a.html" target="_blank" rel="noopener">money.pl, 11.08.2025</a>. ZUS w programie „Aktywni 50+” zachęca, by sprawdzać, jak dłuższa praca, PPK i IKZE zmieniają emeryturę: <a href="https://direct.money.pl/artykuly/porady/jeden-dodatkowy-rok-pracy-moze-podniesc-emeryture-prezes-zus-zabral-glos" target="_blank" rel="noopener">money.pl, 24.07.2026</a>. Ulga dla pracujących seniorów: <a href="https://www.podatki.gov.pl/ulgi-i-odliczenia/ulga-dla-pracujacych-seniorow-pit-kto-moze-skorzystac" target="_blank" rel="noopener">podatki.gov.pl</a>. Najniższa emerytura od 1.03.2026: <a href="https://www.zus.pl/-/od-marca-emerytury-i-renty-w-g%C3%B3r%C4%99" target="_blank" rel="noopener">ZUS</a>. Udział instytucji prowadzących IKE i IKZE jest dobrowolny. Dane w pokazie są fikcyjne.</span></p>`,
    po(root) {
      const fp = $('#f-prog', root), fc = $('#f-cel', root);
      const odswiez = () => {
        const d = new FormData(fp), wiek = +d.get('wiek'), ikze = +d.get('ikze'), cel = +new FormData(fc).get('cel');
        $('#prog-wynik', root).innerHTML = wynik(wiek, ikze); obsluzWykres($('#prog-wynik', root));
        $('#cel-wynik', root).innerHTML = celWynik(wiek, ikze, cel);
        $('#schody-wynik', root).innerHTML = schody(wiek, ikze);
      };
      fp.onchange = odswiez; fc.onchange = odswiez; obsluzWykres(root);
    },
  };
}
