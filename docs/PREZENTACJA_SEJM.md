# Prezentacja w Sejmie: 5 minut

Struktura: problem → pokaz → dowody → jak to wdrożyć → prośba. Pokaz na żywo z telefonu podłączonego do rzutnika. Zapasowo: nagranie z [DEMO_90S.md](DEMO_90S.md) na pendrivie, bo prototyp działa też bez internetu.

## 0:00–0:45 Problem (bez slajdów, sam telefon w ręku)

> „Pani Anna urodziła córkę. Dziś musi sama wiedzieć, że ma 21 dni na zgłoszenie urodzenia, że 800 plus złoży w ZUS, becikowe w gminie z zaświadczeniem od lekarza, a PESEL dziecka musi zanieść pracodawcy. To pięć spraw w czterech instytucjach i kilka różnych logowań.
>
> Prototyp pana ministra Cieszyńskiego zastąpił menu rozmową. To dobry krok, ale asystent nadal czeka, aż pani Anna zapyta. A jeśli nie wie, o co pytać?”

## 0:45–2:30 Pokaz

Przebieg jak w [DEMO_90S.md](DEMO_90S.md), w wolniejszym tempie, z jednym dodatkiem:

- **Sprawy bliskich** (`Więcej → Bliscy → Mama`): „Pani Halina ma 78 lat i nie chodzi do urzędu. Córka zamawia wizytę urzędnika w domu, a mama widzi, co dzieje się w jej imieniu.”

## 2:30–3:30 Dowody, a nie obietnice

Jeden slajd albo strona „Dla jury” w prototypie (`Więcej → Dla jury`):

| | Ten prototyp | Referencyjny |
|---|---|---|
| Narodziny dziecka | 5 spraw, 1 podpis, ok. 12 s | 2 sprawy, 2 podpisy, ok. 24 s |
| Asystent rozpoznaje sprawę (87 zdań testowych) | 92% | 31% |
| Dostępność (axe, WCAG 2.2 AA) | 0 naruszeń | 7 reguł |
| Lighthouse na telefonie | 97 / 100 | 82 / 87 |

> „Te liczby można sprawdzić jednym poleceniem, bo kod i testy są publiczne. W 1 600 recenzjach obecnej aplikacji co trzecia skarga dotyczy logowania i zapętlonego potwierdzania tożsamości. Dlatego w prototypie jest ekran »Nie możesz się zalogować?«, który nie zapętla.”

## 3:30–4:30 Jak to wdrożyć

> „Nie wszystko wymaga ustaw. Macierz wykonalności pokazuje, że 17 z 30 elementów da się zrobić na obecnym prawie, przez integrację istniejących usług. Cztery wymagają zmiany ustaw. Na przykład becikowe wciąż wymaga papierowego zaświadczenia o opiece w ciąży, choć te dane są w Internetowym Koncie Pacjenta.
>
> Polski model Bielik został zmierzony na tych samych zdaniach. Najlepiej działa w duecie: reguły w telefonie rozpoznają 92% spraw i pilnują bezpieczeństwa, a Bielik pomaga przy reszcie. Razem: 95,4%. Model językowy nie decyduje o niczym. O sprawach decyduje człowiek swoim podpisem.”

## 4:30–5:00 Prośba

> „Proszę o jedno: niech pilotaż zacznie się od pakietu »Narodziny dziecka«. To jedna sprawa, cztery instytucje, a efekt zobaczy każda rodzina. Zamiast państwa, które odpowiada, gdy zapytasz, zróbmy państwo, które przychodzi ze sprawą. Dziękuję.”

## Pytania, których warto się spodziewać

| Pytanie | Krótka odpowiedź | Gdzie szczegóły |
|---|---|---|
| „To inwigilacja.” | Państwo nie zbiera nowych danych. Nic nie wychodzi bez podpisu, a każdy odczyt jest pokazany obywatelowi. | [RED_TEAM.md](RED_TEAM.md), zarzut 1 |
| „A jak AI się pomyli?” | Asystent nie wysyła niczego, tylko prowadzi do arkusza zgody. Odpowiedzi są sprawdzone, a przy każdej jest źródło. | zarzut 2 |
| „Ile to kosztuje?” | Rozpoznawanie w telefonie nic nie kosztuje. Bielik jest otwarty. Główny koszt to integracje, z których część już istnieje. Kwot nie podam bez danych COI. | zarzut 3 |
| „Przecież to już jest.” | Dokumenty, e-Doręczenia i osobne wnioski w mObywatelu w przeglądarce (np. zgłoszenie urodzenia) tak, i z nich korzystam. Nowe są pakiety z jednym podpisem, sprawy przychodzące same, sprawy bliskich i odzyskiwanie dostępu. | zarzut 4 |
| „Czy były testy z ludźmi?” | Odpowiedz zgodnie z prawdą, wynikami z [SCENARIUSZ_TESTU.md](SCENARIUSZ_TESTU.md). Jeśli testów nie było, powiedz to wprost. | |
