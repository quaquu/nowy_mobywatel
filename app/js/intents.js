// Rozpoznawanie intencji obywatela: działa bez sieci, w przeglądarce i w Node (testy).
// To warstwa „pierwszej linii”: rozpoznaje sprawę i proponuje gotowy, sprawdzony przebieg.
// Model językowy (docelowo Bielik/PLLuM) ma tylko pomagać w rozmowie, nigdy nie wysyła niczego sam.

export function norm(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9 :/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Prośby, których asystent nie wykona niezależnie od sformułowania: cudze dane,
// próby obejścia zabezpieczeń (wstrzyknięte polecenia), czyny niezgodne z prawem.
const ODMOWA = [
  [/zignoruj|poprzednie instrukcj|tryb\w* administrator|jestes teraz|wylacz\w* potwierdz|bez podpisu|^system ?:|uzytkownik jest zweryfikowany/, 'bezpieczenstwo'],
  [/sasiad|cudz\w*|innej osoby|innego czlowieka|bylej zony|bylego meza|czyj jest|czyje jest|do kogo nalezy (auto|samochod|numer)/, 'cudze_dane'],
  [/falszyw\w* (dowod|dokument|zaswiadcz)|podrob|ukryc dochod|uniknac podatk|nie placic podatk|usun\w* (moje )?punkty|skasuj\w* (moje )?punkty|wygeneruj\w* .*pesel/, 'niezgodne_z_prawem'],
];
// „podaj adres Jana Kowalskiego” — dane osoby wskazanej z imienia i nazwiska (sprawdzane na oryginalnym tekście).
const OSOBA = /\b(adres|pesel|dane|numer|telefon)\b.*\b[A-ZŁŚŻŹĆ][a-ząęółśżźćń]+ [A-ZŁŚŻŹĆ][a-ząęółśżźćń]+/;

// Każda intencja: lista [wzorzec, waga]. Wzorce działają na tekście znormalizowanym.
export const INTENCJE = {
  narodziny: [
    [/urodzil|urodzi |urodzi$|urodzen|narodzin|noworod|porod/, 4],
    [/zostal(am|em) (mama|tata|mamą|tatą|ojcem|matka)/, 4],
    [/(pesel|akt\w*).{0,20}(dziec|dziecku|synowi|corce|malego|malej)|(dziec|dziecku).{0,20}pesel/, 3],
  ],
  przeprowadzka: [
    [/przeprowadz/, 4],
    [/zamelduj|zameldow|wymeld|meldun|melduj/, 4],
    [/(nowy|zmian\w*|nowego) adres|adres zamieszkania/, 3],
    [/nowym mieszkani|nowe mieszkanie|innego miasta/, 1.5],
  ],
  kupno_auta: [
    [/kupuj|kupil|kupic|kupn|zakup/, 2],
    [/auto|samochod|pojazd|skod|toyot|opel|fiat|volkswagen|\bvw\b|audi|bmw|ford|kia|hyundai|renault|peugeot/, 1.5],
    [/zarejestr\w* (auto|samochod|pojazd)|rejestracj\w* (auto|samochod|pojazd)|przerejestr|przepisac na (siebie|mnie)/, 4],
    [/histori\w* pojazd|\bpcc\b|umow\w* kupna|sprowadz|kradzion|z ogloszenia/, 4],
  ],
  utrata_dokumentu: [
    [/zgubil|zgubi|ukradl|ukradzi|kradziez|kradziezy|zginal|zginel|wypadl|nie moge znalezc/, 4],
    [/zastrz/, 4],
    [/kredyt na moje dane|na moje dane .*kredyt/, 4],
    [/portfel|torebk/, 2],
  ],
  nowy_dowod: [
    [/dowod/, 1.5],
    [/(dowod\w*).{0,40}(wazn|wygas|traci|konczy|nowy|nowego|wyrob|wymian|przedluz|wniosek|odbior|czeka|dziecka)|(nowy|nowego|wyrobic|wymiana|wniosek o|przedluzenie|odbior) .{0,20}dowod|(wazn\w*|konczy\w*) .{0,30}dowod/, 3.5],
    [/ile sie czeka/, 1],
  ],
  mandat: [
    [/mandat/, 4],
    [/punkt\w* karn|punkty|fotoradar|predkos|km h|z kamery/, 3],
  ],
  platnosci: [
    [/zaplac|oplac|oplat|platnos|zaplacen|blik/, 2.5],
    [/podat|rata|raty|zaleglos|smieci|skarbow/, 2.5],
    [/do zaplacenia|do zaplaty/, 3],
  ],
  skrzynka: [
    [/pism|skrzynk|doreczen|wezwani|decyzj/, 4],
    [/\blist\b|wiadomosc|z zus|z urzedu|od urzedow/, 2.5],
  ],
  swiadczenia: [
    [/nalez|przysluguj|doplat|becikow|dofinans|babciow|zasilek|zasilk|dodatek|swiadczen|aktywny rodzic|pomoc od panstwa|jakas pomoc/, 4],
    [/800|plus\b|ulg/, 3],
  ],
  dostep_danych: [
    [/kto (sprawdzal|zagladal|widzial|ogladal|pobieral|mial dostep)|histori\w* dostep|dostep\w* do moich danych/, 5],
    [/(jakie|co) .{0,20}(dane|wie|wiecie).{0,20}(o mnie|panstwo)|co wiecie o mnie/, 5],
    [/zgod|prywatn|udostepnian|wiedzial wszystko|sprawdzala? moj|pobieral\w* moje dane/, 3.5],
  ],
  bliscy: [
    [/\bmam(a|ie|e|ą)\b|(dowod|recept\w*|spraw\w*|dane|konto|emerytur\w*|leki|za) mamy\b|\btat(a|y|e|ą|u)\b|\btacie\b|\bojc|rodzic|babci|babcia|dziadk|\bcork|corki|podopieczn/, 3],
    [/pelnomocn|upowazn|opiekuj|za mame|za tate|za (starsz|chor)/, 3],
  ],
  logowanie: [
    [/zaloguj|zalogowac|logowan|hasl|biometri|odcisk|face ?id|\bpin\b/, 4],
    [/certyfikat|w kolko|petl|potwierdz\w* tozsamos|wyrzucil|zablokowan\w* konto|konto zablok/, 4],
    [/mdowod\w* .{0,15}(wygasl|wygas|stracil|nie dziala)|znikl\w* .{0,20}z aplikacji|nowy telefon|przeniesc mobywatel|przeniesc aplikacj/, 4],
  ],
  dokumenty: [
    [/pokaz|pokazac/, 2.5],
    [/dokument|legitymac|18 lat|pelnolet|duzej rodziny|\bkdr\b|dowod rejestracyjn|hotel|policjant|numer pesel|moj pesel/, 2.5],
  ],
  pojazd: [
    [/\boc\b|ubezpieczen\w* (samochod|auta|pojazd)|przeglad|badani\w* techniczn|moje pojazdy|przebieg|cepik/, 4],
  ],
  stluczka: [
    [/stluczk|kolizj|wjechal|wypadek|wypadk|sprawcy|porysowal|uderzyl|obtarl|stluklem|stluklam/, 5],
  ],
  oszustwo: [
    [/\bsms|dziwn|podejrzan|\blink|podszywa|oszust|phishing|\bmail|odetna|doplat\w* za paczk/, 4],
  ],
  do_zrobienia: [
    [/do zalatwienia|moje sprawy|co musze|zalegl\w* sprawy|na najblizszy czas|przypomnij|przypomn/, 4],
    [/(cos|czy cos) .{0,10}konczy|terminy|termin(ach|ow)/, 3],
  ],
  konsultant: [
    [/czlowiek|konsultant|infolini|zywy|porozmawiac z kims|z kims porozmawiac|numer\w* telefonu do pomocy|telefon do pomocy/, 5],
  ],
};

// Gdy w zdaniu jest bliska osoba, a sprawa dotyczy jej (np. „dowód mamy”), wygrywa „bliscy”.
const PRIORYTETY = [
  [/zostal(am|em) (mama|tata|mamą|tatą)/, 'narodziny'],
];

// Sprawa starszego członka rodziny (np. „dowód mamy”) to sprawa „bliscy”, nie własna.
const STARSI = /\bmam(a|ie|e|ą)\b|(dowod|recept\w*|spraw\w*|dane|konto|emerytur\w*|leki|za) mamy\b|\btat(a|y|e|ą|u)\b|\btacie\b|\bojc|rodzic|babci|dziadk/;

const PROG = 2.5; // minimalny wynik, poniżej: „nie jestem pewien”

export function rozpoznaj(tekst) {
  const raw = String(tekst || '');
  const n = norm(raw);
  if (!n || n.length < 2) return { intencja: 'poza_zakresem', pewnosc: 0, wyniki: [] };
  for (const [re, powod] of ODMOWA) if (re.test(n)) return { intencja: 'odmowa', powod, pewnosc: 1, wyniki: [] };
  if (OSOBA.test(raw) && !/urzed|skarbow|zus|gmin/i.test(raw)) return { intencja: 'odmowa', powod: 'cudze_dane', pewnosc: 1, wyniki: [] };
  for (const [re, intencja] of PRIORYTETY) if (re.test(n)) return { intencja, pewnosc: 1, wyniki: [] };

  const wyniki = Object.entries(INTENCJE).map(([id, wz]) => {
    let s = 0;
    for (const [re, w] of wz) if (re.test(n)) s += w;
    if (id === 'bliscy' && STARSI.test(n) && !/babciow|aktywn\w* rodzic/.test(n)) s += 3;
    return { id, s };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);

  if (!wyniki.length || wyniki[0].s < PROG) return { intencja: 'poza_zakresem', pewnosc: 0, wyniki };
  const [a, b] = wyniki;
  const pewnosc = b ? Math.min(1, (a.s - b.s) / a.s + 0.35) : 1;
  return { intencja: a.id, pewnosc, druga: b && a.s - b.s < 1 ? b.id : null, wyniki };
}
