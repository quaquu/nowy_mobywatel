// Sprawdza, czy działają wszystkie linki do źródeł (gov.pl, ZUS itd.) użyte w aplikacji.
// Wymaga internetu: node tests/linki.mjs
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../app/js/', import.meta.url);
const GOV = 'https://www.gov.pl/web/gov/';
const linki = new Set();
for (const f of readdirSync(dir)) {
  const src = readFileSync(new URL(f, dir), 'utf8');
  for (const m of src.matchAll(/https:\/\/[^\s'"`)<>]+/g)) linki.add(m[0].replace(/[.,]$/, ''));
  for (const m of src.matchAll(/GOV \+ '([^']+)'/g)) linki.add(GOV + m[1]);
}
let zle = 0;
for (const u of [...linki].filter(u => !u.includes('github.com/quaquu') && u !== GOV).sort()) {
  let s;
  let tytul = '';
  try {
    const r = await fetch(u, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (sprawdzanie linków prototypu)' } });
    s = r.status; tytul = ((await r.text()).match(/<title>([^<]*)/) || [])[1]?.trim() || '';
  } catch (e) { s = 'błąd: ' + e.cause?.code; }
  // gov.pl zwraca 200 także dla nieistniejących stron, wtedy tytuł to samo „Portal Gov.pl”
  const ok = s === 200 && tytul !== 'Portal Gov.pl';
  if (!ok) zle++;
  console.log(`${ok ? '✓' : '✗'} ${s} ${u}  [${tytul.slice(0, 60)}]`);
}
process.exit(zle ? 1 : 0);
