# „Kto dzwoni?” i podpisy poparcia: stan prawny (25.10.2026)

Rozpoznanie przed dodaniem dwóch funkcji zaproponowanych przez autora zgłoszenia. Fakty z tekstów ustaw i komunikatów urzędów; opinie i zapowiedzi oznaczone wprost.

## 1. Telefony od oszustów podszywających się pod bank lub urząd

**Co już jest (z tekstu ustawy):** ustawa z 28 lipca 2023 r. o zwalczaniu nadużyć w komunikacji elektronicznej, tekst jednolity [Dz.U. 2024 poz. 1803](https://eli.gov.pl/eli/DU/2024/1803/ogl) (wersja Kancelarii Sejmu z 8.10.2026):

- **Art. 3 pkt 3**: definicja CLI spoofingu (nieuprawnione posłużenie się cudzym numerem jako numerem wywołującym).
- **Art. 16**: operator „blokuje połączenie głosowe albo ukrywa identyfikację numeru wywołującego”.
- **Art. 17**: Prezes UKE prowadzi **jawny wykaz numerów służących wyłącznie do odbierania połączeń głosowych** i publikuje go w BIP. Wpis na wniosek banku, oddziału instytucji kredytowej, SKOK, firmy inwestycyjnej, funduszu i TFI, instytucji płatniczej, zakładu ubezpieczeń i reasekuracji, **jednostki sektora finansów publicznych**; także infolinii operatorów.
- **Wykaz nadpisów podmiotów publicznych** (CSIRT NASK): nazwy nadawców SMS zastrzeżone dla instytucji publicznych.
- CERT Polska przyjmuje zgłoszenia: [incydent.cert.pl](https://incydent.cert.pl/), podejrzane SMS-y na numer 8080.

**Czego nie ma:** nie znaleźliśmy usługi, w której obywatel sprawdza w mObywatelu numer, który właśnie dzwonił. Nie ma też publicznego rejestru numerów, z których instytucje *dzwonią*. Wykaz z art. 17 obejmuje tylko numery, z których *nikt nie dzwoni*. mObywatel jest już używany na infoliniach w kierunku odwrotnym: bank potwierdza tożsamość klienta ([pilotaż Alior Banku, cashless.pl](https://www.cashless.pl/17845-alior-mobywatel-infolinia)).

**Wnioski dla prototypu (ekran „Kto dzwoni?”):**

1. Numer z wykazu UKE „tylko do odbierania”, który dzwoni, to pewne podszycie się. Mocny, prosty komunikat.
2. Numer instytucji z (proponowanego) rejestru numerów wychodzących to dobra wskazówka, ale numer da się podrobić. Pewność daje dopiero **potwierdzenie rozmowy w aplikacji**, wysłane przez urzędnika z systemu instytucji.
3. Numer spoza rejestrów: aplikacja **nie ujawnia właściciela prywatnego numeru** (asystent nadal odmawia ustalania danych osób prywatnych).
4. Zawsze ta sama lista „nikt nie poprosi o kod BLIK, hasło, przelew na bezpieczne konto, instalację aplikacji do zdalnej pomocy”.

## 2. Elektroniczne podpisy poparcia

| Procedura | Dziś | Źródło |
|---|---|---|
| Kandydaci i listy w wyborach do Sejmu, Senatu, Parlamentu Europejskiego, na prezydenta | **Portal poparcia** w ustawie: nowelizacja Kodeksu wyborczego z 23.01.2026, Dz.U. 2026 poz. 178 (ogłoszona 17.02.2026), wchodzi w życie po 12 miesiącach. Poparcie po zalogowaniu, podpisem zaufanym, osobistym albo kwalifikowanym. Wyborca może bezpłatnie sprawdzić, kiedy i komu udzielił poparcia; portal sprawdza też podpisy z papierowych list. Papier zostaje jako alternatywa. | [PKW](https://pkw.gov.pl/aktualnosci/informacje/udzielanie-poparcia-w-formie-elektronicznej-zmiany-w-kodeksie-wyborczym), [prawo.pl](https://www.prawo.pl/samorzad/portal-poparcia-w-wyborach-kiedy-ruszy-i-jakie-dane-bedzie-przetwarzal,536050.html) |
| Wybory samorządowe | Portal poparcia **nie obejmuje** rad i wójtów (burmistrzów, prezydentów miast). | PKW, jw. |
| Obywatelska inicjatywa ustawodawcza | Papier: 100 000 podpisów w 3 miesiące (ustawa z 24.06.1999). Poselski projekt z 1.04.2026 (RPW/11430/2026, wnioskodawczyni Paulina Matysiak, posłowie kilku klubów) rozszerza Portal poparcia na projekty ustaw; 1 000 podpisów na utworzenie komitetu nadal na papierze. **Stanu prac w Sejmie nie zweryfikowaliśmy.** | [Interia](https://wydarzenia.interia.pl/kraj/news-obywatelskie-podpisy-ida-do-sieci-projekt-zgromadzil-sojusz,nId,23329728) |
| Referendum ogólnokrajowe (wniosek obywateli), referendum lokalne | Papierowe listy podpisów. | ustawy o referendum ogólnokrajowym i lokalnym |

**Głosy w debacie (opinie, nie fakty prawne):** Instytut Spraw Obywatelskich apelował o weto do nowelizacji (druk 556), bo e-podpisy dostają partie, a nie obywatele; podaje 72% poparcia dla e-podpisów pod projektami ustaw (badanie na zlecenie ISO) i 64% w badaniu IBRiS z 11.2023 ([ISO](https://instytutsprawobywatelskich.pl/cyfrowe-podpisy-dla-partii-papier-dla-obywateli-apel-do-prezydenta-nawrockiego-czas-na-weto/)). Kolejni RPO (Lipowicz, Bodnar, Wiącek) postulowali e-podpisy pod inicjatywami obywatelskimi (wg ISO).

**Wnioski dla prototypu (ekran „Podpisy i poparcie”):**

1. Każda zbiórka ma uczciwy status: „w prawie od lutego 2027” (kandydaci) albo „wymaga zmiany ustawy” (projekty ustaw, referenda).
2. Poparcie ujawnia poglądy polityczne (dane szczególnej kategorii, art. 9 RODO), więc **komitet widzi tylko licznik**, a dane osoby tylko organ sprawdzający; odczyt trafia do rejestru „Kto sprawdzał moje dane”.
3. „Moje poparcia” pokazują także wpisy z papierowych list. To odpowiedź na problem „martwych dusz” na listach poparcia, zapisany już w nowelizacji.

## Czego nie zweryfikowano

- Liczby numerów w wykazie UKE (art. 17) i jego formatu w BIP: nie udało się go pobrać.
- Daty uruchomienia Portalu poparcia innej niż wynikająca z ustawy (12 miesięcy od 17.02.2026).
- Stanu prac nad projektem RPW/11430/2026.
- Wszystkie numery, komitety, inicjatywy i kandydaci w prototypie są fikcyjni.
