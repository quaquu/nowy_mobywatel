# Miejsca ochronne z rejestru PSP dla gmin z pokazu (Łódź, Zgierz) -> app/dane/schrony.json.
# Źródło: „Punkty schronienia w Polsce”, dane.gov.pl (zbiór 28058), plik z gdziesieukryc.pl, licencja CC BY 4.0.
# Dane są wbudowane w aplikację, żeby mapa działała bez internetu (w czasie alarmu sieć często nie działa).
#   python3 narzedzia/schrony.py            # pobiera aktualny plik
#   python3 narzedzia/schrony.py plik.csv   # albo używa pobranego wcześniej
import csv, io, json, os, sys, urllib.request
from datetime import datetime, timezone
URL = 'https://gdziesieukryc.pl/PS_XML/punkty_schronienia.csv'
GMINY = ('Łódź', 'Zgierz')
DOSTEPNOSC = {'Całodobowa': 0, 'Określone godziny': 1, 'Na żądanie': 2}
WYJ = os.path.join(os.path.dirname(__file__), '..', 'app', 'dane', 'schrony.json')

if len(sys.argv) > 1:
    surowe, stan = open(sys.argv[1], 'rb').read(), datetime.fromtimestamp(os.path.getmtime(sys.argv[1]), timezone.utc)
else:
    with urllib.request.urlopen(urllib.request.Request(URL, headers={'User-Agent': 'prototyp-mobywatel/1.0 (dane publiczne PSP)'}), timeout=120) as r:
        surowe = r.read()
        lm = r.headers.get('Last-Modified')
        stan = datetime.strptime(lm, '%a, %d %b %Y %H:%M:%S %Z') if lm else datetime.now(timezone.utc)
punkty = []
for w in csv.DictReader(io.StringIO(surowe.decode('utf-8-sig'))):
    if w['Gmina'] not in GMINY: continue
    try: lat, lon = round(float(w['Szerokosc geograficzna']), 5), round(float(w['Dlugosc geograficzna']), 5)
    except ValueError: continue
    punkty.append([lat, lon, w['Adres'].strip(), DOSTEPNOSC.get(w['Dostepnosc'], 2), w['Gmina']])
punkty.sort()
os.makedirs(os.path.dirname(WYJ), exist_ok=True)
json.dump({'zrodlo': 'Punkty schronienia w Polsce (KG PSP), dane.gov.pl, licencja CC BY 4.0', 'url': 'https://dane.gov.pl/pl/dataset/28058',
           'stan': stan.strftime('%d.%m.%Y'), 'gminy': list(GMINY), 'pola': ['lat', 'lon', 'adres', 'dostepnosc 0 calodobowa 1 godziny 2 na zadanie', 'gmina'],
           'punkty': punkty}, open(WYJ, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(punkty)} punktów -> app/dane/schrony.json ({os.path.getsize(WYJ) // 1024} KB)')
