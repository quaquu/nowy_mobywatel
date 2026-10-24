# Scenariusz testu z użytkownikami (5–8 osób)

Cel: sprawdzić **na ludziach**, a nie tylko automatami, czy prototyp jest zrozumiały, zwłaszcza dla osób 65+. Wynik jest liczbowy: odsetek wykonanych zadań, czas i wynik SUS.

## Kogo zaprosić

| Grupa | Liczba | Dlaczego |
|---|---:|---|
| 18–34 lata, korzysta z mObywatela | 1–2 | punkt odniesienia |
| 35–64 lata, rodzic | 2 | historia flagowa „Narodziny dziecka” |
| 65+ | 2 | tryb prosty, sprawy bliskich |
| osoba, dla której polski nie jest pierwszym językiem (np. z Ukrainy) | 1 | prosty język |
| osoba korzystająca z czytnika ekranu lub z niedowidzeniem | 0–1 | dostępność w praktyce |

5 osób wykrywa większość poważnych problemów z użytecznością (Nielsen, 2000). 8 osób daje stabilniejszy wynik SUS.

## Przygotowanie (5 minut)

1. Telefon testera albo telefon prowadzącego. Link: adres z GitHub Pages, zakończony `#/test`.
2. Okno prywatne przeglądarki, żeby nie było danych z poprzedniego testu.
3. Prowadzący ma kartkę z tym scenariuszem. **Nie podpowiada.** Na pytanie „co mam teraz zrobić?” odpowiada: „A jak Pan/Pani myśli?”.
4. Za zgodą testera: nagrywanie ekranu i głosu (metoda „myśl na głos”). Bez zgody: tylko notatki.

## Przebieg (15–20 minut)

1. **Zgoda i wprowadzenie (2 min).** „Testujemy aplikację, nie Pana/Panią. Nie ma złych odpowiedzi. Proszę mówić na głos, co Pan/Pani myśli.”
2. **Ekran „Tryb testowy”.** Tester wpisuje kod (np. T03, bez imienia), wybiera wiek i to, czy korzysta z mObywatela.
3. **5 zadań.** Treść każdego zadania widać na czarnym pasku na górze ekranu. Aplikacja sama mierzy czas, kliknięcia i to, czy cel został osiągnięty. Przycisk „Nie wiem, jak to zrobić” kończy zadanie jako niewykonane.
   - T1. Urodziła się Twoja córka. Daj jej na imię Zofia i załatw wszystkie sprawy urzędowe z tym związane.
   - T2. Dostałaś mandat z fotoradaru. Prowadziłaś Ty. Zapłać go (kod BLIK: 123456).
   - T3. Sprawdź, czy policja sprawdzała ostatnio Twoje dane, i dowiedz się, w jakim celu.
   - T4. Przeprowadzasz się na ul. Piotrkowską 210 w Łodzi. Zamelduj się pod nowym adresem.
   - T5. Wyobraź sobie, że nie możesz się zalogować, bo wygasł certyfikat mDowodu. Odzyskaj dostęp.
4. **Ankieta SUS (2 min).** 10 pytań w aplikacji, skala 1–5.
5. **Rozmowa (3 min).**
   - Co było najtrudniejsze?
   - Czy wiedział(a) Pan/Pani, co zostanie wysłane, zanim Pan/Pani podpisał(a)?
   - Czy chciał(a)by Pan/Pani, żeby państwo samo proponowało takie sprawy? Dlaczego?
   - **Zrozumienie nazw (przed pokazaniem ekranu):** „W aplikacji jest pozycja »Przypomnienia i zlecenia«. Co Pana/Pani zdaniem tam znajdę? Czym różni się przypomnienie od zlecenia?” Zapisz odpowiedź dosłownie. Zaliczamy, gdy tester sam powie, że zlecenie coś robi (np. płaci), a przypomnienie tylko daje znać. To samo pytanie zadaj o „Należy Ci się”.
6. **Eksport.** Na ekranie wyników: „Pobierz wyniki (JSON)” albo „Skopiuj wyniki”. Plik `test-T03-RRRR-MM-DD.json` trafia do folderu `research/testy/` w repozytorium.

## Jak policzyć wyniki

```bash
node research/podsumuj_testy.mjs research/testy/*.json
```

Skrypt liczy dla każdego zadania odsetek sukcesu z 95% przedziałem ufności (metoda Wilsona), medianę czasu, medianę kliknięć, a także średni SUS z przedziałem ufności, osobno dla grupy 65+.

## Progi sukcesu (ustalone przed testem)

| Miara | Próg |
|---|---|
| Wykonane zadania (wszyscy) | ≥ 80% |
| T1 „Narodziny dziecka”: mediana czasu | < 60 s |
| SUS (średnia) | ≥ 80 („dobry” do „doskonałego”) |
| SUS w grupie 65+ | ≥ 70 |
| Odpowiedź „tak” na pytanie o wiedzę, co zostanie wysłane | ≥ 4 z 5 osób |
| Poprawne wyjaśnienie różnicy „przypomnienie” / „zlecenie” | ≥ 4 z 5 osób |

## Etyka i dane

- Kod testera zamiast imienia i nazwiska. Wiek tylko w przedziałach.
- Aplikacja nic nie wysyła do internetu. Wyniki zostają w przeglądarce, dopóki tester ich nie pobierze.
- Nagrania (jeśli są) usuwamy po spisaniu notatek.
