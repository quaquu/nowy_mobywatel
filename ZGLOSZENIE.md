# Tekst do formularza zgłoszeniowego mObywatel Challenge

Gotowe do wklejenia na [mobywatel.ai/#zglos](https://mobywatel.ai/#zglos). Limity znaków sprawdza `node tests/sprawdz-zgloszenie.mjs`.

> **Przed wysłaniem:** (1) otwórz link w oknie prywatnym przeglądarki (wymóg organizatora); (2) uzupełnij swoje dane w pierwszych polach; (3) w polu „Strona www” wklej adres repozytorium: https://github.com/quaquu/nowy_mobywatel

---

**Imię i nazwisko lub nazwa zespołu \***
_(uzupełnij)_

**E-mail \***
_(uzupełnij)_

**Miejscowość**
_(uzupełnij)_

**Zgłaszam jako**
Osoba prywatna

**Tytuł koncepcji \*** <!-- pole: tytul, max 160 -->
```
Państwo, które przychodzi ze sprawą: mObywatel, w którym urodzenie dziecka to 5 spraw w 4 urzędach załatwionych jednym podpisem
```

**Opis \*** <!-- pole: opis, 30–4000 -->
```
Zmierzone, nie zadeklarowane. Te same testy na tym i na referencyjnym prototypie (kod testów w repozytorium):
• narodziny dziecka: 5 spraw w 4 instytucjach za 4 dotknięcia i 1 podpis, ok. 14 s (model KLM); w referencji 2 sprawy, 6 dotknięć, 2 podpisy, ok. 24 s;
• asystent przypisał do właściwej sprawy 90,8% z 87 zdań, których nie widział przy budowie (referencja: 31,0%); złośliwe prośby odrzucone: 5 z 5;
• 0 błędów dostępności WCAG 2.2 AA (axe; referencja: 7 rodzajów), Lighthouse dostępność 100 (referencja: 87);
• 42 ścieżki przechodzą automatycznie do końca, 52 ekrany na 4 szerokościach bez błędów, działa bez internetu.

Problem: żeby coś załatwić, trzeba samemu wiedzieć, że ma się sprawę, w którym urzędzie i jakim wnioskiem. Po narodzinach dziecka to 5 wniosków w 4 instytucjach, każdy osobno.

Pomysł: państwo samo przychodzi ze sprawą. Na tym stoją trzy rzeczy.
1. Sprawa przychodzi sama. Szpital zgłosił narodziny, więc na starcie czeka karta „Urodziła się Twoja córka” z tym, co rodzina zyska: 800 zł co miesiąc i 1 000 zł becikowego.
2. Jeden podpis za kilka urzędów. Akt urodzenia z PESEL i meldunkiem, 800+, becikowe, ubezpieczenie dziecka i urlop rodzicielski są wypełnione danymi, które państwo już ma. Drugi rodzic potwierdza imię w swoim mObywatelu. Po podpisie każdą sprawę śledzisz jak przesyłkę.
3. Widzisz, kto i po co użył Twoich danych: każdy odczyt z celem i podstawą prawną, podejrzany oznaczony.

Ten sam wzór działa w 11 sprawach życiowych (narodziny, przeprowadzka, kupno auta, zgubione dokumenty, nowy dowód, ślub, śmierć bliskiej osoby, renta wdowia, firma, emerytura, 18 lat) i dla 4 osób: Anny (33 lata, właśnie urodziła córkę), jej mamy Haliny (78 lat, tryb prosty), Jakuba (17 lat) i Katarzyny (29 lat).

Na prawdziwych danych publicznych: alarm przychodzi komunikatem z sieci komórkowej (Cell Broadcast, planowany od 2027 r.) i otwiera mObywatela z najbliższym miejscem ochronnym z rejestru PSP (dane.gov.pl), liczonym w telefonie bez internetu, z instrukcją RCB po polsku, angielsku i ukraińsku i przyciskiem „Jestem bezpieczna” dla bliskich.

Pod ręką: zastrzeżenie PESEL ze stanem na Starcie (cofnięcie na czas kredytu, potem wraca samo); pokazywanie dowodu według celu (zakupy 18+, hotel, wynajem auta: tylko potrzebne dane); „Możesz skorzystać”; Twoja emerytura (ZUS, PPK, IKE i IKZE razem, z prognozą, składkami miesiąc po miesiącu i osobami uprawnionymi); Zdrowie (recepty z kodem dla apteki, wyniki prostym językiem, bez diagnozy); BLIK; „Kto dzwoni?”; podpisy poparcia; pomoc przy logowaniu (33% ocen 1–2★ z 1600 recenzji mObywatela dotyczy logowania). Asystent, tekstem albo głosem, działa w telefonie i niczego nie wysyła sam.

Dla kogo: rodzice, osoby starsze i ich dzieci, każdy, kto nie wie, co mu przysługuje.

Uczciwie: dokumenty w telefonie, e-Doręczenia, zastrzeżenie PESEL i osobne wnioski (zgłoszenie urodzenia, zameldowanie, ePłatności) już istnieją. Łączę je w sprawy życiowe. Macierz wykonalności pokazuje, co da się wdrożyć bez zmian ustaw (33 z 62 elementów). W aplikacji ramki „O prototypie” oddzielają to, co już działa, od tego, co nowe. Strona „Dla jury”: instrukcja na 60 sekund i tryb testowy z pomiarem czasu i ankietą SUS.
```

**Link do klikalnego prototypu \*** <!-- pole: link -->
```
https://quaquu.github.io/nowy_mobywatel/
```

**Dodatkowy link** <!-- pole: link2 -->
```
https://quaquu.github.io/nowy_mobywatel/film/pokaz.mp4
```
Film 107 s z napisami, bez dźwięku, nagrany z prototypu skryptem `tests/film.mjs` (odtwarzalny). Repozytorium idzie w pole „Strona www”.

**Polskie modele i technologie** <!-- pole: technologie, max 300 -->
```
Bielik 11B (SpeakLeash), uruchomiony lokalnie: jako wsparcie reguł podniósł trafność rozpoznania spraw z 92% do 95,4% (pomiar z pierwszą wersją reguł). Rozpoznawanie działa w telefonie, bez chmury. BLIK, e-Doręczenia, rejestry państwowe. Kod MIT.
```

**Zgody:** zaznacz obie.
