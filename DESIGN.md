---
name: mObywatel (prototyp) – państwo, które przychodzi ze sprawą
description: Barwy i krój serwisu mObywatela (granat, Lato) w układzie aplikacji bankowej - zabarwione tło z miękkimi plamami barwy, białe widżety z jedną liczbą, okrągłe szybkie akcje, portfel kart dokumentów, wykresy z danymi zamiast list.
colors:
  tlo: "oklch(97.3% 0.007 269)"        # #f4f6fb, powierzchnia serwisu mObywatela
  tlo-gora: "oklch(93.9% 0.017 251)"
  powierzchnia: "oklch(99.6% 0.003 269)"
  tekst: "oklch(23% 0.012 262)"
  tekst-drugorzedny: "oklch(49.8% 0.009 254)"
  separator: "oklch(91.5% 0.008 262)"
  akcent: "oklch(41.5% 0.136 255)"     # #004a93, granat mObywatela
  akcent-wypelnienie: "oklch(93.9% 0.017 251)"
  sukces: "oklch(49.5% 0.1 168)"
  ostrzezenie: "oklch(50.5% 0.14 47)"   # pomarańcz serwisu #c25400, przyciemniony do 4,5:1
  blad: "oklch(52% 0.2 24)"
  seria-1: "oklch(57.5% 0.155 254)"
  seria-2: "oklch(65.5% 0.177 40)"
  seria-3: "oklch(65.5% 0.13 163)"
  seria-4: "oklch(76% 0.16 75)"
typography:
  font: "Lato 400, 700, 900 (OFL), przycięte do znaków polskich"
  tytul-ekranu: "32px / 900 / -0.022em"
  liczba-glowna: "44px / 900, cyfry tabelaryczne"
  liczba-widzetu: "28px / 900"
  tytul-wiersza: "17px / 700"
  tekst: "17px / 400"
  objasnienie: "15px / 400"
rounded:
  widzet: "20px"
  grupa: "16px"
  pole: "12px"
  arkusz: "24px"
  przycisk: "999px"
---

# DESIGN.md

Źródło prawdy dla wyglądu prototypu. Tokeny są w `app/css/app.css` (role: `--tlo`, `--pow`, `--gl`, `--s1`…) i w `app/css/tokens.css` (skala odstępów `--space-*`, czasy ruchu). Skąd barwy: `.hallmark/brand-spec.md` (pobrane 16.11.2026 z info.mobywatel.gov.pl, nie z pamięci). Pierwsza linia arkusza to stempel Hallmark; `sloplint` i `npm test` sprawdzają zasady poniżej.

## Overview

Obywatel korzysta na co dzień z aplikacji banku. Jeśli mObywatel wygląda jak formularz, przegrywa z nimi już na pierwszym ekranie. Dlatego układ i rzemiosło biorą z aplikacji bankowych to, co działa (liczba zamiast akapitu, widżety, szybkie akcje, wykres z danymi), a tożsamość zostaje państwowa: granat i krój Lato z serwisu mObywatela, karty dokumentów w ich prawdziwych barwach, bez godła.

Osiem rzeczy niesie charakter:
1. **Sprawa, która przychodzi sama**: granatowe pole na górze Startu, jedna akcja na białej pigułce.
2. **Portfel dokumentów**: stos kart w barwach mObywatela.
3. **Widżety z jedną liczbą**: emerytura, do zapłaty, dni do badania auta, świadczenia. Każdy prowadzi do sprawy.
4. **Twoja emerytura**: suma ze wszystkich filarów, pasek udziałów i wykres prognozy, którą zmieniasz dwoma przełącznikami. Składki jako siatka 12 miesięcy (opłacona, w toku, brak), osoby uprawnione jako lista z ostrzeżeniem przy pustym wskazaniu.
5. **Zdrowie**: wynik jako znacznik na pasku zakresu laboratorium, zawsze z liczbą, jednostką i zdaniem „co z tym zrobić”; kolor ostrzeżenia, nigdy czerwień alarmu. Kod recepty duży, z odstępami, do pokazania w aptece.
6. **Krzywizny**: jeden zestaw promieni (4, 8, 12, 16, 20, 24 px i pigułka). W przeglądarkach z `corner-shape` (Chrome 139+) rogi ciągłe jak w iOS, promień ~1,5 raza większy; Safari i Firefox pokazują zwykłe zaokrąglenia (sprawdzone: Safari do 26.6 tego nie obsługuje).
7. **Telefon na komputerze**: obudowa jak w iPhonie, nie płaski pierścień: tytanowa krawędź 4 px w kolorze głębokiej purpury z odblaskiem, czarna ramka ekranu 12 px, przycisk czynności, głośność i boczny przycisk. Ekran 390 × 844 bez zmian; kolor obudowy to trzy tokeny `--obudowa-*`.
8. **Ruch**: przełączniki segmentowe z podświetleniem, które się przesuwa (translate, 0,34 s, krzywa arkuszy iOS); ikona zakładki lekko rośnie przy wyborze; po zmianie zakładki sekcje wchodzą po kolei (< 0,4 s); kwoty na widżetach dobiegają do wartości (0,7 s), a czytnik ekranu od razu dostaje wynik; telefon na komputerze wjeżdża przy otwarciu. „Ogranicz ruch” wyłącza przesuwanie i skalowanie.

### Decyzja z 16–17.11.2026 (redesign Hallmark, pełny)

Wygląd iOS (HIG) był poprawny, ale wyglądał jak makieta: szare listy, rysowane twarze, mało liczb. Próbowany motyw Riso (róż i niebieski z druku) odrzucony: nie pasuje do aplikacji państwowej. Wybrano barwy marki z serwisu mObywatela i układ aplikacji bankowej. Zmiany: tło z plamami barwy, szybkie akcje, widżety, kolorowe znaki kategorii, awatary z inicjałami, terminy z kafelkiem daty, wykresy w „Twojej emeryturze”, jeden krój w trzech grubościach.

## Colors

- **Tło** `#f4f6fb` z trzema miękkimi plamami barwy u góry ekranu (granat, błękit, morski w jasnych odcieniach); niżej czyste tło. W ciemnym: granatowa noc `oklch(15% 0.035 241)`, nie czerń.
- **Powierzchnie**: białe widżety i grupy na tle, z miękkim cieniem (`--cien-widzet`). W ciemnym o stopień jaśniejsze od tła, z jasną krawędzią u góry zamiast cienia.
- **Akcent `#004a93`** (granat mObywatela) tylko dla działań, wyboru i fokusu. Granatowe pole sprawy jest takie samo w obu motywach.
- **Kategorie**: znak w kolorze kategorii na jego jasnym odcieniu (pieniądze zielony, pojazdy pomarańczowy, rodzina fiolet, dane indygo, telefon morski, pomoc szary, pilne czerwony). Kolor znaczy rodzaj sprawy, nie stan.
- **Stany**: sukces, ostrzeżenie, błąd, każdy co najmniej 4,5:1 do powierzchni, zawsze z ikoną albo słowem.
- **Serie wykresów**: cztery barwy w stałej kolejności (konto w ZUS, subkonto, PPK, IKE i IKZE), sprawdzone walidatorem palet dataviz (CVD ΔE ≥ 9 na jasnym, 8,4 na ciemnym). Na jasnym tle dwie serie mają kontrast poniżej 3:1, dlatego obok paska zawsze jest lista z nazwami i kwotami.
- **Karty dokumentów**: gradienty w barwach dokumentu (niebieski dowód, purpurowe prawo jazdy, pomarańczowe pojazdy); najjaśniejszy stopień daje białemu tekstowi co najmniej 4,5:1.

## Typography

Jeden krój: Lato (Łukasz Dziedzic, OFL), krój serwisu mObywatela, w trzech grubościach: 400 tekst, 700 tytuły wierszy, przyciski i etykiety, 900 tytuły ekranów i liczby. Liczby (kwoty, daty, dni) są największym tekstem na kafelku, zawsze cyframi tabelarycznymi. Bez rozstrzelonych wersalików i etykiet nad nagłówkami.

## Layout

Kolumna telefonu (maks. 480 px), marginesy 16 px, odstępy ze skali 4 px (`--space-*`). Start: powitanie, szybkie akcje (4 okrągłe przyciski 56 px z podpisem), sprawa, portfel, siatka widżetów (2 kolumny, odstęp 12 px; nieparzysty ostatni na całą szerokość), pole pytania, „Do zrobienia” (kafelek daty z lewej, najbliższy termin pierwszy), „Dla Ciebie”. Pasek kart na całą szerokość u dołu, półprzezroczysty.

**Komputer**: strona produktu. Telefon po lewej działa na żywo i zostaje na ekranie przy przewijaniu (sticky). Po prawej przewija się opowieść: hasło, trzy liczby z pomiarów, film, „Trzy sytuacje z życia” (karty z obrazem, dwoma zdaniami i liczbą; klik przełącza telefon na tę sprawę), cztery osoby, co jeszcze sprawdzić, „Uczciwie”. Przejście ekranu w telefonie nie przewija strony.

**Alarm**: najpierw komunikat Cell Broadcast jak systemowy alert telefonu (czerwona krawędź, drgnięcie, „Otwórz w mObywatelu”); potem czerwony pas komunikatu z wyborem języka PL, EN, UA, baner trwającego alarmu na Starcie; najbliższe miejsce ochronne z odległością, kierunkiem i czasem dojścia, mapa (z siecią kafelki OpenStreetMap, bez sieci schemat z kręgami 250 i 500 m), instrukcja w trzech zdaniach, bliscy z „Wyślij drogę”, jedna główna akcja „Jestem bezpieczna”.

**Pokaż tylko to, co potrzebne**: najpierw cel (kapsuły), potem lista danych z przełącznikami zaznaczonymi według celu; pod spodem „Ukryte: …”; kod z listą przekazanych danych.

## Elevation & Depth

Głębia robi hierarchię: widżety i grupy unoszą się nad zabarwionym tłem miękkim cieniem, karty dokumentów mają cień z przesunięciem, arkusz zgody wysuwa się od dołu. Żadnych kolorowych poświat.

## Shapes

Widżety 20 px, grupy i karty 16 px, pola i kafelki dat 12 px, arkusz 24 px u góry, przyciski i segmenty jako kapsuły, znaki kategorii i awatary w kółku.

## Components

- **Znak**: „Sprawa domknięta”. Biały łuk (państwo) obejmuje błękitną kropkę (obywatela), a koło domyka morski znak zgody. Granatowy kwadrat z zaokrągleniem 16/64. Bez litery, bez czerwieni i bieli flagi, bez godła; nie naśladuje znaku aplikacji mObywatel. Źródło: `app/icon.svg`; PNG dla iPhone'a i manifestu robi `node tests/ikony.mjs`.
- **Nagłówek**: znak, skaner kodów, pisma z licznikiem i portret osoby (prowadzi do konta i ustawień, jak w aplikacji banku). Tryb wyglądu jest w Ustawieniach, nie na górze.
- **Szybkie akcje**: trzy ulubione, które każdy wybiera sam w „Dostosuj” (czwarte kółko), z katalogu 11 akcji. Domyślnie: PESEL (stan zastrzeżenia: zielona kropka „zastrzeżony”, czerwona „Zastrzeż PESEL”; cofnięcie na dzień, 3 dni, 7 dni albo bez terminu, potem wraca samo), Kto dzwoni?, Zgubiony portfel. W katalogu nie ma tego, co na Starcie już jest: skaner i pisma są w nagłówku, dowód jest kartą pod spodem, asystent ma zakładkę.
- **Widżet**: etykieta ze znakiem, jedna liczba (28 px, 900), jedno zdanie objaśnienia. Wariant szeroki dla emerytury z paskiem udziałów; wariant z pierścieniem dla dni do terminu.
- **Wiersz listy**: znak kategorii 40 px albo kafelek daty, tytuł 700, objaśnienie 400 w kolorze drugorzędnym.
- **Awatar**: ten sam portret co na dokumencie, przybliżony na twarz w kółku; niemowlę śpi w czapeczce i kocyku, w tym samym stylu.
- **Karta dokumentu**: jak zabezpieczony druk: giloszowa rozeta przy prawej krawędzi i fale mikrodruku (biała kreska, tryb soft-light), prostokątna folia hologramu z prążkami, kolorowe zdjęcie i jego mała jasna kopia („duch”), jak na plastikowym dowodzie. Portrety osób: rastrowe ilustracje malarskie (miękki pędzel, dorosłe proporcje, lekki uśmiech, pastelowe tło inne dla każdej osoby), osoby fikcyjne. Powstają lokalnie z portretu redakcyjnego przerysowanego modelem ilustracyjnym (`narzedzia/portrety.py`), WebP 320 × 400, 7–14 KB. Wektorowe twarze rysowane kodem odrzucone 17.11.2026: wyglądały kreskówkowo. Auto: płaska ilustracja w kolorze z rejestru.
- **Twoja emerytura**: suma (44 px), zdanie o części dziedziczonej, pasek udziałów z przerwami 2 px; lista filarów z kwotą, udziałem i źródłem danych; karta prognozy z dwoma przełącznikami segmentowymi (wiek, dopłata do IKZE), kwotą miesięczną, rozbiciem, stopą zastąpienia, ulgą IKZE i wykresem kapitału (linia 2 px, pole 16%, podpisany początek i koniec, krzyż i dymek pod kursorem, tabela jako zamiennik). „Jak liczymy” pod spodem.
- **Arkusz zgody**: co, dokąd, jakie dane, co można cofnąć; jedna wyróżniona akcja na dole.
- **Sprawa**: najpierw „Co zyskujesz” (kwoty i liczba wniosków, których nie trzeba składać; kafel gaśnie, gdy odznaczysz jego sprawę), potem lista kroków. Krok obowiązkowy ma kłódkę zamiast wyszarzonego pola.
- **Po podpisie**: oś czasu ze stanem każdej sprawy (Gotowe, W toku, Później), jak śledzenie przesyłki.
- **Portfel na Starcie**: niższe karty (2,05 : 1), żeby pod portfelem było widać liczby już na pierwszym ekranie; pełne karty w zakładce Dokumenty.
- **Notatka o prototypie**: przerywana ramka „O prototypie” dla zdań autora (co już działa, co nowe, skąd wzór). Głos aplikacji zostaje czysty; ramki ukrywa przełącznik w Ustawieniach.
- **Przyciski**: kapsuły; główny wypełniony granatem, drugi jasnym granatem, niszczący czerwony, tekstowy sam kolor. Cel dotyku ≥ 44 px.

## Motion

Ruch tłumaczy stan: wciśnięcie kafla i akcji (skala 0,94–0,985, 120 ms), przejścia ekranów, arkusz od dołu, Face ID z Dynamic Island w symulacji telefonu. Tylko transformacja i przezroczystość. „Ogranicz ruch” zostawia przenikania.

## Do's and Don'ts

- **Rób**: liczby zamiast akapitów, źródło i datę przy każdej danej, wykres tylko z prawdziwą osią i tabelą obok, stałą kolejność barw serii.
- **Nie rób**: różu i barw spoza marki, godła i oznaczeń urzędowych, kart w kartach, etykiet wersalikami, wymyślonych wskaźników bez źródła.
