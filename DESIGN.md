---
name: mObywatel (prototyp) – państwo, które przychodzi ze sprawą
description: Natywny wygląd iOS według Apple Human Interface Guidelines z charakterem mObywatela; niebieski akcent, czerwień marki, krój systemowy (Lato poza Apple), listy grupowane z kafelkami kategorii, pływający pasek kart i portfel kart dokumentów.
colors:
  tlo: "#f2f2f7"
  powierzchnia: "#ffffff"
  wypelnienie: "rgb(118 118 128 / .12)"
  tekst: "#111216"
  tekst-drugorzedny: "#5c5c63"
  tekst-trzeciorzedny: "#6c6c72"
  separator: "#dcdce1"
  akcent: "#0a63d8"
  akcent-tekst: "#ffffff"
  akcent-wypelnienie: "#e6effb"
  akcent-mocny: "#0850b0"
  akcent-wysoki-kontrast: "#0047a8"
  marka: "#c8102e"
  sukces: "#1d7a3a"
  ostrzezenie: "#8f5300"
  blad: "#b3261e"
  przelacznik-wlaczony: "#2f9e4d"
  ciemny-tlo: "#000000"
  ciemny-powierzchnia: "#1c1c1e"
  ciemny-tekst: "#ffffff"
  ciemny-akcent: "#3d9bff"
  szklo-krawedz: "rgb(255 255 255 / .75)"
  kafel-pieniadze: "#248a3d"
  kafel-pojazdy: "#c93400"
  kafel-rodzina: "#d30f45"
  kafel-terminy: "#3634a3"
  kafel-dane: "#8944ab"
  kafel-telefon: "#007d76"
  kafel-pomoc: "#6c6c70"
  dok-dowod: "#1c4fb0"
  dok-prawo-jazdy: "#861a33"
  dok-pojazdy: "#a8400f"
  dok-bliscy: "#186a32"
typography:
  tytul-duzy:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  tytul-sekcji:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
  naglowek:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
  tresc:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.45
  objasnienie:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.35
  przypis:
    fontFamily: "-apple-system, BlinkMacSystemFont, Lato, Segoe UI, Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  pole: "10px"
  grupa: "12px"
  przycisk: "999px"
  arkusz: "32px"
  kafel: "8px"
  pasek-kart: "34px"
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
  kafel-kategorii:
    textColor: "#ffffff"
    rounded: "{rounded.kafel}"
    size: "30px"
  pasek-kart:
    backgroundColor: "color-mix(in srgb, {colors.powierzchnia} 84%, transparent)"
    rounded: "{rounded.pasek-kart}"
    height: "62px"
---

# DESIGN.md

Źródło prawdy dla wyglądu prototypu. Tokeny w nagłówku odpowiadają zmiennym w `app/css/app.css` (`--tlo`, `--pow`, `--gl`…). Zasady sprawdza detektor Impeccable w `npm test` (próg: 0 zgłoszeń).

## Overview

Tryb „Operate”: obywatel przychodzi coś załatwić, więc aplikacja ma wyglądać jak dobrze zrobiona, natywna aplikacja z iPhone'a, którą umie obsłużyć bez zastanowienia. Podstawą są [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) (iOS 26, Liquid Glass). Charakter dają cztery rzeczy:

1. **paleta**: niebieski akcent dla działań, czerwień marki mObywatela tylko w logo i sprawach pilnych, kolorowe kafelki kategorii;
2. **gęstość**: listy grupowane jak w Ustawieniach iOS;
3. **jeden wyróżnik**: portfel kart dokumentów na starcie, stos kart z wystającymi paskami nazw;
4. **sprawa, która przychodzi sama**: jedna komórka nad portfelem.

Wszystko inne to standardowe wzorce: duże tytuły, pływający pasek kart, arkusz (sheet) do zgody, systemowe przełączniki.

### Decyzja z 26.10.2026 (przegląd według HIG)

Na prośbę autora wygląd przestawiono na zasady Apple. Zmiany i powody:
- **Akcent niebieski zamiast czerwonego.** HIG: „nie używaj tego samego koloru do różnych znaczeń”. Czerwień była naraz działaniem i ostrzeżeniem; teraz działanie jest niebieskie (jak linki w prawdziwym mObywatelu), czerwień to marka, plakietka nieprzeczytanych i „pilne”. Przycisk niszczący (np. zastrzeżenie) pozostaje czerwony, jak w iOS.
- **Krój systemowy.** HIG zaleca krój systemowy (SF Pro), którego nie wolno osadzać na stronie. Na iPhonie i Macu używamy go przez `-apple-system`; na innych urządzeniach dalej Lato.
- **Grubości jak w stylach tekstu iOS**: Large Title pogrubiony, nagłówki i przyciski półgrube (600), tytuł wiersza zwykły (Body). Bez cienkich odmian.
- **Liquid Glass tylko na warstwie nawigacji**: pasek kart i kapsuła przycisków w nagłówku; treść nieprzezroczysta. „Ogranicz przezroczystość” i wysoki kontrast zamieniają szkło w pełną powierzchnię.
- **Zwiększony kontrast z systemu** (`prefers-contrast: more`) działa jak przełącznik w aplikacji.

## Colors

- **Tła**: `tlo` (systemGroupedBackground) i `powierzchnia` (secondarySystemGroupedBackground). W trybie ciemnym czerń i `#1c1c1e`.
- **Akcent `#0a63d8`** (tint) tylko dla działań: przycisk główny, linki, wybrana zakładka, przyciski tekstowe. Kontrast z bielą 5,6:1. Wysoki kontrast: `#0047a8`; tryb ciemny `#3d9bff`.
- **Marka `#c8102e`**: logo, plakietka nieprzeczytanych, plakietki „pilne”. Nigdy jako kolor działania.
- **Kafelki kategorii**: biały znak na kwadracie w kolorze kategorii (pieniądze i świadczenia zielony, pojazdy pomarańczowy, rodzina różowy, terminy i podpisy indygo, dane i bezpieczeństwo fiolet, telefon morski, pomoc i ustawienia szary). Odcienie z wersji Apple „zwiększony kontrast”, żeby biały znak miał co najmniej 3:1. Kolor znaczy kategorię, nie stan.
- **Stany** mają własne kolory: sukces (zielony), ostrzeżenie (bursztyn), błąd (czerwony). Plakietki używają wypełnień 10–16% tych kolorów.
- **Karty dokumentów** to jedyne gradienty: jednokierunkowe, w barwie dokumentu, z jednym miękkim refleksem.
- **Przełączniki** włączone na zielono, jak w iOS.
- **Wygląd**: domyślnie za ustawieniem telefonu; w Ustawieniach (i w panelu obok symulacji telefonu) przełącznik segmentowy Automatycznie / Jasny / Ciemny. Wybór zapamiętany osobno od stanu pokazu i ustawiany przed pierwszym rysowaniem strony, bez mignięcia złego motywu.

## Typography

Krój systemowy na urządzeniach Apple, Lato (400 i 700, przycięte do znaków polskich, ok. 44 KB) na pozostałych. Style tekstu iOS: Large Title 34 px pogrubiony, Title 3 20 px półgruby, Headline 17 px półgruby, Body 17 px, Subheadline 15 px, Footnote 13 px (nagłówki grup list), pasek kart 10 px półgruby; minimum 11 px. Kwoty, daty i liczniki: cyfry tabelaryczne. Nagłówki z `text-wrap: balance`, akapity z `text-wrap: pretty`. Tryb prosty i „Większy tekst” skalują całość o 20%.

## Layout

Kolumna o szerokości telefonu (maks. 480 px), marginesy boczne 16 px, odstępy z siatki 4/8/12/16/20/24/32 px. Pasek nawigacji u góry (lepki, z rozmyciem; przyciski w szklanej kapsule), pływający pasek kart u dołu (5 sekcji, 12 px od krawędzi, nad wskaźnikiem ekranu domowego). Na komputerze: symulacja iPhone'a 390×844 obok panelu opisu albo pełny ekran.

## Elevation & Depth

Głębia tylko tam, gdzie ma znaczenie: karty dokumentów (cień z przesunięciem i rozmyciem, neutralny), arkusz zgody i warstwa nawigacji ze szkła (pasek kart, kapsuła w nagłówku). Listy i komórki są płaskie, bez cieni; hierarchię robią tła, odstępy i separatory 1 px. Żadnych kolorowych poświat.

## Shapes

Komórki i grupy: 12 px; pola: 10 px; przyciski, plakietki i pasek kart: kapsuła; kafelki kategorii: 8 px; arkusz: pływający, 8 px od krawędzi, rogi współśrodkowe z rogami ekranu (32 px); karty dokumentów: 16 px; zdjęcie na dokumencie: 3 px (jak na plastikowym dowodzie).

## Components

- **Lista grupowana**: biała grupa z zaokrągleniem 12 px, wiersze ≥ 56 px, kafelek kategorii 30 px, tytuł zwykłą grubością, opis w kolorze drugorzędnym, strzałka w kolorze trzeciorzędnym; separator wcięty do tekstu. Długie listy dzielone na grupy z nagłówkiem (Footnote, kolor drugorzędny), np. „Więcej”: Twoje sprawy, Bezpieczeństwo i dane, Udział w życiu publicznym, Pomoc i ustawienia, O prototypie.
- **Pasek kart**: pływająca kapsuła ze szkła; znaki i podpisy jednobarwne, wybrana zakładka w kolorze akcentu z wypełnionym znakiem na delikatnej kapsule. Plakietki tylko dla ważnych informacji.
- **Sprawa, która przyszła sama**: jedna biała komórka nad portfelem: ikona, tytuł, opis i kapsuła „Załatw”. Bez etykiety nad tytułem i bez paska z boku.
- **Karta dokumentu**: jeden pomysł, światło na materiale. Drobny gilosz jak na dowodzie; miękki refleks przechodzi powoli (2,4 s), gdy karta się pojawia i gdy najedziesz na nią kursorem; na komputerze karta lekko przechyla się za kursorem (do ok. 3,5°), a odblask i hologram idą za światłem. Bez unoszenia i bez pętli.
- **Podpis (Face ID)**: w symulacji iPhone'a rozpoznanie twarzy wyrasta z Dynamic Island (odsłanianie przez przycinanie, bez odbicia; zwija się szybciej, niż się rozwinęło); na telefonie ciemne okienko na środku ekranu.
- **Arkusz zgody**: zawsze ta sama struktura (co, dokąd, jakie dane, co można cofnąć). Na dole przyklejona jedna wyróżniona akcja: „Podpisz” na całą szerokość, pod nią „Wróć” jako przycisk tekstowy.
- **Przypięte działanie długiego formularza**: gdy przycisk na końcu formularza (np. „Przejrzyj i podpisz raz” w Narodzinach) jest poza ekranem, ta sama akcja wisi nad paskiem kart; znika, gdy właściwy przycisk jest widoczny.
- **Tytuły wierszy**: zawsze zwykła grubość (Body), także w pojedynczych kartach-linkach; pogrubione są tytuły ekranów, nagłówki i kwoty.
- **Przyciski**: kapsuły, najwyżej jeden lub dwa wyróżnione na widok; główny (wypełniony akcentem), drugi (jasne wypełnienie akcentem), niszczący (czerwony), tekstowy (sam akcent; podkreślenie po najechaniu). Obszar dotyku ≥ 44×44 px, lekkie wciśnięcie przy dotyku.
- **Pola**: wypełnione tłem systemowym, bez ramki; fokus 3 px w kolorze akcentu.
- **Oś czasu po wysłaniu**: kropki sukcesu połączone linią 1 px, w jednej grupie.
- **Tryb prosty**: duże wiersze (76 px, tekst 20 px) zamiast kafli.

## Motion

Według `animate.md` z pakietu Impeccable i zasad iOS: ruch tłumaczy stan i kierunek, nie zdobi.
- Czasy: odpowiedź 100–150 ms, zmiana stanu 150–300 ms, przejście widoku 300–500 ms (ekran 380 ms, arkusz 420 ms), wyjście szybsze niż wejście (arkusz 240 ms).
- Krzywa: wyhamowanie `cubic-bezier(.16, 1, .3, 1)`, arkusz jak w iOS `cubic-bezier(.32, .72, 0, 1)`. Bez odbić i sprężyn.
- Animujemy transformację, przezroczystość i przycinanie, nie szerokość ani wysokość; `will-change` tylko w trakcie ruchu.
- „Ogranicz ruch”: bez przesuwania i skalowania, zostają krótkie przenikania i zmiany koloru (informacja o zmianie nie znika).

## Illustrations

Własne ilustracje wektorowe (`app/js/grafiki.js`), bez zdjęć prawdziwych ludzi: zdjęcie do dowodu (przodem, neutralna mina, jasne tło), awatary bliskich w kółku 40 px, auto z boku w kolorze z rejestru (bez znaków marki), zdjęcie z fotoradaru w odcieniach szarości z paskami danych pomiaru. Płaskie kolory z jednym gradientem na bryłę, bez obrysów. Każdy rysunek ma opis dla czytnika ekranu albo jest ukryty, gdy obok jest ten sam tekst.

## Do's and Don'ts

- **Rób**: standardowe kontrolki i wzorce iOS według HIG; jeden akcent dla działań, osobny kolor marki; płaskie grupy z separatorami; prawdziwe treści i stany (pusty, błąd, ładowanie, sukces).
- **Nie rób**: etykiet nad nagłówkami („PRZYSZŁA DO CIEBIE”), kolorowych pasków z boku kart, kart w kartach, fioletowych i turkusowych gradientów, kolorowych poświat, szkła na treści, powtarzalnych pasków jako ozdoby, znaków Unicode zamiast ikon, godła i oznaczeń urzędowych.
- **Wyjątek zapisany w `.impeccable/config.json`**: krój Lato jako zapas poza urządzeniami Apple (świadoma decyzja autora; detektor uznaje go za popularny).
