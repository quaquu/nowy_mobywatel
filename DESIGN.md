---
name: mObywatel (prototyp) – państwo, które przychodzi ze sprawą
description: Natywny wygląd iOS z charakterem mObywatela; krój Lato, czerwony akcent, listy grupowane i portfel kart dokumentów.
colors:
  tlo: "#f2f2f7"
  powierzchnia: "#ffffff"
  wypelnienie: "rgb(118 118 128 / .12)"
  tekst: "#111216"
  tekst-drugorzedny: "#5c5c63"
  tekst-trzeciorzedny: "#6c6c72"
  separator: "#dcdce1"
  akcent: "#c8102e"
  akcent-tekst: "#ffffff"
  akcent-wypelnienie: "#fbe6ea"
  akcent-mocny: "#a00d25"
  sukces: "#1d7a3a"
  ostrzezenie: "#8f5300"
  blad: "#b3261e"
  przelacznik-wlaczony: "#2f9e4d"
  ciemny-tlo: "#000000"
  ciemny-powierzchnia: "#1c1c1e"
  ciemny-tekst: "#ffffff"
  ciemny-akcent: "#ff6f82"
  dok-dowod: "#1c4fb0"
  dok-prawo-jazdy: "#861a33"
  dok-pojazdy: "#a8400f"
  dok-bliscy: "#186a32"
typography:
  tytul-duzy:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  tytul-sekcji:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  naglowek:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.3
  tresc:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.45
  objasnienie:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.35
  przypis:
    fontFamily: "Lato, -apple-system, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  pole: "10px"
  grupa: "12px"
  przycisk: "12px"
  arkusz: "14px"
  karta-dokumentu: "16px"
  kapsula: "999px"
spacing:
  o1: "4px"
  o2: "8px"
  o3: "12px"
  o4: "16px"
  o5: "20px"
  o6: "24px"
  o8: "32px"
components:
  przycisk-glowny:
    backgroundColor: "{colors.akcent}"
    textColor: "{colors.akcent-tekst}"
    typography: "{typography.naglowek}"
    rounded: "{rounded.przycisk}"
    height: "50px"
    padding: "12px 20px"
  przycisk-glowny-hover:
    backgroundColor: "{colors.akcent-mocny}"
  przycisk-drugi:
    backgroundColor: "{colors.akcent-wypelnienie}"
    textColor: "{colors.akcent}"
    rounded: "{rounded.przycisk}"
    height: "50px"
  lista-grupowana:
    backgroundColor: "{colors.powierzchnia}"
    rounded: "{rounded.grupa}"
  wiersz-listy:
    typography: "{typography.tresc}"
    height: "56px"
    padding: "10px 16px"
  pole-tekstowe:
    backgroundColor: "{colors.wypelnienie}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.pole}"
    height: "48px"
  plakietka:
    typography: "{typography.przypis}"
    rounded: "{rounded.kapsula}"
    padding: "3px 9px"
  karta-dokumentu:
    textColor: "#ffffff"
    rounded: "{rounded.karta-dokumentu}"
    padding: "16px 18px"
  arkusz-zgody:
    backgroundColor: "{colors.powierzchnia}"
    rounded: "{rounded.arkusz}"
---

# DESIGN.md

Źródło prawdy dla wyglądu prototypu. Tokeny w nagłówku odpowiadają zmiennym w `app/css/app.css` (`--tlo`, `--pow`, `--gl`…). Zasady sprawdza detektor Impeccable w `npm test` (próg: 0 zgłoszeń).

## Overview

Tryb „Operate”: obywatel przychodzi coś załatwić, więc aplikacja ma wyglądać jak dobrze zrobiona, natywna aplikacja z iPhone'a, którą umie obsłużyć bez zastanowienia. Charakter dają tylko cztery rzeczy:

1. **krój Lato** (polski projekt Łukasza Dziedzica);
2. **paleta**: czerwony akcent na neutralnych, systemowych tłach;
3. **gęstość**: listy grupowane jak w Ustawieniach iOS;
4. **jeden wyróżnik**: portfel kart dokumentów na starcie, stos kart z wystającymi paskami nazw.

Wszystko inne to standardowe wzorce: duże tytuły, pasek kart u dołu, arkusz (sheet) do zgody, systemowe przełączniki.

## Colors

- **Tła**: `tlo` (systemowe szare tło list grupowanych) i `powierzchnia` (biel komórek). W trybie ciemnym czerń i `#1c1c1e`.
- **Akcent `#c8102e`** tylko dla działań (przycisk główny, linki, aktywna zakładka, ikony w wierszach) i zaznaczenia. Nie do dekoracji. Kontrast z bielą 5,9:1, z tłem 5,3:1.
- **Stany** mają własne kolory: sukces (zielony), ostrzeżenie (bursztyn), błąd. Plakietki używają wypełnień 10–16% tych kolorów.
- **Karty dokumentów** to jedyne gradienty: jednokierunkowe, w barwie dokumentu (dowód niebieski, prawo jazdy bordo, pojazdy pomarańcz, bliscy zieleń), z jednym miękkim refleksem. Bez fioletu, turkusu i powtarzalnych pasków.
- **Przełączniki** włączone na zielono, jak w iOS.

## Typography

Jedna rodzina (Lato 400 i 700), skala ról jak w iOS: tytuł duży 34 px, tytuł sekcji 20 px, nagłówek 17 px pogrubiony, treść 17 px, objaśnienie 15 px, przypis 13 px, pasek kart 11 px. Kroje przycięte do znaków polskich (ok. 44 KB), wczytywane wcześnie (`preload`), `font-display: swap`. Kwoty, daty i liczniki: cyfry tabelaryczne. Nagłówki z `text-wrap: balance`, akapity z `text-wrap: pretty`. Tryb prosty i „Większy tekst” skalują całość o 20%.

## Layout

Kolumna o szerokości telefonu (maks. 480 px), marginesy boczne 16 px, odstępy z siatki 4/8/12/16/20/24/32 px. Więcej miejsca nad nagłówkiem sekcji niż pod nim. Pasek nawigacji u góry (lepki, z rozmyciem), pasek kart u dołu (5 sekcji). Na komputerze: symulacja iPhone'a 390×844 obok panelu opisu albo pełny ekran.

## Elevation & Depth

Głębia tylko tam, gdzie ma znaczenie: karty dokumentów (cień z przesunięciem i rozmyciem, neutralny) i arkusz zgody. Listy i komórki są płaskie, bez cieni; hierarchię robią tła, odstępy i separatory 1 px. Żadnych kolorowych poświat.

## Shapes

Komórki i grupy: 12 px; pola: 10 px; przyciski: 12 px, małe przyciski i plakietki: kapsuła; arkusz: 14 px u góry; karty dokumentów: 16 px; zdjęcie na dokumencie: 3 px (jak na plastikowym dowodzie).

## Components

- **Lista grupowana**: biała grupa z zaokrągleniem 12 px, wiersze ≥ 56 px, ikona w kolorze akcentu bez tła, tytuł pogrubiony, opis w kolorze drugorzędnym, strzałka w kolorze trzeciorzędnym; separator wcięty do tekstu.
- **Sprawa, która przyszła sama**: jedna biała komórka nad portfelem: ikona, tytuł, opis i kapsuła „Załatw”. Bez etykiety nad tytułem i bez paska z boku.
- **Arkusz zgody**: zawsze ta sama struktura (co, dokąd, jakie dane, co można cofnąć); przyciski „Wróć” i „Podpisz” przyklejone do dołu.
- **Przyciski**: główny (wypełniony akcentem), drugi (pełne jasne wypełnienie akcentem), tekstowy (sam akcent, bez podkreślenia; podkreślenie po najechaniu).
- **Pola**: wypełnione tłem systemowym, bez ramki; fokus 3 px w kolorze akcentu.
- **Oś czasu po wysłaniu**: kropki sukcesu połączone linią 1 px, w jednej grupie.
- **Tryb prosty**: duże wiersze (76 px, tekst 20 px) zamiast kafli.

## Do's and Don'ts

- **Rób**: standardowe kontrolki i wzorce iOS; jeden akcent dla działań; płaskie grupy z separatorami; prawdziwe treści i stany (pusty, błąd, ładowanie, sukces).
- **Nie rób**: etykiet nad nagłówkami („PRZYSZŁA DO CIEBIE”), kolorowych pasków z boku kart, kart w kartach, fioletowych i turkusowych gradientów, kolorowych poświat, powtarzalnych pasków jako ozdoby, znaków Unicode zamiast ikon, godła i oznaczeń urzędowych.
- **Wyjątek zapisany w `.impeccable/config.json`**: krój Lato (świadoma decyzja autora; detektor uznaje go za popularny).
