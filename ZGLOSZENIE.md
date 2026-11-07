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
Problem: obywatel musi sam wiedzieć, że ma coś do załatwienia, w którym urzędzie i jakim wnioskiem. Prototyp Janusza Cieszyńskiego zastępuje menu rozmową, ale czeka, aż zapytasz, i prowadzi jedną sprawę naraz. Po narodzinach dziecka załatwia w nim 2 sprawy z 2 podpisami.

Moja wersja odwraca kierunek. Państwo przychodzi ze sprawą: szpital zgłosił narodziny, więc na starcie czeka karta „Urodziła się Twoja córka”. Jedno dotknięcie pokazuje 5 spraw w 4 instytucjach, wypełnionych danymi, które państwo już ma: zgłoszenie urodzenia (akt, PESEL, meldunek), 800+, becikowe, ubezpieczenie dziecka i urlop rodzicielski. Arkusz zgody pokazuje, co, dokąd i z jakimi danymi wyślemy. Jeden podpis. Zmierzone: 4 dotknięcia i ok. 14 s (model KLM) wobec 6 dotknięć i 24 s za 2 sprawy w referencji.

Co jeszcze da się przejść do końca:
• 10 spraw życiowych: narodziny, przeprowadzka, kupno auta (historia z ostrzeżeniem o cofniętym liczniku), utrata dokumentów, nowy dowód (wniosek gotowy, wizyta po odciski palców), ślub, śmierć bliskiej osoby (zasiłek pogrzebowy liczony z rachunków, renta wdowia dla mamy z jej upoważnienia), firma (CEIDG z ZUS, podatkiem i VAT), emerytura (luka w składkach wykryta z danych US i ZUS), 18 lat (profil kandydata na kierowcę).
• Mandat i podatek z BLIK, badanie techniczne ze stacjami na mapie i rezerwacją terminu.
• „Możesz skorzystać”: świadczenia i ulgi wykryte z rejestrów.
• Przypomnienia i zlecenia: zlecenie (jak zlecenie stałe w banku) np. opłaci ratę podatku, zawsze z uprzedzeniem.
• „Kto sprawdzał moje dane”: każdy odczyt z celem i podstawą prawną.
• Sprawy bliskich: córka zamawia wizytę urzędnika u 78-letniej mamy, która widzi, co dzieje się w jej imieniu.
• „Nie możesz się zalogować?”: 33% ocen 1–2★ z 1600 recenzji mObywatela dotyczy logowania.
• „Kto dzwoni?”: sprawdzenie numeru przed rozmową; konsultant mObywatela oddzwania z numeru, który da się tu sprawdzić.
• Skaner QR: w sklepie przekazuje samą pełnoletność, ostrzega przed fałszywymi kodami z parkometrów.
• Podpisy poparcia bez papieru: projekty ustaw, referenda, kandydaci.
• Tryb prosty dla seniorów, większy tekst, wysoki kontrast, czytanie na głos, tryb ciemny.
• Asystent (tekst i głos) rozpoznaje sprawę w telefonie, bez internetu, i prowadzi do tego samego arkusza zgody. Nie wysyła niczego sam, podaje źródło z gov.pl, odrzuca złośliwe prośby.

Dla kogo: rodzice, osoby starsze i ich dzieci, każdy, kto nie wie, co mu przysługuje.

Pomiary, a nie opinie (te same narzędzia na obu prototypach, kod testów w repozytorium):
• rozpoznanie sprawy, odłożony zbiór testowy 87 zdań: 90,8% vs 31,0% w referencji; nowe sprawy, osobny zbiór 37 zdań: 91,9%;
• złośliwe prośby odrzucone: 5/5;
• axe (WCAG 2.2 AA): 0 naruszeń vs 7 reguł w referencji;
• Lighthouse na telefonie: wydajność 97, dostępność 100 (referencja: 82 i 87);
• 31 ścieżek przechodzi automatycznie do końca; 44 ekrany × 4 szerokości bez błędów i ślepych zaułków; działa offline.

Uczciwie: dokumenty w telefonie, e-Doręczenia, zastrzeżenie PESEL i historia pojazdu już istnieją, a w mObywatelu w przeglądarce także zgłoszenie urodzenia, zameldowanie i ePłatności, każde osobno wśród 44 usług. Łączę je w sprawy życiowe. Macierz wykonalności prawnej pokazuje, co da się wdrożyć bez zmian ustaw (29 z 50 elementów), a co ich wymaga. Na stronie „Dla jury” jest instrukcja na 60 sekund i tryb testowy z pomiarem czasu i ankietą SUS.
```

**Link do klikalnego prototypu \*** <!-- pole: link -->
```
https://quaquu.github.io/nowy_mobywatel/
```

**Dodatkowy link** <!-- pole: link2 -->
```
https://github.com/quaquu/nowy_mobywatel
```

**Polskie modele i technologie** <!-- pole: technologie, max 300 -->
```
Bielik 11B (SpeakLeash), uruchomiony lokalnie: jako wsparcie reguł podniósł trafność rozpoznania spraw z 92% do 95,4% (pomiar z pierwszą wersją reguł). Rozpoznawanie działa w telefonie, bez chmury. BLIK, e-Doręczenia, rejestry państwowe. Kod MIT.
```

**Zgody:** zaznacz obie.
