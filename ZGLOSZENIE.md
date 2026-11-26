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
Po narodzinach dziecka państwo oczekuje od rodziców pięciu wniosków w czterech instytucjach: zgłoszenia urodzenia, 800+, becikowego, ubezpieczenia dziecka i urlopu rodzicielskiego. Każdy trzeba znaleźć, wypełnić i wysłać osobno, i to w tygodniach, w których głowa jest zajęta czymś zupełnie innym. A prawie wszystkie potrzebne dane państwo już ma. To jest problem, który rozwiązuję: żeby coś załatwić, trzeba samemu wiedzieć, że ma się sprawę, w którym urzędzie i jakim wnioskiem.

W moim mObywatelu jest odwrotnie: sprawa przychodzi do człowieka. Szpital zgłasza narodziny, a Anna widzi na starcie kartę „Urodziła się Twoja córka” i od razu to, co rodzina dostanie. Wpisuje imię córki, sprawdza, co i dokąd zostanie wysłane, i podpisuje raz. Cztery dotknięcia i jeden podpis zamiast pięciu wniosków. Potem śledzi każdą sprawę jak paczkę, a Piotr potwierdza imię w swoim telefonie. Nic nie wychodzi w ciemno ani bez podpisu, a każdy odczyt jej danych przez urząd widać razem z celem i podstawą prawną.

Ten sam wzór działa w jedenastu sytuacjach z życia: przy przeprowadzce, zgubionym portfelu, ślubie, 18. urodzinach, śmierci bliskiej osoby. Zrobiłem go dla ludzi w ważnych momentach, którzy nie mają czasu uczyć się procedur, i dla starszych rodziców oraz ich dzieci, które dziś załatwiają wszystko za nich. W prototypie można przejść cztery takie życia, od 17-letniego Jakuba po 78-letnią Halinę w prostym trybie, której córka pomaga z upoważnienia.

Sprawdziłem to tymi samymi testami na swoim i na referencyjnym prototypie. Referencja załatwia po narodzinach 2 sprawy dwoma podpisami, mój prototyp 5 spraw jednym. Jej asystent rozumie 3 na 10 zdań pisanych własnymi słowami, mój 9 na 10. Nie zaczynam od zera: dokumenty w telefonie i pojedyncze wnioski już działają w mObywatelu, a ja łączę je w jeden pakiet. Najszybciej zobaczycie to na stronie „Dla jury”: przejście zajmuje minutę.
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
