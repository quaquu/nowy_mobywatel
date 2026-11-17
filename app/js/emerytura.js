// Twoja emerytura: kapitał ze wszystkich filarów w jednym miejscu i prognoza z dwoma scenariuszami.
// Od 2026 r. ZUS ma udostępniać w mObywatelu dane z systemu powszechnego i z programów dobrowolnych
// (PPK, PPE, IKE, IKZE). Dane osób w pokazie są fikcyjne, prognoza poglądowa (model niżej, w „Jak liczymy”).
import { ic } from './icons.js';
import { esc, $ } from './core.js';
import { emerytalne as E, ja, zl, OSOBA, WLASCICIEL } from './data.js';

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
const MIESIACE = { 60: 264, 62: 248, 65: 218 }; // średnie dalsze trwanie życia w miesiącach, w przybliżeniu (tablice GUS)
const WYPLATA_DODATKOWA = 240; // PPK, IKE i IKZE rozłożone na 20 lat
const LIMIT_IKZE = 11304;   // limit wpłat na IKZE w 2026 r. (zatrudnieni)

const tys = n => n >= 1e6 ? (n / 1e6).toLocaleString('pl-PL', { maximumFractionDigits: 1 }) + ' mln zł' : Math.round(n / 1000).toLocaleString('pl-PL') + ' tys. zł';
const zlOkr = n => zl(Math.round(n));
const fv = (b, r, n) => b * (1 + r) ** n;
const fvRenta = (rocznie, r, n) => rocznie * (((1 + r) ** n - 1) / r);

function lataDo(wiek) {
  const teraz = new Date(), [rok, mies] = E.ur;
  return Math.max(0, (rok + wiek + (mies - 1) / 12) - (teraz.getFullYear() + teraz.getMonth() / 12));
}
export function suma() { return E?.pozycje ? E.pozycje.reduce((s, p) => s + p.kwota, 0) : 0; }
const sumaGrupy = g => E.pozycje.filter(p => p.grupa === g).reduce((s, p) => s + p.kwota, 0);

// Kapitał w roku t (od dziś) i prognoza w wieku `wiek` z dopłatą do IKZE `ikze` zł miesięcznie.
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
  const n = Math.round(lataDo(wiek)), teraz = new Date().getFullYear();
  const pkt = Array.from({ length: n + 1 }, (_, t) => ({ rok: teraz + t, v: kapital(t, ikze).razem }));
  const W = 340, H = 150, L = 4, R = 4, T = 22, B = 24, max = Math.max(...pkt.map(p => p.v)) * 1.05;
  const x = i => L + i * (W - L - R) / n, y = v => T + (H - T - B) * (1 - v / max);
  const linia = pkt.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const pole = `${linia}L${x(n).toFixed(1)},${H - B}L${x(0).toFixed(1)},${H - B}Z`;
  const siatka = [0.5, 1].map(f => `<line class="wk-siatka" x1="${L}" x2="${W - R}" y1="${y(max / 1.05 * f).toFixed(1)}" y2="${y(max / 1.05 * f).toFixed(1)}"/>`).join('');
  const lata = [0, Math.round(n / 2), n].map(i => `<text class="wk-os" x="${x(i).toFixed(1)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === n ? 'end' : 'middle'}">${pkt[i].rok}</text>`).join('');
  return `<figure class="wykres" data-pkt='${JSON.stringify(pkt.map(p => [p.rok, Math.round(p.v)]))}'>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kapitał emerytalny: dziś ${tys(pkt[0].v)}, w ${pkt[n].rok} r. ${tys(pkt[n].v)} (w dzisiejszych złotych)">
      ${siatka}
      <path class="wk-pole" d="${pole}"/><path class="wk-linia" d="${linia}"/>
      <circle class="wk-pkt" cx="${x(0).toFixed(1)}" cy="${y(pkt[0].v).toFixed(1)}" r="4"/><circle class="wk-pkt" cx="${x(n).toFixed(1)}" cy="${y(pkt[n].v).toFixed(1)}" r="4"/>
      <text class="wk-etyk" x="${x(0).toFixed(1)}" y="${(y(pkt[0].v) - 10).toFixed(1)}">${tys(pkt[0].v)}</text>
      <text class="wk-etyk" x="${x(n).toFixed(1)}" y="${(y(pkt[n].v) - 10).toFixed(1)}" text-anchor="end">${tys(pkt[n].v)}</text>
      ${lata}
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
  const ukryj = () => { dymek.hidden = krzyz.hidden = wsk.hidden = true; };
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
  svg.onpointerleave = ukryj;
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
  const mojaLuka = WLASCICIEL.emerytura === OSOBA;
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
        ${wybor('wiek', [[60, `${E.wiek} lat`], [62, '62 lata'], [65, '65 lat']].filter(([w]) => w >= E.wiek), 'Kiedy przejdziesz na emeryturę', E.wiek)}
        ${wybor('ikze', [[0, 'bez dopłat'], [200, '200 zł'], [500, '500 zł']], 'Dopłata do IKZE miesięcznie', 0)}
      </form>
      <div id="prog-wynik" aria-live="polite">${wynik(E.wiek, 0)}</div>
    </section>

    ${mojaLuka ? `<a class="karta link-karta" href="#/sprawa/emerytura">${ic('alert', 'okr')}<span><b>2013–2015: brak składek w ZUS</b><small>Urząd skarbowy ma Twój przychód z tych lat, a ZUS nie ma składek. Sprawdź to, zanim zabraknie dokumentów.</small></span>${ic('right', 'strz')}</a>` : ''}

    <details class="rozw"><summary>Jak liczymy</summary>
      <p class="maly">To prognoza poglądowa, w dzisiejszych złotych. Kapitał w ZUS rośnie realnie o ${WALORYZACJA * 100}% rocznie, a co miesiąc dochodzi ${String(SKLADKA * 100).replace('.', ',')}% pensji (12,22% na konto i 7,3% na subkonto). PPK, IKE i IKZE rosną realnie o ${ZWROT * 100}% rocznie. Emerytura z ZUS to kapitał podzielony przez średnie dalsze trwanie życia (przyjęte w przybliżeniu: 60 lat ${MIESIACE[60]} mies., 62 lata ${MIESIACE[62]}, 65 lat ${MIESIACE[65]}). Pieniądze z PPK, IKE i IKZE dzielimy na 20 lat wypłat. Zakładamy pracę bez przerw i pensję stałą w dzisiejszych złotych, więc przerwy w pracy obniżą wynik. Oficjalną prognozę przygotowuje ZUS.</p>
    </details>
    <p class="zrodlo">${ic('info')}<span>ZUS ma pokazywać w mObywatelu kapitał z systemu powszechnego i z PPK, PPE, IKE oraz IKZE: <a href="https://www.money.pl/emerytury/nowa-funkcja-w-mobywatelu-zus-pokaze-wszystkie-dane-o-przyszlych-emeryturach-7188147795806976a.html" target="_blank" rel="noopener">money.pl, 11.08.2025</a>. Udział instytucji prowadzących IKE i IKZE jest dobrowolny. Dane w pokazie są fikcyjne.</span></p>`,
    po(root) {
      const f = $('#f-prog', root), out = $('#prog-wynik', root);
      const odswiez = () => { const d = new FormData(f); out.innerHTML = wynik(+d.get('wiek'), +d.get('ikze')); obsluzWykres(out); };
      f.onchange = odswiez; obsluzWykres(root);
    },
  };
}
