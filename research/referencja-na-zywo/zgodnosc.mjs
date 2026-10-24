// Czy strona mobywatel.ai na żywo rozpoznaje sprawy tak samo jak router z pobranego kodu (tests/reference-router.mjs)?
// Próba: co dziesiąte zdanie ze zbioru testowego. Wynik 24.10.2026: 21/21 zgodnych.
import { loadPlaywright } from '../../tests/lib.mjs';
import { trasaReferencyjna } from '../../tests/reference-router.mjs';
import { readFileSync } from 'node:fs';
const rows = readFileSync(new URL('../../tests/data/intencje.tsv', import.meta.url), 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('\t')[1]);
const proba = rows.filter((_, i) => i % 10 === 3); // co dziesiąte zdanie, deterministycznie
const { chromium } = loadPlaywright();
const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true })).newPage();
let zgodne = 0;
for (const z of proba) {
  await p.goto('https://mobywatel.ai/aplikacja?osoba=marta', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.fill('#prompt', z); await p.press('#prompt', 'Enter'); await p.waitForTimeout(4000);
  const live = /Tego w tej wersji jeszcze nie załatwię/.test(await p.evaluate(() => document.querySelector('#chat')?.innerText || '')) ? 'fallback' : 'scenariusz';
  const lok = trasaReferencyjna(z) === 'fallback' ? 'fallback' : 'scenariusz';
  zgodne += live === lok; console.log(`${live === lok ? '=' : '≠'} na żywo: ${live.padEnd(10)} lokalnie: ${lok.padEnd(10)} ${z}`);
}
console.log(`\nZgodność strony na żywo z kodem z ZIP: ${zgodne}/${proba.length}`);
await b.close();
