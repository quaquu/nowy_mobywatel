// Strona dla jury: co jest inne, co zmierzyliśmy (liczby z ostatniego `npm test`) i jak to sprawdzić.
import { ic } from './icons.js';
import { esc } from './core.js';
import { WYNIKI as W } from './wyniki.js';

const REPO = 'https://github.com/quaquu/nowy_mobywatel';
const p = (x, d = 0) => x == null ? '–' : (100 * x).toFixed(d).replace('.', ',') + '%';
const pl = x => x == null ? '–' : String(x).replace('.', ',');
const wiersz = (a, b, c) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td></tr>`;

export function jury() {
  const m = W || {};
  return {
    tytul: 'Dla jury',
    html: `<h1 tabindex="-1">Państwo, które przychodzi ze sprawą</h1>
    <p class="wstep">Prototyp Janusza Cieszyńskiego odpowiada, gdy zapytasz. Nasz zaczyna sprawę sam: zauważa zdarzenie (urodziło się dziecko, kończy się dowód), łączy sprawy z kilku urzędów w jedną listę wypełnioną danymi, które państwo już ma, i prosi o <b>jeden podpis</b>. Asystent jest jednym z wejść, nie całą aplikacją.</p>

    <h2 class="sekcja">Spróbuj w 60 sekund</h2>
    <ol class="punkty"><li>Na starcie dotknij <a href="#/sprawa/narodziny">„Urodziła się Twoja córka”</a>.</li><li>Wybierz imię i dotknij „Przejrzyj i podpisz raz”.</li><li>Zobacz w <a href="#/dane/dostep">„Kto sprawdzał moje dane”</a>, które urzędy użyły Twoich danych i po co.</li></ol>

    <h2 class="sekcja">Co zmierzyliśmy</h2>
    ${W ? `<p class="maly">Pomiar z ${esc(m.data)}. Te same narzędzia uruchomiliśmy na prototypie referencyjnym (kod z mobywatel.ai, tryb przeglądarkowy).</p>
    <div class="tabela" tabindex="0" role="region" aria-label="Tabela porównania, przewijana w poziomie"><table><caption class="sr">Porównanie z prototypem referencyjnym</caption>
      <thead><tr><th scope="col">Miara</th><th scope="col">Ten prototyp</th><th scope="col">Referencyjny</th></tr></thead><tbody>
      ${wiersz('Narodziny dziecka: liczba dotknięć do wysłania wszystkich spraw', m.klm?.nasz?.akcje ?? '–', m.klm?.ref?.akcje ?? '–')}
      ${wiersz('…liczba podpisów', m.klm?.nasz?.podpisy ?? '–', m.klm?.ref?.podpisy ?? '–')}
      ${wiersz('…sprawy załatwione', m.klm?.nasz?.sprawy ?? '–', m.klm?.ref?.sprawy ?? '–')}
      ${wiersz('…przewidywany czas (model KLM)', (m.klm?.nasz?.sekundy ?? '–') + ' s', (m.klm?.ref?.sekundy ?? '–') + ' s')}
      ${wiersz('Rozpoznanie sprawy z tekstu (zbiór testowy, n=' + (m.intencje?.test?.n ?? '–') + ')', p(m.intencje?.test?.nasz, 1), p(m.intencje?.test?.referencja, 1))}
      ${wiersz('Złośliwe prośby odrzucone', m.intencje?.test?.odmowy ?? '–', '–')}
      ${(m.bielik || []).map(b => wiersz(`Polski model ${esc(b.model.replace(/-v3\.0-Instruct.*$/, ' v3').replace(/-/g, ' '))} (lokalnie, bez przykładów): sam / jako wsparcie reguł`, `${p(b.test.bielik, 1)} / ${p(b.test.hybryda, 1)}`, '–')).join('')}
      ${wiersz('Naruszenia dostępności (axe, WCAG 2.2 AA)', m.axe?.nasz ?? '–', m.axe?.ref ?? '–')}
      ${wiersz('Lighthouse: dostępność', m.lighthouse?.nasz?.accessibility ?? '–', m.lighthouse?.ref?.accessibility ?? '–')}
      ${wiersz('Lighthouse: wydajność (telefon)', m.lighthouse?.nasz?.performance ?? '–', m.lighthouse?.ref?.performance ?? '–')}
      ${wiersz('Czytelność tekstów (FOG-PL, mniej = prościej)', pl(m.czytelnosc?.nasz?.fog), pl(m.czytelnosc?.ref?.fog))}
      ${wiersz('Działa bez internetu po pierwszym otwarciu', m.offline ? 'tak' : '–', '–')}
      </tbody></table></div>` : '<p class="maly">Wyniki pojawią się po uruchomieniu testów (npm test).</p>'}

    <h2 class="sekcja">Skąd pomysły</h2>
    <ul class="lista mala">
      <li class="poz">${ic('bolt', 'okr')}<span><b>Estonia</b><small>usługi proaktywne według zdarzeń życiowych; rejestr, kto czytał moje dane</small></span></li>
      <li class="poz">${ic('baby', 'okr')}<span><b>Singapur, LifeSG</b><small>urodzenie i świadczenia w jednym pakiecie: z 60 do 15 minut</small></span></li>
      <li class="poz">${ic('gift', 'okr')}<span><b>Korea, Gov24</b><small>lista świadczeń, które Ci przysługują</small></span></li>
      <li class="poz">${ic('clock', 'okr')}<span><b>Abu Zabi, TAMM AutoGov</b><small>sprawy powtarzalne na autopilocie, za zgodą</small></span></li>
      <li class="poz">${ic('chat', 'okr')}<span><b>Ukraina, Diia.AI</b><small>asystent, który wykonuje usługi, także głosem</small></span></li>
      <li class="poz">${ic('mail', 'okr')}<span><b>Włochy, IO</b><small>jedna skrzynka z płatnościami od 15 tys. urzędów</small></span></li>
    </ul>

    <h2 class="sekcja">Uczciwie: co już jest w mObywatelu</h2>
    <p>Dokumenty w telefonie, e-Doręczenia, historia pojazdu, punkty karne, zastrzeżenie PESEL, zawieszenie dowodu, mStłuczka i informacja o odbiorcach danych z rejestru PESEL (na wniosek, jako plik) już działają. Nie udajemy, że to nasze. Nowe są: sprawy przychodzące same, pakiety spraw z jednym podpisem, „Należy Ci się”, autopilot, bieżący rejestr dostępu do danych ze wszystkich rejestrów, sprawy bliskich, tryb prosty i odzyskiwanie dostępu bez pętli.</p>

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
