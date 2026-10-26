// Przebiegi spraw: każda sprawa to jeden ekran z danymi, które państwo już ma,
// listą kroków do zaznaczenia i jednym podpisem na końcu.
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, arkuszZgody, dodajWyslane, ogloszenie, toast, cel, przypnijAkcje } from './core.js';
import { spokojnie } from './ruch.js';
import { autoZBoku, zdjecieFotoradaru } from './grafiki.js';
import { ja, dziecko, dokumenty, za, fmt, fmtPelna, zl, sprawy } from './data.js';

// 1 sprawa, 2–4 sprawy, 5+ spraw (12–14: spraw)
export const ileSpraw = n => `${n} ${n === 1 ? 'sprawa' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'sprawy' : 'spraw'}`;
const wiersz = (k, v) => `<div class="wiersz"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;
const zrodlo = (t, u) => `<p class="zrodlo">${ic('info')}<span>Na podstawie: <a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></span></p>`;

function krok({ id, tytul, opis, doKogo, wymagany, wl = true, plakietka }) {
  return `<li class="krok">
    <label class="krok-l">
      <input type="checkbox" name="krok" value="${id}" ${wl ? 'checked' : ''} ${wymagany ? 'disabled' : ''}>
      <span class="krok-t"><b>${esc(tytul)}</b>${plakietka ? ` <span class="plak ${plakietka[0]}">${esc(plakietka[1])}</span>` : ''}<small>${opis}</small><small class="do">${ic('right')}${esc(doKogo)}</small></span>
    </label></li>`;
}
const zaznaczone = (root, wszystkie) => {
  const ids = new Set($$('input[name=krok]', root).filter(i => i.checked).map(i => i.value));
  return wszystkie.filter(k => ids.has(k.id));
};
function gotowe({ tytul, czas, pozycje, dalej = [] }) {
  return `<div class="gotowe" tabindex="-1">
    <div class="gotowe-ik">${ic('check', 'duza')}</div>
    <h2>${esc(tytul)}</h2>
    ${czas ? `<p class="maly">${esc(czas)}</p>` : ''}
    <ol class="os-czasu">${pozycje.map(p => `<li><b>${esc(p[0])}</b><small>${esc(p[1])}</small></li>`).join('')}</ol>
    <div class="przyciski pion">${dalej.map(d => `<a class="btn ${d[2] || 'drugi'}" href="${d[1]}">${esc(d[0])}</a>`).join('')}<a class="btn drugi" href="#/start">Wróć na start</a></div>
  </div>`;
}

/* ---------------- Narodziny dziecka (historia flagowa) ---------------- */
const NARODZINY = () => [
  { id: 'usc', tytul: 'Zgłoszenie urodzenia', opis: 'Akt urodzenia, numer PESEL i zameldowanie u Ciebie załatwia jeden wniosek.', doKogo: 'Urząd Stanu Cywilnego w Łodzi', wymagany: true, plakietka: ['zielona', 'obowiązkowe, 21 dni'] },
  { id: '800', tytul: 'Świadczenie 800+', opis: `800 zł miesięcznie od miesiąca urodzenia, na konto ${esc(ja.konto)}.`, doKogo: 'ZUS' },
  { id: 'becikowe', tytul: 'Becikowe 1 000 zł', opis: 'Dochód sprawdziliśmy w urzędzie skarbowym: mieścisz się w progu. Zaświadczenie o opiece w ciąży pobierzemy z Internetowego Konta Pacjenta.', doKogo: 'Urząd Miasta Łodzi' },
  { id: 'nfz', tytul: 'Ubezpieczenie zdrowotne córki', opis: 'Przekażemy PESEL córki Twojemu pracodawcy, który zgłosi ją do ZUS (masz na to 7 dni).', doKogo: ja.pracodawca },
  { id: 'urlop', tytul: 'Urlop rodzicielski po macierzyńskim', opis: 'Wniosek złożony teraz daje 81,5% pensji przez cały rok, zamiast 100% i 70% osobno.', doKogo: ja.pracodawca },
  { id: 'mob', tytul: 'Córka w Twoim mObywatelu', opis: 'PESEL, odpis aktu urodzenia i jej sprawy zobaczysz w zakładce Bliscy.', doKogo: 'mObywatel' },
];

export function narodziny() {
  const zrob = stan.zrobione.narodziny;
  const imie = stan.imieDziecka;
  if (zrob) {
    return { tytul: 'Urodziło się dziecko', html: `<h1 tabindex="-1">Witaj na świecie, ${esc(imie || 'córeczko')}!</h1>` + gotowe({
      tytul: 'Wszystko wysłane jednym podpisem',
      czas: 'Statusy zobaczysz tutaj i w powiadomieniach.',
      pozycje: [
        ['USC: akt urodzenia i PESEL', 'zwykle następnego dnia roboczego, odpis trafi do Twojej skrzynki'],
        ['ZUS: 800+', 'decyzja do 2 miesięcy, wypłata z wyrównaniem od miesiąca urodzenia'],
        ['Urząd Miasta: becikowe', 'wypłata na konto w ciągu miesiąca'],
        [ja.pracodawca, 'zgłoszenie do ubezpieczenia i wniosek o urlop rodzicielski'],
        ['Samo się zrobi', 'ulga w PIT w lutym; „Aktywny rodzic” przypomnimy za rok'],
      ],
      dalej: [['Zobacz, kto użył Twoich danych', '#/dane/dostep', 'drugi']],
    }) };
  }
  return {
    tytul: 'Urodziło się dziecko',
    html: `
    <h1 tabindex="-1">Gratulacje, ${esc(ja.wolacz)}!</h1>
    <p class="wstep">${fmt(dziecko.urodzone)} w szpitalu urodziła się Twoja córka. Szpital przesłał kartę urodzenia do urzędu. <b>Zostało 5 spraw w 4 instytucjach. Załatwisz je jednym podpisem.</b></p>
    <form id="f-nar" class="karta" novalidate>
      <label for="imie" class="etyk">Jak córka będzie miała na imię?</label>
      <input id="imie" name="imie" class="pole" autocomplete="off" value="${esc(imie)}" placeholder="np. Zofia" aria-describedby="imie-pom" required>
      <p id="imie-pom" class="maly">Najwyżej dwa imiona, bez zdrobnień. Nazwisko: ${esc(ja.nazwisko)}, jak rodziców.</p>
      <div class="chipy" role="group" aria-label="Podpowiedzi imion">${dziecko.propozycjeImion.filter(n => n !== 'Jan').map(n => `<button type="button" class="chip" data-imie="${n}">${n}</button>`).join('')}</div>
      <p class="blad" id="imie-blad" role="alert" hidden>Wpisz imię córki.</p>
      <h2 class="nag">Co wyślemy</h2>
      <p class="maly">Wszystko jest już wypełnione. Odznacz to, czego nie chcesz.</p>
      <ul class="kroki">${NARODZINY().map(krok).join('')}</ul>
      <details class="rozw"><summary>Załatwi się samo, bez wniosku</summary>
        <ul class="punkty"><li>Ulgę na dziecko dopiszemy do Twojego e-PIT w lutym.</li><li>O programie „Aktywny rodzic” przypomnimy, gdy córka skończy rok.</li><li>${esc(ja.partner.imie)} dostanie powiadomienie i odpis aktu.</li></ul>
      </details>
      <button class="btn glowny szeroki" id="nar-dalej">${ic('key')}Przejrzyj i podpisz raz</button>
    </form>
    ${zrodlo('gov.pl: Zgłoś urodzenie dziecka', 'https://www.gov.pl/web/gov/zglos-urodzenie-dziecka')}`,
    po(root) {
      przypnijAkcje(root, $('#nar-dalej', root));
      const pole = $('#imie', root);
      $$('[data-imie]', root).forEach(b => b.onclick = () => { pole.value = b.dataset.imie; $('#imie-blad', root).hidden = true; });
      $('#f-nar', root).onsubmit = async e => {
        e.preventDefault();
        const imie = pole.value.trim().replace(/\s+/g, ' ');
        if (!imie) { $('#imie-blad', root).hidden = false; pole.focus(); return; }
        const wyb = zaznaczone(root, NARODZINY());
        const nazwa = imie.charAt(0).toUpperCase() + imie.slice(1);
        const ok = await arkuszZgody({
          tytul: `${nazwa} ${ja.nazwisko}: ${ileSpraw(wyb.filter(k => k.id !== 'mob').length)} do wysłania`,
          pozycje: wyb.map(k => ({ co: k.tytul, do: k.doKogo })),
          dane: ['Twoje imię, nazwisko i PESEL', 'adres zameldowania', 'numer konta', 'dane z karty urodzenia'],
          cofniecie: 'Wnioski o świadczenia możesz wycofać do czasu decyzji. Zgłoszenia urodzenia nie da się cofnąć, ale błąd w akcie poprawi USC.',
          cel: 'narodziny',
        });
        if (!ok) return;
        stan.imieDziecka = nazwa; stan.zrobione.narodziny = true;
        stan.noweDostepy.unshift(
          { kto: 'ZUS', co: 'Twój PESEL, numer konta, dane córki', po: 'wniosek 800+ (wysłany przez Ciebie)', kiedy: Date.now() },
          { kto: 'Urząd Miasta Łodzi (świadczenia)', co: 'dochód z urzędu skarbowego za 2025 r.', po: 'wniosek o becikowe (wysłany przez Ciebie)', kiedy: Date.now() });
        wyb.forEach(k => dodajWyslane(k.tytul, k.doKogo));
        zapisz(); ogloszenie(`Wysłano: ${ileSpraw(wyb.filter(k => k.id !== 'mob').length)}. Gratulacje!`);
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Przeprowadzka ---------------- */
const ADRESY = ['ul. Piotrkowska 210 m. 4, 90-368 Łódź', 'ul. Piłsudskiego 12 m. 30, 90-051 Łódź', 'ul. Długa 5, 95-100 Zgierz', 'al. Kościuszki 1 m. 7, 90-418 Łódź', 'ul. Wileńska 18, 94-029 Łódź'];

export function przeprowadzka() {
  if (stan.zrobione.przeprowadzka) {
    return { tytul: 'Przeprowadzka', html: `<h1 tabindex="-1">Nowy adres zapisany</h1>` + gotowe({
      tytul: 'Zameldowanie wysłane',
      pozycje: [['Urząd gminy', 'zameldowanie zwykle w 1 dzień roboczy; wymeldowanie ze starego adresu z automatu'], ['Urząd skarbowy, ZUS, NFZ', 'nowy adres trafi do nich sam po zameldowaniu'], ['Wydział komunikacji', 'zgłoszenie nowego adresu właściciela Yarisa'], ['Nowa gmina', 'deklaracja opłaty za śmieci złożona']],
    }) };
  }
  const dzieckoImie = stan.imieDziecka || 'córka';
  const kroki = [
    { id: 'meld', tytul: 'Zameldowanie na pobyt stały', opis: 'Wymeldowanie ze starego adresu zrobi się samo.', doKogo: 'urząd gminy właściwy dla nowego adresu', wymagany: true },
    { id: 'urzedy', tytul: 'Nowy adres w urzędach', opis: 'Urząd skarbowy, ZUS i NFZ dostaną adres z rejestru. Nie musisz pisać do każdego z osobna.', doKogo: 'US, ZUS, NFZ', plakietka: ['niebieska', 'zlecenie'] },
    { id: 'pojazd', tytul: 'Nowy adres właściciela pojazdu', opis: 'Zgłoszenie zmiany adresu dla Yarisa. Masz na to 30 dni.', doKogo: 'wydział komunikacji' },
    { id: 'smieci', tytul: 'Deklaracja opłaty za śmieci', opis: 'Obowiązkowa w nowej gminie w ciągu 14 dni. Liczba osób: 3.', doKogo: 'nowa gmina' },
  ];
  return {
    tytul: 'Przeprowadzka',
    html: `
    <h1 tabindex="-1">Przeprowadzka</h1>
    <p class="wstep">Podaj nowy adres. Resztę urzędów powiadomimy sami. <b>Dowodu nie wymieniasz</b>: od 2015 r. nie ma w nim adresu.</p>
    <form id="f-prz" class="karta" novalidate>
      <label class="etyk" for="adres">Nowy adres</label>
      <input id="adres" class="pole" list="adresy" autocomplete="off" placeholder="Zacznij pisać ulicę" required aria-describedby="adres-blad">
      <datalist id="adresy">${ADRESY.map(a => `<option value="${a}">`).join('')}</datalist>
      <div class="chipy" role="group" aria-label="Podpowiedzi adresów"><button type="button" class="chip" data-adres="${ADRESY[0]}">${ADRESY[0].split(',')[0]}</button><button type="button" class="chip" data-adres="${ADRESY[2]}">${ADRESY[2].split(',')[0]}, Zgierz</button></div>
      <p class="blad" id="adres-blad" role="alert" hidden>Wybierz albo wpisz nowy adres.</p>
      <label class="etyk" for="data">Od kiedy tam mieszkasz</label>
      <input id="data" type="date" class="pole" value="${za(0).toISOString().slice(0, 10)}">
      <fieldset class="grupa"><legend class="etyk">Kto się przeprowadza</legend>
        <label class="opcja"><input type="checkbox" checked disabled> Ty</label>
        <label class="opcja"><input type="checkbox" checked> ${esc(dzieckoImie)} (zameldujesz jako rodzic)</label>
        <label class="opcja"><input type="checkbox" checked> ${esc(ja.partner.imie)} <small>(dostanie prośbę o podpis w swoim mObywatelu)</small></label>
      </fieldset>
      <fieldset class="grupa"><legend class="etyk">Mieszkanie jest</legend>
        <label class="opcja"><input type="radio" name="tytul" value="moje"> moje (sprawdzimy w księdze wieczystej)</label>
        <label class="opcja"><input type="radio" name="tytul" value="najem" checked> wynajmowane: właściciel potwierdzi w swoim mObywatelu</label>
      </fieldset>
      <h2 class="nag">Co wyślemy</h2>
      <ul class="kroki">${kroki.map(krok).join('')}</ul>
      <button class="btn glowny szeroki">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('gov.pl: Zamelduj się na pobyt stały', 'https://www.gov.pl/web/gov/zamelduj-sie-na-pobyt-staly-lub-czasowy-dluzszy-niz-3-miesiace')}`,
    po(root) {
      const pole = $('#adres', root);
      $$('[data-adres]', root).forEach(b => b.onclick = () => { pole.value = b.dataset.adres; $('#adres-blad', root).hidden = true; });
      $('#f-prz', root).onsubmit = async e => {
        e.preventDefault();
        if (pole.value.trim().length < 6) { $('#adres-blad', root).hidden = false; pole.focus(); return; }
        const wyb = zaznaczone(root, kroki);
        const najem = $('input[name=tytul]:checked', root).value === 'najem';
        const ok = await arkuszZgody({
          tytul: 'Zameldowanie: ' + pole.value.split(',')[0],
          pozycje: [...wyb.map(k => ({ co: k.tytul, do: k.doKogo })), ...(najem ? [{ co: 'Prośba o potwierdzenie pobytu', do: 'właściciel mieszkania' }] : [])],
          dane: ['imię, nazwisko, PESEL', 'nowy adres', 'dane pojazdu EL 4K217'],
          cofniecie: 'Zameldowanie możesz zmienić w każdej chwili kolejnym zgłoszeniem.',
          cel: 'przeprowadzka',
        });
        if (!ok) return;
        stan.zrobione.przeprowadzka = true; wyb.forEach(k => dodajWyslane(k.tytul, k.doKogo)); zapisz();
        ogloszenie('Zameldowanie wysłane.');
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Kupno używanego auta ---------------- */
let autoKrok = 'sprawdz';
export function auto() {
  if (stan.zrobione.auto) {
    return { tytul: 'Kupno auta', html: `<h1 tabindex="-1">Auto jest Twoje</h1>` + gotowe({
      tytul: 'Umowa, podatek i rejestracja wysłane',
      pozycje: [['Sprzedający', 'podpisze umowę w swoim mObywatelu (link ważny 24 h)'], ['Urząd skarbowy', 'PCC-3 złożony i opłacony'], ['Wydział komunikacji', 'rejestracja na Ciebie; tablice zostają, decyzja w kilka dni'], ['OC', 'polisa sprzedającego działa do końca okresu; przypomnimy 30 dni wcześniej']],
    }) };
  }
  if (autoKrok === 'sprawdz') {
    return {
      tytul: 'Kupno używanego auta',
      html: `
      <h1 tabindex="-1">Kupno używanego auta</h1>
      <p class="wstep">Najpierw sprawdźmy auto w rejestrach. Wystarczy zdjęcie dowodu rejestracyjnego od sprzedającego.</p>
      <form id="f-sp" class="karta" novalidate>
        <button type="button" class="btn drugi szeroki" id="foto">${ic('id')}Zrób zdjęcie dowodu rejestracyjnego</button>
        <label class="etyk" for="nr">Numer rejestracyjny</label><input id="nr" class="pole" autocomplete="off" placeholder="np. EL 7H213">
        <label class="etyk" for="vin">VIN</label><input id="vin" class="pole" autocomplete="off" placeholder="17 znaków">
        <p class="blad" id="sp-blad" role="alert" hidden>Podaj numer rejestracyjny i VIN albo zrób zdjęcie.</p>
        <button class="btn glowny szeroki">${ic('search')}Sprawdź historię</button>
      </form>
      <div id="wynik" aria-live="polite"></div>`,
      po(root) {
        $('#foto', root).onclick = () => { $('#nr', root).value = 'EL 7H213'; $('#vin', root).value = 'VNKKG3D350A112845'; toast('Odczytano dane ze zdjęcia'); };
        $('#f-sp', root).onsubmit = e => {
          e.preventDefault();
          if ($('#nr', root).value.trim().length < 4 || $('#vin', root).value.trim().length < 11) { $('#sp-blad', root).hidden = false; return; }
          $('#sp-blad', root).hidden = true;
          $('#wynik', root).innerHTML = `
            <section class="karta" aria-labelledby="h-hist">
              <div class="auto-hist">${autoZBoku({ kolor: 'srebrny', opis: 'Toyota Yaris III, srebrna' })}</div>
              <h2 id="h-hist">Toyota Yaris III 1.33, 2016</h2>
              ${wiersz('Kradzież', 'nie zgłoszono')}${wiersz('OC', 'ważne do ' + fmtPelna(za(97)))}${wiersz('Badanie techniczne', 'ważne do ' + fmtPelna(za(160)))}${wiersz('Właściciele', '3, sprzedający od 2023 r.')}
              <div class="ostrz" role="note">${ic('alert')}<span><b>Przebieg spadł.</b> 2023: 148 210 km, 2024: 96 400 km. Zapytaj sprzedającego o wymianę licznika albo zrezygnuj.</span></div>
              <h3 class="nag">Przebieg w badaniach technicznych</h3>
              <ol class="przebieg"><li>2021 <b>92 000 km</b></li><li>2022 <b>121 500 km</b></li><li>2023 <b>148 210 km</b></li><li class="zle">2024 <b>96 400 km</b></li></ol>
              <button class="btn glowny szeroki" id="kupuje">Kupuję to auto</button>
            </section>`;
          $('#kupuje', root).onclick = () => { autoKrok = 'kup'; dispatchEvent(new HashChangeEvent('hashchange')); };
          $('#wynik h2', root).scrollIntoView({ behavior: spokojnie() ? 'auto' : 'smooth', block: 'start' });
        };
      },
    };
  }
  const kroki = [
    { id: 'umowa', tytul: 'Umowa kupna-sprzedaży', opis: 'Przygotowana z danych z rejestru. Sprzedający podpisze ją w swoim telefonie.', doKogo: 'sprzedający', wymagany: true },
    { id: 'pcc', tytul: 'Podatek PCC-3', opis: '<span id="pcc-opis">2% ceny</span>, płatny w 14 dni. Złożymy deklarację i zapłacisz BLIK-iem.', doKogo: 'urząd skarbowy' },
    { id: 'rej', tytul: 'Rejestracja na Ciebie', opis: 'Masz na nią 30 dni. Tablice mogą zostać. Opłatę pokażemy przed płatnością.', doKogo: 'wydział komunikacji' },
    { id: 'oc', tytul: 'Przypomnienie o OC', opis: 'Polisa sprzedającego przechodzi na Ciebie. Przypomnimy, zanim się skończy.', doKogo: 'mObywatel' },
  ];
  return {
    tytul: 'Kupno używanego auta',
    html: `
    <h1 tabindex="-1">Kupujesz Toyotę Yaris</h1>
    <form id="f-kup" class="karta" novalidate>
      <label class="etyk" for="cena">Cena z umowy (zł)</label>
      <input id="cena" class="pole" inputmode="numeric" value="24500">
      <p class="maly" id="pcc-info"></p>
      <h2 class="nag">Co wyślemy</h2>
      <ul class="kroki">${kroki.map(krok).join('')}</ul>
      <button class="btn glowny szeroki">${ic('key')}Przejrzyj i podpisz</button>
      <button type="button" class="btn tekst" id="wroc">Wróć do historii auta</button>
    </form>
    ${zrodlo('gov.pl: Zarejestruj pojazd', 'https://www.gov.pl/web/gov/zarejestruj-pojazd')}`,
    po(root) {
      const cena = $('#cena', root);
      const licz = () => { const c = Math.max(0, parseInt(cena.value.replace(/\D/g, '')) || 0); const p = c >= 1000 ? Math.round(c * 0.02) : 0; $('#pcc-info', root).textContent = `Podatek PCC: ${zl(p)}${c < 1000 ? ' (poniżej 1 000 zł nie płacisz)' : ''}.`; $('#pcc-opis', root).textContent = zl(p); return p; };
      cena.oninput = licz; licz();
      $('#wroc', root).onclick = () => { autoKrok = 'sprawdz'; dispatchEvent(new HashChangeEvent('hashchange')); };
      $('#f-kup', root).onsubmit = async e => {
        e.preventDefault();
        const wyb = zaznaczone(root, kroki);
        const ok = await arkuszZgody({ tytul: 'Zakup Toyoty Yaris', pozycje: wyb.map(k => ({ co: k.tytul, do: k.doKogo })), dane: ['imię, nazwisko, PESEL, adres', 'dane pojazdu z CEPiK', `cena: ${zl(parseInt(cena.value) || 0)}`], cofniecie: `PCC (${zl(licz())}) zapłacisz BLIK-iem po podpisie. Rejestrację można wycofać do decyzji urzędu.`, cel: 'auto' });
        if (!ok) return;
        stan.zrobione.auto = true; autoKrok = 'sprawdz'; wyb.forEach(k => dodajWyslane(k.tytul, k.doKogo)); zapisz();
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Utrata dokumentów ---------------- */
export function utrata() {
  if (stan.zrobione.utrata) {
    return { tytul: 'Utrata dokumentów', html: `<h1 tabindex="-1">Jesteś zabezpieczona</h1>` + gotowe({
      tytul: 'Dokumenty zastrzeżone',
      czas: 'Banki i operatorzy widzą zastrzeżenie od tej chwili.',
      pozycje: [['Dowód osobisty', 'zawieszony na 14 dni i zastrzeżony w bankach; jeśli się znajdzie, odwiesisz go tutaj'], ['PESEL', 'zastrzeżony; cofniesz jednym przyciskiem, np. przed wzięciem kredytu'], ['mDowód w telefonie', 'działa dalej, możesz nim potwierdzać tożsamość']],
      dalej: [['Złóż wniosek o nowy dowód', '#/sprawa/dowod', 'glowny'], ['Znalazłam portfel: odwieś dowód', '#/sprawa/utrata/znaleziony', 'drugi']],
    }) };
  }
  const kroki = [
    { id: 'dowod', tytul: 'Zawieś i zastrzeż dowód osobisty', opis: 'Na 14 dni. Jeśli portfel się znajdzie, cofniesz to tutaj.', doKogo: 'Rejestr Dowodów Osobistych, banki' },
    { id: 'pesel', tytul: 'Zastrzeż PESEL', opis: 'Nikt nie weźmie kredytu ani karty SIM na Twoje dane.', doKogo: 'Rejestr zastrzeżeń PESEL' },
    { id: 'prawo', tytul: 'Zgłoś utratę prawa jazdy', opis: 'Uprawnienia do jazdy masz nadal. Wtórnik zamówisz w tym samym wniosku (100 zł).', doKogo: 'starosta (wydział komunikacji)', wl: false },
  ];
  return {
    tytul: 'Utrata dokumentów',
    html: `
    <h1 tabindex="-1">Zgubione lub skradzione dokumenty</h1>
    <p class="wstep">Najpierw zabezpieczymy Cię przed kradzieżą tożsamości. To zajmie minutę.</p>
    <form id="f-ut" class="karta" novalidate>
      <ul class="kroki">${kroki.map(krok).join('')}</ul>
      <p class="uwaga">${ic('phone')}<span>Karty płatnicze zastrzeżesz pod numerem <a href="tel:+48828828828">828 828 828</a>. Kradzież zgłoś policji: <a href="tel:112">112</a>.</span></p>
      <button class="btn glowny szeroki pilny">${ic('shield')}Zastrzeż zaznaczone</button>
    </form>
    ${zrodlo('gov.pl: Zgłoś utratę swojego dowodu osobistego', 'https://www.gov.pl/web/gov/zglos-utrate-lub-uszkodzenie-swojego-dowodu-osobistego-uniewaznij-dowod')}`,
    po(root) {
      $('#f-ut', root).onsubmit = async e => {
        e.preventDefault();
        const wyb = zaznaczone(root, kroki);
        if (!wyb.length) return toast('Zaznacz co najmniej jedną rzecz.');
        const ok = await arkuszZgody({ tytul: 'Zastrzeżenie dokumentów', pozycje: wyb.map(k => ({ co: k.tytul, do: k.doKogo })), dane: ['PESEL', 'seria i numer dowodu ZWA 418263'], cofniecie: 'Zawieszenie dowodu i zastrzeżenie PESEL cofniesz w aplikacji w każdej chwili.', przycisk: 'Zastrzeż', cel: 'utrata' });
        if (!ok) return;
        stan.zrobione.utrata = true; wyb.forEach(k => dodajWyslane(k.tytul, k.doKogo)); zapisz();
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}
export function znaleziony() {
  const bylo = stan.zrobione.utrata;
  stan.zrobione.utrata = false; zapisz();
  return { tytul: 'Portfel się znalazł', html: `<h1 tabindex="-1">Portfel się znalazł</h1>` + gotowe({ tytul: bylo ? 'Dowód odwieszony' : 'Nic nie było zastrzeżone', pozycje: [['Dowód osobisty', 'znów ważny w bankach i urzędach'], ['PESEL', 'zostaje zastrzeżony, dopóki sam go nie odblokujesz']] }) };
}

/* ---------------- Nowy dowód osobisty ---------------- */
export function dowod() {
  if (stan.zrobione.dowod) {
    return { tytul: 'Nowy dowód', html: `<h1 tabindex="-1">Wniosek złożony</h1>` + gotowe({ tytul: 'Dowód będzie gotowy za ok. 3 tygodnie', pozycje: [['Urząd', 'Urząd Miasta Łodzi, Delegatura Polesie'], ['Odbiór', 'dostaniesz SMS; przy odbiorze urzędnik pobierze odciski palców'], ['Stary dowód', 'ważny do odbioru nowego']] }) };
  }
  const d = dokumenty[0];
  return {
    tytul: 'Nowy dowód osobisty',
    html: `
    <h1 tabindex="-1">Nowy dowód osobisty</h1>
    <p class="wstep">Twój dowód traci ważność ${fmt(za(41))}. Wniosek jest wypełniony danymi z rejestru.</p>
    <form id="f-dow" class="karta" novalidate>
      ${d.pola.slice(0, 2).map(p => wiersz(...p)).join('')}${wiersz('Adres do korespondencji', ja.adres)}
      <fieldset class="grupa"><legend class="etyk">Zdjęcie</legend>
        <label class="opcja"><input type="radio" name="foto" checked> zrobię zdjęcie telefonem teraz (sprawdzimy, czy spełnia wymagania)</label>
        <label class="opcja"><input type="radio" name="foto"> dodam zdjęcie z zakładu fotograficznego (do 6 miesięcy)</label>
      </fieldset>
      <label class="etyk" for="urzad">Gdzie odbierzesz dowód</label>
      <select id="urzad" class="pole"><option>Urząd Miasta Łodzi, Delegatura Polesie</option><option>Urząd Miasta Łodzi, Delegatura Śródmieście</option><option>Urząd Miasta Zgierza</option></select>
      <button class="btn glowny szeroki">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('gov.pl: Uzyskaj dowód osobisty', 'https://www.gov.pl/web/gov/uzyskaj-dowod-osobisty')}`,
    po(root) {
      $('#f-dow', root).onsubmit = async e => {
        e.preventDefault();
        const ok = await arkuszZgody({ tytul: 'Wniosek o dowód osobisty', pozycje: [{ co: 'Wniosek o wydanie dowodu', do: $('#urzad', root).value }], dane: ['imię, nazwisko, PESEL', 'zdjęcie', 'adres do korespondencji'], cofniecie: 'Wniosek możesz wycofać, dopóki dowód nie zostanie wydany.', cel: 'dowod' });
        if (!ok) return;
        stan.zrobione.dowod = true; dodajWyslane('Wniosek o dowód osobisty', $('#urzad', root).value); zapisz();
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Mandat i podatek ---------------- */
function blik(id) {
  return `<label class="etyk" for="${id}">Kod BLIK</label>
    <input id="${id}" class="pole blik" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="000 000" aria-describedby="${id}-pom">
    <p class="maly" id="${id}-pom">W prototypie zadziała dowolny 6-cyfrowy kod.</p>
    <p class="blad" id="${id}-blad" role="alert" hidden>Kod BLIK ma 6 cyfr.</p>`;
}
const blikOk = (root, id) => { const ok = /^\d{6}$/.test($('#' + id, root).value.replace(/\s/g, '')); $('#' + id + '-blad', root).hidden = ok; if (!ok) $('#' + id, root).focus(); return ok; };

export function mandat() {
  if (stan.zrobione.mandat) {
    return { tytul: 'Mandat', html: `<h1 tabindex="-1">Mandat zapłacony</h1>` + gotowe({ tytul: '200 zł zapłacone', pozycje: [['GITD (CANARD)', 'potwierdzenie w skrzynce'], ['Punkty karne', 'masz teraz 5 z 24; wygasną po roku od zapłaty']] }) };
  }
  return {
    tytul: 'Mandat z fotoradaru',
    html: `
    <h1 tabindex="-1">Mandat z fotoradaru</h1>
    <section class="karta">
      <div class="foto-radar">${zdjecieFotoradaru({ kiedy: fmtPelna(za(-9)) + ' 17:42:08', opis: 'Zdjęcie z fotoradaru: Toyota Yaris EL 4K217, 68 km/h przy limicie 50 km/h' })}</div>
      ${wiersz('Gdzie', 'Zgierz, ul. Łódzka, obszar zabudowany')}${wiersz('Kiedy', fmtPelna(za(-9)) + ', 17:42')}${wiersz('Prędkość', '68 km/h przy limicie 50 km/h')}${wiersz('Mandat', '200 zł i 3 punkty karne')}${wiersz('Termin', 'do ' + fmt(za(6)))}
    </section>
    <form id="f-man" class="karta" novalidate>
      <fieldset class="grupa"><legend class="etyk">Kto prowadził?</legend>
        <label class="opcja"><input type="radio" name="kto" value="ja" checked> Ja. Przyjmuję mandat.</label>
        <label class="opcja"><input type="radio" name="kto" value="inny"> Ktoś inny. Wskażę kierowcę.</label>
        <label class="opcja"><input type="radio" name="kto" value="nie"> Nie zgadzam się z mandatem.</label>
      </fieldset>
      <div id="man-ja">${blik('blik-m')}</div>
      <p id="man-nie" class="uwaga" hidden>${ic('info')}<span>Możesz odmówić przyjęcia mandatu. Wtedy sprawa trafi do sądu, a Ty przedstawisz swoje racje. Wyślemy odmowę do GITD.</span></p>
      <button class="btn glowny szeroki" id="man-ok">${ic('key')}Przyjmij i zapłać 200 zł</button>
    </form>`,
    po(root) {
      const f = $('#f-man', root);
      f.onchange = () => {
        const kto = $('input[name=kto]:checked', f).value;
        $('#man-ja', root).hidden = kto !== 'ja'; $('#man-nie', root).hidden = kto !== 'nie';
        $('#man-ok', root).innerHTML = ic('key') + (kto === 'ja' ? 'Przyjmij i zapłać 200 zł' : kto === 'inny' ? 'Wskaż kierowcę' : 'Wyślij odmowę');
      };
      f.onsubmit = async e => {
        e.preventDefault();
        const kto = $('input[name=kto]:checked', f).value;
        if (kto === 'ja' && !blikOk(root, 'blik-m')) return;
        if (kto === 'inny') { toast('W prototypie: formularz wskazania kierowcy z danymi z CEPiK.'); return; }
        const ok = await arkuszZgody(kto === 'ja'
          ? { tytul: 'Przyjęcie mandatu i płatność', pozycje: [{ co: 'Przyjęcie mandatu 200 zł', do: 'GITD (CANARD)' }, { co: 'Płatność BLIK 200 zł', do: 'GITD' }], cofniecie: 'Przyjętego i zapłaconego mandatu nie można cofnąć. Uchylić go może tylko sąd.', przycisk: 'Przyjmij i zapłać', cel: 'mandat' }
          : { tytul: 'Odmowa przyjęcia mandatu', pozycje: [{ co: 'Odmowa przyjęcia mandatu', do: 'GITD (CANARD)' }], przycisk: 'Wyślij odmowę' });
        if (!ok) return;
        if (kto === 'ja') { stan.zrobione.mandat = true; dodajWyslane('Mandat 200 zł zapłacony', 'GITD'); zapisz(); dispatchEvent(new HashChangeEvent('hashchange')); }
        else toast('Odmowa wysłana. Sprawa trafi do sądu rejonowego.');
      };
    },
  };
}

export function podatek() {
  if (stan.zrobione.podatek) {
    return { tytul: 'Podatek', html: `<h1 tabindex="-1">Rata zapłacona</h1>` + gotowe({ tytul: '186 zł zapłacone', pozycje: [['Urząd Miasta Łodzi', 'potwierdzenie w skrzynce'], ['Następne raty', stan.autopilot.podatek ? 'zapłacimy je ze zlecenia stałego; dzień wcześniej damy znać' : 'przypomnimy 7 dni przed terminem']] }) };
  }
  return {
    tytul: 'Podatek od nieruchomości',
    html: `
    <h1 tabindex="-1">Podatek od nieruchomości</h1>
    <section class="karta">${wiersz('Rata', 'IV rata za 2026 r.')}${wiersz('Kwota', '186 zł')}${wiersz('Termin', fmt(za(23)))}${wiersz('Odbiorca', 'Urząd Miasta Łodzi')}</section>
    <form id="f-pod" class="karta" novalidate>
      ${blik('blik-p')}
      <label class="opcja przel"><input type="checkbox" id="auto-pod" ${stan.autopilot.podatek ? 'checked' : ''}> <span><b>Włącz zlecenie stałe:</b> kolejne raty zapłacimy z Twojego konta w dniu terminu. Dzień wcześniej damy znać i będzie można płatność wstrzymać.</span></label>
      <button class="btn glowny szeroki">${ic('key')}Zapłać 186 zł</button>
    </form>`,
    po(root) {
      $('#f-pod', root).onsubmit = async e => {
        e.preventDefault();
        if (!blikOk(root, 'blik-p')) return;
        const auto = $('#auto-pod', root).checked;
        const ok = await arkuszZgody({ tytul: 'Płatność podatku', pozycje: [{ co: 'Płatność BLIK 186 zł', do: 'Urząd Miasta Łodzi' }, ...(auto ? [{ co: 'Zlecenie stałe: kolejne raty z Twojego konta', do: 'Urząd Miasta Łodzi (wyłączysz je w „Przypomnieniach i zleceniach”)' }] : [])], przycisk: 'Zapłać', cel: 'podatek' });
        if (!ok) return;
        stan.zrobione.podatek = true; stan.autopilot.podatek = auto; dodajWyslane('Podatek od nieruchomości 186 zł', 'Urząd Miasta Łodzi'); zapisz();
        dispatchEvent(new HashChangeEvent('hashchange'));
      };
    },
  };
}

/* ---------------- Katalog i sprawy w podglądzie ---------------- */
export function katalog() {
  return {
    tytul: 'Sprawy życiowe',
    html: `<h1 tabindex="-1">Co się u Ciebie dzieje?</h1>
    <p class="wstep">Wybierz sytuację. Pokażemy wszystkie sprawy w różnych urzędach naraz, a nie każdą osobno.</p>
    <ul class="lista">${sprawy.map(s => `<li><a class="poz" href="#/sprawa/${s.id}">${ic(s.ikona, 'okr')}<span><b>${esc(s.tytul)}</b><small>${esc(s.opis)}</small></span>${s.pelne ? '' : '<span class="plak szara">podgląd</span>'}${ic('right', 'strz')}</a></li>`).join('')}</ul>`,
  };
}

export function podglad(id) {
  const s = sprawy.find(x => x.id === id);
  if (!s) return null;
  return {
    tytul: s.tytul,
    html: `<h1 tabindex="-1">${esc(s.tytul)}</h1>
    <p class="wstep">W tym prototypie to podgląd planu sprawy. Pełne przebiegi pokazujemy na przykładach: narodziny, przeprowadzka, kupno auta i utrata dokumentów.</p>
    <ol class="os-czasu karta">${s.kroki.map(k => `<li><b>${esc(k)}</b></li>`).join('')}</ol>
    <a class="btn drugi szeroki" href="#/sprawy">Wszystkie sprawy</a>`,
  };
}
