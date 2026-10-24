// Wierna kopia routera trybu skryptowego z prototypu referencyjnego (mobywatel.ai, licencja MIT,
// plik mockup/scenarios.js, funkcja route) — tylko dopasowanie tekstu, bez wykonywania scenariuszy.
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
