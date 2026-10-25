# Skaner kodów QR: co już jest (25.10.2026)

Rozpoznanie przed dodaniem skanera (ikona obok skrzynki, jak w prototypie referencyjnym).

## Co już działa w mObywatelu (wg publikacji, niezweryfikowane w aplikacji)

- **Weryfikacja mDokumentów kodem QR**: sprawdzający skanuje kod, właściciel widzi zakres danych i zatwierdza; dane pokazują się krótko i nie są zapisywane u sprawdzającego. Jest też weryfikator w przeglądarce (weryfikator.mobywatel.gov.pl). Źródła: [benchmark.pl](https://www.benchmark.pl/aktualnosci/mobywatel-2-0-jak-sprawdzic-kod-qr-drugiej-osoby.html), [podatki.biz](https://www.podatki.biz/artykuly/jak-zweryfikowac-mdowod_16_57884.htm), [android.com.pl: weryfikacja kryptograficzna](https://android.com.pl/tech/924454-mobywatel-weryfikacja-kryptograficzna/).
- **Logowanie do serwisów administracji kodem QR** z aplikacji ([antyweb.pl](https://antyweb.pl/mobywatel-2-0-do-pobrania)).
- **Sama pełnoletność w kasie samoobsługowej**: klient skanuje kod z kasy, sklep dostaje tylko potwierdzenie wieku, bez imienia i PESEL (Provaid; [instalki.pl](https://www.instalki.pl/news/internet/koniec-z-czekaniem-na-pracownika-sklepu-polacy-stworzyli-bezobslugowa-weryfikacje-wieku/)). Ministerstwo zapowiada podobne potwierdzanie wieku w usługach internetowych ([android.com.pl](https://android.com.pl/tech/1047796-weryfikacja-wieku-mobywatelem-bedzie-prosta/)).

## Co dodaje prototyp

1. Każde przekazanie danych kodem trafia do „Kto sprawdzał moje dane” (kto, co, po co).
2. Przy logowaniu kodem pytanie „Czy to Ty logujesz się na komputerze?” z przeglądarką, miejscem i godziną oraz przycisk „To nie ja”, który blokuje logowanie. Odpowiedź na oszustwa „zeskanuj kod, który wysłałem”.
3. Kod prowadzący poza gov.pl (np. naklejka na parkometrze, tzw. quishing) wywołuje ostrzeżenie; strona nie jest otwierana.
4. Bez aparatu (brak zgody, komputer) działają kody pokazowe; kody do zeskanowania drugim telefonem są na stronie „Dla jury” i w panelu obok symulacji telefonu.

## Technicznie

- Aparat: `getUserMedia` (tylna kamera, gdy jest), wyłączany przy zamknięciu skanera, zmianie ekranu i zejściu aplikacji w tło.
- Odczyt: wbudowany `BarcodeDetector`, a gdy go brak (np. Safari, Chromium na Linuksie): biblioteka [jsQR](https://github.com/cozmo/jsQR) 1.4.0 (Apache-2.0), ładowana dopiero przy otwarciu skanera (`app/vendor/`).
- Test: Chromium dostaje sztuczny obraz z kamery z kodem QR (`tests/kamera-y4m.mjs`), więc test przechodzi całą drogę od aparatu do ekranu zgody.

## Czego nie zweryfikowano

- Działania na prawdziwych telefonach (iOS Safari, Android Chrome) i z prawdziwym aparatem; testy używają sztucznego obrazu w Chromium.
- Aktualnego zakresu funkcji QR w mObywatelu (opis z publikacji, nie z aplikacji).
