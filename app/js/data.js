// Dane pokazowe. Wszystkie osoby, numery i adresy są FIKCYJNE.
// Daty liczymy względem dnia otwarcia prototypu, żeby historia zawsze była „aktualna”.

const DZIEN = 864e5;
export const dzis = new Date(new Date().toDateString());
export const za = n => new Date(dzis.getTime() + n * DZIEN);
export const fmt = (d, o = { day: 'numeric', month: 'long' }) => d.toLocaleDateString('pl-PL', o);
export const fmtPelna = d => d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const zl = n => n.toLocaleString('pl-PL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' zł';

export const ja = {
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

export const dokumenty = [
  { id: 'dowod', nazwa: 'mDowód', kolor: 'niebieski', istnieje: true,
    linia: 'Ważny do ' + fmtPelna(za(41)), alert: 'Ważny jeszcze 41 dni',
    pola: [['Imię i nazwisko', 'Anna Wójcik'], ['PESEL', '93051507780'], ['Seria i numer', 'ZWA 418263'], ['Ważny do', fmtPelna(za(41))]],
    zrodlo: 'Rejestr Dowodów Osobistych' },
  { id: 'prawo', nazwa: 'mPrawo jazdy', kolor: 'fiolet', istnieje: true,
    linia: 'Kat. B · 2 punkty karne',
    pola: [['Kategorie', 'B'], ['Ważne do', '14.03.2033'], ['Punkty karne', '2 (wygasną ' + fmtPelna(za(220)) + ')']],
    zrodlo: 'Centralna Ewidencja Kierowców' },
  { id: 'pojazd', nazwa: 'Moje pojazdy', kolor: 'pomarancz', istnieje: true,
    linia: 'Toyota Yaris · EL 4K217', alert: 'Badanie techniczne za 19 dni',
    pola: [['Pojazd', 'Toyota Yaris 1.5, 2019'], ['Nr rejestracyjny', 'EL 4K217'], ['OC', 'do ' + fmtPelna(za(132)) + ' (Link4)'], ['Badanie techniczne', 'do ' + fmtPelna(za(19))]],
    zrodlo: 'CEPiK, Ubezpieczeniowy Fundusz Gwarancyjny' },
];

// Lista „Do zrobienia”: posortowana po terminie. `cel` to trasa w aplikacji.
export const zadania = [
  { id: 'mandat', tytul: 'Mandat z fotoradaru', opis: '200 zł · przyjmij i zapłać do ' + fmt(za(6)), termin: za(6), pilne: true, cel: '#/mandat', ikona: 'coin' },
  { id: 'podatek', tytul: 'Podatek od nieruchomości', opis: 'IV rata 186 zł do ' + fmt(za(23)), termin: za(23), cel: '#/podatek', ikona: 'coin' },
  { id: 'badanie', tytul: 'Badanie techniczne Yarisa', opis: 'do ' + fmt(za(19)) + ' · stacje w pobliżu', termin: za(19), cel: '#/dokument/pojazd', ikona: 'car' },
  { id: 'dowod', tytul: 'Twój dowód traci ważność', opis: 'za 41 dni · wniosek zajmie 2 minuty', termin: za(41), cel: '#/sprawa/dowod', ikona: 'id' },
];

export const naleznosci = [
  { id: 'becikowe', tytul: 'Becikowe', kwota: '1 000 zł jednorazowo', dlaczego: 'Urodziło się dziecko, a dochód w rodzinie za 2025 r. jest niższy niż próg 1 922 zł na osobę (dane z urzędu skarbowego).', status: 'w pakiecie „Narodziny dziecka”', cel: '#/sprawa/narodziny', zrodlo: ['gov.pl: Uzyskaj becikowe', 'https://www.gov.pl/web/gov/uzyskaj-becikowe'] },
  { id: '800', tytul: 'Świadczenie wychowawcze 800+', kwota: '800 zł miesięcznie', dlaczego: 'Przysługuje na każde dziecko do 18 lat. Wniosek w ciągu 3 miesięcy od urodzenia daje wypłatę od miesiąca urodzenia.', status: 'w pakiecie „Narodziny dziecka”', cel: '#/sprawa/narodziny', zrodlo: ['gov.pl: Skorzystaj z programu Rodzina 800+', 'https://www.gov.pl/web/gov/skorzystaj-z-programu-rodzina-500'] },
  { id: 'aktywny', tytul: '„Aktywny rodzic”', kwota: 'do 1 500 zł miesięcznie', dlaczego: 'Gdy dziecko skończy 12 miesięcy i oboje rodzice pracują albo dziecko pójdzie do żłobka.', status: 'przypomnimy ' + fmt(za(362), { month: 'long', year: 'numeric' }), cel: '#/naleznosci', zrodlo: ['gov.pl: Aktywny rodzic', 'https://www.gov.pl/web/rodzina/aktywny-rodzic'] },
  { id: 'ulga', tytul: 'Ulga na dziecko w PIT', kwota: 'ok. 1 112 zł rocznie', dlaczego: 'Dopiszemy ją sami do Twojego e-PIT za 2026 r. Nie musisz nic robić.', status: 'automatycznie w lutym', cel: '#/naleznosci', zrodlo: ['gov.pl: Skorzystaj z ulgi podatkowej na dziecko', 'https://www.gov.pl/web/gov/skorzystaj-z-ulgi-podatkowej-na-dziecko'] },
];

export const autopilot = [
  { id: 'podatek', tytul: 'Podatek od nieruchomości', opis: 'Płać raty z konta w dniu terminu. Przed każdą płatnością dostaniesz powiadomienie i możesz ją wstrzymać.', wl: false },
  { id: 'dokumenty', tytul: 'Ważność dokumentów', opis: 'Przypomnij 60, 30 i 7 dni przed końcem ważności. Przygotuj wniosek z danymi i zdjęciem.', wl: true },
  { id: 'pojazd', tytul: 'OC i badanie techniczne', opis: 'Przypomnij 30 i 7 dni wcześniej. Pokaż stacje kontroli pojazdów w pobliżu.', wl: true },
  { id: 'adres', tytul: 'Jeden adres w państwie', opis: 'Gdy zmienisz meldunek, sami powiadomimy urząd skarbowy, ZUS, NFZ i bazę pojazdów.', wl: true },
];

// Rejestr dostępu do danych: kto, kiedy, po co i na jakiej podstawie (wzór: Estonia, „Andmejälgija”).
export const dostep = [
  { kto: 'Policja (KMP Łódź)', co: 'dane z prawa jazdy i pojazdu', po: 'kontrola drogowa', kiedy: za(-2), podstawa: 'art. 129 ustawy Prawo o ruchu drogowym', id: 'policja' },
  { kto: 'Szpital im. M. Kopernika', co: 'Twój PESEL i adres', po: 'karta urodzenia dziecka przekazana do USC', kiedy: za(-3), podstawa: 'art. 54 ustawy Prawo o aktach stanu cywilnego', id: 'szpital' },
  { kto: 'Bank (PKO BP)', co: 'potwierdzenie, że dowód nie jest zastrzeżony', po: 'Twój wniosek o kartę kredytową', kiedy: za(-16), podstawa: 'Twoja zgoda i ustawa o dowodach osobistych', id: 'bank' },
  { kto: 'Urząd Miasta Łodzi', co: 'adres zameldowania', po: 'naliczenie podatku od nieruchomości', kiedy: za(-38), podstawa: 'ustawa o podatkach i opłatach lokalnych', id: 'gmina' },
  { kto: 'Operator telekomunikacyjny', co: 'sprawdzenie zastrzeżenia PESEL', po: 'zakup karty SIM na Twoje dane', kiedy: za(-51), podstawa: 'ustawa o zastrzeganiu numeru PESEL', id: 'operator', podejrzane: true },
];

export const skrzynka = [
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

// Katalog zdarzeń życiowych. `pelne` = przebieg do przejścia w prototypie.
export const sprawy = [
  { id: 'narodziny', tytul: 'Urodziło się dziecko', opis: '5 spraw w 4 instytucjach, jeden podpis', ikona: 'baby', pelne: true },
  { id: 'przeprowadzka', tytul: 'Przeprowadzka', opis: 'meldunek i nowy adres w urzędach', ikona: 'home', pelne: true },
  { id: 'auto', tytul: 'Kupno używanego auta', opis: 'historia, umowa, podatek, rejestracja', ikona: 'car', pelne: true },
  { id: 'utrata', tytul: 'Zgubiłam / ukradli mi dokumenty', opis: 'zastrzeżenie w 1 minutę, nowy dowód', ikona: 'shield', pelne: true },
  { id: 'dowod', tytul: 'Nowy dowód osobisty', opis: 'wniosek ze zdjęciem z paszportu', ikona: 'id', pelne: true },
  { id: 'slub', tytul: 'Ślub', opis: 'zapewnienie, nazwisko, dokumenty', ikona: 'ring', kroki: ['Złożenie zapewnienia w USC (osobiście)', 'Wybór nazwiska po ślubie', 'Nowy dowód i paszport: wnioski przygotujemy po ślubie', 'Zmiana nazwiska w banku i u pracodawcy: wyślemy powiadomienie'] },
  { id: 'smierc', tytul: 'Śmierć bliskiej osoby', opis: 'akt zgonu, zasiłek pogrzebowy, spadek', ikona: 'leaf', kroki: ['Akt zgonu: USC sporządza na podstawie karty zgonu', 'Zasiłek pogrzebowy 7 000 zł: wniosek do ZUS', 'Wyrejestrowanie pojazdu i zamknięcie spraw w urzędach', 'Poświadczenie dziedziczenia: notariusz albo sąd'] },
  { id: 'firma', tytul: 'Zakładam firmę', opis: 'CEIDG, ZUS, VAT, konto', ikona: 'case', kroki: ['Wpis do CEIDG (formularz z Twoimi danymi)', 'Wybór formy opodatkowania', 'Zgłoszenie do ZUS (ulga na start)', 'Rejestracja VAT, jeśli potrzebna'] },
  { id: 'emerytura', tytul: 'Przejście na emeryturę', opis: 'wniosek, wyliczenie, kapitał', ikona: 'sun', kroki: ['Prognoza emerytury z ZUS', 'Wniosek o emeryturę (od 30 dni przed wiekiem)', 'Legitymacja emeryta w telefonie'] },
  { id: 'osiemnastka', tytul: 'Kończę 18 lat', opis: 'dowód, prawo jazdy, wybory', ikona: 'star', kroki: ['Pierwszy dowód dorosłego', 'Wpis do rejestru wyborców: automatycznie', 'Profil kandydata na kierowcę'] },
];
