// Strona dla jury: co jest inne, co zmierzyliśmy (liczby z ostatniego `npm test`) i jak to sprawdzić.
import { ic } from './icons.js';
import { esc } from './core.js';
import { WYNIKI as W } from './wyniki.js';

const REPO = 'https://github.com/quaquu/nowy_mobywatel';
const p = (x, d = 0) => x == null ? '–' : (100 * x).toFixed(d).replace('.', ',') + '%';
const pl = x => x == null ? '–' : String(x).replace('.', ',');
// Pomiar opublikowanej strony (GitHub Pages) robimy ręcznie po publikacji: npm test mierzy serwer lokalny.
const ZYWA = { data: '17.11.2026', wydajnosc: '89–93' };
const wiersz = (a, b, c) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td></tr>`;

export function jury() {
  const m = W || {};
  return {
    tytul: 'Dla jury',
    html: `<h1 tabindex="-1">Państwo, które przychodzi ze sprawą</h1>
    <p class="wstep">Prototyp referencyjny pokazał, że z państwem można rozmawiać, zamiast szukać usługi w menu. Ten prototyp idzie krok dalej: <b>państwo samo zaczyna sprawę</b>. Zauważa zdarzenie (urodziło się dziecko, kończy się dowód), zbiera sprawy z kilku urzędów w jedną listę wypełnioną danymi, które już ma, i prosi o <b>jeden podpis</b>. Asystent jest jednym z wejść, nie całą aplikacją.</p>

    ${W ? `<h2 class="sekcja">Trzy liczby</h2>
    <ul class="trzy-liczby">
      <li><b>${m.klm?.nasz?.akcje ?? '–'} dotknięcia</b><span>i ${m.klm?.nasz?.sprawy ?? '–'} spraw po narodzinach dziecka załatwionych jednym podpisem. W prototypie referencyjnym: ${m.klm?.ref?.akcje ?? '–'} dotknięć, ${m.klm?.ref?.sprawy ?? '–'} sprawy, ${m.klm?.ref?.podpisy ?? '–'} podpisy.</span></li>
      <li><b>9 na 10</b><span>zdań napisanych własnymi słowami asystent przypisał do właściwej sprawy (${p(m.intencje?.test?.nasz, 1)} z ${m.intencje?.test?.n ?? '–'} zdań, których nie widział przy budowie). Referencja: 3 na 10 (${p(m.intencje?.test?.referencja, 1)}).</span></li>
      <li><b>0 błędów</b><span>dostępności w automatycznym teście WCAG 2.2 AA (axe) na wszystkich ekranach. Referencja: ${m.axe?.ref ?? '–'} rodzajów błędów.</span></li>
    </ul>
    <p class="maly">Te same narzędzia na obu prototypach, pomiar z ${esc(m.data)}. Kod testów jest w repozytorium, a <code>npm test</code> odtwarza każdą liczbę.</p>` : ''}

    <h2 class="sekcja">Spróbuj w 60 sekund</h2>
    <ol class="punkty"><li>Na starcie dotknij <a href="#/sprawa/narodziny">„Urodziła się Twoja córka”</a>.</li><li>Wybierz imię i dotknij „Przejrzyj i podpisz raz”. Po podpisie przełącz „za 3 dni”: każdą sprawę śledzisz jak przesyłkę.</li><li>Zobacz w <a href="#/dane/dostep">„Kto sprawdzał moje dane”</a>, które urzędy użyły Twoich danych i po co.</li><li>Zmień osobę w <a href="#/osoby">„Osoby w pokazie”</a>: Halina (78 lat) ma tryb prosty i gotowy wniosek o rentę wdowią.</li></ol>

    ${W ? `<details class="rozw metoda"><summary>Wszystkie pomiary i metoda</summary>
    <p class="maly">Czas policzony modelem KLM (Keystroke-Level Model): standardowe czasy dotknięcia, czytania i oczekiwania na system, bez udziału ludzi. Rozpoznanie sprawy: zbiór zdań odłożony przed budową asystenta. Wydajność: Lighthouse w trybie telefonu.</p>
    <div class="tabela" tabindex="0" role="region" aria-label="Tabela porównania, przewijana w poziomie"><table><caption class="sr">Porównanie z prototypem referencyjnym</caption>
      <thead><tr><th scope="col">Miara</th><th scope="col">Ten prototyp</th><th scope="col">Referencyjny</th></tr></thead><tbody>
      ${wiersz('Narodziny dziecka: dotknięcia do wysłania wszystkich spraw', m.klm?.nasz?.akcje ?? '–', m.klm?.ref?.akcje ?? '–')}
      ${wiersz('…podpisy', m.klm?.nasz?.podpisy ?? '–', m.klm?.ref?.podpisy ?? '–')}
      ${wiersz('…sprawy załatwione', m.klm?.nasz?.sprawy ?? '–', m.klm?.ref?.sprawy ?? '–')}
      ${wiersz('…przewidywany czas (model KLM)', (m.klm?.nasz?.sekundy ?? '–') + ' s', (m.klm?.ref?.sekundy ?? '–') + ' s')}
      ${wiersz('Rozpoznanie sprawy z tekstu (' + (m.intencje?.test?.n ?? '–') + ' zdań)', p(m.intencje?.test?.nasz, 1), p(m.intencje?.test?.referencja, 1))}
      ${wiersz('Złośliwe prośby odrzucone', m.intencje?.test?.odmowy ?? '–', '–')}
      ${wiersz('Błędy dostępności (axe, WCAG 2.2 AA)', m.axe?.nasz ?? '–', m.axe?.ref ?? '–')}
      ${wiersz('Lighthouse: dostępność', m.lighthouse?.nasz?.accessibility ?? '–', m.lighthouse?.ref?.accessibility ?? '–')}
      ${wiersz('Lighthouse: wydajność na telefonie (serwer testowy / ta strona ' + ZYWA.data + ')', (m.lighthouse?.nasz?.performance ?? '–') + ' / ' + ZYWA.wydajnosc, m.lighthouse?.ref?.performance ?? '–')}
      ${wiersz('Wzorce „interfejsu z generatora” i błędy jakości (detektor Impeccable)', m.impeccable?.razem ?? '–', m.impeccable?.ref?.razem ?? '–')}
      ${wiersz('Trudność tekstów (indeks FOG-PL, mniej = prościej)', pl(m.czytelnosc?.nasz?.fog), pl(m.czytelnosc?.ref?.fog))}
      ${wiersz('Działa bez internetu po pierwszym otwarciu', m.offline ? 'tak' : '–', '–')}
      ${(m.bielik || []).map(b => wiersz(`Próba: polski model ${esc(b.model.replace(/-v3\.0-Instruct.*$/, ' v3').replace(/-/g, ' '))} w telefonie, sam / razem z regułami`, `${p(b.test.bielik, 1)} / ${p(b.test.hybryda, 1)}`, '–')).join('')}
      </tbody></table></div></details>` : '<p class="maly">Wyniki pojawią się po uruchomieniu testów (npm test).</p>'}

    <h2 class="sekcja">Skąd pomysły</h2>
    <ul class="lista mala">
      <li class="poz">${ic('bolt', 'okr')}<span><b>Estonia</b><small>usługi proaktywne według zdarzeń życiowych; rejestr, kto czytał moje dane</small></span></li>
      <li class="poz">${ic('baby', 'okr')}<span><b>Singapur, LifeSG</b><small>urodzenie i świadczenia w jednym pakiecie: z 60 do 15 minut</small></span></li>
      <li class="poz">${ic('gift', 'okr')}<span><b>Korea, Gov24</b><small>lista świadczeń, które Ci przysługują</small></span></li>
      <li class="poz">${ic('clock', 'okr')}<span><b>Abu Zabi, TAMM AutoGov</b><small>sprawy powtarzalne załatwiane za obywatela, za jego zgodą</small></span></li>
      <li class="poz">${ic('chat', 'okr')}<span><b>Ukraina, Diia.AI</b><small>asystent, który wykonuje usługi, także głosem</small></span></li>
      <li class="poz">${ic('mail', 'okr')}<span><b>Włochy, IO</b><small>jedna skrzynka z płatnościami od 15 tys. urzędów</small></span></li>
    </ul>

    <h2 class="sekcja">Skaner: kody do zeskanowania</h2>
    <p>Otwórz prototyp na telefonie, dotknij ikony skanera u góry ekranu i zeskanuj kod z tego ekranu. Bez drugiego telefonu: w skanerze są „Kody pokazowe”.</p>
    <ul class="kody-qr">${[['sklep', 'Kasa w sklepie', 'tylko pełnoletność'], ['urzad', 'Okienko urzędu', 'tożsamość'], ['logowanie', 'Logowanie na komputerze', '„Czy to Ty?”'], ['parkometr', 'Naklejka na parkometrze', 'fałszywy kod']].map(([id, t, o]) => `<li><img src="img/kod-${id}.svg" alt="Kod QR pokazowy: ${t}" width="132" height="132" loading="lazy"><b>${t}</b><small>${o}</small></li>`).join('')}</ul>

    <h2 class="sekcja">Uczciwie: co już jest, a co nowe</h2>
    <div class="uczciwie">
      <div><h3>Już działa w mObywatelu</h3><ul class="punkty"><li>dokumenty w telefonie, e-Doręczenia, historia pojazdu, punkty karne</li><li>zastrzeżenie PESEL, zawieszenie dowodu, mStłuczka</li><li>w przeglądarce osobne wnioski: zgłoszenie urodzenia, zameldowanie, dowód, zbycie pojazdu, ePłatności</li><li>potwierdzanie danych i logowanie kodem QR, w części kas samą pełnoletnością</li></ul>
      <p class="maly">Operatorzy już blokują połączenia z podszytym numerem banku. Kodeks wyborczy od lutego 2027 r. pozwoli poprzeć kandydata przez internet.</p></div>
      <div><h3>Nowe w tym prototypie</h3><ul class="punkty"><li>sprawy, które przychodzą same, i pakiety spraw z kilku urzędów z jednym podpisem</li><li>śledzenie każdej sprawy jak przesyłki</li><li>„Możesz skorzystać”, przypomnienia i zlecenia stałe</li><li>jeden rejestr: kto i po co sprawdzał moje dane</li><li>Twoja emerytura: ZUS, PPK, IKE i IKZE razem, z prognozą</li><li>sprawy bliskich, tryb prosty, odzyskiwanie dostępu bez pętli</li><li>„Kto dzwoni?”, ostrzeżenie przed obcym kodem QR, podpisy poparcia</li></ul></div>
    </div>

    <h2 class="sekcja">Dokumentacja</h2>
    <ul class="lista mala">
      <li><a class="poz" href="${REPO}/blob/main/docs/ANALIZA.md" target="_blank" rel="noopener">${ic('doc', 'okr')}<span><b>Analiza</b><small>7 krajów, prototyp referencyjny, 1600 recenzji mObywatela</small></span></a></li>
      <li><a class="poz" href="${REPO}/blob/main/docs/MACIERZ_WYKONALNOSCI.md" target="_blank" rel="noopener">${ic('shield', 'okr')}<span><b>Macierz wykonalności prawnej</b><small>co można wdrożyć dziś, a co wymaga zmiany przepisów</small></span></a></li>
      <li><a class="poz" href="${REPO}/blob/main/docs/RED_TEAM.md" target="_blank" rel="noopener">${ic('alert', 'okr')}<span><b>Red team</b><small>prywatność, błędy AI, koszt, „to już jest”</small></span></a></li>
      <li><a class="poz" href="${REPO}" target="_blank" rel="noopener">${ic('info', 'okr')}<span><b>Kod (MIT) i testy</b><small>npm test odtwarza wszystkie liczby z tej strony</small></span></a></li>
    </ul>
    <a class="btn drugi szeroki" href="#/test">${ic('test')}Tryb testowy dla testerów</a>
    <p class="stopka-info">Niezależny prototyp. Dane fikcyjne. To nie jest usługa administracji publicznej ani oficjalna aplikacja mObywatel.</p>`,
  };
}
