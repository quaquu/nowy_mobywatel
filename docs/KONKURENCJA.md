# Inne zgłoszenia na mObywatel Challenge (przegląd 25.11.2026)

Metoda: wyszukiwanie w publicznym API GitHuba (15 zapytań po nazwach repozytoriów i 6 po treści README), czyli 364 repozytoria, z czego 138 aktywnych od 1.10.2026. Odrzucone: generatory fałszywych dokumentów („fmObywatel”, „sObywatel”, „xObywatel”), kopie strony, projekty z HackNation 2026 (wyzwania ZUS „Przewodnik rodzica”, „Misja AED”, „Radar innowacji”). Każdy działający prototyp otwarty w przeglądarce (komputer i telefon), README przeczytane.

Ograniczenie: zgłoszenia zrobione w Figmie, Framerze albo bez publicznego repozytorium są niewidoczne. Pełnej listy zna tylko organizator.

## Zgłoszenia z działającym prototypem

| Zgłoszenie | Zakres | Mocne strony | Testy z ludźmi / pomiary |
|---|---|---|---|
| [mObywatel 2028](https://github.com/mateuszkozlowski/mobywatel-2028) (M. Kozłowski) | cała aplikacja, pisma, alerty | strona produktu, Bielik na żywo, OCR pism, dane CERT, IMGW i PSP | 10 osób, 6 zadań (wcześniejsza wersja) |
| [„Załatwione”](https://yushawnchen.github.io/mobywatel-zalatwione/) (Y. Chen) | sprawy życiowe | koncepcja najbliższa naszej: narodziny jednym wnioskiem, Anna i Halina, zgoda drugiego rodzica, film 80 s | brak |
| [„W tle”](https://yushawnchen.github.io/mobywatel-w-tle/) (Y. Chen) | ekran blokady, powiadomienia | 9 misji z podpowiedzią, Dynamic Island, PL i EN | brak |
| [mObywatel dla bliskich](https://mobywatel-dla-bliskich-prototyp.vercel.app) (fisieek) | sprawy rodziny | postacie 3D, kilka telefonów obok siebie, pokaz automatyczny 2 min, film 1 min | brak |
| [Ogarniacz](https://mobywatel-ogarniacz.pages.dev/) (kciecinski) | jedna sprawa, wiele instytucji | minimalistyczny czat, film 48 s, testy Playwright | brak |
| [Spinka](https://mollo-glitch.github.io/mobywatel/) (mollo-glitch) | asystent spraw | wyrazista strona, film, „co się stanie po każdej decyzji” | brak |
| [Sprawy po bliskim](https://sprawy-po-bliskim.vercel.app) | śmierć bliskiej osoby | dopracowana jedna ścieżka, film 75 s | brak |
| [Sprawnie](https://sprawnie-prototype.vercel.app) (mdopieralski) | ZUS i bilety miejskie | PWA offline, WCAG 2.2 AA, axe w testach | testy automatyczne |
| [mObywatel 3.0](https://tomaszkrawczyk-cmd.github.io/mobywatel-koncepcja/) (T. Krawczyk) | bardzo szeroki (v32) | 5 języków, tryb dla jury, Bielik w przeglądarce | brak |
| [Trzy koncepcje](https://mobywatel-concept.pages.dev/) (mkwkamil) | senior, auto, tożsamość | dwa ekrany obok siebie | brak |
| [Przeprowadzka bez chaosu](https://tsarumar.github.io/przeprowadzka-bez-chaosu/) | przeprowadzka | ścieżka dla cudzoziemców, PL, EN i UA | brak |
| [Pod Twoją kontrolą](https://orderglide.github.io/mobywatel-koncepcja/) (OrderGlide) | zgody, ślad sprawy | „Pokaż mi w 2 minuty” | brak |
| [Sprawdź, kto dzwoni](https://loloekk.github.io/caller-verification/?lang=pl) | weryfikacja połączeń | kod z rozmowy, PL i EN | brak |
| [mObywatel dla każdego](https://dragy001.github.io/mobywatel-dla-kazdego/) | senior i JDG (KSeF) | dwie osoby | brak |
| [Zgłoś zbycie pojazdu](https://brzana.github.io/mObywatelChallenge/) | jedna usługa | prosta ścieżka 60 s | brak |
| [e-głosowanie](https://ai-red-team-lab-pjait.github.io/e-glosowanie-prototyp/) (PJATK) | wybory | NFC, skan twarzy | brak |
| odmiany referencji: [mkljczk](https://mkljczk.github.io/mobywatel-ai/), [Piórkowski](https://wojpiorkowski.github.io/mobywatel.ai---projekt-Wojciech-Piorkowski/), anusieqq, Naturo13, wojd0, BMW0807 | dodatki do referencji | m.in. 15 języków, zmiana oznaczenia płci | brak |

Bez publicznej wersji w chwili przeglądu: molk915 (React, duży), VerySillyCatPerson, 0300PM, ItsRaelx, pikselinho-dev, mS-siad (szkic), mgmra (szkic).

## Wnioski dla tego prototypu

- Nikt poza Kozłowskim nie ma testów z ludźmi. To wciąż największa luka.
- Nikt nie ma pomiarów 1:1 z referencją (dotknięcia, trafność asystenta, axe, Lighthouse) ani 40 ścieżek sprawdzanych automatycznie.
- Dane publiczne na żywo ma tylko Kozłowski (CERT, IMGW, PSP); my mamy PSP w telefonie, bez sieci.
- Koncepcja „państwo przychodzi ze sprawą” nie jest już jedyna („Załatwione”, „W tle”), więc zgłoszenie zaczyna się od pomiarów, a nie od pomysłu.
- Wielu ma film (48–80 s) i pokaz automatyczny; kilku ma 2–5 języków.
