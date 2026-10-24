// Ocena rozpoznawania intencji: nasz silnik vs router skryptowy prototypu referencyjnego (mobywatel.ai).
// Podział: zdanie trafia do zbioru „test” deterministycznie (FNV-1a % 10 >= 6), reszta to „dev”.
// Silnik stroiliśmy wyłącznie na „dev”; błędy z „test” drukujemy tylko z flagą --pokaz-test.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { rozpoznaj } from '../app/js/intents.js';
import { trasaReferencyjna, MAPA_REF } from './reference-router.mjs';

const rows = readFileSync(new URL('./data/intencje.tsv', import.meta.url), 'utf8')
  .split('\n').filter(l => l && !l.startsWith('#')).map(l => { const [i, t] = l.split('\t'); return { i, t }; });
const fnv = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
for (const r of rows) r.split = fnv(r.t) % 10 >= 6 ? 'test' : 'dev';

const showTest = process.argv.includes('--pokaz-test');
const res = { dev: {}, test: {} };
for (const split of ['dev', 'test']) {
  const S = rows.filter(r => r.split === split);
  let ok = 0, okRef = 0, okShared = 0, okRefShared = 0, nShared = 0, odmowaOk = 0, odmowaN = 0, falseRefusal = 0;
  const errs = [];
  for (const r of S) {
    const got = rozpoznaj(r.t).intencja;
    const ref = trasaReferencyjna(r.t);
    const refOk = (MAPA_REF[ref] || []).includes(r.i);
    if (got === r.i) ok++; else errs.push(`${r.i} <- ${got}: ${r.t}`);
    if (refOk) okRef++;
    const shared = Object.values(MAPA_REF).some(v => v.includes(r.i)) && r.i !== 'poza_zakresem' && r.i !== 'odmowa';
    if (shared) { nShared++; if (got === r.i) okShared++; if (refOk) okRefShared++; }
    if (r.i === 'odmowa') { odmowaN++; if (got === 'odmowa') odmowaOk++; }
    else if (got === 'odmowa') falseRefusal++;
  }
  res[split] = { n: S.length, nasz: ok / S.length, referencja: okRef / S.length, nShared, naszWspolne: okShared / nShared, refWspolne: okRefShared / nShared, odmowy: `${odmowaOk}/${odmowaN}`, falszyweOdmowy: falseRefusal };
  console.log(`\n[${split}] n=${S.length}  nasz: ${(100 * ok / S.length).toFixed(1)}%  referencja: ${(100 * okRef / S.length).toFixed(1)}%  | intencje obsługiwane przez obie (n=${nShared}): nasz ${(100 * okShared / nShared).toFixed(1)}%, ref ${(100 * okRefShared / nShared).toFixed(1)}%  | złośliwe odrzucone: ${odmowaOk}/${odmowaN}, fałszywe odmowy: ${falseRefusal}`);
  if (split === 'dev' || showTest) errs.forEach(e => console.log('  ✗', e));
}
mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
writeFileSync(new URL('./out/intencje.json', import.meta.url), JSON.stringify(res, null, 2));
