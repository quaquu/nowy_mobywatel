// Bezpieczeństwo i udział obywatela: „Kto dzwoni?” (weryfikacja numeru i rozmowy)
// oraz podpisy poparcia bez papierowych list (projekty ustaw, referenda, kandydaci).
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, arkuszZgody, ogloszenie, toast, cel } from './core.js';
import { numery, przykladyNumerow, inicjatywy, poparciaPapier, za, fmt } from './data.js';

const wiersz = (k, v) => `<div class="wiersz"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
const zrodlo = (t, u) => `<p class="zrodlo">${ic('info')}<span>Na podstawie: <a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></span></p>`;
const liczba = n => n.toLocaleString('pl-PL');
const ELI_UKE = 'https://eli.gov.pl/eli/DU/2024/1803/ogl';

/* ---------------- Kto dzwoni? ---------------- */
// 9 cyfr numeru krajowego; „+48”, „0048”, spacje i myślniki są pomijane.
export function cyfry(t) {
  let d = String(t || '').replace(/\D/g, '');
  if (d.length === 13 && d.startsWith('0048')) d = d.slice(4);
  if (d.length === 11 && d.startsWith('48')) d = d.slice(2);
  return d.length === 9 ? d : null;
}
const pokazNr = d => /^[5-8]/.test(d) ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;

const NIGDY = `<h2 class="sekcja">Urząd, bank ani policja nigdy nie poproszą o:</h2>
  <ul class="punkty"><li>kod BLIK, hasło do banku albo PIN,</li><li>przelew na „bezpieczne konto”,</li><li>instalację aplikacji do zdalnej pomocy,</li><li>dane karty płatniczej.</li></ul>`;

function wynikNumeru(d) {
  const n = numery.find(x => x.nr === d);
  const nr = '+48 ' + pokazNr(d);
  if (n?.rodzaj === 'tylko-odbior') {
    return `<section class="karta wynik-nr zly" aria-labelledby="wn-t">
      <p class="wynik-plak"><span class="plak czerwona">numer tylko do odbierania</span></p>
      <h2 id="wn-t">To prawie na pewno oszustwo</h2>
      <p>${esc(nr)} to numer infolinii: ${esc(n.kto)}. Bank odbiera na nim telefony, ale <b>nigdy z niego nie dzwoni</b>. Ktoś podszywa się pod ten numer.</p>
      <p class="ostrz">${ic('alert')}<span>Rozłącz się. Jeśli rozmówca dostał już kod albo dane, zadzwoń do banku na numer z karty płatniczej i zastrzeż PESEL.</span></p>
      <div class="przyciski pion"><button class="btn glowny" data-zglos-nr="${d}">${ic('shield')}Zgłoś numer do CERT Polska</button><a class="btn drugi" href="#/sprawa/utrata">Zastrzeż PESEL i dokumenty</a></div>
      ${zrodlo('wykaz UKE numerów tylko do odbierania połączeń, art. 17 ustawy o zwalczaniu nadużyć w komunikacji elektronicznej', ELI_UKE)}
    </section>`;
  }
  if (n?.rodzaj === 'instytucja') {
    return `<section class="karta wynik-nr" aria-labelledby="wn-t">
      <p class="wynik-plak"><span class="plak zielona">numer instytucji publicznej</span></p>
      <h2 id="wn-t">${esc(n.kto)}</h2>
      <p>Z numeru ${esc(nr)} instytucja dzwoni do obywateli w sprawach: ${esc(n.sprawy)}.</p>
      <p class="uwaga">${ic('info')}<span>Numer na ekranie da się podrobić. Pewność daje tylko potwierdzenie rozmowy w mObywatelu: urzędnik wysyła je ze swojego systemu, gdy z Tobą rozmawia.</span></p>
      <button class="btn glowny szeroki" data-potwierdz="${d}">${ic('callcheck')}Poproś o potwierdzenie rozmowy</button>
      <div id="potwierdzenie" aria-live="polite"></div>
    </section>`;
  }
  return `<section class="karta wynik-nr" aria-labelledby="wn-t">
    <p class="wynik-plak"><span class="plak">brak w rejestrach</span></p>
    <h2 id="wn-t">Tego numeru nie ma w rejestrach instytucji</h2>
    <p>${esc(nr)} nie należy do żadnego urzędu ani banku z rejestru. Nie pokazujemy, do kogo należą prywatne numery.</p>
    <p class="ostrz">${ic('alert')}<span>Jeśli rozmówca podaje się za urząd, bank albo policję, rozłącz się i zadzwoń sam na numer ze strony instytucji.</span></p>
    <button class="btn drugi szeroki" data-zglos-nr="${d}">${ic('shield')}Zgłoś numer do CERT Polska</button>
  </section>`;
}

function potwierdzenie(n) {
  const sprawa = stan.zrobione.narodziny ? `Twój wniosek o 800+ dla córki${stan.imieDziecka ? ' ' + stan.imieDziecka : ''}` : 'Twój zasiłek macierzyński';
  const teraz = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  return `<div class="potw" tabindex="-1">
    <p class="potw-t">${ic('check')}<b>Rozmowa potwierdzona</b></p>
    ${wiersz('Instytucja', n.kto)}${wiersz('Rozmawia z Tobą', n.osoba)}${wiersz('W sprawie', sprawa)}${wiersz('Potwierdzono', 'dziś, ' + teraz)}
    <p class="maly">Nawet w potwierdzonej rozmowie nikt nie poprosi o kod BLIK, hasło ani przelew.</p>
  </div>`;
}

export function ktoDzwoni() {
  return {
    tytul: 'Kto dzwoni?',
    html: `<h1 tabindex="-1">Kto dzwoni?</h1>
    <p class="wstep">Ktoś podaje się za bank, urząd albo policję? Sprawdź numer, zanim cokolwiek powiesz.</p>
    <form id="f-nr" class="karta" novalidate>
      <label class="etyk" for="nr">Numer, który dzwonił</label>
      <input id="nr" class="pole" inputmode="tel" autocomplete="off" placeholder="np. 42 000 34 56" aria-describedby="nr-pom">
      <p class="maly" id="nr-pom">Przykłady w prototypie:</p>
      <div class="chipy">${przykladyNumerow.map(([nr, opis]) => `<button type="button" class="chip" data-nr="${nr}">${esc(nr)} <span class="sr">(${esc(opis)})</span></button>`).join('')}</div>
      <p class="blad" id="nr-blad" role="alert" hidden>Wpisz 9 cyfr numeru, np. 42 000 34 56.</p>
      <button class="btn glowny szeroki">${ic('search')}Sprawdź numer</button>
    </form>
    <div id="wynik-nr" aria-live="polite"></div>
    ${NIGDY}
    <p class="stopka-info">Już dziś operatorzy blokują połączenia, w których ktoś podszywa się pod numer z jawnego wykazu UKE (numery banków i instytucji tylko do odbierania), a podejrzane SMS-y przyjmuje CERT Polska pod numerem 8080. Nowe w prototypie: sprawdzenie numeru w mObywatelu, rejestr numerów, z których dzwonią instytucje publiczne, i potwierdzenie rozmowy w aplikacji.</p>`,
    po(root) {
      const pole = $('#nr', root), wynik = $('#wynik-nr', root);
      const sprawdz = () => {
        const d = cyfry(pole.value);
        $('#nr-blad', root).hidden = !!d;
        if (!d) { pole.focus(); return; }
        wynik.innerHTML = wynikNumeru(d);
        stan.sprawdzoneNumery++; zapisz(); cel('kto-dzwoni');
        ogloszenie($('h2', wynik).textContent);
        wynik.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      };
      $('#f-nr', root).onsubmit = e => { e.preventDefault(); sprawdz(); };
      $$('[data-nr]', root).forEach(b => b.onclick = () => { pole.value = b.dataset.nr; sprawdz(); });
      wynik.onclick = e => {
        const z = e.target.closest('[data-zglos-nr]');
        if (z) { z.disabled = true; toast('Zgłoszenie trafi do CERT Polska. Dziękujemy, to chroni innych.'); return; }
        const p = e.target.closest('[data-potwierdz]');
        if (p) {
          const n = numery.find(x => x.nr === p.dataset.potwierdz);
          p.hidden = true;
          const box = $('#potwierdzenie', wynik);
          box.innerHTML = potwierdzenie(n); $('.potw', box).focus({ preventScroll: true });
          cel('rozmowa-potwierdzona'); ogloszenie('Rozmowa potwierdzona: ' + n.kto);
        }
      };
    },
  };
}

/* ---------------- Podpisy i poparcie ---------------- */
const RODZAJE = {
  ustawa: ['Obywatelskie projekty ustaw', '100 000 podpisów w 3 miesiące'],
  referendum: ['Referendum ogólnokrajowe', 'wniosek do Sejmu, 500 000 podpisów'],
  lokalne: ['Referenda lokalne', '10% mieszkańców gminy z prawem głosu'],
  kandydat: ['Kandydaci w wyborach', 'np. 2 000 podpisów dla kandydata na senatora'],
};
const PRAWO = {
  ustawa: ['pomarańczowa', 'wymaga zmiany ustawy', 'Dziś podpisy zbiera się tylko na papierze. Prototyp pokazuje, jak mogłoby to działać po zmianie ustawy.'],
  portal: ['zielona', 'w prawie od lutego 2027', 'Kodeks wyborczy przewiduje Portal poparcia od lutego 2027 r. w wyborach do Sejmu, Senatu, Parlamentu Europejskiego i na prezydenta.'],
};
const ileMa = i => i.ile + (stan.poparcia[i.id] ? 1 : 0);
const pasek = i => {
  const proc = Math.min(100, Math.round(ileMa(i) / i.prog * 100));
  return `<div class="zbiorka"><progress max="${i.prog}" value="${ileMa(i)}" aria-label="Zebrane podpisy: ${proc}%"></progress>
    <p class="maly"><b>${liczba(ileMa(i))}</b> z ${liczba(i.prog)} podpisów · zostało ${i.koniec} dni</p></div>`;
};

export function poparcieWidok() {
  const moje = [
    ...inicjatywy.filter(i => stan.poparcia[i.id]).map(i => ({ id: i.id, tytul: i.tytul, kiedy: new Date(stan.poparcia[i.id]) })),
    ...poparciaPapier,
  ];
  return {
    tytul: 'Podpisy i poparcie',
    html: `<h1 tabindex="-1">Podpisy i poparcie</h1>
    <p class="wstep">Poprzyj projekt ustawy, wniosek o referendum albo kandydata bez papierowej listy. Komitet zobaczy tylko liczbę podpisów, a nie Twoje dane.</p>
    ${Object.entries(RODZAJE).map(([r, [nazwa, opis]]) => {
      const lista = inicjatywy.filter(i => i.rodzaj === r);
      return `<h2 class="sekcja">${esc(nazwa)}</h2><p class="maly sekcja-o">${esc(opis)}</p>
      <ul class="lista">${lista.map(i => `<li><a class="poz" href="#/poparcie/${i.id}">${ic(r === 'kandydat' ? 'user' : 'pen', 'okr')}<span><b>${esc(i.tytul)}</b><small>${liczba(ileMa(i))} z ${liczba(i.prog)} · ${PRAWO[i.prawo][1]}</small></span>${stan.poparcia[i.id] ? '<span class="plak zielona">poparte</span>' : ''}${ic('right', 'strz')}</a></li>`).join('')}</ul>`;
    }).join('')}
    <h2 class="sekcja">Moje poparcia</h2>
    <ul class="lista-kart">${moje.map(m => `<li class="karta${m.podejrzane ? ' podejrzane' : ''}">
      <p class="mp"><span><b>${esc(m.tytul)}</b><small>${m.papier ? 'papierowa lista poparcia' : 'poparcie w mObywatelu'} · ${fmt(m.kiedy)}</small></span>${m.podejrzane ? '<span class="plak pomaranczowa">sprawdź</span>' : '<span class="plak zielona">Twój podpis</span>'}</p>
      ${m.podejrzane ? `<p class="ostrz">${ic('alert')}<span>Twoje dane są na papierowej liście poparcia. Jeśli to nie Twój podpis, zgłoś to. Komisja sprawdzi listę.</span></p><button class="btn tekst" data-nie-ja="${m.id}">To nie ja, zgłoś do komisji wyborczej</button>` : ''}
    </li>`).join('')}</ul>
    <p class="stopka-info">Od lutego 2027 r. Portal poparcia (Kodeks wyborczy, Dz.U. 2026 poz. 178) pozwoli poprzeć kandydatów w wyborach powszechnych przez internet i sprawdzić, komu udzieliło się poparcia. Nie obejmie wyborów samorządowych, projektów ustaw ani referendów: tu nadal obowiązuje papier. Projekt poselski z 1 kwietnia 2026 r. (RPW/11430/2026) proponuje e-podpisy pod projektami ustaw.</p>`,
    po(root) {
      $$('[data-nie-ja]', root).forEach(b => b.onclick = () => { b.disabled = true; cel('poparcie-zgloszone'); toast('Zgłoszenie trafi do komisji wyborczej, która sprawdza podpisy.'); });
    },
  };
}

export function inicjatywa(id) {
  const i = inicjatywy.find(x => x.id === id);
  if (!i) return null;
  const [kolor, krotko, dlugo] = PRAWO[i.prawo];
  if (stan.poparcia[i.id]) {
    return { tytul: i.tytul, html: `<h1 tabindex="-1">Dziękujemy za podpis</h1>
      <div class="gotowe" tabindex="-1"><div class="gotowe-ik">${ic('check', 'duza')}</div><h2>${esc(i.tytul)}</h2>${pasek(i)}
      <ol class="os-czasu">
        <li><b>Podpis złożony</b><small>${fmt(new Date(stan.poparcia[i.id]))}, podpisem w mObywatelu</small></li>
        <li><b>${esc(i.sprawdza[0].toUpperCase() + i.sprawdza.slice(1))}</b><small>sprawdzi w rejestrze wyborców, czy masz prawo poprzeć i czy nie podpisano się dwa razy</small></li>
        <li><b>Komitet</b><small>widzi licznik większy o 1, bez Twoich danych</small></li>
        <li><b>Po zakończeniu zbiórki</b><small>damy znać, czy podpisów wystarczyło</small></li>
      </ol>
      <div class="przyciski pion"><a class="btn drugi" href="#/poparcie">Wszystkie zbiórki</a><a class="btn drugi" href="#/dane/dostep">Zobacz, kto użył Twoich danych</a></div></div>` };
  }
  return {
    tytul: i.tytul,
    html: `<h1 tabindex="-1">${esc(i.tytul)}</h1>
    <p class="wstep">${esc(i.opis)}</p>
    <section class="karta">${pasek(i)}
      ${wiersz('Zbiera', i.komitet)}${wiersz('Koniec zbiórki', fmt(za(i.koniec)))}${wiersz('Podpisy sprawdza', i.sprawdza)}
    </section>
    <details class="karta rozw"><summary>Przeczytaj, co popierasz</summary><p>${esc(i.tresc)}</p></details>
    <p class="prawo-stan"><span class="plak ${kolor}">${krotko}</span></p>
    <p class="uwaga">${ic('info')}<span>${esc(dlugo)}</span></p>
    <button class="btn glowny szeroki" id="poprzyj">${ic('pen')}Poprzyj podpisem w mObywatelu</button>`,
    po(root) {
      $('#poprzyj', root).onclick = async () => {
        const ok = await arkuszZgody({
          tytul: 'Poparcie: ' + i.tytul,
          pozycje: [{ co: `Poparcie: ${i.tytul}`, do: `${i.sprawdza} (sprawdzenie podpisu)` }],
          dane: ['imię i nazwisko', 'numer PESEL', 'adres zamieszkania'],
          cofniecie: `Twoje dane zobaczy tylko ${i.sprawdza}; komitet zobaczy licznik. Złożonego poparcia nie można wycofać.`,
          przycisk: 'Podpisz poparcie',
          cel: 'poparcie',
        });
        if (!ok) return;
        stan.poparcia[i.id] = Date.now();
        stan.noweDostepy.unshift({ kto: i.sprawdza[0].toUpperCase() + i.sprawdza.slice(1), co: 'imię, nazwisko, PESEL, adres', po: `sprawdzenie Twojego poparcia: ${i.tytul}`, kiedy: Date.now() });
        zapisz(); ogloszenie('Poparcie złożone.');
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}
