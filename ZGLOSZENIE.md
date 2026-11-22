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
Problem: żeby coś załatwić, obywatel musi sam wiedzieć, że ma sprawę, w którym urzędzie i jakim wnioskiem. Po narodzinach dziecka to 5 wniosków w 4 instytucjach, każdy osobno.

Prototyp referencyjny pokazał, że z państwem można rozmawiać, zamiast szukać usługi w menu. Idę krok dalej: państwo samo przychodzi ze sprawą. Na tym stoją trzy rzeczy.

1. Sprawa przychodzi sama. Szpital zgłosił narodziny, więc na starcie czeka karta „Urodziła się Twoja córka”, a w niej to, co rodzina zyska: 800 zł co miesiąc i 1 000 zł becikowego.

2. Jeden podpis za kilka urzędów. Zgłoszenie urodzenia (akt, PESEL, meldunek), 800+, becikowe, ubezpieczenie dziecka i urlop rodzicielski są już wypełnione danymi, które państwo ma. Arkusz zgody pokazuje, co, dokąd i z jakimi danymi wyślemy. Po podpisie każdą sprawę śledzisz jak przesyłkę.

3. Widzisz, kto i po co użył Twoich danych. Każdy odczyt z rejestru ma cel i podstawę prawną, a podejrzany jest oznaczony.

Ten sam wzór działa w 11 sprawach życiowych: narodziny, przeprowadzka, kupno auta, utrata dokumentów, nowy dowód, ślub, śmierć bliskiej osoby, renta wdowia, firma, emerytura, 18 lat. Do wyboru są 4 osoby, jak w referencji: Anna (33 lata, właśnie urodziła córkę), jej mama Halina (78 lat, tryb prosty), Jakub (17 lat) i Katarzyna (29 lat, planuje ślub).

Pod ręką, bez szukania w menu: alarm, który przychodzi komunikatem z sieci komórkowej (Cell Broadcast, planowany od 2027 r.) i otwiera mObywatela z najbliższym miejscem ochronnym z rejestru PSP, liczonym w telefonie bez internetu, z instrukcją po polsku, angielsku i ukraińsku oraz „Jestem bezpieczna” dla bliskich; pokazywanie dowodu tylko w potrzebnym zakresie (wybierasz cel: zakupy 18+, hotel, wynajem auta, a aplikacja zaznacza tylko potrzebne dane); zastrzeżenie PESEL na Starcie (cofnięcie na czas kredytu i automatyczny powrót), „Możesz skorzystać” (świadczenia wykryte z rejestrów), Twoja emerytura (ZUS, PPK, IKE i IKZE razem, z prognozą), płatności BLIK, „Kto dzwoni?” przeciw oszustom, podpisy poparcia bez papieru i pomoc przy logowaniu (33% ocen 1–2★ z 1600 recenzji mObywatela dotyczy logowania). Asystent, tekstem albo głosem, działa w telefonie bez internetu i niczego nie wysyła sam.

Dla kogo: rodzice, osoby starsze i ich dzieci, każdy, kto nie wie, co mu przysługuje.

Pomiary, nie opinie (te same narzędzia na obu prototypach, kod testów w repozytorium):
• narodziny dziecka: 4 dotknięcia i 1 podpis za 5 spraw, ok. 14 s (model KLM); w referencji 6 dotknięć i 2 podpisy za 2 sprawy, ok. 24 s;
• asystent przypisał do właściwej sprawy 90,8% z 87 zdań, których nie widział przy budowie (referencja: 31,0%); złośliwe prośby odrzucone: 5 z 5;
• dostępność: 0 błędów WCAG 2.2 AA w teście axe (referencja: 7 rodzajów), Lighthouse 100 (referencja: 87);
• 40 ścieżek przechodzi automatycznie do końca, 51 ekranów na 4 szerokościach bez błędów; działa offline.

Uczciwie: dokumenty w telefonie, e-Doręczenia, zastrzeżenie PESEL i historia pojazdu już istnieją, a w mObywatelu w przeglądarce także zgłoszenie urodzenia, zameldowanie i ePłatności, każde osobno. Łączę je w sprawy życiowe. Macierz wykonalności pokazuje, co da się wdrożyć bez zmian ustaw (29 z 50 elementów), a co ich wymaga. W aplikacji ramki „O prototypie” oddzielają to, co już działa, od tego, co nowe. Na stronie „Dla jury” jest instrukcja na 60 sekund i tryb testowy z pomiarem czasu i ankietą SUS.
```

**Link do klikalnego prototypu \*** <!-- pole: link -->
```
https://quaquu.github.io/nowy_mobywatel/
```

**Dodatkowy link** <!-- pole: link2 -->
```
https://quaquu.github.io/nowy_mobywatel/film/pokaz.mp4
```
Film 102 s z napisami, bez dźwięku, nagrany z prototypu skryptem `tests/film.mjs` (odtwarzalny). Repozytorium idzie w pole „Strona www”.

**Polskie modele i technologie** <!-- pole: technologie, max 300 -->
```
Bielik 11B (SpeakLeash), uruchomiony lokalnie: jako wsparcie reguł podniósł trafność rozpoznania spraw z 92% do 95,4% (pomiar z pierwszą wersją reguł). Rozpoznawanie działa w telefonie, bez chmury. BLIK, e-Doręczenia, rejestry państwowe. Kod MIT.
```

**Zgody:** zaznacz obie.
