# Macierz wykonalności prawnej

Dla każdej automatyzacji z prototypu: czy da się ją wdrożyć dziś, co trzeba połączyć i jakie przepisy zmienić.

- 🟢 **Dziś**: usługa istnieje online, a prawo jej nie blokuje. Potrzebne jest tylko wbudowanie w aplikację.
- 🟡 **Integracja**: prawo pozwala, ale trzeba połączyć systemy, wydać rozporządzenie albo oprzeć się na zgodzie obywatela.
- 🔴 **Ustawa**: wymaga zmiany ustawy.

To analiza autora prototypu, a nie opinia prawna. Pozycje 🔴 i 🟡 należy przed wdrożeniem skonsultować z prawnikami Ministerstwa Cyfryzacji i właścicielami rejestrów.

## Narodziny dziecka (historia flagowa)

| Element | Status | Podstawa / uwagi |
|---|:---:|---|
| Zgłoszenie urodzenia online (akt, PESEL i zameldowanie w jednym) | 🟢 | Prawo o aktach stanu cywilnego. USC przy rejestracji nadaje PESEL i melduje dziecko ([gov.pl](https://www.gov.pl/web/gov/zglos-urodzenie-dziecka)). Usługa jest już w mObywatelu w przeglądarce ([lista usług](../research/mobywatel-w-przegladarce.md)). |
| Powiadomienie rodzica, że szpital przekazał kartę urodzenia | 🟡 | Karta urodzenia trafia do USC elektronicznie. Potrzebne zdarzenie z systemu rejestrów stanu cywilnego do powiadomień w mObywatelu (podstawa: zadania ministra cyfryzacji wobec aplikacji). |
| Jeden podpis pod kilkoma wnioskami | 🟡 | Każdy wniosek pozostaje osobnym dokumentem podpisanym przez obywatela (art. 63 KPA). Jeden gest może podpisać paczkę dokumentów, tak jak w podpisie zbiorczym. Wymaga zmian technicznych po stronie podpisu w mObywatelu. |
| Wniosek 800+ wypełniony danymi z rejestru PESEL | 🟢 | ZUS przyjmuje wnioski elektronicznie (PUE/eZUS, mZUS, banki, Emp@tia) i uzupełnia dane z rejestrów. Potrzebny kanał z mObywatela do ZUS. |
| Becikowe: wniosek elektroniczny | 🟢 | Emp@tia ([gov.pl](https://www.gov.pl/web/gov/uzyskaj-becikowe)). |
| Becikowe: dochód sprawdzony automatycznie w KAS | 🟡 | Organy świadczeń rodzinnych pozyskują dane o dochodach elektronicznie. Pokazanie wyniku obywatelowi przed złożeniem wniosku wymaga jego zgody. |
| Becikowe: zaświadczenie o opiece medycznej w ciąży pobrane z Internetowego Konta Pacjenta | 🔴 | Ustawa o świadczeniach rodzinnych wymaga zaświadczenia lekarskiego lub od położnej. Trzeba dopuścić potwierdzenie z systemu P1. |
| Przekazanie PESEL dziecka pracodawcy (zgłoszenie do ubezpieczenia) | 🟡 | Dziś robi to obywatel. Potrzebny kanał mObywatel → płatnik (np. przez PUE ZUS). Wariant 🔴: ZUS zgłasza dziecko z urzędu na podstawie rejestru PESEL. |
| Wniosek o urlop rodzicielski do pracodawcy | 🟡 | Kodeks pracy dopuszcza formę elektroniczną wniosku. Potrzebny kanał do pracodawcy (e-Doręczenia firm). |
| Ulga na dziecko w PIT dopisana automatycznie | 🟢 | Twój e-PIT już wstępnie wypełnia zeznania. Dopisanie ulgi na podstawie rejestru PESEL to zmiana po stronie KAS. |
| Przypomnienie o programie „Aktywny rodzic” | 🟢 | Samo przypomnienie nie wymaga zmian prawa. |

## Pozostałe sprawy

| Element | Status | Podstawa / uwagi |
|---|:---:|---|
| Zameldowanie online z potwierdzeniem właściciela w jego aplikacji | 🟢 / 🟡 | Zameldowanie przez internet istnieje ([gov.pl](https://www.gov.pl/web/gov/zamelduj-sie-na-pobyt-staly-lub-czasowy-dluzszy-niz-3-miesiace)). Potwierdzenie przez właściciela w jego mObywatelu wymaga nowej funkcji (🟡). |
| Nowy adres automatycznie w US, ZUS, NFZ | 🔴 / 🟡 | Dziś osoba fizyczna aktualizuje adres m.in. w US osobno (ZAP-3). Wariant 🟡: za zgodą obywatela mObywatel wysyła aktualizacje. Wariant 🔴: rejestry pobierają adres z PESEL z urzędu. |
| Deklaracja opłaty za śmieci wypełniona i wysłana do nowej gminy | 🟢 / 🟡 | Wiele gmin przyjmuje ją przez ePUAP. Brak jednolitego wzoru w kraju (🟡). |
| Kupno auta: historia pojazdu | 🟢 | Istnieje w mObywatelu. |
| Kupno auta: umowa podpisana przez obie strony w aplikacji | 🟡 | Podpis istnieje. Brakuje wzoru umowy i wymiany dokumentu między dwiema osobami. |
| Kupno auta: PCC-3 i płatność | 🟢 | e-Urząd Skarbowy. |
| Kupno auta: rejestracja online | 🟢 | Istnieje ([gov.pl](https://www.gov.pl/web/gov/zarejestruj-pojazd)). |
| Utrata dokumentów: zawieszenie dowodu, zastrzeżenie PESEL | 🟢 | Istnieje. W prototypie jest jeden przycisk dla wszystkiego. |
| Nowy dowód: wniosek wypełniony w aplikacji, rezerwacja wizyty | 🟡 | Od 2021 r. dorosły składa wniosek osobiście, bo urząd pobiera odciski palców; przez internet tylko dla dzieci do 12 lat. Wypełnienie wniosku danymi z rejestru i rezerwacja wizyty w gminie wymagają integracji z systemami rezerwacji urzędów (🟡). |
| Ślub: zapewnienia, rezerwacja terminu, nazwisko, przypomnienia o dokumentach | 🟢 / 🟡 | Zapewnienia podpisuje się osobiście w USC; opłata za akt małżeństwa 84 zł. Zmiana nazwiska w PESEL następuje z urzędu po sporządzeniu aktu (🟢). Wstępna rezerwacja terminu przez aplikację i potwierdzenie przez drugą osobę wymagają integracji z USC (🟡). |
| Śmierć bliskiej osoby: zasiłek pogrzebowy, renta wdowia, lista do poświadczenia dziedziczenia | 🟢 / 🟡 | Zasiłek pogrzebowy (7 000 zł po zgonach od 2026 r.) i wniosek ERWD o rentę wdowią składa się elektronicznie przez eZUS (🟢). Wysłanie ich z mObywatela, w tym wniosku za mamę z upoważnienia w ZUS, wymaga integracji z ZUS (🟡). |
| Zakładanie firmy: CEIDG-1 z ZUS, podatkiem i VAT-R | 🟢 | Wniosek CEIDG-1 online (od 1.11.2026 r. tylko online) obejmuje zgłoszenie do ZUS i wybór opodatkowania; VAT-R można dołączyć. Usługa „Firma” jest już w mObywatelu. |
| Emerytura: brakujące okresy składek z porównania danych US i ZUS | 🟡 / 🔴 | Zastrzeżenie do informacji o stanie konta składa się dziś w eZUS (🟢). Wykrycie luki przez porównanie przychodów z urzędu skarbowego z kontem w ZUS wymaga podstawy prawnej do łączenia tych danych (🔴) albo zgody obywatela (🟡). |
| 18. urodziny: wpis do rejestru wyborców, profil kandydata na kierowcę | 🟢 / 🟡 | Wpis do Centralnego Rejestru Wyborców następuje z urzędu (🟢). Wniosek o profil kandydata na kierowcę składa się dziś elektronicznie przez ePUAP albo w starostwie; z mObywatela wymaga integracji (🟡). |
| Wizyta urzędnika u osoby chorej lub niepełnosprawnej, zamówiona przez pełnomocnika | 🟢 / 🟡 | Przyjęcie wniosku w miejscu pobytu przewiduje ustawa o dowodach osobistych. Zamawianie przez aplikację to 🟡. |
| Badanie techniczne: termin z CEPiK, stacje kontroli na mapie, rezerwacja terminu | 🟢 / 🟡 | Termin ważności badania jest już w mObywatelu („Mój pojazd”), a wynik stacja wpisuje do centralnej ewidencji pojazdów. Wykaz stacji prowadzą starostowie, osobno w każdym powiecie; wspólny wykaz z położeniem to 🟡. Rezerwacja terminu wymaga integracji z prywatnymi stacjami, dobrowolnej dla stacji (🟡). W prototypie stacje i terminy są fikcyjne. |
| Mandat z fotoradaru: przyjęcie i płatność w aplikacji | 🟡 | Płatność online istnieje. Przyjęcie mandatu i wskazanie kierowcy w aplikacji wymaga zmian w procesie CANARD/GITD. |
| Zlecenie stałe płatności podatku od nieruchomości | 🟡 | Zapłata przez obywatela na jego zlecenie (polecenie zapłaty). Potrzebna zgoda i powiadomienie przed płatnością (zapisane w prototypie). |
| „Możesz skorzystać”: świadczenia na podstawie danych z rejestrów | 🟡 / 🔴 | Profilowanie pod kątem świadczeń wymaga podstawy prawnej (RODO, art. 6 ust. 1 lit. e i art. 22). Wariant 🟡: dobrowolne włączenie przez obywatela. Wariant 🔴: obowiązek informowania o świadczeniach w ustawie. |
| Bieżący rejestr dostępu do danych ze wszystkich rejestrów | 🟢 / 🟡 | Dla PESEL i RDO informacja o odbiorcach danych już istnieje ([gov.pl](https://www.gov.pl/web/gov/pobierz-informacje-o-odbiorcach-danych-z-rejestru-pesel-i-rejestru-dowodow-osobistych)). Rozszerzenie na CEPiK, KAS, ZUS i NFZ to 🟡 (logi istnieją; potrzebne udostępnienie). Wyjątki: służby, gdy jawność szkodzi postępowaniu (🔴, osobne przepisy). |
| Sprawy bliskich na podstawie pełnomocnictwa | 🟡 | Upoważnienia w IKP istnieją. Ogólne pełnomocnictwo do spraw w mObywatelu wymaga wspólnego rejestru pełnomocnictw. |
| Pismo w wersji prostym językiem | 🟢 | Streszczenie jako dodatek do decyzji nie wymaga zmiany KPA. Wersję przygotowuje i podpisuje urząd, a nie AI. |
| Odzyskiwanie dostępu bez pętli (diagnoza, powrót w to samo miejsce) | 🟢 | Zmiana wyłącznie techniczna. |
| Dokumenty „tylko do wglądu” przez 30 dni po wygaśnięciu certyfikatu | 🔴 / 🟡 | Ważność mDowodu określają przepisy o aplikacji mObywatel. Wymaga zmiany rozporządzenia lub ustawy. |
| Asystent: rozpoznawanie sprawy w telefonie, Bielik w chmurze rządowej | 🟢 | AI Act, art. 50: obowiązek informowania, że to AI (jest w interfejsie). Asystent nie decyduje o świadczeniach, tylko kieruje do wniosku, więc nie jest systemem wysokiego ryzyka z załącznika III pkt 5 lit. a. Decyzje zostają u urzędników. |

## Bezpieczeństwo, skaner kodów i udział obywatela

Źródła i szczegóły: [research/telefony-i-podpisy.md](../research/telefony-i-podpisy.md).

| Element | Status | Podstawa / uwagi |
|---|:---:|---|
| „Kto dzwoni?”: sprawdzenie numeru w wykazie UKE numerów tylko do odbierania | 🟢 | Wykaz jest jawny i publikowany w BIP UKE (art. 17 ustawy o zwalczaniu nadużyć w komunikacji elektronicznej, [Dz.U. 2024 poz. 1803](https://eli.gov.pl/eli/DU/2024/1803/ogl)). Wpisują się banki, instytucje finansowe i jednostki sektora finansów publicznych. Operatorzy blokują połączenia z podszytym numerem albo ukrywają numer (art. 16). Wystarczy pobierać wykaz do aplikacji. |
| Rejestr numerów, z których dzwonią instytucje publiczne | 🟡 / 🔴 | Wzór: wykaz nadpisów SMS podmiotów publicznych prowadzony przez CSIRT NASK (ta sama ustawa). Dobrowolne zgłaszanie numerów przez instytucje to 🟡; obowiązek dla wszystkich wymaga zmiany ustawy. |
| Potwierdzenie rozmowy w mObywatelu (instytucja potwierdza, że to ona dzwoni) | 🟡 | Dziś działa kierunek odwrotny: bank potwierdza tożsamość klienta na infolinii przez mObywatela ([pilotaż Alior Banku](https://www.cashless.pl/17845-alior-mobywatel-infolinia)). Instytucje musiałyby podłączyć swoje systemy; banki na podstawie umowy. |
| Zgłoszenie numeru do CERT Polska z aplikacji | 🟢 | CERT Polska przyjmuje zgłoszenia ([incydent.cert.pl](https://incydent.cert.pl/), SMS 8080). |
| Poparcie kandydatów i list w wyborach do Sejmu, Senatu, PE i na prezydenta przez mObywatela | 🟢 od 02.2027 | Portal poparcia: ustawa z 23.01.2026 o zmianie Kodeksu wyborczego ([Dz.U. 2026 poz. 178](https://pkw.gov.pl/aktualnosci/informacje/udzielanie-poparcia-w-formie-elektronicznej-zmiany-w-kodeksie-wyborczym)), wchodzi w życie 12 miesięcy po ogłoszeniu (17.02.2026). Podpis zaufany, osobisty albo kwalifikowany. Nie obejmuje wyborów samorządowych. |
| „Moje poparcia”: sprawdzenie, komu udzieliło się poparcia, także na papierowej liście | 🟢 od 02.2027 | Ta sama ustawa: bezpłatna informacja o dacie poparcia i komitecie; portal sprawdza też podpisy z papierowych list. |
| Komitet widzi tylko licznik, dane osoby widzi tylko organ sprawdzający | 🟡 | Poparcie ujawnia poglądy polityczne (dane szczególnej kategorii, art. 9 RODO). Minimalizacja danych to wymóg projektowy, do zapisania w rozporządzeniu o portalu. |
| E-podpisy pod obywatelskimi projektami ustaw | 🔴 | Ustawa z 24.06.1999 o wykonywaniu inicjatywy ustawodawczej przez obywateli: 100 000 podpisów na papierze w 3 miesiące. Projekt poselski z 1.04.2026 (RPW/11430/2026) rozszerza Portal poparcia na projekty ustaw; stanu prac nie zweryfikowano. |
| Skaner: potwierdzenie danych kodem QR (tożsamość w okienku, sama pełnoletność w sklepie) | 🟢 | Istnieje: weryfikacja mDokumentów kodem QR; pełnoletność bez imienia i PESEL w części kas samoobsługowych ([android.com.pl](https://android.com.pl/tech/1047796-weryfikacja-wieku-mobywatelem-bedzie-prosta/), [instalki.pl](https://www.instalki.pl/news/internet/koniec-z-czekaniem-na-pracownika-sklepu-polacy-stworzyli-bezobslugowa-weryfikacje-wieku/)). |
| Skaner: logowanie do serwisów kodem QR | 🟢 | Istnieje w mObywatelu ([benchmark.pl](https://www.benchmark.pl/aktualnosci/mobywatel-2-0-jak-sprawdzic-kod-qr-drugiej-osoby.html), [antyweb.pl](https://antyweb.pl/mobywatel-2-0-do-pobrania)). |
| Każde przekazanie danych kodem QR w „Kto sprawdzał moje dane” | 🟢 / 🟡 | Zapis po stronie aplikacji to zmiana techniczna; wpis po stronie odbiorcy wymaga jego systemu. |
| „To nie ja” przy logowaniu kodem: blokada sesji i ostrzeżenie | 🟡 | Wymaga połączenia z węzłem logowania (login.gov.pl). |
| Ostrzeżenie przed kodem QR prowadzącym poza gov.pl (np. naklejki na parkometrach) | 🟢 | Zmiana wyłącznie techniczna; strona nie jest otwierana. |
| E-podpisy pod wnioskami o referendum ogólnokrajowe i lokalne | 🔴 | Ustawy o referendum ogólnokrajowym i lokalnym przewidują tylko listy papierowe. |

## Podsumowanie

| Status | Liczba elementów |
|---|---:|
| 🟢 dziś (w tym 🟢 / 🟡; 2 od lutego 2027) | 29 |
| 🟡 integracja, rozporządzenie albo zgoda | 13 |
| 🔴 zmiana ustawy (w tym warianty 🔴 / 🟡 i 🟡 / 🔴) | 8 |

**Pierwszy etap (bez zmian ustaw):** pakiet „Narodziny dziecka” bez automatycznego zaświadczenia lekarskiego, odzyskiwanie dostępu, tryb prosty, pisma prostym językiem, rozszerzony rejestr dostępu dla PESEL i RDO, przypomnienia o terminach.
