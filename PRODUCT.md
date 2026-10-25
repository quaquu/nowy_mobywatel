# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Klikalny prototyp aplikacji mobilnej, który naśladuje natywną aplikację iOS (mObywatel). Na komputerze pokazywany w symulacji iPhone'a z panelem opisu albo na pełnym ekranie.

## Stack

Statyczny HTML, CSS i JavaScript (moduły ES), bez budowania i bez frameworka; service worker do pracy offline; publikacja na GitHub Pages z katalogu `app/`.

## Users

- **Jury mObywatel Challenge** (Klub Parlamentarny Rozwój Plus): ocenia w kilka minut, na komputerze, czy prototyp jest lepszy od prototypu Janusza Cieszyńskiego: prostszy, wygodniejszy, bardziej dostępny albo załatwiający więcej spraw.
- **Obywatel z historii pokazowej**: Anna Wójcik (33 lata, Łódź), której urodziła się córka; jej mama Halina (78 lat) potrzebuje pomocy w sprawach urzędowych.
- **Testerzy** (5–8 osób, w tym 65+), którzy przechodzą zadania w trybie testowym.

## Product Purpose

Pokazać „państwo, które przychodzi ze sprawą”: aplikacja sama zauważa zdarzenie (narodziny, koniec ważności dowodu, mandat), łączy sprawy z kilku urzędów w jedną listę wypełnioną danymi, które państwo już ma, i prosi o jeden podpis. Sukces: wejście do 10 najlepszych zgłoszeń i obrona koncepcji w Sejmie.

## Positioning

Prototyp referencyjny odpowiada, gdy zapytasz; ten zaczyna sprawę sam i załatwia kilka spraw w kilku urzędach jednym podpisem. Każda liczba porównania jest zmierzona i powtarzalna (`npm test`).

## Operating Context

- Ocena przez link, bez logowania, często na komputerze; czasem na telefonie.
- Prezentacja na żywo w Sejmie (rzutnik, telefon albo laptop), także bez internetu.
- Tekst do formularza: `ZGLOSZENIE.md`; scenariusze wystąpień: `docs/DEMO_90S.md`, `docs/PREZENTACJA_SEJM.md`.

## Capabilities and Constraints

- Sprawy pełne: narodziny dziecka, przeprowadzka, kupno auta, utrata dokumentów, nowy dowód, mandat, podatek; sprawy bliskich; rejestr dostępu do danych; przypomnienia i zlecenia; asystent (tekst i głos, rozpoznawanie w telefonie); tryb prosty; odzyskiwanie dostępu; tryb testowy.
- Dane są fikcyjne. Nie wolno używać godła, logo ani oznaczeń mObywatela; karty dokumentów są stylizowane.
- Nic nie jest wysyłane bez arkusza zgody i podpisu.
- Terminologia: „sprawa”, „przypomnienie” (tylko daje znać), „zlecenie” (robi coś za obywatela, jak zlecenie stałe w banku), „Możesz skorzystać” (propozycja, a nie roszczenie), „Bliscy”.

## Brand Commitments

- Wygląd jak natywna aplikacja iOS z charakterem mObywatela: czerwony akcent, portfel kart dokumentów (decyzja autora, 24.10.2026).
- Krój Lato, polski projekt Łukasza Dziedzica (decyzja autora, 24.10.2026).
- Język: prosty polski, bez form zależnych od płci użytkownika tam, gdzie się da; zwroty do obywatela na „Ty”.

## Evidence on Hand

- Pomiary: `tests/out/wyniki.json`, strona „Dla jury” (`app/js/wyniki.js`).
- 1 600 recenzji mObywatela i ich kodowanie: `research/`.
- Wyniki Bielika: `research/bielik/`. Przeklikanie referencji na żywo: `research/referencja-na-zywo/`.
- Brak testów z ludźmi (scenariusz gotowy w `docs/SCENARIUSZ_TESTU.md`); nie wolno ich wymyślać.

## Product Principles

1. Państwo zaczyna sprawę, obywatel ją zatwierdza: nic nie wychodzi bez podpisu.
2. Jedna sprawa życiowa to jedna lista i jeden podpis, niezależnie od liczby urzędów.
3. Przejrzystość zamiast zaufania na słowo: każdy odczyt danych jest widoczny.
4. Prosty język i duże cele dotyku dla wszystkich, tryb prosty dla seniorów.
5. Liczby tylko zmierzone; to, co już istnieje w mObywatelu, oznaczone uczciwie.

## Accessibility & Inclusion

WCAG 2.2 AA (sprawdzane axe-core na każdym ekranie, jasny i ciemny motyw), cele dotyku ≥ 44 px, tryb prosty (tekst +20%, duże wiersze), wysoki kontrast, czytanie na głos, działanie offline.
