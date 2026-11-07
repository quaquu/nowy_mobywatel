// Dane pokazowe. Wszystkie osoby, numery i adresy są FIKCYJNE.
// Daty liczymy względem dnia otwarcia prototypu, żeby historia zawsze była „aktualna”.

const DZIEN = 864e5;
export const dzis = new Date(new Date().toDateString());
export const za = n => new Date(dzis.getTime() + n * DZIEN);
export const fmt = (d, o = { day: 'numeric', month: 'long' }) => d.toLocaleDateString('pl-PL', o);
export const fmtPelna = d => d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const zl = n => n.toLocaleString('pl-PL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' zł';

const anna_ja = {
  imie: 'Anna', nazwisko: 'Wójcik', wolacz: 'Anno',
  pesel: '93051507780', urodzona: '15.05.1993',
  adres: 'ul. Zielona 8 m. 12, 90-601 Łódź',
  konto: 'PL 61 1090 •••• •••• 4412',
  pracodawca: 'Drukarnia Kolor sp. z o.o.',
  partner: { imie: 'Piotr', nazwisko: 'Wójcik' },
};

export const dziecko = {
  urodzone: za(-3),
  szpital: 'Szpital im. M. Kopernika, Łódź',
  karta: 'karta urodzenia nr 2026/10/0841',
  propozycjeImion: ['Zofia', 'Hanna', 'Jan'],
};

export const mama = {
  imie: 'Halina', nazwisko: 'Nowicka', wiek: 78, miasto: 'Zgierz',
  pelnomocnictwo: 'zdrowie (IKP), ZUS, dowód osobisty',
  pelnomocnictwoDo: za(700),
};

const anna_dokumenty = [
  { id: 'dowod', nazwa: 'mDowód', kolor: 'niebieski', istnieje: true,
    linia: 'Ważny do ' + fmtPelna(za(41)), alert: 'Ważny jeszcze 41 dni',
    pola: [['Imię i nazwisko', 'Anna Wójcik'], ['PESEL', '93051507780'], ['Seria i numer', 'ZWA 418263'], ['Ważny do', fmtPelna(za(41))]],
    zrodlo: 'Rejestr Dowodów Osobistych', akcja: ['Przygotuj wniosek o nowy dowód', '#/sprawa/dowod'] },
  { id: 'prawo', nazwa: 'mPrawo jazdy', kolor: 'purpura', istnieje: true,
    linia: 'Kat. B · 2 punkty karne',
    pola: [['Kategorie', 'B'], ['Ważne do', '14.03.2033'], ['Punkty karne', '2 (wygasną ' + fmtPelna(za(220)) + ')']],
    zrodlo: 'Centralna Ewidencja Kierowców' },
  { id: 'pojazd', nazwa: 'Moje pojazdy', kolor: 'pomarancz', istnieje: true,
    linia: 'Toyota Yaris · EL 4K217', alert: 'Badanie techniczne za 19 dni',
    pola: [['Pojazd', 'Toyota Yaris 1.5, 2019'], ['Kolor', 'czerwony'], ['Nr rejestracyjny', 'EL 4K217'], ['OC', 'do ' + fmtPelna(za(132)) + ' (Link4)'], ['Badanie techniczne', 'do ' + fmtPelna(za(19))]],
    zrodlo: 'CEPiK, Ubezpieczeniowy Fundusz Gwarancyjny' },
];

// Lista „Do zrobienia”: posortowana po terminie. `cel` to trasa w aplikacji.
const anna_zadania = [
  { id: 'mandat', tytul: 'Mandat z fotoradaru', opis: '200 zł · przyjmij i zapłać do ' + fmt(za(6)), termin: za(6), pilne: true, cel: '#/mandat', ikona: 'coin' },
  { id: 'podatek', tytul: 'Podatek od nieruchomości', opis: 'IV rata 186 zł do ' + fmt(za(23)), termin: za(23), cel: '#/podatek', ikona: 'coin' },
  { id: 'badanie', tytul: 'Badanie techniczne Yarisa', opis: 'do ' + fmt(za(19)) + ' · stacje w pobliżu', termin: za(19), cel: '#/badanie', ikona: 'car' },
  { id: 'dowod', tytul: 'Twój dowód traci ważność', opis: 'za 41 dni · wniosek gotowy, umów wizytę', termin: za(41), cel: '#/sprawa/dowod', ikona: 'id' },
  { id: 'smierc', tytul: 'Zasiłek pogrzebowy po tacie', opis: 'wniosek do ' + fmt(za(323)) + ' · potrzebny rachunek', termin: za(323), cel: '#/sprawa/smierc', ikona: 'leaf' },
];

const anna_naleznosci = [
  { id: 'becikowe', tytul: 'Becikowe', kwota: '1 000 zł jednorazowo', dlaczego: 'Urodziło się dziecko, a dochód w rodzinie za 2025 r. jest niższy niż próg 1 922 zł na osobę (dane z urzędu skarbowego).', status: 'w pakiecie „Narodziny dziecka”', cel: '#/sprawa/narodziny', zrodlo: ['gov.pl: Uzyskaj becikowe', 'https://www.gov.pl/web/gov/uzyskaj-becikowe'] },
  { id: '800', tytul: 'Świadczenie wychowawcze 800+', kwota: '800 zł miesięcznie', dlaczego: 'Przysługuje na każde dziecko do 18 lat. Wniosek w ciągu 3 miesięcy od urodzenia daje wypłatę od miesiąca urodzenia.', status: 'w pakiecie „Narodziny dziecka”', cel: '#/sprawa/narodziny', zrodlo: ['gov.pl: Skorzystaj z programu Rodzina 800+', 'https://www.gov.pl/web/gov/skorzystaj-z-programu-rodzina-500'] },
  { id: 'aktywny', tytul: '„Aktywny rodzic”', kwota: 'do 1 500 zł miesięcznie', dlaczego: 'Gdy dziecko skończy 12 miesięcy i oboje rodzice pracują albo dziecko pójdzie do żłobka.', status: 'przypomnimy ' + fmt(za(362), { month: 'long', year: 'numeric' }), cel: '#/naleznosci', zrodlo: ['gov.pl: Aktywny rodzic', 'https://www.gov.pl/web/rodzina/aktywny-rodzic'] },
  { id: 'ulga', tytul: 'Ulga na dziecko w PIT', kwota: 'ok. 1 112 zł rocznie', dlaczego: 'Dopiszemy ją sami do Twojego e-PIT za 2026 r. Nie musisz nic robić.', status: 'automatycznie w lutym', cel: '#/naleznosci', zrodlo: ['gov.pl: Skorzystaj z ulgi podatkowej na dziecko', 'https://www.gov.pl/web/gov/skorzystaj-z-ulgi-podatkowej-na-dziecko'] },
];

// Przypomnienia (tylko dają znać) i zlecenia (robią coś za Ciebie, jak zlecenie stałe w banku).
// Każdy opis odpowiada na trzy pytania: co się stanie, kiedy i jak to zatrzymać.
const anna_autopilot = [
  { id: 'dokumenty', rodzaj: 'przypomnienie', tytul: 'Koniec ważności dokumentów', opis: 'Damy znać 60, 30 i 7 dni przed końcem ważności dowodu, prawa jazdy i paszportu. Wniosek przygotujemy, ale wysyłasz go Ty.', wl: true },
  { id: 'pojazd', rodzaj: 'przypomnienie', tytul: 'OC i badanie techniczne auta', opis: 'Damy znać 30 i 7 dni przed końcem OC i badania technicznego. Pokażemy stacje kontroli w pobliżu.', wl: true },
  { id: 'adres', rodzaj: 'zlecenie', tytul: 'Nowy adres w urzędach', opis: 'Gdy zmienisz meldunek, przekażemy nowy adres do urzędu skarbowego, ZUS, NFZ i bazy pojazdów. Nie musisz pisać do każdego urzędu.', wl: false },
  { id: 'podatek', rodzaj: 'zlecenie', tytul: 'Raty podatku od nieruchomości', opis: 'W dniu terminu zapłacimy ratę z Twojego konta. Dzień wcześniej dostaniesz powiadomienie i możesz płatność wstrzymać.', wl: false },
];

// Rejestr dostępu do danych: kto, kiedy, po co i na jakiej podstawie (wzór: Estonia, „Andmejälgija”).
const anna_dostep = [
  { kto: 'Policja (KMP Łódź)', co: 'dane z prawa jazdy i pojazdu', po: 'kontrola drogowa', kiedy: za(-2), podstawa: 'art. 129 ustawy Prawo o ruchu drogowym', id: 'policja' },
  { kto: 'Szpital im. M. Kopernika', co: 'Twój PESEL i adres', po: 'karta urodzenia dziecka przekazana do USC', kiedy: za(-3), podstawa: 'art. 54 ustawy Prawo o aktach stanu cywilnego', id: 'szpital' },
  { kto: 'Bank (PKO BP)', co: 'potwierdzenie, że dowód nie jest zastrzeżony', po: 'Twój wniosek o kartę kredytową', kiedy: za(-16), podstawa: 'Twoja zgoda i ustawa o dowodach osobistych', id: 'bank' },
  { kto: 'Urząd Miasta Łodzi', co: 'adres zameldowania', po: 'naliczenie podatku od nieruchomości', kiedy: za(-38), podstawa: 'ustawa o podatkach i opłatach lokalnych', id: 'gmina' },
  { kto: 'Operator telekomunikacyjny', co: 'sprawdzenie zastrzeżenia PESEL', po: 'zakup karty SIM na Twoje dane', kiedy: za(-51), podstawa: 'ustawa o zastrzeganiu numeru PESEL', id: 'operator', podejrzane: 'Nie kupowałaś karty SIM? Ktoś mógł próbować użyć Twoich danych. Zastrzeżenie PESEL zadziałało i operator odmówił.' },
];

const anna_skrzynka = [
  { id: 'us', od: 'Urząd Skarbowy Łódź-Polesie', tytul: 'Zwrot nadpłaty podatku', data: za(-1), nowa: true,
    tresc: 'Na podstawie art. 77 § 1 Ordynacji podatkowej Naczelnik Urzędu Skarbowego zawiadamia, że nadpłata w wysokości 214,00 zł wynikająca z zeznania PIT-37 za rok 2025 zostanie zwrócona na rachunek bankowy wskazany w zeznaniu w terminie 14 dni.',
    prosto: 'Oddajemy Ci 214 zł nadpłaconego podatku za 2025 r. Pieniądze przyjdą na Twoje konto w ciągu 14 dni. Nic nie musisz robić.' },
  { id: 'mandat', od: 'CANARD (GITD)', tytul: 'Wezwanie: przekroczenie prędkości', data: za(-2), nowa: true, cel: '#/mandat',
    tresc: 'Urządzenie rejestrujące zarejestrowało przekroczenie dopuszczalnej prędkości o 18 km/h. Wzywa się właściciela pojazdu EL 4K217 do wskazania kierującego w terminie 7 dni od doręczenia.',
    prosto: 'Fotoradar zrobił zdjęcie Twojemu autu: jechało 18 km/h za szybko. Masz 7 dni, żeby powiedzieć, kto prowadził. Jeśli Ty, możesz od razu przyjąć mandat 200 zł i zapłacić.' },
  { id: 'gmina', od: 'Urząd Miasta Łodzi', tytul: 'Decyzja: podatek od nieruchomości 2026', data: za(-200),
    tresc: 'Ustala się wysokość zobowiązania podatkowego w podatku od nieruchomości na rok 2026 w kwocie 744,00 zł, płatnego w czterech ratach.',
    prosto: 'Podatek za mieszkanie na 2026 r. to 744 zł. Płacisz w 4 ratach po 186 zł.' },
];

// Katalog zdarzeń życiowych; każde ma pełny przebieg w prototypie.
export const sprawy = [
  { id: 'narodziny', tytul: 'Urodziło się dziecko', opis: '5 spraw w 4 instytucjach, jeden podpis', ikona: 'baby' },
  { id: 'przeprowadzka', tytul: 'Przeprowadzka', opis: 'meldunek i nowy adres w urzędach', ikona: 'home' },
  { id: 'auto', tytul: 'Kupno używanego auta', opis: 'historia, umowa, podatek, rejestracja', ikona: 'car' },
  { id: 'utrata', tytul: 'Zgubione albo skradzione dokumenty', opis: 'zastrzeżenie w 1 minutę, nowy dowód', ikona: 'shield' },
  { id: 'dowod', tytul: 'Nowy dowód osobisty', opis: 'wniosek gotowy, wizyta po odciski palców', ikona: 'id' },
  { id: 'slub', tytul: 'Ślub', opis: 'zapewnienie, termin, nazwisko, dokumenty po ślubie', ikona: 'ring' },
  { id: 'smierc', tytul: 'Śmierć bliskiej osoby', opis: 'zasiłek pogrzebowy, świadczenia, spadek', ikona: 'leaf' },
  { id: 'renta', tytul: 'Renta wdowia', opis: 'emerytura i część renty po mężu lub żonie', ikona: 'coin' },
  { id: 'firma', tytul: 'Zakładam firmę', opis: 'CEIDG, podatek, ZUS i VAT w jednym wniosku', ikona: 'case' },
  { id: 'emerytura', tytul: 'Emerytura', opis: 'kiedy, ile i brakujące okresy składek', ikona: 'sun' },
  { id: 'osiemnastka', tytul: 'Kończę 18 lat', opis: 'dowód, prawo jazdy, wybory', ikona: 'star' },
];

// Kto dzwoni? Numery FIKCYJNE. Rodzaje: „tylko-odbior” – numer z jawnego wykazu UKE numerów służących
// wyłącznie do odbierania połączeń (art. 17 ustawy o zwalczaniu nadużyć w komunikacji elektronicznej);
// „instytucja” – proponowany rejestr numerów, z których instytucje publiczne dzwonią do obywateli.
export const numery = [
  { nr: '800000101', rodzaj: 'tylko-odbior', kto: 'Bank Przykładowy S.A.' },
  { nr: '420003456', rodzaj: 'instytucja', kto: 'ZUS, Oddział w Łodzi', sprawy: 'świadczenia dla rodzin i zasiłki', osoba: 'Ewa Kamińska' },
  { nr: '426000600', rodzaj: 'instytucja', kto: 'Urząd Skarbowy Łódź-Polesie', sprawy: 'zwroty i zaległości podatkowe', osoba: 'Marek Zając' },
  { nr: '420001100', rodzaj: 'instytucja', kto: 'Centrum Pomocy mObywatela', sprawy: 'oddzwanianie na prośbę złożoną w aplikacji', osoba: 'Agnieszka Lis' },
];
export const przykladyNumerow = [['800 000 101', 'infolinia banku'], ['42 000 34 56', 'ZUS'], ['512 000 789', 'nieznany']];

// Podpisy i poparcie. Inicjatywy, komitety i kandydaci są FIKCYJNI.
// `prawo` mówi uczciwie, czy podpis elektroniczny jest dziś możliwy.
export const inicjatywy = [
  { id: 'przejscia', rodzaj: 'ustawa', tytul: 'Bezpieczne przejścia przy szkołach', komitet: 'Komitet „Bezpieczna Droga do Szkoły”', opis: 'Obywatelski projekt ustawy: doświetlone przejście dla pieszych i próg zwalniający przy każdej szkole podstawowej do 2030 r.', tresc: 'Art. 1. Zarządca drogi zapewnia przy każdej szkole podstawowej przejście dla pieszych z oświetleniem i progiem zwalniającym. Art. 2. Koszt pokrywa budżet państwa w 70%. Art. 3. Ustawa wchodzi w życie po 6 miesiącach.', ile: 41230, prog: 100000, koniec: 78, sprawdza: 'Marszałek Sejmu', prawo: 'ustawa' },
  { id: 'czas', rodzaj: 'referendum', tytul: 'Referendum w sprawie stałego czasu', komitet: 'Komitet „Jeden Czas”', opis: 'Wniosek do Sejmu o referendum ogólnokrajowe: czy Polska ma zrezygnować ze zmiany czasu dwa razy w roku?', tresc: 'Pytanie: „Czy jest Pani/Pan za tym, aby w Polsce obowiązywał przez cały rok ten sam czas?”', ile: 212400, prog: 500000, koniec: 40, sprawdza: 'Marszałek Sejmu', prawo: 'ustawa' },
  { id: 'zajezdnia', rodzaj: 'lokalne', tytul: 'Park na terenie dawnej zajezdni w Łodzi', komitet: 'Mieszkańcy „Zielona Zajezdnia”', opis: 'Wniosek o referendum lokalne: czy miasto ma przeznaczyć teren dawnej zajezdni na park?', tresc: 'Pytanie: „Czy jest Pani/Pan za przeznaczeniem terenu dawnej zajezdni tramwajowej na park miejski?”', ile: 38900, prog: 52000, koniec: 33, sprawdza: 'komisarz wyborczy w Łodzi', prawo: 'ustawa' },
  { id: 'senat', rodzaj: 'kandydat', tytul: 'Jan Przykładowy, kandydat na senatora', komitet: 'Komitet Wyborczy Wyborców „Przykład”', opis: 'Poparcie zgłoszenia kandydata w wyborach do Senatu, okręg nr 25 (Łódź).', tresc: 'Zgłoszenie kandydata na senatora wymaga podpisów co najmniej 2 000 wyborców z okręgu.', ile: 1460, prog: 2000, koniec: 20, sprawdza: 'okręgowa komisja wyborcza', prawo: 'portal' },
];
// Wpis z papierowej listy poparcia znaleziony w rejestrze (pokaz: ktoś użył Twoich danych).
export const poparciaPapier = [
  { id: 'papier', tytul: 'Kandydat na senatora, KWW „Nasz Okręg”', kiedy: za(-12), papier: true, podejrzane: true },
];

/* ---------------- Osoby w pokazie ----------------
   Jeden świat: Anna (33 l.) urodziła córkę, a 6 tygodni temu zmarł jej tata, Tadeusz. Jego żona, Halina (78 l.),
   jest wdową i korzysta z pomocy Anny. Jakub (17 l.) i jego siostra Katarzyna (29 l.) to inna rodzina z Łodzi.
   Osobę wybiera adres (?osoba=halina) albo przełącznik w pokazie; wybór zostaje w przeglądarce. */
export const OSOBY = {
  anna: { nazwa: 'Anna Wójcik', opis: '33 lata, Łódź. Trzy dni temu urodziła córkę, sześć tygodni temu zmarł jej tata.', krotko: 'urodziła córkę, zmarł jej tata' },
  halina: { nazwa: 'Halina Nowicka', opis: '78 lat, Zgierz, mama Anny. Wdowa, korzysta z trybu prostego; córka pomaga jej z upoważnienia.', krotko: 'renta wdowia, tryb prosty' },
  jakub: { nazwa: 'Jakub Lis', opis: '17 lat, Łódź. Za 18 dni kończy 18 lat i chce zrobić prawo jazdy.', krotko: 'kończy 18 lat, prawo jazdy' },
  kasia: { nazwa: 'Katarzyna Lis', opis: '29 lat, Łódź, siostra Jakuba. Planuje ślub z Tomaszem.', krotko: 'planuje ślub' },
};
// Czyja jest sprawa w pokazie; pozostałe (zgubione dokumenty, nowy dowód) ma każda osoba.
export const WLASCICIEL = { narodziny: 'anna', przeprowadzka: 'anna', auto: 'anna', mandat: 'anna', podatek: 'anna', badanie: 'anna', smierc: 'anna', firma: 'anna', emerytura: 'anna', slub: 'kasia', osiemnastka: 'jakub', renta: 'halina' };
export const adresOsoby = (id, hash = '#/start') => { const u = new URL(location.href); u.searchParams.set('osoba', id); u.hash = hash; return u.pathname + u.search + u.hash; };
export const OSOBA = (() => {
  try {
    const q = new URLSearchParams(location.search).get('osoba');
    if (OSOBY[q]) { localStorage.setItem('mobywatel-osoba', q); return q; }
    const z = localStorage.getItem('mobywatel-osoba');
    return OSOBY[z] ? z : 'anna';
  } catch { return 'anna'; }
})();

export const zmarl = za(-42); // tata Anny, mąż Haliny
// Jakub kończy 18 lat za 18 dni: data urodzenia i PESEL liczone od dziś (w PESEL po 2000 r. miesiąc + 20).
const urJakuba = (() => { const d = za(18); d.setFullYear(d.getFullYear() - 18); return d; })();
const dwa = n => String(n).padStart(2, '0');
const peselJakuba = dwa(urJakuba.getFullYear() % 100) + dwa(urJakuba.getMonth() + 21) + dwa(urJakuba.getDate()) + '04315';

const DANE = {
  anna: {
    ja: anna_ja, dokumenty: anna_dokumenty, zadania: anna_zadania, naleznosci: anna_naleznosci, autopilot: anna_autopilot, dostep: anna_dostep, skrzynka: anna_skrzynka,
    hero: { id: 'narodziny', cel: '#/sprawa/narodziny', tytul: 'Urodziła się Twoja córka', opis: '5 spraw w 4 instytucjach, jeden podpis', przycisk: 'Załatw wszystko naraz', awatar: 'corka', aria: 'Sprawa przyszła do Ciebie: urodziła się Twoja córka. 5 spraw w 4 instytucjach, jeden podpis. Załatw wszystko naraz.' },
    bliscyOpis: 'mama, córka',
    rejestry: [
      ['Rejestr PESEL', 'imię, nazwisko, PESEL, adres, stan cywilny, dzieci'],
      ['Centralna Ewidencja Pojazdów i Kierowców', 'Toyota Yaris EL 4K217, prawo jazdy kat. B, 2 punkty'],
      ['Krajowa Administracja Skarbowa', 'dochody za 2025 r., nadpłata 214 zł'],
      ['ZUS', 'zatrudnienie: Drukarnia Kolor sp. z o.o., zasiłek macierzyński'],
      ['NFZ / Internetowe Konto Pacjenta', 'ubezpieczenie, recepty, skierowania'],
    ],
    podpowiedzi: ['Urodziło nam się dziecko', 'Zgubiłam portfel', 'Przeprowadzam się', 'Kto sprawdzał moje dane?', 'Z czego mogę skorzystać?'],
  },
  halina: {
    ja: { imie: 'Halina', nazwisko: 'Nowicka', wolacz: 'Pani Halino', pesel: '48031207461', urodzona: '12.03.1948', adres: 'ul. Lipowa 3 m. 5, 95-100 Zgierz', konto: 'PL 27 1020 •••• •••• 9083' },
    dokumenty: [
      { id: 'dowod', nazwa: 'mDowód', kolor: 'niebieski', linia: 'Ważny do ' + fmtPelna(za(77)), alert: 'Ważny jeszcze 77 dni',
        pola: [['Imię i nazwisko', 'Halina Nowicka'], ['PESEL', '48031207461'], ['Seria i numer', 'ZGB 204517'], ['Ważny do', fmtPelna(za(77))]],
        zrodlo: 'Rejestr Dowodów Osobistych', akcja: ['Urzędnik może przyjść do domu', '#/bliscy'] },
      { id: 'legitymacja', nazwa: 'Legitymacja emeryta-rencisty', kolor: 'zielony', linia: 'ZUS, Oddział w Łodzi',
        pola: [['Imię i nazwisko', 'Halina Nowicka'], ['Świadczenie', 'emerytura'], ['Wystawca', 'ZUS, Oddział w Łodzi']],
        zrodlo: 'ZUS' },
    ],
    zadania: [
      { id: 'renta', tytul: 'Renta wdowia: ok. 434 zł więcej', opis: 'co miesiąc · wniosek jest gotowy', termin: za(0), cel: '#/sprawa/renta', ikona: 'coin' },
      { id: 'recepta', tytul: 'Recepta gotowa: Metformax 500', opis: 'kod 4821 · wykupisz w każdej aptece', termin: za(30), cel: '#/pismo/recepta', ikona: 'doc' },
      { id: 'dowod', tytul: 'Dowód traci ważność ' + fmt(za(77)), opis: 'urzędnik przyjdzie do domu · córka Anna to załatwia', termin: za(77), cel: '#/bliscy', ikona: 'id' },
    ],
    naleznosci: [
      { id: 'renta', tytul: 'Renta wdowia', kwota: 'ok. 434 zł miesięcznie więcej', dlaczego: 'Masz własną emeryturę, a po śmierci męża przysługuje Ci renta rodzinna. Możesz dostawać całą jedną i 15% drugiej (od 2027 r. 25%).', status: 'wniosek gotowy', cel: '#/sprawa/renta', zrodlo: ['ZUS: renta wdowia', 'https://www.zus.pl/obsluga-swiadczen/obsluga-wnioskow-o-wyplate-swiadczen-lacznie-z-renta-rodzinna-tzw-renta-wdowia'] },
      { id: 'pielegnacyjny', tytul: 'Dodatek pielęgnacyjny', kwota: 'co miesiąc, razem z emeryturą', dlaczego: 'Po 75. urodzinach ZUS przyznaje go sam, bez wniosku. Już go dostajesz.', status: 'wypłacany', cel: '#/naleznosci', zrodlo: ['ZUS: dodatek pielęgnacyjny', 'https://www.zus.pl/swiadczenia/dodatki-do-swiadczen-emerytalno-rentowych/dodatek-pielegnacyjny'] },
      { id: 'leki', tytul: 'Bezpłatne leki 65+', kwota: 'leki z wykazu bez opłat', dlaczego: 'Masz ponad 65 lat. Lekarz wpisuje na recepcie kod „S”, a apteka wydaje lek z wykazu bez dopłaty.', status: 'działa na każdej recepcie', cel: '#/naleznosci', zrodlo: ['gov.pl: Korzystaj z bezpłatnych leków 65+', 'https://www.gov.pl/web/gov/korzystaj-z-bezplatnych-lekow-75'] },
    ],
    autopilot: [
      { id: 'dokumenty', rodzaj: 'przypomnienie', tytul: 'Koniec ważności dowodu', opis: 'Damy znać Tobie i córce 60, 30 i 7 dni przed końcem ważności. Wniosek przygotujemy, ale składa go urzędnik w Twoim domu albo w urzędzie.', wl: true },
      { id: 'recepty', rodzaj: 'przypomnienie', tytul: 'Gotowe recepty', opis: 'Damy znać, gdy lekarz wystawi receptę. Kod zobaczysz w aplikacji i w SMS-ie.', wl: true },
      { id: 'pomoc', rodzaj: 'zlecenie', tytul: 'Córka załatwia sprawy w moim imieniu', opis: 'Anna może składać wnioski w ZUS, odbierać recepty i umawiać urzędnika. Każdą jej czynność widzisz tutaj i możesz ją cofnąć.', wl: true },
    ],
    dostep: [
      { kto: 'Anna Wójcik (córka, upoważnienie)', co: 'recepty w Internetowym Koncie Pacjenta', po: 'odbiór recepty', kiedy: za(-1), podstawa: 'Twoje upoważnienie', id: 'corka' },
      { kto: 'Przychodnia „Zdrowie”, Zgierz', co: 'recepty i skierowania', po: 'wystawienie recepty', kiedy: za(-2), podstawa: 'ustawa o systemie informacji w ochronie zdrowia', id: 'przychodnia' },
      { kto: 'Bank (Pekao)', co: 'sprawdzenie zastrzeżenia PESEL', po: 'próba otwarcia konta na Twoje dane', kiedy: za(-9), podstawa: 'ustawa o zastrzeganiu numeru PESEL', id: 'bank', podejrzane: 'Nie otwierałaś konta? Ktoś mógł podać Twoje dane, np. po telefonie „na wnuczka”. PESEL był zastrzeżony, więc bank odmówił.' },
      { kto: 'ZUS, Oddział w Łodzi', co: 'akt zgonu męża z rejestru stanu cywilnego', po: 'wstrzymanie emerytury męża', kiedy: za(-41), podstawa: 'ustawa o emeryturach i rentach z FUS', id: 'zus' },
    ],
    skrzynka: [
      { id: 'recepta', od: 'Przychodnia „Zdrowie”, Zgierz', tytul: 'Recepta: Metformax 500', data: za(-2), nowa: true,
        tresc: 'Recepta elektroniczna. Kod dostępu: 4821. Lek: Metformax 500, 60 tabletek, dawkowanie 1 tabletka 2 razy dziennie. Kod uprawnień dodatkowych: S.',
        prosto: 'Lekarz wystawił receptę na Metformax 500, 60 tabletek. W aptece podaj kod 4821 i swój PESEL. Lek jest bezpłatny, bo masz ponad 65 lat.' },
      { id: 'zus', od: 'ZUS, Oddział w Łodzi', tytul: 'Waloryzacja emerytury', data: za(-240),
        tresc: 'Na podstawie art. 88 ustawy o emeryturach i rentach z Funduszu Ubezpieczeń Społecznych świadczenie podlega waloryzacji od 1 marca 2026 r.',
        prosto: 'Od marca Twoja emerytura jest wyższa. Nic nie musisz robić.' },
    ],
    hero: { id: 'renta', cel: '#/sprawa/renta', tytul: 'Możesz dostać ok. 434 zł więcej', opis: 'renta wdowia · wniosek jest gotowy', przycisk: 'Sprawdź i złóż', ikona: 'coin', aria: 'Sprawa przyszła do Ciebie: renta wdowia, około 434 zł więcej co miesiąc. Wniosek jest gotowy.' },
    bliscyOpis: 'córka Anna pomaga',
    bliscy: { wstep: 'Osoby, które upoważniłaś do spraw w Twoim imieniu. Widzisz wszystko, co robią, i możesz to cofnąć.', osoby: [['#/bliscy', 'anna', 'Anna Wójcik, córka', 'zdrowie (IKP), ZUS, dowód · ostatnio: odebrała receptę']] },
    rejestry: [
      ['Rejestr PESEL', 'imię, nazwisko, PESEL, adres, stan cywilny: wdowa'],
      ['ZUS', 'emerytura, dodatek pielęgnacyjny, renta rodzinna po mężu'],
      ['NFZ / Internetowe Konto Pacjenta', 'recepty, skierowania, upoważnienie dla córki'],
      ['Rejestr Dowodów Osobistych', 'dowód ważny do ' + fmtPelna(za(77))],
    ],
    podpowiedzi: ['Kto do mnie dzwonił?', 'Renta wdowia', 'Kończy mi się dowód', 'Recepta', 'Chcę porozmawiać z człowiekiem'],
    ustawienia: { prosty: true },
    asystent: {
      swiadczenia: { t: 'Po śmierci męża możesz dostawać rentę wdowią: całą emeryturę i 15% renty rodzinnej, czyli około 434 zł więcej co miesiąc. Wniosek jest gotowy. Dodatek pielęgnacyjny już dostajesz.', a: [['Renta wdowia', '#/sprawa/renta']] },
      emerytura: { t: 'Dostajesz emeryturę z ZUS i dodatek pielęgnacyjny. Po śmierci męża możesz dostawać więcej, w ramach renty wdowiej.', a: [['Renta wdowia', '#/sprawa/renta']] },
      bliscy: { t: 'Twoja córka Anna ma upoważnienie do spraw zdrowia, ZUS i dowodu. Wszystko, co robi w Twoim imieniu, widzisz w zakładce Bliscy.', a: [['Bliscy', '#/bliscy']] },
      nowy_dowod: { t: `Twój dowód jest ważny do ${fmt(za(77))}. Urzędnik może przyjść do Ciebie do domu. Córka Anna już się tym zajmuje.`, a: [['Bliscy', '#/bliscy']] },
      skrzynka: { t: 'Masz nową receptę na Metformax 500. Kod 4821. Lek jest bezpłatny.', a: [['Pokaż receptę', '#/pismo/recepta']] },
      do_zrobienia: { t: 'Najważniejsze: renta wdowia, około 434 zł więcej co miesiąc. Do tego gotowa recepta i dowód, którym zajmuje się córka.', a: [['Renta wdowia', '#/sprawa/renta']] },
      smierc: { t: 'Przykro mi z powodu śmierci męża. Zasiłkiem pogrzebowym zajęła się córka Anna. Dla Ciebie jest gotowy wniosek o rentę wdowią.', a: [['Renta wdowia', '#/sprawa/renta']] },
    },
  },
  jakub: {
    ja: { imie: 'Jakub', nazwisko: 'Lis', wolacz: 'Jakubie', pesel: peselJakuba, urodzona: fmtPelna(urJakuba), adres: 'ul. Wróblewskiego 18 m. 7, 93-578 Łódź', konto: 'PL 74 1140 •••• •••• 3021' },
    dokumenty: [
      { id: 'dowod', nazwa: 'mDowód', kolor: 'niebieski', linia: 'Ważny do 14.06.2033',
        pola: [['Imię i nazwisko', 'Jakub Lis'], ['PESEL', peselJakuba], ['Seria i numer', 'ZWB 771204'], ['Ważny do', '14.06.2033']], zrodlo: 'Rejestr Dowodów Osobistych' },
      { id: 'legitymacja', nazwa: 'mLegitymacja szkolna', kolor: 'zielony', linia: 'XV Liceum Ogólnokształcące w Łodzi',
        pola: [['Imię i nazwisko', 'Jakub Lis'], ['Szkoła', 'XV Liceum Ogólnokształcące w Łodzi'], ['Ważna do', '30.09.2027']], zrodlo: 'System Informacji Oświatowej' },
    ],
    zadania: [
      { id: 'osiemnastka', tytul: 'Za 18 dni kończysz 18 lat', opis: 'co się zmieni · prawo jazdy', termin: za(18), cel: '#/sprawa/osiemnastka', ikona: 'star' },
    ],
    naleznosci: [],
    autopilot: [
      { id: 'dokumenty', rodzaj: 'przypomnienie', tytul: 'Koniec ważności dokumentów', opis: 'Damy znać przed końcem ważności dowodu i legitymacji szkolnej.', wl: true },
      { id: 'wybory', rodzaj: 'przypomnienie', tytul: 'Wybory', opis: 'Po 18. urodzinach damy znać o terminie wyborów i adresie lokalu wyborczego.', wl: true },
    ],
    dostep: [
      { kto: 'Monika Lis (mama)', co: 'Internetowe Konto Pacjenta', po: 'umówienie wizyty u lekarza', kiedy: za(-12), podstawa: 'władza rodzicielska (do 18. urodzin)', id: 'mama' },
      { kto: 'XV LO w Łodzi', co: 'PESEL i adres', po: 'legitymacja szkolna', kiedy: za(-60), podstawa: 'ustawa o systemie informacji oświatowej', id: 'szkola' },
    ],
    skrzynka: [
      { id: 'wybory', od: 'Urząd Miasta Łodzi', tytul: 'Wpis do rejestru wyborców', data: za(-1), nowa: true,
        tresc: 'Informujemy, że z dniem uzyskania pełnoletności zostanie Pan ujęty w Centralnym Rejestrze Wyborców na podstawie adresu zameldowania na pobyt stały.',
        prosto: 'Po 18. urodzinach wpiszemy Cię do rejestru wyborców sami. Nic nie musisz robić.' },
    ],
    hero: { id: 'osiemnastka', cel: '#/sprawa/osiemnastka', tytul: 'Za 18 dni kończysz 18 lat', opis: 'co się zmieni · prawo jazdy', przycisk: 'Zobacz', ikona: 'star', aria: 'Sprawa przyszła do Ciebie: za 18 dni kończysz 18 lat.' },
    bliscyOpis: 'rodzice',
    bliscy: { wstep: 'Do 18. urodzin rodzice mogą załatwiać sprawy w Twoim imieniu i widzą Twoje Internetowe Konto Pacjenta.', osoby: [['#/bliscy', 'users', 'Monika i Paweł Lis, rodzice', 'dostęp do IKP do ' + fmt(za(18))]] },
    rejestry: [
      ['Rejestr PESEL', 'imię, nazwisko, PESEL, adres'],
      ['System Informacji Oświatowej', 'szkoła, klasa, legitymacja'],
      ['NFZ / Internetowe Konto Pacjenta', 'ubezpieczenie przez rodzica, szczepienia'],
      ['Rejestr Dowodów Osobistych', 'dowód ważny do 14.06.2033'],
    ],
    podpowiedzi: ['Kończę 18 lat', 'Jak zrobić prawo jazdy?', 'Pierwsze wybory', 'Pokaż legitymację'],
    asystent: {
      dokumenty: { t: 'Masz mDowód (ważny do 14.06.2033) i mLegitymację szkolną. Jeśli chcesz potwierdzić tylko wiek, pokażę kod bez reszty danych.', a: [['Dokumenty', '#/dokumenty']] },
      nowy_dowod: { t: 'Twój dowód jest ważny do 14.06.2033. Po 18. urodzinach nie musisz go wymieniać.', a: [['Dokumenty', '#/dokumenty']] },
      swiadczenia: { t: 'Na razie nic nowego dla Ciebie. Damy znać, gdy coś Ci przysługuje.', a: [] },
      skrzynka: { t: 'Masz jedno pismo: po 18. urodzinach wpiszemy Cię do rejestru wyborców sami.', a: [['Otwórz skrzynkę', '#/skrzynka']] },
      do_zrobienia: { t: 'Za 18 dni kończysz 18 lat. Zobacz, co się zmieni, i złóż wniosek o profil kandydata na kierowcę.', a: [['Co się zmienia po 18 latach', '#/sprawa/osiemnastka']] },
      pojazd: { t: 'Nie masz zarejestrowanego pojazdu. Chcesz zrobić prawo jazdy?', a: [['Profil kandydata na kierowcę', '#/sprawa/osiemnastka']] },
      mandat: { t: 'Nie masz mandatów ani punktów karnych.', a: [] },
      platnosci: { t: 'Nie masz nic do zapłaty.', a: [] },
    },
  },
  kasia: {
    ja: { imie: 'Katarzyna', nazwisko: 'Lis', wolacz: 'Katarzyno', pesel: '97022503482', urodzona: '25.02.1997', adres: 'ul. Narutowicza 40 m. 11, 90-135 Łódź', konto: 'PL 15 1050 •••• •••• 6620', pracodawca: 'Szpital im. M. Kopernika w Łodzi', partner: { imie: 'Tomasz', nazwisko: 'Bąk' } },
    dokumenty: [
      { id: 'dowod', nazwa: 'mDowód', kolor: 'niebieski', linia: 'Ważny do 03.09.2031',
        pola: [['Imię i nazwisko', 'Katarzyna Lis'], ['PESEL', '97022503482'], ['Seria i numer', 'ZWC 318840'], ['Ważny do', '03.09.2031']], zrodlo: 'Rejestr Dowodów Osobistych' },
      { id: 'prawo', nazwa: 'mPrawo jazdy', kolor: 'purpura', linia: 'Kat. B · 0 punktów karnych',
        pola: [['Kategorie', 'B'], ['Ważne do', '21.07.2031'], ['Punkty karne', '0']], zrodlo: 'Centralna Ewidencja Kierowców' },
    ],
    zadania: [
      { id: 'slub', tytul: 'Ślub: zacznij od zapewnień', opis: 'Tomasz zaprosił Cię do wspólnej sprawy', termin: za(0), cel: '#/sprawa/slub', ikona: 'ring' },
      { id: 'us', tytul: 'Zwrot podatku 380 zł', opis: 'przyjdzie sam w ciągu 14 dni', termin: za(14), cel: '#/pismo/us', ikona: 'coin' },
    ],
    naleznosci: [],
    autopilot: [
      { id: 'dokumenty', rodzaj: 'przypomnienie', tytul: 'Koniec ważności dokumentów', opis: 'Damy znać 60, 30 i 7 dni przed końcem ważności dowodu i prawa jazdy.', wl: true },
      { id: 'adres', rodzaj: 'zlecenie', tytul: 'Nowe nazwisko w urzędach', opis: 'Jeśli po ślubie zmienisz nazwisko, przekażemy je do urzędu skarbowego, NFZ i pracodawcy. Bank powiadomimy tylko za Twoją zgodą.', wl: false },
    ],
    dostep: [
      { kto: 'Tomasz Bąk', co: 'Twój stan cywilny (tak/nie)', po: 'zaproszenie do wspólnej sprawy „Ślub”', kiedy: za(-1), podstawa: 'Twoja zgoda w aplikacji', id: 'tomasz' },
      { kto: 'Szpital im. M. Kopernika (pracodawca)', co: 'PESEL i adres', po: 'zgłoszenie do ubezpieczeń', kiedy: za(-90), podstawa: 'ustawa o systemie ubezpieczeń społecznych', id: 'praca' },
    ],
    skrzynka: [
      { id: 'us', od: 'Urząd Skarbowy Łódź-Śródmieście', tytul: 'Zwrot nadpłaty podatku', data: za(-3), nowa: true,
        tresc: 'Na podstawie art. 77 § 1 Ordynacji podatkowej Naczelnik Urzędu Skarbowego zawiadamia, że nadpłata w wysokości 380,00 zł wynikająca z zeznania PIT-37 za rok 2025 zostanie zwrócona na rachunek bankowy wskazany w zeznaniu w terminie 14 dni.',
        prosto: 'Oddajemy Ci 380 zł nadpłaconego podatku za 2025 r. Pieniądze przyjdą na Twoje konto w ciągu 14 dni. Nic nie musisz robić.' },
    ],
    hero: { id: 'slub', cel: '#/sprawa/slub', tytul: 'Tomasz zaprosił Cię do sprawy „Ślub”', opis: 'zapewnienia, termin, nazwisko', przycisk: 'Zaplanujcie razem', ikona: 'ring', aria: 'Sprawa przyszła do Ciebie: Tomasz zaprosił Cię do wspólnej sprawy „Ślub”.' },
    bliscyOpis: 'Tomasz, wspólna sprawa',
    bliscy: { wstep: 'Nikogo jeszcze nie upoważniłaś. Tomasz zaprosił Cię do wspólnej sprawy: każde z was podpisuje swoje wnioski.', osoby: [['#/sprawa/slub', 'ring', 'Tomasz Bąk', 'wspólna sprawa: ślub']] },
    rejestry: [
      ['Rejestr PESEL', 'imię, nazwisko, PESEL, adres, stan cywilny: panna'],
      ['Centralna Ewidencja Kierowców', 'prawo jazdy kat. B, 0 punktów'],
      ['Krajowa Administracja Skarbowa', 'dochody za 2025 r., nadpłata 380 zł'],
      ['ZUS', 'zatrudnienie: Szpital im. M. Kopernika w Łodzi'],
    ],
    podpowiedzi: ['Bierzemy ślub', 'Zmiana nazwiska po ślubie', 'Kto sprawdzał moje dane?', 'Pokaż dokumenty'],
    asystent: {
      skrzynka: { t: 'Masz jedno nowe pismo: zwrot 380 zł nadpłaconego podatku. Pieniądze przyjdą same.', a: [['Otwórz pismo', '#/pismo/us']] },
      do_zrobienia: { t: 'Tomasz zaprosił Cię do wspólnej sprawy „Ślub”. Do tego zwrot podatku, który przyjdzie sam.', a: [['Zaplanuj ślub', '#/sprawa/slub']] },
      swiadczenia: { t: 'Na razie nic nowego dla Ciebie. Damy znać, gdy coś Ci przysługuje.', a: [] },
      nowy_dowod: { t: 'Twój dowód jest ważny do 03.09.2031. Jeśli po ślubie zmienisz nazwisko, trzeba będzie go wymienić; przypomnimy.', a: [['Zaplanuj ślub', '#/sprawa/slub']] },
      pojazd: { t: 'Nie masz zarejestrowanego pojazdu. Masz prawo jazdy kat. B i 0 punktów karnych.', a: [['Dokumenty', '#/dokumenty']] },
      mandat: { t: 'Nie masz mandatów ani punktów karnych.', a: [] },
      platnosci: { t: 'Nie masz nic do zapłaty. Za to urząd skarbowy odda Ci 380 zł.', a: [['Otwórz pismo', '#/pismo/us']] },
    },
  },
};
export const osoba = DANE[OSOBA];
export const { ja, dokumenty, zadania, naleznosci, autopilot, dostep, skrzynka } = osoba;
