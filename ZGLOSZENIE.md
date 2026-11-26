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
Kiedy rodzi się dziecko, rodzice myślą o wszystkim, tylko nie o urzędach. A właśnie wtedy państwo oczekuje od nich pięciu wniosków w czterech instytucjach: zgłoszenia urodzenia, 800+, becikowego, ubezpieczenia dziecka i urlopu rodzicielskiego. Każdy trzeba znaleźć, wypełnić i wysłać osobno, choć prawie wszystkie potrzebne dane państwo już ma.

Mój mObywatel odwraca ten porządek: to nie człowiek szuka sprawy, tylko sprawa przychodzi do niego. Szpital zgłasza narodziny, a na ekranie Anny pojawia się karta „Urodziła się Twoja córka”. Anna od razu widzi, co rodzina dostanie (800 zł co miesiąc i 1000 zł becikowego), wpisuje imię, sprawdza, co i dokąd zostanie wysłane, i podpisuje raz. Piotr potwierdza imię w swoim telefonie. Potem każdą sprawę śledzą jak paczkę: przyjęta, w toku, gotowa.

Ten sam pomysł działa w 11 sytuacjach z życia, m.in. przy przeprowadzce, kupnie auta, zgubionym portfelu, ślubie, śmierci bliskiej osoby i 18. urodzinach. Prototyp można przejść jako jedna z czterech osób: Anna (33 lata, właśnie urodziła córkę), jej mama Halina (78 lat, prosty tryb z dużymi przyciskami; córka pomaga jej z upoważnienia), Jakub (za chwilę kończy 18 lat) i Katarzyna (planuje ślub).

Dla kogo? Dla ludzi w ważnych momentach życia, którzy nie mają czasu ani siły uczyć się procedur. I dla starszych rodziców oraz ich dzieci, które dziś załatwiają wszystko za nich przez telefon.

Co jest dla mnie najważniejsze:
Jeden podpis zamiast pięciu wniosków, ale nigdy w ciemno. Przed podpisem zawsze widać, co, dokąd i z jakimi danymi idzie. Bez podpisu nic nie wychodzi, także z asystenta.
Zaufanie. Ekran „Kto sprawdzał moje dane” pokazuje każdy odczyt: kto, po co i na jakiej podstawie. Halina widzi, że ktoś próbował otworzyć konto na jej PESEL i że zastrzeżenie zadziałało.
Sprawy, które dziś są rozrzucone po różnych serwisach, w jednym miejscu: emerytura z ZUS, PPK, IKE i IKZE razem z prognozą; recepty z kodem dla apteki i wyniki badań objaśnione prostym językiem; przy alarmie najbliższe schronienie z rejestru PSP, także bez internetu.

Sprawdziłem to tymi samymi testami na swoim i na referencyjnym prototypie. Po narodzinach dziecka: 5 spraw załatwionych 4 dotknięciami i jednym podpisem (ok. 14 s); w referencji 2 sprawy i 2 podpisy (ok. 24 s). Asystent rozumie 9 na 10 zdań pisanych własnymi słowami (referencja: 3 na 10). Automatyczny test dostępności (WCAG 2.2 AA) nie znajduje żadnego błędu.

Uczciwie: dokumenty w telefonie, e-Doręczenia, zastrzeżenie PESEL i pojedyncze wnioski już istnieją. Nowe jest to, że państwo samo zaczyna sprawę i zbiera wnioski w jeden pakiet. Co da się wdrożyć bez zmiany przepisów, a co wymaga ustawy, opisuję w macierzy wykonalności w repozytorium. Na stronie „Dla jury” jest ścieżka na 60 sekund.
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
