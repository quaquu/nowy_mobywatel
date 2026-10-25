// Asystent: rozumie sprawę, pokazuje gotowy przebieg i źródło. Nigdy nie wysyła niczego sam:
// każde działanie kończy się tym samym arkuszem zgody co w aplikacji.
import { ic } from './icons.js';
import { stan, esc, $, czytaj, cel } from './core.js';
import { rozpoznaj } from './intents.js';
import { fmt, za } from './data.js';

const GOV = 'https://www.gov.pl/web/gov/';
export const O = {
  narodziny: { t: 'Gratulacje! Szpital już przekazał kartę urodzenia do urzędu. Zostało 5 spraw w 4 instytucjach: zgłoszenie urodzenia, 800+, becikowe, ubezpieczenie i urlop rodzicielski. Wszystkie są wypełnione, potrzebny jest jeden podpis.', a: [['Załatw wszystko naraz', '#/sprawa/narodziny']], z: ['gov.pl: Zgłoś urodzenie dziecka', GOV + 'zglos-urodzenie-dziecka'] },
  przeprowadzka: { t: 'Podaj nowy adres, a zamelduję Cię i powiadomię urząd skarbowy, ZUS i NFZ. Wymeldowanie ze starego adresu zrobi się samo. Dowodu nie wymieniasz: od 2015 r. nie ma w nim adresu.', a: [['Zamelduj się', '#/sprawa/przeprowadzka']], z: ['gov.pl: Zamelduj się na pobyt stały', GOV + 'zamelduj-sie-na-pobyt-staly-lub-czasowy-dluzszy-niz-3-miesiace'] },
  kupno_auta: { t: 'Najpierw sprawdzę auto w rejestrach: kradzież, OC, badania i przebieg. Potem przygotuję umowę, podatek PCC-3 (2% ceny) i wniosek o rejestrację.', a: [['Sprawdź auto', '#/sprawa/auto']], z: ['gov.pl: Sprawdź historię pojazdu', GOV + 'sprawdz-historie-pojazdu'] },
  utrata_dokumentu: { t: 'Najpierw Cię zabezpieczmy. Zawieszę dowód na 14 dni, zastrzegę go w bankach i zastrzegę PESEL. Wszystko cofniesz, jeśli portfel się znajdzie. Karty płatnicze zastrzeżesz pod numerem 828 828 828.', a: [['Zastrzeż dokumenty', '#/sprawa/utrata']], z: ['gov.pl: Zgłoś utratę dowodu osobistego', GOV + 'zglos-utrate-lub-uszkodzenie-swojego-dowodu-osobistego-uniewaznij-dowod'] },
  nowy_dowod: { t: `Twój dowód jest ważny do ${fmt(za(41))}. Wniosek wypełnię danymi z rejestru, zdjęcie zrobisz telefonem. Odciski palców urzędnik pobierze przy odbiorze.`, a: [['Złóż wniosek', '#/sprawa/dowod']], z: ['gov.pl: Uzyskaj dowód osobisty', GOV + 'uzyskaj-dowod-osobisty'] },
  mandat: { t: `Masz mandat z fotoradaru: 200 zł i 3 punkty, termin ${fmt(za(6))}. Teraz masz 2 punkty z 24. Możesz przyjąć mandat i zapłacić BLIK-iem, wskazać innego kierowcę albo odmówić.`, a: [['Zobacz mandat', '#/mandat']], z: ['gov.pl: Sprawdź punkty karne', GOV + 'sprawdz-swoje-punkty-karne'] },
  platnosci: { t: `Do zapłaty masz: mandat 200 zł (do ${fmt(za(6))}) i IV ratę podatku od nieruchomości 186 zł (do ${fmt(za(23))}).`, a: [['Zapłać podatek', '#/podatek'], ['Zobacz mandat', '#/mandat']], z: null },
  skrzynka: { t: 'Masz 2 nowe pisma: zwrot nadpłaty 214 zł z urzędu skarbowego i wezwanie z fotoradaru. Każde pismo pokazuję też prostym językiem.', a: [['Otwórz skrzynkę', '#/skrzynka']], z: null },
  swiadczenia: { t: 'Sprawdziłem rejestry: należy Ci się 800+, becikowe 1 000 zł i ulga na dziecko w PIT. „Aktywnego rodzica” przypomnę, gdy córka skończy rok.', a: [['Zobacz, co Ci się należy', '#/naleznosci']], z: ['gov.pl: Uzyskaj becikowe', GOV + 'uzyskaj-becikowe'] },
  dostep_danych: { t: 'W ostatnich 60 dniach Twoje dane odczytało 5 instytucji. Jeden odczyt warto sprawdzić: operator komórkowy pytał o Twój PESEL przy zakupie karty SIM.', a: [['Kto sprawdzał moje dane', '#/dane/dostep'], ['Co państwo o mnie wie', '#/dane/rejestry']], z: null },
  bliscy: { t: `Masz upoważnienie od mamy, Haliny Nowickiej. Jej dowód traci ważność ${fmt(za(77))}. Mogę zamówić wizytę urzędnika u mamy w domu.`, a: [['Sprawy mamy', '#/bliscy/mama']], z: ['gov.pl: Dowód dla osoby, która nie może przyjść do urzędu', GOV + 'uzyskaj-dowod-osobisty'] },
  logowanie: { t: 'To najczęstszy problem, więc mam na to prosty sposób. Sprawdzę, co się stało, i pokażę jeden sposób potwierdzenia tożsamości. Po powrocie z banku nie zaczynasz od nowa.', a: [['Odzyskaj dostęp', '#/dostep']], z: null },
  dokumenty: { t: 'Twoje dokumenty: mDowód, mPrawo jazdy i pojazdy. Jeśli chcesz potwierdzić tylko wiek albo tożsamość, mogę pokazać kod bez reszty danych.', a: [['Dokumenty', '#/dokumenty'], ['Pokaż tylko to, co potrzebne', '#/pokaz']], z: null },
  pojazd: { t: `Toyota Yaris EL 4K217: OC ważne do ${fmt(za(132))}, badanie techniczne do ${fmt(za(19))}. Przypomnę 7 dni wcześniej.`, a: [['Mój pojazd', '#/dokument/pojazd']], z: null },
  stluczka: { t: 'Czy ktoś jest ranny? Jeśli tak, dzwoń pod 112. Jeśli nie i zgadzacie się co do winy, oświadczenie spiszecie w obecnym mObywatelu (usługa mStłuczka). Przy sporze wezwij policję.', a: [], z: ['gov.pl: mStłuczka w mObywatelu', 'https://www.gov.pl/web/cyfryzacja/mstluczka-koniec-papierowych-formalnosci-po-kolizji-drogowej-dla-uzytkownikow-aplikacji-mobywatel'], tel: '112' },
  oszustwo: { t: 'Nie klikaj w link i nie podawaj danych. Prześlij SMS-a na bezpłatny numer 8080, a stronę zgłoś do CERT Polska. Urzędy nie wysyłają linków do płatności SMS-em.', a: [], z: ['CERT Polska: zgłoś incydent', 'https://incydent.cert.pl/'] },
  kto_dzwoni: { t: 'Podaj numer, który dzwonił. Sprawdzę, czy należy do urzędu albo banku i czy ten bank w ogóle z niego dzwoni. Nie pokazuję, do kogo należą prywatne numery. Pamiętaj: nikt z urzędu ani banku nie poprosi o kod BLIK ani hasło.', a: [['Sprawdź numer', '#/kto-dzwoni']], z: ['UKE: ustawa o zwalczaniu nadużyć w komunikacji elektronicznej', 'https://eli.gov.pl/eli/DU/2024/1803/ogl'] },
  poparcie: { t: 'Trwają 4 zbiórki podpisów: projekt ustawy, referendum ogólnokrajowe, referendum w Łodzi i kandydat na senatora. Poparcie podpiszesz w aplikacji; komitet zobaczy tylko liczbę podpisów.', a: [['Podpisy i poparcie', '#/poparcie']], z: ['PKW: poparcie w formie elektronicznej', 'https://pkw.gov.pl/aktualnosci/informacje/udzielanie-poparcia-w-formie-elektronicznej-zmiany-w-kodeksie-wyborczym'] },
  do_zrobienia: { t: 'Najbliższe terminy: mandat (6 dni), badanie techniczne (19 dni), podatek (23 dni), dowód (41 dni). Narodziny córki to sprawa na teraz.', a: [['Pokaż wszystko', '#/start']], z: null },
  konsultant: { t: 'Jasne. Konsultant oddzwoni i, jeśli się zgodzisz, zobaczy, na czym utknęłaś.', a: [['Poproś o telefon', '#/konsultant']], z: null },
};
const ODMOWY = {
  bezpieczenstwo: 'Tego nie zrobię. Nie wykonuję poleceń wpisanych w rozmowie, które zmieniają moje zasady, i nigdy nie wysyłam niczego bez Twojego podpisu.',
  cudze_dane: 'Nie pokazuję danych innych osób. Jeśli działasz w czyimś imieniu, ta osoba może Cię upoważnić w zakładce Bliscy.',
  niezgodne_z_prawem: 'W tym nie pomogę. Mogę za to wyjaśnić, jak sprawa wygląda zgodnie z prawem, np. kiedy wygasają punkty karne albo jakie ulgi Ci przysługują.',
};
const NAZWY = { narodziny: 'narodziny dziecka', przeprowadzka: 'przeprowadzkę', kupno_auta: 'kupno auta', utrata_dokumentu: 'zgubione dokumenty', nowy_dowod: 'nowy dowód', mandat: 'mandat', platnosci: 'płatności', skrzynka: 'pisma', swiadczenia: 'świadczenia', dostep_danych: 'Twoje dane', bliscy: 'sprawy bliskich', logowanie: 'logowanie', dokumenty: 'dokumenty', pojazd: 'auto: OC i badanie', stluczka: 'stłuczkę', oszustwo: 'podejrzaną wiadomość', kto_dzwoni: 'podejrzany telefon', poparcie: 'podpisy poparcia', do_zrobienia: 'terminy', konsultant: 'rozmowę z człowiekiem' };
const PODPOWIEDZI = ['Urodziło nam się dziecko', 'Zgubiłam portfel', 'Przeprowadzam się', 'Kto sprawdzał moje dane?', 'Co mi się należy?'];

const historia = [];

export function odpowiedz(tekst) {
  const r = rozpoznaj(tekst);
  if (r.intencja === 'odmowa') return { t: ODMOWY[r.powod] || ODMOWY.bezpieczenstwo, a: [], odmowa: true, r };
  if (r.intencja === 'poza_zakresem') return { t: 'Tego nie wiem albo to nie jest sprawa urzędowa. Pomagam w sprawach z urzędami. Spróbuj inaczej albo wybierz:', chipy: PODPOWIEDZI.slice(0, 3), a: [['Porozmawiaj z człowiekiem', '#/konsultant']], r };
  const o = O[r.intencja];
  const dopytaj = r.druga && O[r.druga] ? [NAZWY[r.druga]] : null;
  return { ...o, r, dopytaj: dopytaj && { tekst: `Chodzi o ${NAZWY[r.intencja]} czy o ${NAZWY[r.druga]}?`, inna: r.druga } };
}

function babelek(m) {
  if (m.kto === 'ja') return `<div class="msg ja">${esc(m.t)}</div>`;
  return `<div class="msg bot${m.odmowa ? ' odm' : ''}">
    <p>${esc(m.t)}</p>
    ${m.a && m.a.length ? `<div class="akcje">${m.a.map(([l, h]) => `<a class="btn glowny maly-btn" href="${h}">${esc(l)}</a>`).join('')}</div>` : ''}
    ${m.tel ? `<a class="btn pilny maly-btn" href="tel:${m.tel}">${ic('phone')}Zadzwoń ${m.tel}</a>` : ''}
    ${m.z ? `<p class="zrodlo">${ic('info')}<span>Źródło: <a href="${m.z[1]}" target="_blank" rel="noopener">${esc(m.z[0])}</a></span></p>` : ''}
    ${m.dopytaj ? `<p class="maly">${esc(m.dopytaj.tekst)}</p><div class="chipy"><button class="chip" data-int="${m.dopytaj.inna}">Raczej ${esc(NAZWY[m.dopytaj.inna])}</button></div>` : ''}
    ${m.chipy ? `<div class="chipy">${m.chipy.map(c => `<button class="chip" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
  </div>`;
}

export function asystent(params) {
  return {
    tytul: 'Asystent',
    html: `<h1 tabindex="-1">Asystent</h1>
    <p class="maly">Rozumie sprawy urzędowe i prowadzi do gotowego wniosku. Niczego nie wysyła bez Twojego podpisu. Działa także bez internetu: rozpoznawanie sprawy działa w telefonie. Docelowo rozmowę wspiera polski model Bielik uruchomiony w chmurze rządowej.</p>
    <div class="czat" id="czat" aria-live="polite" aria-relevant="additions">
      ${historia.length ? historia.map(babelek).join('') : `<div class="msg bot"><p>Dzień dobry! Napisz albo powiedz, co chcesz załatwić, własnymi słowami.</p><div class="chipy">${PODPOWIEDZI.map(c => `<button class="chip" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`}
    </div>
    <div class="pisz-pasek"><form class="pisz" id="f-pisz">
      <label for="pytanie" class="sr">Twoja wiadomość</label>
      <input id="pytanie" autocomplete="off" placeholder="Napisz, co chcesz załatwić" enterkeyhint="send">
      <button type="button" class="ib" id="mow" aria-label="Powiedz głosem">${ic('mic')}</button>
      <button class="ib wyslij" aria-label="Wyślij">${ic('send')}</button>
    </form></div>
    `,
    po(root) {
      const czat = $('#czat', root), pole = $('#pytanie', root);
      const dodaj = m => { historia.push(m); czat.insertAdjacentHTML('beforeend', babelek(m)); const el = czat.lastElementChild; el.scrollIntoView({ block: el.offsetHeight > 280 ? 'start' : 'end', behavior: 'smooth' }); };
      const zadaj = t => {
        if (!t.trim()) return;
        dodaj({ kto: 'ja', t });
        const o = odpowiedz(t);
        dodaj(o);
        cel('asystent:' + o.r.intencja);
        if (stan.ustawienia.czytaj) czytaj(o.t);
      };
      $('#f-pisz', root).onsubmit = e => { e.preventDefault(); const t = pole.value; pole.value = ''; zadaj(t); };
      czat.onclick = e => {
        const q = e.target.closest('[data-q]'); if (q) return zadaj(q.dataset.q);
        const i = e.target.closest('[data-int]'); if (i) { const o = { ...O[i.dataset.int], r: { intencja: i.dataset.int } }; dodaj(o); }
      };
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const mow = $('#mow', root);
      if (!SR) { mow.onclick = () => dodaj({ t: 'Ta przeglądarka nie obsługuje rozpoznawania mowy. Napisz wiadomość albo użyj dyktowania z klawiatury telefonu.' }); }
      else {
        mow.onclick = () => {
          const rec = new SR(); rec.lang = 'pl-PL'; rec.interimResults = false;
          mow.classList.add('nagrywa'); mow.setAttribute('aria-label', 'Słucham…');
          rec.onresult = e => zadaj(e.results[0][0].transcript);
          rec.onend = () => { mow.classList.remove('nagrywa'); mow.setAttribute('aria-label', 'Powiedz głosem'); };
          rec.onerror = () => dodaj({ t: 'Nie usłyszałem. Spróbuj jeszcze raz albo napisz.' });
          rec.start();
        };
      }
      if (params.get('q')) { zadaj(params.get('q')); history.replaceState(null, '', '#/asystent'); }
      if (params.get('mow') && SR) mow.click();
      else if (!params.get('q')) pole.focus({ preventScroll: true });
    },
  };
}
