// Sprawy życiowe z katalogu: ślub, śmierć bliskiej osoby, firma, emerytura, osiemnastka.
// Ten sam wzór co narodziny: dane, które państwo już ma, wybory, arkusz zgody, jeden podpis, oś czasu.
// Fakty i kwoty sprawdzone 02.11.2026 (źródła przy każdej sprawie). Osoby, adresy i liczby są fikcyjne.
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, arkuszZgody, dodajWyslane, ogloszenie, przypnijAkcje } from './core.js';
import { ja, mama, za, fmt, fmtPelna, zl } from './data.js';
import { krok, gotowe, zaznaczone, wiersz, zrodlo, wyborTerminu, dataWizyty, ileSpraw } from './sprawy.js';

const wybor = (nazwa, opcje, legenda) => `<fieldset class="grupa"><legend class="etyk">${esc(legenda)}</legend>${opcje.map(([v, t, opis], i) => `<label class="opcja"><input type="radio" name="${nazwa}" value="${v}" ${i === 0 ? 'checked' : ''}> <span>${esc(t)}${opis ? `<small class="maly">${esc(opis)}</small>` : ''}</span></label>`).join('')}</fieldset>`;
const wartosc = (root, nazwa) => $(`input[name=${nazwa}]:checked`, root)?.value;
const przyklad = t => `<p class="uwaga">${ic('info')}<span>${t}</span></p>`;
const isoDnia = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
// Załącznik w prototypie: zdjęcie dokumentu „dodane” jednym dotknięciem (w aplikacji: aparat albo pliki).
const zalacznik = (id, etykieta) => `<div class="zal"><button type="button" class="btn drugi maly-btn" data-zal="${id}" aria-pressed="false">${ic('doc')}${esc(etykieta)}</button><span class="maly" id="${id}-st" role="status"></span></div>`;
function obsluzZalaczniki(root) {
  $$('[data-zal]', root).forEach(b => b.onclick = () => {
    const tak = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', tak);
    $(`#${b.dataset.zal}-st`, root).textContent = tak ? 'Dodano zdjęcie (w prototypie: przykładowy plik).' : '';
    $(`#${b.dataset.zal}-blad`, root)?.setAttribute('hidden', '');
  });
}
const dodany = (root, id) => $(`[data-zal="${id}"]`, root)?.getAttribute('aria-pressed') === 'true';
const blad = (root, id) => { const b = $(`#${id}-blad`, root); b.hidden = false; b.scrollIntoView({ block: 'center' }); };

async function wyslij(root, { id, pozycje, dane, cofniecie, przycisk, stan: zapisany, wyslane }) {
  const ok = await arkuszZgody({ tytul: pozycje.tytul, pozycje: pozycje.lista, dane, cofniecie, przycisk, cel: id });
  if (!ok) return;
  stan.zrobione[id] = zapisany;
  wyslane.forEach(([t, d]) => dodajWyslane(t, d));
  zapisz(); ogloszenie('Wysłano.');
  dispatchEvent(new HashChangeEvent('hashchange'));
}

/* ---------------- Ślub (przykład: osoba fikcyjna) ---------------- */
const PARA = { ona: 'Katarzyna Lis', on: 'Tomasz Bąk', usc: 'Urząd Stanu Cywilnego w Łodzi' };
export function slub() {
  const z = stan.zrobione.slub;
  if (z) return { tytul: 'Ślub', html: `<h1 tabindex="-1">Termin zarezerwowany</h1>` + gotowe({
    tytul: `Ślub: ${fmt(new Date(z.data), { day: 'numeric', month: 'long', year: 'numeric' })}`,
    czas: z.rodzaj,
    pozycje: [
      [`USC: ${dataWizyty(z.wizyta)}`, 'zapewnienia podpiszecie oboje osobiście, z dowodami osobistymi'],
      [PARA.on, 'dostał prośbę o potwierdzenie terminu w swoim mObywatelu'],
      ['Opłata 84 zł', 'za sporządzenie aktu małżeństwa, przy pierwszej wizycie'],
      ['Po ślubie', `nazwisko: ${z.nazwisko}; PESEL zmieni się z urzędu, przypomnimy o dowodzie i prawie jazdy (30 dni)`],
    ],
  }) };
  const min = isoDnia(za(35)), dom = isoDnia(za(90));
  const KROKI = () => [
    { id: 'zapewnienie', tytul: 'Zapewnienie o braku przeszkód do małżeństwa', opis: 'Wypełnione danymi z rejestru PESEL. Podpiszecie je oboje osobiście w USC; jest ważne 6 miesięcy, a ślub może się odbyć najwcześniej miesiąc później.', doKogo: PARA.usc, wymagany: true, plakietka: ['pomaranczowa', 'osobiście'] },
    { id: 'termin', tytul: 'Rezerwacja terminu ślubu', opis: 'Wstępna, do potwierdzenia przy podpisaniu zapewnień.', doKogo: PARA.usc, wymagany: true },
    { id: 'tomasz', tytul: `Potwierdzenie terminu przez: ${PARA.on}`, opis: 'Prośba trafi do jego mObywatela; bez jego zgody rezerwacja przepadnie po 7 dniach.', doKogo: 'mObywatel Tomasza' },
    { id: 'po', tytul: 'Po ślubie: przypomnienia o dokumentach', opis: 'Nazwisko w PESEL zmieni się z urzędu po sporządzeniu aktu. Przypomnimy o nowym dowodzie (wizyta po odciski palców) i o wymianie prawa jazdy w 30 dni.', doKogo: 'mObywatel' },
    { id: 'bank', tytul: 'Nowe nazwisko w banku i u pracodawcy', opis: 'Po ślubie wyślemy im odpis aktu, jeśli się zgodzisz.', doKogo: 'bank i pracodawca', wl: false },
  ];
  return {
    tytul: 'Ślub',
    html: `<h1 tabindex="-1">Ślub</h1>
    ${przyklad(`Twój ślub jest już w rejestrze, więc pokazujemy tę sprawę na przykładzie: ${PARA.ona} i ${PARA.on}, Łódź. Dane fikcyjne.`)}
    <form id="f-slub" class="karta" novalidate>
      ${wybor('rodzaj', [['Ślub cywilny w urzędzie', 'Ślub cywilny w urzędzie'], ['Ślub cywilny poza urzędem', 'Ślub cywilny poza urzędem', 'dodatkowa opłata 1000 zł'], ['Ślub wyznaniowy ze skutkami cywilnymi', 'Ślub wyznaniowy ze skutkami cywilnymi', 'USC wyda zaświadczenie dla duchownego, ważne 6 miesięcy']], 'Rodzaj ślubu')}
      <label class="etyk" for="slub-data">Data ślubu</label>
      <input id="slub-data" type="date" class="pole" min="${min}" value="${dom}" aria-describedby="slub-data-pom">
      <p class="maly" id="slub-data-pom">Najwcześniej miesiąc po podpisaniu zapewnień.</p>
      <p class="blad" id="slub-data-blad" role="alert" hidden>Wybierz datę co najmniej 35 dni od dziś.</p>
      ${wybor('nazwisko', [['Bąk', 'Bąk (nazwisko męża)'], ['Lis', 'Lis (zostaje)'], ['Lis-Bąk', 'Lis-Bąk']], 'Twoje nazwisko po ślubie')}
      ${wyborTerminu('wizyta-usc', 'Wizyta w USC (zapewnienia)')}
      <h2 class="nag">Co przygotujemy</h2>
      <ul class="kroki">${KROKI().map(krok).join('')}</ul>
      <button class="btn glowny szeroki" id="slub-dalej">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('gov.pl: Weź ślub cywilny', 'https://www.gov.pl/web/gov/wez-slub-cywilny')}`,
    po(root) {
      przypnijAkcje(root, $('#slub-dalej', root));
      $('#f-slub', root).onsubmit = e => {
        e.preventDefault();
        const data = $('#slub-data', root).value;
        if (!data || data < min) return blad(root, 'slub-data');
        const wyb = zaznaczone(root, KROKI()), wizyta = wartosc(root, 'wizyta-usc');
        wyslij(root, {
          id: 'slub',
          pozycje: { tytul: 'Ślub: rezerwacja i zapewnienia', lista: wyb.map(k => ({ co: k.tytul, do: k.doKogo })).concat([{ co: `Wizyta: ${dataWizyty(wizyta)}`, do: PARA.usc }]) },
          dane: ['imiona, nazwiska i PESEL obojga', 'stan cywilny z rejestru', 'wybrane nazwisko'],
          cofniecie: 'Rezerwację odwołasz do 7 dni przed ślubem. Zapewnienia nie wysyłamy: podpiszecie je w USC.',
          przycisk: 'Podpisz i zarezerwuj',
          stan: { data, wizyta, rodzaj: wartosc(root, 'rodzaj'), nazwisko: wartosc(root, 'nazwisko') },
          wyslane: [['Rezerwacja terminu ślubu', PARA.usc]],
        });
      };
    },
  };
}

/* ---------------- Śmierć bliskiej osoby ---------------- */
// Zasiłek pogrzebowy: 7 000 zł po zgonach od 01.01.2026 r., nie więcej niż koszty z rachunków; wniosek w 12 miesięcy.
// Renta wdowia: 100% jednego świadczenia + 15% drugiego (od 2027 r. 25%), wniosek ERWD, limit łącznej kwoty.
const TATA = { imie: 'Tadeusz', nazwisko: 'Nowicki', zmarl: za(-5), usc: 'Urząd Stanu Cywilnego w Zgierzu', auto: 'Opel Astra, EZG 51RT' };
const ZASILEK = 7000;
export function smierc() {
  const z = stan.zrobione.smierc;
  if (z) return { tytul: 'Śmierć bliskiej osoby', html: `<h1 tabindex="-1">Wnioski wysłane</h1>` + gotowe({
    tytul: `${ileSpraw(z.ile)} w toku`,
    czas: 'Statusy zobaczysz tutaj i w powiadomieniach.',
    pozycje: [
      ...(z.zasilek ? [['ZUS: zasiłek pogrzebowy', `${zl(z.zasilek)} na Twoje konto, zwykle w ciągu 30 dni od kompletu dokumentów`]] : []),
      ...(z.wdowia ? [['ZUS: renta wdowia mamy', 'decyzja przyjdzie do mamy i do Ciebie (z upoważnienia)']] : []),
      ...(z.spadek ? [['Poświadczenie dziedziczenia', 'lista dokumentów dla notariusza jest w Twojej skrzynce']] : []),
      ['Przypomnimy', 'o zgłoszeniu spadku do urzędu skarbowego (SD-Z2) w 6 miesięcy od poświadczenia dziedziczenia'],
    ],
  }) };
  const KROKI = () => [
    { id: 'zasilek', tytul: 'Zasiłek pogrzebowy', opis: `Do ${zl(ZASILEK)}, ale nie więcej niż koszty z rachunków (zgon od 1 stycznia 2026 r.). Wniosek trzeba złożyć w 12 miesięcy.`, doKogo: 'ZUS' },
    { id: 'wdowia', tytul: 'Renta wdowia dla mamy, w jej imieniu', opis: 'Mama ma emeryturę, a po tacie przysługuje jej renta rodzinna. Renta wdowia to całe jedno świadczenie i 15% drugiego (od 2027 r. 25%), jeśli razem nie przekroczą limitu. Działasz z upoważnienia mamy do spraw w ZUS; mama zobaczy wniosek u siebie.', doKogo: `ZUS (w imieniu: ${mama.imie} ${mama.nazwisko})` },
    { id: 'spadek', tytul: 'Poświadczenie dziedziczenia', opis: 'U notariusza albo w sądzie. Przygotujemy listę dokumentów: odpis aktu zgonu, akty urodzenia dzieci, akt małżeństwa rodziców.', doKogo: 'notariusz albo sąd rejonowy', wl: false },
  ];
  return {
    tytul: 'Śmierć bliskiej osoby',
    html: `<h1 tabindex="-1">Przykro nam</h1>
    <p class="wstep">${TATA.usc} zarejestrował zgon Twojego taty, ${TATA.imie}a ${TATA.nazwisko}ego, ${fmt(TATA.zmarl)}. Poniżej jest to, co trzeba załatwić. Część spraw urzędy zrobiły same.</p>
    <section class="karta">
      <h2 class="nag">Bez Twojego udziału</h2>
      <ul class="punkty">
        <li>Dowód osobisty taty został unieważniony z urzędu.</li>
        <li>ZUS dostał informację o zgonie z rejestru PESEL i wstrzyma wypłatę emerytury.</li>
        <li>Polisa OC auta taty (${esc(TATA.auto)}) przechodzi na spadkobierców. Auta nie trzeba wyrejestrowywać.</li>
      </ul>
    </section>
    <form id="f-smierc" class="karta" novalidate>
      ${wybor('kto', [['ja', 'Ja pokryłam koszty pogrzebu'], ['zaklad', 'Zakład pogrzebowy rozliczy zasiłek w moim imieniu', 'wtedy pieniądze trafią do zakładu, a rachunek jest niższy o kwotę zasiłku']], 'Kto pokrył koszty pogrzebu')}
      <label class="etyk" for="koszt">Koszty pogrzebu z rachunków (zł)</label>
      <input id="koszt" class="pole" inputmode="numeric" value="6800" aria-describedby="koszt-pom">
      <p class="maly" id="koszt-pom" role="status"></p>
      ${zalacznik('rachunek', 'Dodaj zdjęcie rachunku')}
      <p class="blad" id="rachunek-blad" role="alert" hidden>Do zasiłku potrzebny jest rachunek za pogrzeb.</p>
      ${wiersz('Konto do wypłaty', ja.konto)}
      <h2 class="nag">Co wyślemy</h2>
      <ul class="kroki">${KROKI().map(krok).join('')}</ul>
      <button class="btn glowny szeroki" id="smierc-dalej">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('ZUS: zasiłek pogrzebowy', 'https://www.zus.pl/swiadczenia/zasilki/zasilek-pogrzebowy')}`,
    po(root) {
      przypnijAkcje(root, $('#smierc-dalej', root));
      obsluzZalaczniki(root);
      const kwota = () => Math.min(ZASILEK, Math.max(0, parseInt($('#koszt', root).value.replace(/\D/g, '') || '0', 10)));
      const pokaz = () => { const k = kwota(); $('#koszt-pom', root).textContent = k < ZASILEK ? `ZUS wypłaci ${zl(k)}: koszty są niższe niż ${zl(ZASILEK)}.` : `ZUS wypłaci ${zl(ZASILEK)}, czyli najwyższą kwotę zasiłku.`; };
      $('#koszt', root).oninput = pokaz; pokaz();
      $('#f-smierc', root).onsubmit = e => {
        e.preventDefault();
        const wyb = zaznaczone(root, KROKI()), zas = wyb.some(k => k.id === 'zasilek');
        if (zas && !dodany(root, 'rachunek')) return blad(root, 'rachunek');
        if (!wyb.length) return;
        wyslij(root, {
          id: 'smierc',
          pozycje: { tytul: `${ileSpraw(wyb.length)} po śmierci taty`, lista: wyb.map(k => ({ co: k.id === 'zasilek' ? `Zasiłek pogrzebowy: ${zl(kwota())}` : k.tytul, do: k.doKogo })) },
          dane: ['Twoje imię, nazwisko, PESEL i numer konta', 'dane taty z rejestru PESEL i aktu zgonu', ...(zas ? ['rachunek za pogrzeb'] : []), ...(wyb.some(k => k.id === 'wdowia') ? ['upoważnienie od mamy do spraw w ZUS'] : [])],
          cofniecie: 'Wnioski do ZUS możesz wycofać, dopóki ZUS nie wyda decyzji.',
          stan: { ile: wyb.length, zasilek: zas ? kwota() : 0, wdowia: wyb.some(k => k.id === 'wdowia'), spadek: wyb.some(k => k.id === 'spadek') },
          wyslane: wyb.map(k => [k.tytul, k.doKogo]),
        });
      };
    },
  };
}

/* ---------------- Zakładam firmę ---------------- */
// Jednoosobowa działalność: wniosek CEIDG-1 (bezpłatny) obejmuje też zgłoszenie do ZUS i wybór opodatkowania; NIP i REGON nadają US i GUS.
// Zbieg tytułów: przy umowie o pracę z pensją co najmniej minimalną z firmy obowiązkowa jest tylko składka zdrowotna.
// Zwolnienie z VAT: sprzedaż do 240 000 zł w roku (od 2026 r.), w pierwszym roku proporcjonalnie do dni działalności.
export function firma() {
  const z = stan.zrobione.firma;
  if (z) return { tytul: 'Zakładam firmę', html: `<h1 tabindex="-1">Firma zgłoszona</h1>` + gotowe({
    tytul: z.nazwa,
    czas: `Działalność od ${fmt(new Date(z.od), { day: 'numeric', month: 'long', year: 'numeric' })}`,
    pozycje: [
      ['CEIDG', 'wpis jest bezpłatny i widać go najpóźniej następnego dnia roboczego; działać możesz od dnia złożenia wniosku'],
      ['Urząd skarbowy i GUS', 'NIP i REGON pojawią się we wpisie i w Twojej skrzynce, bez osobnych wniosków'],
      ['ZUS', 'zgłoszenie do ubezpieczenia zdrowotnego; składki społeczne płacisz już z umowy o pracę'],
      ...(z.vat ? [['Urząd skarbowy: VAT-R', 'rejestracja jako czynny podatnik VAT']] : []),
      ['Przypomnimy', 'składka zdrowotna i zaliczka na podatek: do 20. dnia każdego miesiąca'],
    ],
  }) };
  const KROKI = () => [
    { id: 'ceidg', tytul: 'Wpis do CEIDG', opis: 'Dane z rejestru PESEL. Wpis jest widoczny najpóźniej następnego dnia roboczego; NIP i REGON uzupełnią się w nim same.', doKogo: 'CEIDG', wymagany: true, plakietka: ['zielona', 'bezpłatny'] },
    { id: 'zus', tytul: 'Zgłoszenie do ubezpieczenia zdrowotnego', opis: 'Część tego samego wniosku. Masz umowę o pracę z pensją co najmniej minimalną, więc z firmy płacisz tylko składkę zdrowotną.', doKogo: 'ZUS', wymagany: true },
    { id: 'pit', tytul: 'Wybór formy opodatkowania', opis: 'Też w tym samym wniosku.', doKogo: 'Urząd skarbowy', wymagany: true },
    { id: 'vat', tytul: 'Rejestracja do VAT (VAT-R)', opis: 'Tylko jeśli chcesz być czynnym podatnikiem VAT.', doKogo: 'Urząd skarbowy', wl: false },
    { id: 'przyp', tytul: 'Przypomnienia o płatnościach', opis: 'Składka zdrowotna i zaliczka na podatek: do 20. dnia miesiąca.', doKogo: 'mObywatel' },
  ];
  return {
    tytul: 'Zakładam firmę',
    html: `<h1 tabindex="-1">Zakładam firmę</h1>
    <p class="wstep">Jeden wniosek do CEIDG trafia też do urzędu skarbowego, ZUS i GUS. Twoje dane już są w rejestrach; wybierz tylko to, co dotyczy firmy.</p>
    <form id="f-firma" class="karta" novalidate>
      <label class="etyk" for="nazwa-firmy">Nazwa firmy</label>
      <input id="nazwa-firmy" class="pole" value="${esc(ja.imie)} ${esc(ja.nazwisko)} Projekty" aria-describedby="nazwa-pom">
      <p class="maly" id="nazwa-pom">Musi zawierać Twoje imię i nazwisko; resztę wybierasz sama.</p>
      <p class="blad" id="nazwa-firmy-blad" role="alert" hidden>Nazwa musi zawierać „${esc(ja.imie)} ${esc(ja.nazwisko)}”.</p>
      ${wybor('branza', [['projektowanie graficzne', 'Projektowanie graficzne'], ['szkolenia', 'Szkolenia i warsztaty'], ['uslugi IT', 'Usługi informatyczne']], 'Czym się zajmiesz')}
      <p class="maly">Kod PKD 2025 podpowie wyszukiwarka CEIDG; możesz dodać kolejne później.</p>
      <label class="etyk" for="firma-od">Data rozpoczęcia</label>
      <input id="firma-od" type="date" class="pole" min="${isoDnia(za(0))}" value="${isoDnia(za(1))}">
      ${wybor('podatek', [['skala', 'Skala podatkowa', '12% i 32%, kwota wolna 30 000 zł'], ['liniowy', 'Podatek liniowy', '19%, bez kwoty wolnej'], ['ryczalt', 'Ryczałt od przychodów', 'stawka zależy od rodzaju usług, liczona od przychodu']], 'Jak chcesz płacić podatek')}
      ${wybor('vat', [['zwolnienie', 'Zwolnienie z VAT', 'do 240 000 zł sprzedaży w roku; w pierwszym roku proporcjonalnie'], ['czynny', 'Czynny podatnik VAT', 'dołączymy wniosek VAT-R']], 'VAT')}
      ${wiersz('Adres firmy', ja.adres)}${wiersz('Rachunek firmy', ja.konto)}
      <h2 class="nag">Co wyślemy</h2>
      <ul class="kroki">${KROKI().map(krok).join('')}</ul>
      <button class="btn glowny szeroki" id="firma-dalej">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('biznes.gov.pl: Wpis do CEIDG', 'https://www.biznes.gov.pl/pl/portal/ou736')}`,
    po(root) {
      przypnijAkcje(root, $('#firma-dalej', root));
      const vatKrok = $('input[name=krok][value=vat]', root);
      $$('input[name=vat]', root).forEach(r => r.onchange = () => { vatKrok.checked = wartosc(root, 'vat') === 'czynny'; });
      $('#f-firma', root).onsubmit = e => {
        e.preventDefault();
        const nazwa = $('#nazwa-firmy', root).value.trim();
        if (!nazwa.includes(`${ja.imie} ${ja.nazwisko}`)) return blad(root, 'nazwa-firmy');
        const wyb = zaznaczone(root, KROKI()), od = $('#firma-od', root).value || isoDnia(za(1));
        wyslij(root, {
          id: 'firma',
          pozycje: { tytul: `Firma „${nazwa}”`, lista: wyb.map(k => ({ co: k.id === 'pit' ? `${k.tytul}: ${$('input[name=podatek]:checked', root).parentElement.textContent.trim().split('\n')[0]}` : k.tytul, do: k.doKogo })) },
          dane: ['imię, nazwisko, PESEL, adres', 'rodzaj działalności i data rozpoczęcia', 'numer rachunku'],
          cofniecie: 'Wpis w CEIDG możesz zmienić albo zawiesić działalność w każdej chwili, bez opłat.',
          stan: { nazwa, od, vat: wyb.some(k => k.id === 'vat') },
          wyslane: [['Wniosek CEIDG-1', 'CEIDG, ZUS, urząd skarbowy, GUS']],
        });
      };
    },
  };
}

/* ---------------- Emerytura ---------------- */
// Wiek emerytalny: 60 lat (kobiety). Wniosek najwcześniej 30 dni przed. Legitymacja emeryta-rencisty: do mObywatela automatycznie (od 2023 r.).
// Umowa zlecenia studenta do 26 lat nie podlegała składkom, więc „brak” w ZUS może być w porządku.
const EMERYTURA = { wiek: '15.05.2053', wniosekOd: '15.04.2053' };
export function emerytura() {
  const z = stan.zrobione.emerytura;
  if (z) return { tytul: 'Emerytura', html: `<h1 tabindex="-1">Gotowe</h1>` + gotowe({
    tytul: z.zastrzezenie ? 'Zastrzeżenie wysłane do ZUS' : 'Okresy składkowe sprawdzone',
    pozycje: [
      ...(z.zastrzezenie ? [['ZUS', 'sprawdzi okres 2013–2015 u płatnika i odpowie w Twojej skrzynce']] : [['2013–2015', 'umowa zlecenia studentki do 26 lat: składki nie były należne']]),
      ['Przypomnimy', `${EMERYTURA.wniosekOd}: od tego dnia złożysz wniosek o emeryturę`],
      ['Legitymacja emeryta-rencisty', 'po przyznaniu emerytury trafi do mObywatela automatycznie'],
    ],
  }) };
  return {
    tytul: 'Emerytura',
    html: `<h1 tabindex="-1">Emerytura</h1>
    <p class="wstep">Wiek emerytalny osiągniesz ${EMERYTURA.wiek} (60 lat). Wniosek złożysz najwcześniej 30 dni wcześniej; przypomnimy.</p>
    <section class="karta">
      <h2 class="nag">Twoje konto w ZUS</h2>
      ${wiersz('Składki na koncie (stan na 31.12.2025)', '168 400 zł')}${wiersz('Subkonto', '42 300 zł')}
      <p class="maly">Dane przykładowe. Prognozę emerytury ZUS liczy przy obecnych zarobkach; zobaczysz ją w informacji o stanie konta.</p>
    </section>
    <section class="karta">
      <h2 class="nag">Okresy składkowe</h2>
      <ul class="lista mala">
        <li class="poz">${ic('check', 'okr zielona')}<span><b>od 2016: umowa o pracę</b><small>${esc(ja.pracodawca)}</small></span></li>
        <li class="poz">${ic('check', 'okr zielona')}<span><b>${fmt(za(-10), { month: 'long', year: 'numeric' })}: zasiłek macierzyński</b><small>składki emerytalne finansuje budżet państwa</small></span></li>
        <li class="poz">${ic('alert', 'okr')}<span><b>2013–2015: umowa zlecenia</b><small>Kawiarnia „Pod Lipą”, Łódź. Urząd skarbowy ma Twój przychód z tej umowy, a ZUS nie ma za ten czas składek.</small></span></li>
      </ul>
    </section>
    <form id="f-emer" class="karta" novalidate>
      ${wybor('student', [['tak', 'Byłam wtedy studentką i miałam mniej niż 26 lat', 'składki nie były należne, wszystko się zgadza'], ['nie', 'Nie byłam studentką', 'zgłosimy zastrzeżenie do ZUS, a ZUS sprawdzi to u płatnika']], 'Czy w 2013–2015 byłaś studentką?')}
      <div id="emer-zal" hidden>${zalacznik('umowa', 'Dodaj zdjęcie umowy zlecenia')}<p class="blad" id="umowa-blad" role="alert" hidden>Dodaj umowę albo inny dowód pracy.</p></div>
      <label class="przel-duzy"><span><b>Przypomnienie o wniosku</b><small>${EMERYTURA.wniosekOd}, 30 dni przed wiekiem emerytalnym</small></span><input type="checkbox" role="switch" id="emer-przyp" checked></label>
      <button class="btn glowny szeroki" id="emer-dalej">Zapisz</button>
    </form>
    ${zrodlo('ZUS: Emerytura w wieku powszechnym', 'https://www.zus.pl/swiadczenia/emerytury/emerytura-dla-osob-urodzonych-po-31-grudnia-1948/emerytura-w-wieku-powszechnym')}`,
    po(root) {
      const pokaz = () => {
        const nie = wartosc(root, 'student') === 'nie';
        $('#emer-zal', root).hidden = !nie;
        $('#emer-dalej', root).innerHTML = nie ? `${ic('key')}Przejrzyj i podpisz zastrzeżenie` : 'Zapisz';
      };
      $$('input[name=student]', root).forEach(r => r.onchange = pokaz); pokaz();
      obsluzZalaczniki(root);
      $('#f-emer', root).onsubmit = e => {
        e.preventDefault();
        const zastrzezenie = wartosc(root, 'student') === 'nie';
        if (!zastrzezenie) { stan.zrobione.emerytura = { zastrzezenie: false }; zapisz(); ogloszenie('Zapisano.'); return dispatchEvent(new HashChangeEvent('hashchange')); }
        if (!dodany(root, 'umowa')) return blad(root, 'umowa');
        wyslij(root, {
          id: 'emerytura',
          pozycje: { tytul: 'Zastrzeżenie do informacji o stanie konta', lista: [{ co: 'Brak składek za 2013–2015 (umowa zlecenia)', do: 'ZUS' }] },
          dane: ['imię, nazwisko, PESEL', 'okres i płatnik z urzędu skarbowego', 'zdjęcie umowy zlecenia'],
          cofniecie: 'Zastrzeżenie możesz wycofać, dopóki ZUS go nie rozpatrzy.',
          stan: { zastrzezenie: true },
          wyslane: [['Zastrzeżenie do informacji o stanie konta', 'ZUS']],
        });
      };
    },
  };
}

/* ---------------- Kończę 18 lat (przykład: osoba fikcyjna) ---------------- */
// Wpis do rejestru wyborców z urzędu (adres w PESEL). Dowód osobisty wydany po 12. roku życia jest ważny 10 lat: nie trzeba go wymieniać.
// Szkolenie na prawo jazdy można zacząć 3 miesiące przed wymaganym wiekiem; do tego potrzebny jest profil kandydata na kierowcę (PKK).
const KUBA = { imie: 'Jakub Lis', urodziny: za(18), dowodDo: '14.06.2033', urzad: 'Urząd Miasta Łodzi, Wydział Komunikacji' };
export function osiemnastka() {
  const z = stan.zrobione.osiemnastka;
  if (z) return { tytul: 'Kończę 18 lat', html: `<h1 tabindex="-1">Gotowe</h1>` + gotowe({
    tytul: z.pkk ? 'Wniosek o profil kandydata na kierowcę wysłany' : 'Wszystko gotowe na 18. urodziny',
    pozycje: [
      ...(z.pkk ? [['Wydział Komunikacji', 'numer profilu (PKK) trafi do skrzynki, zwykle w ciągu 2 dni roboczych; podasz go w ośrodku szkolenia kierowców']] : []),
      ['Rejestr wyborców', `wpis z urzędu ${fmt(KUBA.urodziny)}`],
      ...(z.wybory ? [['Przypomnimy', 'o najbliższych wyborach i adresie lokalu wyborczego']] : []),
      ['Internetowe Konto Pacjenta', 'od 18. urodzin rodzice nie mają już do niego dostępu'],
    ],
  }) };
  return {
    tytul: 'Kończę 18 lat',
    html: `<h1 tabindex="-1">Kończę 18 lat</h1>
    ${przyklad(`Masz to za sobą, więc pokazujemy tę sprawę na przykładzie: ${KUBA.imie}, Łódź, 18 lat skończy ${fmt(KUBA.urodziny)}. Dane fikcyjne.`)}
    <section class="karta">
      <h2 class="nag">Zrobi się samo</h2>
      <ul class="punkty">
        <li>Wpis do rejestru wyborców: z urzędu, na podstawie adresu w rejestrze PESEL.</li>
        <li>Internetowe Konto Pacjenta: od 18. urodzin rodzice nie mają już do niego dostępu.</li>
        <li>Dowód osobisty jest ważny do ${KUBA.dowodDo}. Nie trzeba go wymieniać.</li>
      </ul>
    </section>
    <form id="f-18" class="karta" novalidate>
      ${wybor('pkk', [['tak', 'Chcę zrobić prawo jazdy kategorii B', 'kurs możesz zacząć już teraz: 3 miesiące przed 18. urodzinami'], ['nie', 'Nie teraz']], 'Prawo jazdy')}
      <div id="pkk-dane">
        ${zalacznik('zdjecie', 'Dodaj zdjęcie (jak do dowodu)')}
        <p class="blad" id="zdjecie-blad" role="alert" hidden>Do profilu potrzebne jest aktualne zdjęcie.</p>
        ${zalacznik('orzeczenie', 'Dodaj orzeczenie lekarskie')}
        <p class="blad" id="orzeczenie-blad" role="alert" hidden>Do profilu potrzebne jest orzeczenie lekarskie o braku przeciwwskazań.</p>
        <p class="maly">Profil jest bezpłatny. Opłatę za prawo jazdy wnosisz dopiero po zdanym egzaminie.</p>
      </div>
      <label class="przel-duzy"><span><b>Przypomnienie o wyborach</b><small>termin i adres lokalu wyborczego</small></span><input type="checkbox" role="switch" id="wybory" checked></label>
      <button class="btn glowny szeroki" id="dalej-18">${ic('key')}Przejrzyj i podpisz</button>
    </form>
    ${zrodlo('gov.pl: Uzyskaj prawo jazdy', 'https://www.gov.pl/web/gov/uzyskaj-prawo-jazdy')}`,
    po(root) {
      obsluzZalaczniki(root);
      const pokaz = () => { const tak = wartosc(root, 'pkk') === 'tak'; $('#pkk-dane', root).hidden = !tak; $('#dalej-18', root).innerHTML = tak ? `${ic('key')}Przejrzyj i podpisz` : 'Zapisz'; };
      $$('input[name=pkk]', root).forEach(r => r.onchange = pokaz); pokaz();
      $('#f-18', root).onsubmit = e => {
        e.preventDefault();
        const pkk = wartosc(root, 'pkk') === 'tak', wybory = $('#wybory', root).checked;
        if (!pkk) { stan.zrobione.osiemnastka = { pkk: false, wybory }; zapisz(); ogloszenie('Zapisano.'); return dispatchEvent(new HashChangeEvent('hashchange')); }
        if (!dodany(root, 'zdjecie')) return blad(root, 'zdjecie');
        if (!dodany(root, 'orzeczenie')) return blad(root, 'orzeczenie');
        wyslij(root, {
          id: 'osiemnastka',
          pozycje: { tytul: 'Profil kandydata na kierowcę', lista: [{ co: 'Wniosek o profil kandydata na kierowcę (kat. B)', do: KUBA.urzad }] },
          dane: ['imię, nazwisko, PESEL, adres', 'zdjęcie', 'orzeczenie lekarskie'],
          cofniecie: 'Wniosek możesz wycofać, dopóki urząd nie utworzy profilu.',
          stan: { pkk: true, wybory },
          wyslane: [['Wniosek o profil kandydata na kierowcę', KUBA.urzad]],
        });
      };
    },
  };
}
