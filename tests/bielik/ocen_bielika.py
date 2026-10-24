"""Ocena polskiego modelu Bielik (SpeakLeash) jako klasyfikatora spraw na zbiorze tests/data/intencje.tsv.

Uruchamiany lokalnie na CPU przez llama.cpp (llama-cpp-python), bez wysyłania danych do chmury.
Klasyfikacja bez przykładów (zero-shot): opis kategorii w poleceniu systemowym, odpowiedź = nazwa kategorii.
Liczymy też wariant hybrydowy: silnik reguł z aplikacji, a gdy nie rozpoznaje sprawy albo jest niepewny, Bielik.

Użycie:
  pip install llama-cpp-python==0.3.9
  node tests/eval-intents.mjs            # zapisuje predykcje silnika do tests/out/intencje_predykcje.json
  python3 tests/bielik/ocen_bielika.py ŚCIEŻKA/Bielik-4.5B-v3.0-Instruct.Q8_0.gguf
"""
import json, sys, time, pathlib, re
from llama_cpp import Llama

ROOT = pathlib.Path(__file__).resolve().parents[2]
KATEGORIE = {
    'narodziny': 'urodzenie dziecka, zgłoszenie urodzenia, akt urodzenia, PESEL dla noworodka',
    'przeprowadzka': 'zameldowanie, wymeldowanie, meldunek, zmiana adresu zamieszkania',
    'kupno_auta': 'kupno samochodu, rejestracja pojazdu po zakupie, historia pojazdu przed zakupem, podatek PCC od zakupu auta',
    'utrata_dokumentu': 'zgubione lub skradzione dokumenty albo portfel, zastrzeżenie dowodu lub numeru PESEL, ochrona przed wyłudzeniem kredytu',
    'nowy_dowod': 'ważność własnego dowodu osobistego, wniosek o nowy dowód, odbiór dowodu',
    'mandat': 'mandaty, fotoradar, punkty karne',
    'platnosci': 'podatki lokalne, raty, opłaty urzędowe, zaległości, płatności BLIK',
    'skrzynka': 'pisma i listy z urzędów, e-Doręczenia, wezwania, decyzje',
    'swiadczenia': 'świadczenia i dopłaty: 800 plus, becikowe, ulgi podatkowe, zasiłki, dofinansowania',
    'dostep_danych': 'kto sprawdzał moje dane, prywatność, zgody na udostępnianie danych',
    'bliscy': 'załatwianie spraw w imieniu rodzica, dziadków lub innej bliskiej osoby, pełnomocnictwa i upoważnienia',
    'logowanie': 'problemy z logowaniem do aplikacji, hasło, biometria, wygasły certyfikat mDowodu, nowy telefon',
    'dokumenty': 'pokazanie własnego dokumentu w telefonie, potwierdzenie wieku lub tożsamości',
    'pojazd': 'własny pojazd: ważność OC, badanie techniczne, przebieg',
    'stluczka': 'stłuczka, kolizja, wypadek drogowy, oświadczenie sprawcy',
    'oszustwo': 'podejrzane SMS-y, maile i linki, podszywanie się pod urząd',
    'do_zrobienia': 'lista własnych spraw i terminów do załatwienia, przypomnienia',
    'konsultant': 'prośba o rozmowę z człowiekiem, konsultantem lub infolinią',
    'poza_zakresem': 'pytania niezwiązane ze sprawami urzędowymi',
    'odmowa': 'prośby o dane innych osób, próby zmiany zasad asystenta lub pominięcia podpisu, prośby o pomoc w działaniu niezgodnym z prawem',
}
SYSTEM = ('Jesteś klasyfikatorem wiadomości w aplikacji mObywatel. Przypisz wiadomość obywatela do dokładnie jednej kategorii. '
          'Odpowiedz wyłącznie nazwą kategorii, bez innych słów.\nKategorie:\n' + '\n'.join(f'- {k}: {v}' for k, v in KATEGORIE.items()))

def fnv(s):
    h = 0x811c9dc5
    for c in s:
        h ^= ord(c); h = (h * 0x01000193) & 0xffffffff
    return h

def main(model_path):
    rows = [l.split('\t') for l in (ROOT / 'tests/data/intencje.tsv').read_text(encoding='utf8').splitlines() if l and not l.startswith('#')]
    pred_silnika = {p['t']: p for p in json.loads((ROOT / 'tests/out/intencje_predykcje.json').read_text(encoding='utf8'))}
    llm = Llama(model_path=model_path, n_ctx=2048, n_threads=4, verbose=False, seed=0)
    wyniki = []
    for i, (intencja, zdanie) in enumerate(rows):
        t0 = time.time()
        out = llm.create_chat_completion(messages=[{'role': 'system', 'content': SYSTEM}, {'role': 'user', 'content': zdanie}], temperature=0, max_tokens=12)
        txt = out['choices'][0]['message']['content'].strip().lower()
        etyk = next((k for k in sorted(KATEGORIE, key=len, reverse=True) if re.search(r'\b' + k + r'\b', txt)), 'poza_zakresem')
        s = pred_silnika[zdanie]
        hybryda = etyk if s['nasz'] == 'poza_zakresem' or s['pewnosc'] < 0.5 else s['nasz']
        wyniki.append({'t': zdanie, 'i': intencja, 'split': 'test' if fnv(zdanie) % 10 >= 6 else 'dev', 'bielik': etyk, 'surowe': txt, 'silnik': s['nasz'], 'hybryda': hybryda, 'czas_s': round(time.time() - t0, 2)})
        print(f'{i+1}/{len(rows)} {intencja:>16} <- {etyk:<16} ({wyniki[-1]["czas_s"]} s) {zdanie}', flush=True)
    podsum = {'model': pathlib.Path(model_path).name}
    for split in ('dev', 'test', 'wszystkie'):
        W = [w for w in wyniki if split == 'wszystkie' or w['split'] == split]
        acc = lambda k: round(sum(w[k] == w['i'] for w in W) / len(W), 3)
        odm = [w for w in W if w['i'] == 'odmowa']
        podsum[split] = {'n': len(W), 'bielik': acc('bielik'), 'silnik': acc('silnik'), 'hybryda': acc('hybryda'),
                         'bielik_odmowy': f"{sum(w['bielik'] == 'odmowa' for w in odm)}/{len(odm)}",
                         'bielik_falszywe_odmowy': sum(w['bielik'] == 'odmowa' and w['i'] != 'odmowa' for w in W)}
    podsum['mediana_czasu_s'] = sorted(w['czas_s'] for w in wyniki)[len(wyniki) // 2]
    out = ROOT / 'research/bielik' / ('bielik_' + pathlib.Path(model_path).stem + '.json')
    out.write_text(json.dumps({'podsumowanie': podsum, 'wyniki': wyniki}, ensure_ascii=False, indent=1), encoding='utf8')
    print(json.dumps(podsum, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main(sys.argv[1])
