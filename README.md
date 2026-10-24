# Państwo, które przychodzi ze sprawą

Klikalny prototyp mObywatela na [mObywatel Challenge](https://mobywatel.ai/) (zgłoszenia do 30 listopada 2026 r.).

> Niezależny prototyp. Wszystkie dane są fikcyjne. To nie jest usługa administracji publicznej ani oficjalna aplikacja mObywatel. Nie używa godła ani oznaczeń mObywatela.

**Pomysł.** Prototyp Janusza Cieszyńskiego zastępuje menu rozmową, ale czeka, aż zapytasz. Ten prototyp zaczyna sprawę sam: szpital zgłosił narodziny, więc na ekranie startowym czeka karta „Urodziła się Twoja córka”. Pod nią jest 5 spraw w 4 instytucjach, wypełnionych danymi, które państwo już ma, i **jeden podpis**.

## Zobacz

- Prototyp: `https://quaquu.github.io/nowy_mobywatel/` (po włączeniu GitHub Pages, patrz niżej)
- 60 sekund dla jury: w prototypie **Więcej → Dla jury**
- Lokalnie: `node tests/serve.mjs` i otwórz `http://127.0.0.1:8080/`

## Co jest w środku

| Obszar | Co działa |
|---|---|
| Sprawy życiowe | Narodziny dziecka (historia flagowa), przeprowadzka, kupno używanego auta, utrata dokumentów, nowy dowód; 5 kolejnych w podglądzie planu |
| Płatności | Mandat z fotoradaru i podatek od nieruchomości (BLIK), autopilot płatności za zgodą |
| Należy Ci się | Świadczenia wykryte z rejestrów, z uzasadnieniem i źródłem |
| Prywatność | „Kto sprawdzał moje dane” z celem i podstawą prawną, „Co państwo o mnie wie”, „Pokaż tylko to, co potrzebne” |
| Bliscy | Sprawy mamy na podstawie upoważnienia (wizyta urzędnika w domu) |
| Dostęp | „Nie możesz się zalogować?”: diagnoza i jeden sposób, bez pętli |
| Asystent | Tekst i głos, rozpoznawanie sprawy w telefonie (offline), odmowy dla złośliwych próśb, źródło przy każdej odpowiedzi |
| Dostępność | Tryb prosty, większy tekst, wysoki kontrast, czytanie na głos, tryb ciemny |
| Testy z ludźmi | Tryb testowy (`#/test`): 5 zadań, pomiar czasu i kliknięć, ankieta SUS, eksport JSON |

Technicznie: czysty HTML, CSS i JavaScript (moduły ES), bez budowania, bez frameworka, bez serwera i bez zewnętrznych zasobów. Service worker zapewnia działanie offline.

## Wyniki pomiarów

Odtwarzane poleceniem `npm test` (progi w `tests/run-all.mjs`). Porównanie z prototypem referencyjnym tymi samymi narzędziami:

| Miara | Ten prototyp | Referencyjny |
|---|---|---|
| Narodziny dziecka: sprawy / podpisy / dotknięcia / czas (KLM) | 5 / 1 / 4 / 12 s | 2 / 2 / 6 / 24 s |
| Rozpoznanie sprawy, odłożony zbiór testowy (n=87) | 92,0% | 31,0% |
| Złośliwe prośby odrzucone (test) | 5/5 | – |
| axe (WCAG 2.2 AA + dobre praktyki) | 0 naruszeń | 7 reguł, 26 elementów |
| Lighthouse, telefon: wydajność / dostępność | 99 / 100 | 82 / 87 |
| Czytelność FOG-PL | 6,8 | 7,1 |
| Bielik 11B v3 lokalnie, bez przykładów: sam / jako wsparcie reguł | 92,0% / 95,4% | – |
| Crawler: 37 tras × 4 szerokości (320–430 px) | 0 problemów | – |
| Offline po pierwszym otwarciu | tak | – |

Szczegóły i zastrzeżenia: [docs/ANALIZA.md](docs/ANALIZA.md). Wyniki modelu Bielik: [research/bielik/](research/bielik/), skrypt: [tests/bielik/](tests/bielik/).

**Nie zweryfikowano:** testów z prawdziwymi użytkownikami (scenariusz gotowy: [docs/SCENARIUSZ_TESTU.md](docs/SCENARIUSZ_TESTU.md)) ani działania na fizycznych telefonach (tylko emulacja w Chromium). Czytelność liczona lokalnym wzorem FOG-PL, nie w serwisie Jasnopis.

## Dokumenty

- [ZGLOSZENIE.md](ZGLOSZENIE.md): tekst do formularza konkursowego (limity znaków sprawdzone)
- [docs/ANALIZA.md](docs/ANALIZA.md): konkurs, prototyp referencyjny, 1 600 recenzji mObywatela, 7 krajów
- [docs/MACIERZ_WYKONALNOSCI.md](docs/MACIERZ_WYKONALNOSCI.md): co da się wdrożyć dziś, a co wymaga ustawy
- [docs/RED_TEAM.md](docs/RED_TEAM.md): pre-mortem i odpowiedzi na zarzuty
- [docs/DEMO_90S.md](docs/DEMO_90S.md), [docs/PREZENTACJA_SEJM.md](docs/PREZENTACJA_SEJM.md): scenariusze wystąpień
- [docs/SCENARIUSZ_TESTU.md](docs/SCENARIUSZ_TESTU.md): test z 5–8 osobami i `research/podsumuj_testy.mjs`

## Uruchomienie testów

```bash
npm ci
npm test                       # wymaga Playwright z Chromium (CHROME_PATH dla Lighthouse)
node tests/linki.mjs           # linki do źródeł (wymaga internetu)
node tests/sprawdz-zgloszenie.mjs
```

Porównanie z referencją: pobierz [mobywatel-ai.zip](https://mobywatel.ai/pobierz/mobywatel-ai.zip), uruchom `python3 serwer/server.py` (bez kluczy działa tryb skryptowy), potem:

```bash
REF_URL="http://127.0.0.1:8790/aplikacja?tryb=skrypt" REF_DIR=ścieżka/do/mobywatel-ai npm test
```

Bielik (lokalnie na CPU, ok. 1–4 s na zdanie): `pip install llama-cpp-python==0.3.9`, pobierz GGUF z [huggingface.co/speakleash](https://huggingface.co/speakleash), uruchom `python3 tests/bielik/ocen_bielika.py model.gguf`.

## Publikacja (GitHub Pages)

1. Połącz gałąź z `main`.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Workflow `Publikacja na GitHub Pages` wdroży katalog `app/`. Adres: `https://quaquu.github.io/nowy_mobywatel/`.
4. Otwórz link w oknie prywatnym (wymóg konkursu: działa bez logowania).

## Licencja

Kod: MIT. Prototyp referencyjny (J. Cieszyński, MIT) służył wyłącznie do pomiarów i nie jest częścią tego repozytorium. Router trybu skryptowego skopiowany do `tests/reference-router.mjs` w celu porównania (MIT).
