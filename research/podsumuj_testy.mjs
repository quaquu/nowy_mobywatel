// Podsumowanie testów z użytkownikami: node research/podsumuj_testy.mjs research/testy/*.json
// Dla każdego zadania: sukces z 95% przedziałem Wilsona, mediana czasu i kliknięć; SUS: średnia ± 95% CI (t-Studenta).
import { readFileSync } from 'node:fs';

const pliki = process.argv.slice(2);
if (!pliki.length) { console.log('Podaj pliki JSON z trybu testowego.'); process.exit(1); }
const sesje = pliki.map(f => JSON.parse(readFileSync(f, 'utf8')));

const wilson = (k, n, z = 1.96) => {
  if (!n) return [0, 0];
  const p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
  return [(c - m) / d, (c + m) / d];
};
const mediana = a => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };
const T95 = [12.71, 4.30, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23]; // t(0,975; df=1..10)
const sredniaCI = a => {
  const n = a.length; if (!n) return null;
  const m = a.reduce((x, y) => x + y, 0) / n;
  if (n < 2) return { m, ci: null };
  const sd = Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (n - 1));
  return { m, ci: (T95[n - 2] ?? 1.96) * sd / Math.sqrt(n) };
};
const proc = x => (100 * x).toFixed(0) + '%';

console.log(`Testerów: ${sesje.length} (65+: ${sesje.filter(s => s.wiek === '65+').length})\n`);
console.log('| Zadanie | Sukces | 95% CI | Mediana czasu (s) | Mediana kliknięć |\n|---|---:|---:|---:|---:|');
const ids = [...new Set(sesje.flatMap(s => s.wyniki.map(w => w.id)))];
let wszystkieK = 0, wszystkieN = 0;
for (const id of ids) {
  const w = sesje.map(s => s.wyniki.find(x => x.id === id)).filter(Boolean);
  const k = w.filter(x => x.sukces).length; wszystkieK += k; wszystkieN += w.length;
  const [lo, hi] = wilson(k, w.length);
  console.log(`| ${id} | ${k}/${w.length} (${proc(k / w.length)}) | ${proc(lo)}–${proc(hi)} | ${mediana(w.filter(x => x.sukces).map(x => x.czasS)) ?? '–'} | ${mediana(w.map(x => x.klikniecia))} |`);
}
const [lo, hi] = wilson(wszystkieK, wszystkieN);
console.log(`| **Razem** | ${wszystkieK}/${wszystkieN} (${proc(wszystkieK / wszystkieN)}) | ${proc(lo)}–${proc(hi)} | | |\n`);
for (const [nazwa, f] of [['wszyscy', () => true], ['65+', s => s.wiek === '65+']]) {
  const r = sredniaCI(sesje.filter(f).map(s => s.sus?.wynik).filter(x => x != null));
  console.log(`SUS (${nazwa}): ${r ? r.m.toFixed(1) + (r.ci != null ? ` ± ${r.ci.toFixed(1)}` : '') : 'brak danych'}`);
}
