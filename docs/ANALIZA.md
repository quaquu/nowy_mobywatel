# Analiza: od czego zaczęliśmy i co z tego wynika

Stan na 24 października 2026 r. Wszystkie liczby oznaczone jako **zmierzone** można odtworzyć poleceniem `npm test` (szczegóły w [README](../README.md)).

## 1. Konkurs: co dokładnie trzeba oddać

Źródło: [mobywatel.ai](https://mobywatel.ai/), sekcje „Jak to działa”, „Zgłoszenie”, „Zasady i pytania”.

- **Warunek konieczny:** klikalny prototyp, przez który da się przejść. Same grafiki, szkice, opis ani film nie wystarczą.
- **Link** do Figmy, Framera, własnej strony albo aplikacji w przeglądarce. **Musi działać bez logowania** do ogłoszenia wyników.
- **Termin:** 30 listopada 2026 r., do końca dnia czasu polskiego.
- **Kryterium:** być lepszym od prototypu Janusza Cieszyńskiego, czyli „prostszym, wygodniejszym, bardziej dostępnym albo załatwiającym więcej spraw”.
- **Mile widziane:** polskie modele językowe (Bielik, PLLuM) i technologie polskich firm.
- **Nagroda:** autorzy 10 najlepszych koncepcji prezentują je w Sejmie.
- **Pola formularza:** imię i nazwisko lub nazwa zespołu, e-mail, miejscowość, „zgłaszam jako”, tytuł (do 160 znaków), opis (30–4000 znaków), link do prototypu, dodatkowy link, „polskie modele i technologie” (do 300 znaków), dwie zgody.
- **Kierunki podane przez organizatora:** cała aplikacja; jedna sprawa od początku do końca; asystent i rozmowa; seniorzy i dostępność; przypomnienia i terminy; prywatność i kontrola danych. **Nasz prototyp obejmuje wszystkie sześć.**

## 2. Poprzeczka: prototyp referencyjny

Pobraliśmy pełny kod ([mobywatel.ai/pobierz/mobywatel-ai.zip](https://mobywatel.ai/pobierz/mobywatel-ai.zip), licencja MIT), uruchomiliśmy go lokalnie w trybie skryptowym (tak jak widzi go jury w przeglądarce) i zmierzyliśmy tymi samymi narzędziami co nasz.

### Co robi dobrze (uczciwie)

- Spójny pomysł: **zamiast menu i formularzy jest rozmowa**. Każde działanie kończy się kartą potwierdzenia.
- Pełna wersja ma asystenta z wywoływaniem narzędzi, bazę wiedzy z **1 844 kart usług gov.pl**, głos (rozpoznawanie i synteza mowy) i **15 języków interfejsu**.
- 4 dopracowane osoby pokazowe (Marta, Jan, Ewa, Kacper) i dobre scenariusze: zgubiony portfel, stłuczka, kupno auta, podejrzany SMS.
- „Znak”: przekazywanie danych na komputer kodem.

W językach i bazie wiedzy referencja jest od nas bogatsza i tego nie ukrywamy.

### Słabe miejsca (zmierzone)

| Miara | Referencja | Ten prototyp | Jak mierzone |
|---|---|---|---|
| Narodziny dziecka: sprawy załatwione | 2 (USC, 800+) | 5 (USC z PESEL i meldunkiem, 800+, becikowe, ubezpieczenie, urlop rodzicielski) | `tests/klm.mjs`, Playwright |
| … podpisy | 2 | 1 | j.w. |
| … dotknięcia | 6 | 4 | j.w. |
| … przewidywany czas (KLM + zmierzony czas reakcji, z animacjami) | 24 s | 13 s | j.w. |
| Rozpoznanie sprawy z tekstu, odłożony zbiór testowy (n=87) | 31,0% | 92,0% | `tests/eval-intents.mjs` |
| … tylko intencje obsługiwane przez oba (n=50) | 40,0% | 92,0% | j.w. |
| Naruszenia axe (WCAG 2.2 AA i dobre praktyki) | 7 reguł, 26 elementów, w tym 1 krytyczne i 3 poważne | 0 | `tests/audit.mjs` |
| Lighthouse, telefon: wydajność / dostępność | 82 / 87 (LCP ok. 4,4 s) | 95–97 / 100 (LCP ok. 2,7 s) | Lighthouse 12.6.1 |
| Czytelność (FOG-PL, mniej = prościej) | 7,1 | 7,1 | `tests/audit.mjs` |

Zastrzeżenia do porównania:
- W trybie przeglądarkowym referencja rozpoznaje sprawy wyrażeniami regularnymi. Pełna wersja z dużym modelem językowym rozpoznawałaby więcej. Porównujemy jednak to, co widzi jury pod linkiem.
- Pole „sprawy załatwione” to sprawy wysłane do instytucji w historii flagowej. W referencji po wyborze 800+ znika podpowiedź Karty Dużej Rodziny, więc liczymy dwie.
- Czytelność obu prototypów jest podobna. Nie traktujemy jej jako przewagi.

### Przeklikanie strony na żywo (mobywatel.ai/aplikacja, 24.10.2026)

Wszystkie podpowiedzi z ekranów startowych czterech osób pokazowych kliknięte w przeglądarce, na stronie, którą widzi jury. Skrypty: [`research/referencja-na-zywo/`](../research/referencja-na-zywo/).

| Sprawdzenie | Wynik |
|---|---|
| Podpowiedzi na ekranie startowym kończące się „Tego w tej wersji jeszcze nie załatwię” | **6 z 20** (Jan: 3 z 5, Ewa: 2 z 5, Kacper: 1 z 5, Marta: 0 z 5) |
| Te same zdania wpisane w pole rozmowy | 6 z 8 nierozpoznane |
| Zgodność strony na żywo z routerem z pobranego kodu (21 zdań ze zbioru testowego) | 21/21, więc wynik 31% opisuje stronę na żywo |

Niedziałające podpowiedzi: „Co chce ode mnie Urząd Skarbowy?”, „Chcę na chwilę odblokować PESEL”, „Jedziemy z dziećmi do Egiptu” (Jan), „Ile będę miała emerytury?”, „Jakie recepty ma moja mama?” (Ewa), „Chcę głosować w Gdańsku” (Kacper). W pełnej wersji z modelem językowym prawdopodobnie działają; w wersji przeglądarkowej to ślepe zaułki. Drobna rzecz: po takim zaułku Jan dostaje podpowiedź w formie żeńskiej („Zgubiłam portfel”).

Dla porównania w tym prototypie crawler przechodzi 43 ekrany i nie znajduje ani jednego ślepego zaułka.

### Wnioski z przeklikania

1. **Reaktywność.** Asystent czeka, aż obywatel sam zapyta. Kto nie wie, że należy mu się becikowe, nie zapyta o nie.
2. **Jedna sprawa naraz.** Narodziny to w praktyce 5–6 spraw w 4 instytucjach, a rozmowa prowadzi je sekwencyjnie i z osobnymi podpisami.
3. **Wszystko przez czat.** Trudno zobaczyć całość: co mam do zrobienia, z czego mogę skorzystać, kto czytał moje dane.
4. **Brak odpowiedzi na najczęstszą skargę** (logowanie, patrz niżej).

### Błędy silnika na odłożonym zbiorze testowym (7 z 87)

Silnik zamrożono przed pierwszym uruchomieniem na zbiorze testowym. Błędów poniżej celowo nie poprawiamy, bo to zawyżyłoby wynik. Kolejna wersja wymaga nowego, niezależnego zbioru testowego.

| Zdanie | Powinno być | Silnik |
|---|---|---|
| zmieniłem adres, kogo muszę powiadomić | przeprowadzka | nie rozpoznał |
| ile podatku zapłacę od kupna auta | kupno auta | płatności |
| chce kupic auto od sasiada | kupno auta | **odmowa** (słowo „sąsiad” uruchomiło ochronę cudzych danych) |
| co jest w mojej skrzynce | skrzynka | nie rozpoznał |
| recepty mojej mamy | bliscy | nie rozpoznał |
| mdowod wygasl co robic | logowanie | nowy dowód |
| podejrzany link do dopłaty za paczkę | oszustwo | świadczenia |

Fałszywa odmowa jest najpoważniejsza: reguły bezpieczeństwa oparte na pojedynczym słowie są zbyt szerokie. W wersji wdrożeniowej odmowa „cudze dane” powinna wymagać połączenia słowa o osobie z prośbą o dane (PESEL, adres).

### Polski model językowy: Bielik (SpeakLeash)

Ten sam zbiór 204 zdań oceniliśmy modelami Bielik v3 uruchomionymi lokalnie na CPU (llama.cpp, 4 rdzenie), bez przykładów w poleceniu (zero-shot). Skrypt: [`tests/bielik/ocen_bielika.py`](../tests/bielik/ocen_bielika.py), wyniki zdanie po zdaniu: [`research/bielik/`](../research/bielik/). „Hybryda” oznacza: najpierw silnik reguł z aplikacji, a gdy nie rozpoznaje sprawy albo jest niepewny, Bielik.

| Na odłożonym zbiorze testowym (n=87) | Sam Bielik | Reguły | Hybryda | Złośliwe odrzucone przez Bielika | Mediana czasu / zdanie |
|---|---:|---:|---:|---:|---:|
| Bielik 11B v3.0 Instruct (Q4_K_M) | 92,0% | 92,0% | **95,4%** | 3/5 | 2,8 s |
| Bielik 4.5B v3.0 Instruct (Q8_0) | 54,0% | 92,0% | 93,1% | 1/5 | 1,0 s |

Wnioski:
1. Bielik 11B bez żadnego dostrajania rozpoznaje sprawy tak samo dobrze jak reguły, a razem z nimi lepiej niż każde z osobna.
2. **Bezpieczeństwa nie wolno oddawać modelowi.** Bielik 11B przepuścił 2 z 5 złośliwych próśb. W architekturze prototypu odmowy rozstrzygają reguły, zanim zapytanie trafi do modelu, a model nigdy nie wysyła wniosków.
3. Mały model (4.5B) nadaje się na telefon tylko jako wsparcie reguł, nie samodzielnie.

## 3. Co boli użytkowników obecnego mObywatela

Pobraliśmy 1 600 najnowszych recenzji: 1 500 z Google Play i 100 z App Store, z okresu od 5 sierpnia do 23 października 2026 r. Skargi (1–2★, n=301) zakodowaliśmy słownikiem rdzeni słów w kategorie. Recenzja może należeć do kilku kategorii. Kod: [`research/koduj_recenzje.py`](../research/koduj_recenzje.py), dane: [`research/`](../research/).

| Kategoria | Skargi 1–2★ | Udział |
|---|---:|---:|
| Awarie, błędy, aplikacja się nie uruchamia | 79 | 26% |
| Logowanie, hasło, biometria, PIN | 65 | 22% |
| Potwierdzenie tożsamości / „pętla” certyfikatu mDowodu | 56 | 19% |
| **Dostęp do aplikacji łącznie (dwie powyższe bez dublowania)** | **98** | **33%** |
| Dokumenty znikają / nie da się dodać | 20 | 7% |
| Trudna obsługa, „nic nie można znaleźć” | 16 | 5% |
| Nieaktualne lub błędne dane (OC, pojazdy) | 14 | 5% |
| Powiadomienia (brak albo nadmiar) | 13 | 4% |
| Prywatność, obawa przed wyciekiem | 12 | 4% |
| Seniorzy, wykluczenie | 5 | 2% |

Typowe cytaty: „wpadłam w tzw. pętlę aktywacji. kręcę się w kółko próbując aktywować certyfikat”; „Nie dostałem powiadomienia o tym że moje prawo jazdy straciło ważność”; „mam 80 lat (…) jestem bezradny a do tego mam ograniczenie ruchu by chodzić po urzędach”.

Ograniczenia: kodowanie słownikowe (bez drugiego, niezależnego kodera), 111 skarg bez kategorii (głównie bardzo krótkie: „nie działa”), próba z ostatnich 11 tygodni.

**Co z tego wzięliśmy do prototypu:**
- ekran „Nie możesz się zalogować?”: diagnoza, jeden sposób, powrót w to samo miejsce, bez pętli;
- źródło i data aktualizacji przy każdej danej oraz przycisk „zgłoś błąd w danych”;
- przypomnienia o końcu ważności dokumentów;
- tryb prosty i sprawy bliskich (wizyta urzędnika w domu);
- rejestr dostępu do danych.

## 4. Rozwiązania zagraniczne

| Kraj, usługa | Co robi | Dowód skuteczności | Co bierzemy |
|---|---|---|---|
| **Estonia**: usługi proaktywne, eesti.ee | Usługi według zdarzeń życiowych; państwo zaczyna sprawę samo. Rejestr „kto czytał moje dane” (Andmejälgija). | 478 tys. wizyt w usługach proaktywnych w 2025 r. ([RIA](https://www.ria.ee/en/state-information-system/personal-services/proactive-government-services)); [OECD OPSI](https://oecd-opsi.org/innovations/life-event-based-services-in-estonia/) | sprawy przychodzące same, rejestr dostępu |
| **Singapur**: LifeSG (dawniej Moments of Life) | Rejestracja urodzenia i becikowe (Baby Bonus) w jednym pakiecie z kilku agencji. | Czas z 60 do 15 minut ([GovTech](https://www.tech.gov.sg/media/technews/moments-of-life-is-now-lifesg-story-so-far/)) | pakiet „Narodziny dziecka” |
| **Korea Płd.**: Gov24, Benefit Notifier | Lista świadczeń, które Ci przysługują, na podstawie danych z rejestrów. | Odpowiedź na problem świadczeń niepobranych z niewiedzy ([Asia Economy, 2026](https://view.asiae.co.kr/en/article/2026052915393345298)) | „Możesz skorzystać” |
| **Abu Zabi**: TAMM AutoGov | Sprawy powtarzalne (odnowienia, płatności) załatwiają się same za zgodą. | Gartner Eye on Innovation 2026, EMEA ([Abu Dhabi Media Office](https://www.mediaoffice.abudhabi/en/technology/tamm-autogov-named-emea-winner-at-2026-gartner-eye-on-innovation-awards/)) | autopilot ze zgodą i powiadomieniem przed działaniem |
| **Ukraina**: Diia.AI | Agent AI, który wykonuje usługi (meldunek, mandaty), od 2026 r. w aplikacji i głosem. | [Ministerstwo Transformacji Cyfrowej](https://ai.thedigital.gov.ua/en/news/Diia.AI%20on%20mobile:%20event-driven%20traffic%20fine%20payments%20and%20instant%20residency%20certificates%20via%20the%20national%20AI%20agent), [głos](https://ai.thedigital.gov.ua/en/news/Just%20say%20your%20request:%20How%20the%20new%20voice%20feature%20in%20Diia.AI%20works%20on%20the%20Diia%20Portal) | asystent, który prowadzi do działania, a nie tylko odpowiada |
| **Włochy**: app IO | Jedna skrzynka od urzędów z płatnościami pagoPA i portfelem dokumentów. | 15 tys. instytucji, 456 mln wiadomości ([IDB](https://knowledge.iadb.org/en/open-knowledge/code-development/open-source-solution/ioitaliait)) | skrzynka z płatnościami, pismo z przyciskiem „załatw” |
| **Wielka Brytania**: GOV.UK app | Aplikacja z czatem AI (GOV.UK Chat) i portfelem. | [TechCrunch](https://techcrunch.com/2025/01/21/uk-plans-digital-wallet-for-drivers-licenses-and-other-id-plus-a-chatbot-powered-by-openai), [TechRadar](https://www.techradar.com/phones/the-new-gov-uk-app-wants-to-make-it-easier-to-organize-your-life-here-are-5-things-you-need-to-know) | ostrożność: czat jako dodatek, źródło przy każdej odpowiedzi |
| **Dania**: Digital Post | Pisma od urzędów w aplikacji, z kalendarzem. | [Digitaliseringsstyrelsen](https://en.digst.dk/systems/digital-post-app/) | skrzynka |

Wspólny wzór najlepszych: **państwo zaczyna sprawę samo, łączy sprawy wielu urzędów i prosi o zgodę raz**. AI jest dodatkiem, nie fundamentem.

## 5. Co już jest w mObywatelu (żeby nie „wymyślać” istniejącego)

Na podstawie kart usług gov.pl (kopia w pakiecie referencyjnym), opisu portalu „mObywatel w przeglądarce” ([gov.pl, 25.10.2026](https://www.gov.pl/web/mobywatel/mobywatel-w-przegladarce1); pełna lista usług: [research/mobywatel-w-przegladarce.md](../research/mobywatel-w-przegladarce.md)) i publikacji z 2026 r. ([android.com.pl](https://android.com.pl/tech/1028140-kpo-mobywatel-plany-2026-rok-nowosci/), [antyweb.pl](https://antyweb.pl/mobywatel-funkcje-uslugi)):

| Funkcja | Status dziś | W prototypie |
|---|---|---|
| Dokumenty w telefonie (mDowód, mPrawo jazdy, pojazdy) | istnieje | pokazane jako „jak dziś” + źródło i data danych |
| Historia pojazdu, punkty karne | istnieje | użyte w kupnie auta i mandacie |
| Zastrzeżenie PESEL, zawieszenie dowodu | istnieje | użyte w „Utracie dokumentów” |
| mStłuczka | istnieje | asystent odsyła do istniejącej usługi |
| e-Doręczenia | istnieje (od 2026 główny kanał) | skrzynka + wersja prostym językiem |
| Informacja o odbiorcach danych z rejestru PESEL i RDO | istnieje (na wniosek, plik) | **rozwinięta** w bieżący rejestr ze wszystkich rejestrów |
| Zgłoszenie urodzenia, zameldowanie i wymeldowanie, wniosek o dowód, zawiadomienie o zbyciu lub nabyciu pojazdu | istnieje w mObywatelu w przeglądarce, każda usługa jako osobny wniosek (44 usługi na liście) | **nowe:** pakiet kilku spraw jednej sytuacji życiowej z jednym podpisem, zaczęty przez państwo |
| „Twoje sprawy” ze statusem i urzędem | istnieje w przeglądarce | oś czasu po wysłaniu pakietu |
| ePłatności (opłaty urzędowe, BLIK, karta, historia, potwierdzenia) | istnieje w przeglądarce | **nowe:** zlecenie stałe płatności za zgodą |
| Historia weryfikacji numeru PESEL przez firmy i instytucje | istnieje w przeglądarce | **rozwinięta** w rejestr wszystkich odczytów z celem i podstawą prawną |
| Wybrane sprawy za dziecko lub inną osobę (utrata i zawieszenie dowodu, kradzież tożsamości, dowód dla dziecka) | istnieje w przeglądarce, jako osobne formularze | **rozwinięte:** sprawy bliskich w jednym miejscu, z widokiem dla osoby, w której imieniu działasz |
| Kalendarz (dni wolne, niedziele handlowe) | istnieje; przypomnienie o końcu ważności dowodu i paszportu zapowiedziane „w przyszłości” | przypomnienia o terminach już działają w prototypie |
| Blokowanie połączeń z podszytym numerem, wykaz UKE numerów tylko do odbierania, SMS 8080 do CERT | istnieje u operatorów i w CERT, poza mObywatelem | **nowe:** „Kto dzwoni?”: sprawdzenie numeru w aplikacji i potwierdzenie rozmowy przez instytucję |
| Kody QR: potwierdzanie danych, logowanie, pełnoletność w kasie samoobsługowej | istnieje | **rozwinięte:** wpis w „Kto sprawdzał moje dane”, „To nie ja” przy logowaniu, ostrzeżenie przed obcymi kodami |
| Poparcie kandydatów przez internet (Portal poparcia) | w ustawie, od lutego 2027; projekty ustaw i referenda tylko na papierze | **nowe:** jedno miejsce na wszystkie zbiórki, komitet widzi tylko licznik, „Moje poparcia” |
| „Możesz skorzystać”, zlecenia stałe, tryb prosty, odzyskiwanie dostępu | brak | **nowe** |

Najważniejsza różnica: dziś portal ma osobne usługi z kilku urzędów na jednej liście („Załatw sprawę online”), a obywatel sam musi wiedzieć, których potrzebuje. Narodziny dziecka to tam co najmniej 2 osobne miejsca (zgłoszenie urodzenia w mObywatelu, 800+ w ZUS lub banku) i dodatkowe wnioski w innych systemach. Prototyp łączy je w jedną sprawę.

## 6. Wniosek: koncepcja

**„Państwo, które przychodzi ze sprawą.”** Prototyp referencyjny to państwo, które odpowiada, gdy zapytasz. Nasz:

1. **zauważa zdarzenie** (szpital zgłosił narodziny, kończy się dowód, przyszedł mandat);
2. **łączy sprawy z wielu urzędów** w jedną listę wypełnioną danymi, które państwo już ma;
3. **pokazuje, co wyśle, dokąd i z jakimi danymi**, i prosi o **jeden podpis**;
4. **pokazuje potem, kto użył danych i po co**.

Asystent (tekst i głos) jest jednym z wejść, działa także bez internetu, a docelowo rozmowę wspiera Bielik. Wykonalność prawna każdego elementu jest w [MACIERZ_WYKONALNOSCI.md](MACIERZ_WYKONALNOSCI.md), a odpowiedzi na zarzuty w [RED_TEAM.md](RED_TEAM.md).
