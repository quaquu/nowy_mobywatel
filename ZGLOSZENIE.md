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
Kiedy rodzi się dziecko, rodzice myślą o wszystkim, tylko nie o urzędach. A właśnie wtedy czeka ich pięć wniosków w czterech instytucjach: zgłoszenie urodzenia, 800+, becikowe, ubezpieczenie dziecka i urlop rodzicielski. Każdy osobno, choć prawie wszystkie dane państwo już ma.

Mój mObywatel odwraca ten porządek: to nie człowiek szuka sprawy, tylko sprawa przychodzi do niego. Szpital zgłasza narodziny, a Anna widzi na ekranie kartę „Urodziła się Twoja córka” i to, co rodzina dostanie. Wpisuje imię, sprawdza, co i dokąd zostanie wysłane, i podpisuje raz. Potem śledzi każdą sprawę jak paczkę.

Ten sam pomysł działa w 11 sytuacjach z życia, m.in. przy przeprowadzce, zgubionym portfelu, ślubie i śmierci bliskiej osoby. Prototyp można przejść jako jedna z czterech osób, w tym 78-letnia Halina w prostym trybie, której córka pomaga z upoważnienia.

Dla kogo? Dla ludzi w ważnych momentach życia, którzy nie mają czasu uczyć się procedur, i dla starszych rodziców oraz ich dzieci.

Najważniejsze dla mnie:
Jeden podpis, ale nigdy w ciemno: przed podpisem widać, co, dokąd i z jakimi danymi idzie.
Zaufanie: każdy odczyt Twoich danych widać razem z celem i podstawą prawną.
Jedno miejsce na to, co dziś jest rozrzucone: emerytura z ZUS, PPK, IKE i IKZE, recepty i wyniki badań prostym językiem, najbliższe schronienie przy alarmie, także bez internetu.

Sprawdziłem to tymi samymi testami na swoim i na referencyjnym prototypie. Po narodzinach dziecka: 5 spraw za 4 dotknięcia i jeden podpis (w referencji 2 sprawy i 2 podpisy). Asystent rozumie 9 na 10 zdań pisanych własnymi słowami (referencja: 3 na 10). Automatyczny test dostępności nie znajduje żadnego błędu.

Nie zaczynam od zera: dokumenty w telefonie, e-Doręczenia i pojedyncze wnioski już działają w mObywatelu. Moja zmiana polega na tym, że państwo samo zaczyna sprawę i zbiera te usługi w jeden pakiet. Najszybciej zobaczycie to na stronie „Dla jury”: przejście zajmuje minutę.
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
