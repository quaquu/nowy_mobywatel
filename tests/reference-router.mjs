// Wierna kopia routera trybu skryptowego z prototypu referencyjnego (mobywatel.ai, plik mockup/scenarios.js,
// funkcja route): tylko dopasowanie tekstu, bez wykonywania scenariuszy. Używana wyłącznie do porównania.
//
/* Licencja kodu, z którego pochodzi ta funkcja (plik LICENSE prototypu referencyjnego):

MIT License

Copyright (c) 2026 Janusz Cieszyński

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Licencja MIT nie obejmuje godła RP, nazwy, logo i oznaczeń mObywatela, wyglądu dokumentów,
zdjęć osób z pokazu ani opisów usług z gov.pl (szczegóły w README.md, sekcja „Licencja”).
*/
const norm = t => t.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
export function trasaReferencyjna(t) {
  const n = norm(t);
  if (/pokaz.*(dowod|mdowod)/.test(n)) return 'docShow';
  if (/pokaz.*(prawo|prawk)/.test(n)) return 'docShow';
  if (/pokaz.*(auto|pojazd|samoch)/.test(n)) return 'docShow';
  if (/pokaz.*(kdr|duzej rodziny)/.test(n)) return 'docShow';
  if (/dowod.*(waz|traci)|waznosc dowodu/.test(n)) return 'dowodWaz';
  if (/zastrz.*pesel/.test(n)) return 'pesel';
  if (/znalaz|odblok\w* dowod/.test(n)) return 'znaleziony';
  if (/portfel|zgubil|ukradl|ukradzi|zastrz/.test(n)) return 'portfel';
  if (/stluczk|kolizj|wypadek|stluk|uderzyl|obtar/.test(n)) return 'stluczka';
  if (/kupuj|uzywan|historia pojazdu|sprawdz (auto|samoch)|kupic auto/.test(n)) return 'auto';
  if (/urodzil|urodzi|noworod|urodzenie/.test(n)) return 'dziecko';
  if (/sms|phishing|oszust|dziwn|podejrzan/.test(n)) return 'sms';
  if (/punkt/.test(n)) return 'punkty';
  if (/skrzynk|pismo|list z urzedu|e-doreczen/.test(n)) return 'letter';
  if (/\boc\b|ubezpiecz/.test(n)) return 'oc';
  if (/podatek|zaplac|oplac|oplat/.test(n)) return 'pay';
  if (/duzej rodziny|\bkdr\b/.test(n)) return 'kdr';
  if (/do zalatwienia|co mam|zaleg|przypomn|sprawy|powiadom/.test(n)) return 'todo';
  return 'fallback';
}
// Które nasze etykiety uznajemy za trafienie dla danej trasy referencyjnej (interpretacja na korzyść referencji).
export const MAPA_REF = {
  docShow: ['dokumenty'], kdr: ['dokumenty'],
  dowodWaz: ['nowy_dowod'],
  pesel: ['utrata_dokumentu'], znaleziony: ['utrata_dokumentu'], portfel: ['utrata_dokumentu'],
  stluczka: ['stluczka'], auto: ['kupno_auta'], dziecko: ['narodziny'], sms: ['oszustwo'],
  punkty: ['mandat'], letter: ['skrzynka'], oc: ['pojazd'], pay: ['platnosci', 'mandat'],
  todo: ['do_zrobienia'],
  fallback: ['poza_zakresem', 'odmowa'],
};
