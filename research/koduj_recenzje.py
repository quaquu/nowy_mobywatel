"""Kodowanie skarg (1-2 gwiazdki) z recenzji mObywatela w kategorie bólu.

Metoda: słownik rdzeni słów (regex) na kategorię; recenzja może trafić do kilku kategorii.
Wejście: pliki JSON z recenzjami (Google Play i App Store), wyjście: tabela Markdown i JSON.
Użycie: python3 research/koduj_recenzje.py gplay.json appstore.json > research/recenzje_wyniki.md
"""
import json, re, sys, collections, unicodedata

KAT = {
    'Logowanie, hasło, biometria, PIN': r'zalog|logow|wylog|hasl|has[łl]o|biometri|odcisk|palc|face ?id|\bpin\b',
    'Potwierdzenie tożsamości / certyfikat mDowodu (pętla)': r'certyfikat|potwierdz\w* tozsam|tozsamosc|petl|w kolko|zapetl|aktywacj|nfc|przez bank|profil\w* zaufan',
    'Awarie, błędy, nie uruchamia się': r'nie dziala|blad|bledy|error|awari|zawies|crash|czarny ekran|bial\w* (ekran|stron)|nie otwiera|przestaje dzialac|wywala|serwer',
    'Dokumenty znikają / nie da się dodać': r'(dod\w*|dodani\w*|pobier\w*|usun\w*|znikn\w*).{0,30}(dokument|dowod|prawo jazdy|mdowod)|(dokument|dowod)\w*.{0,30}(usun|znik|dodac|dodania)',
    'Nieaktualne lub błędne dane (OC, pojazdy, podatki)': r'\boc\b|polis|nieaktual|nie aktualiz|bledn\w* dan|falszyw|dziwne samochod|nie pokazuje',
    'Powiadomienia (brak albo spam)': r'powiadom|przypomn|upomnien|okienk|ocen[aeiy]',
    'Trudna obsługa, nie można znaleźć': r'nieintuicyj|intuicyj|nic nie mozna znalez|ciezko sie|trudn|malo czyteln|skomplikow|nie wiem jak',
    'Seniorzy, wykluczenie': r'senior|\b[6-9]\d ?lat|starsz|wykluczen',
    'Prywatność, bezpieczeństwo danych': r'inwigil|wyciek|prywatn|wyludz|po co tyle|komu (udostep|dane)|obawiam sie|wlam',
    'Nowy telefon / przeniesienie konta': r'nowy telefon|nowym (urzadzen|telefon)|przeniesien|inny telefon|zmian\w* telefon',
    'Kontakt z obsługą / infolinia': r'infolini|obslug\w* (klienta|aplikacji)|kontakt|dzwoni',
}

def norm(t):
    t = unicodedata.normalize('NFKD', t.lower()).replace('ł', 'l')
    return ''.join(c for c in t if not unicodedata.combining(c))

def load(paths):
    rows = []
    for p in paths:
        for r in json.load(open(p, encoding='utf8')):
            score = r.get('score', r.get('r'))
            text = r.get('text') or ((r.get('t') or '') + '. ' + (r.get('c') or ''))
            if text:
                rows.append((score, text))
    return rows

rows = load(sys.argv[1:])
low = [t for s, t in rows if s <= 2]
cnt = collections.Counter(); cand = collections.defaultdict(list); none = 0
for t in low:
    n = norm(t); hit = False
    for k, rx in KAT.items():
        if re.search(rx, n):
            cnt[k] += 1; hit = True
            cand[k].append(t.replace('\n', ' '))
    none += not hit
# przykład: najkrótsza recenzja >60 znaków, która trafia tylko do tej jednej kategorii
ex = {}
for k, ts in cand.items():
    solo = [t for t in ts if sum(bool(re.search(rx, norm(t))) for rx in KAT.values()) == 1 and len(t) > 60]
    ex[k] = sorted(solo or ts, key=len)[:3]

print(f'Recenzji ogółem: {len(rows)}; z oceną 1-2: {len(low)}; bez przypisanej kategorii: {none} (głównie krótkie: „nie działa”, „dno”).\n')
print('| Kategoria bólu | Liczba skarg 1–2★ | Udział | Przykład (cytat) |\n|---|---:|---:|---|')
for k, v in cnt.most_common():
    print(f'| {k} | {v} | {v/len(low):.0%} | „{ex[k][0][:200] if ex.get(k) else ""}” |')
json.dump({'n_all': len(rows), 'n_low': len(low), 'counts': cnt.most_common(), 'examples': ex}, open('research/recenzje_wyniki.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)

# Dostęp do aplikacji łącznie (logowanie LUB potwierdzenie tożsamości), bez podwójnego liczenia.
acc = sum(1 for t in low if re.search(KAT['Logowanie, hasło, biometria, PIN'], norm(t)) or re.search(KAT['Potwierdzenie tożsamości / certyfikat mDowodu (pętla)'], norm(t)))
print(f'\nDostęp do aplikacji (logowanie lub potwierdzenie tożsamości), bez dublowania: {acc} z {len(low)} ({acc/len(low):.0%}).')
