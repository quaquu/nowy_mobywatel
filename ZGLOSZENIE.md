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
Problem. Żeby coś załatwić w państwie, trzeba samemu wiedzieć, że ma się sprawę, w którym urzędzie i jakim wnioskiem. Najgorzej wtedy, gdy głowę ma się zajętą czymś ważniejszym. Po narodzinach dziecka to pięć wniosków w czterech instytucjach (zgłoszenie urodzenia, 800+, becikowe, ubezpieczenie dziecka, urlop rodzicielski), każdy osobno, choć prawie wszystkie dane państwo już ma.

Dla kogo. Dla rodziców w pierwszych tygodniach z dzieckiem, dla osób starszych i dla ich dzieci, które załatwiają za nich wszystko przez telefon. I dla każdego, kto trafia w moment z własną procedurą: przeprowadzka, ślub, 18. urodziny, śmierć bliskiej osoby. W prototypie można przejść cztery takie życia, od 17-letniego Jakuba po 78-letnią Halinę w trybie prostym.

Co jest najważniejsze w mojej wersji. Sprawa przychodzi do człowieka, a nie odwrotnie. Szpital zgłasza narodziny, a Anna dostaje na starcie kartę „Urodziła się Twoja córka”: wpisuje imię, widzi, co i dokąd zostanie wysłane, i podpisuje raz. Pięć spraw załatwia 4 dotknięciami i jednym podpisem, a potem śledzi je jak paczkę. Nic nie wychodzi w ciemno ani bez podpisu, a każdy odczyt jej danych przez urząd widać razem z celem i podstawą prawną.

W tych samych testach prototyp referencyjny załatwia po narodzinach 2 sprawy dwoma podpisami, a jego asystent rozumie 3 na 10 zdań pisanych własnymi słowami (mój: 9 na 10). Nie zaczynam od zera: dokumenty w telefonie i pojedyncze wnioski już działają w mObywatelu, a ja łączę je w jeden pakiet. Najszybciej zobaczycie to na stronie „Dla jury”: przejście zajmuje minutę.
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
