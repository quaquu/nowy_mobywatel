// Pomiar prototypu referencyjnego (J. Cieszyński, mobywatel.ai) tym samym zestawem narzędzi.
// Użycie: node tests/baseline-reference.mjs http://127.0.0.1:8790/aplikacja?tryb=skrypt
import { loadPlaywright, runAxe } from './lib.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.argv[2];
const out = process.argv[3] || 'tests/out/reference';
await mkdir(out, { recursive: true });
const { chromium } = loadPlaywright();
const b = await chromium.launch();
const res = {};
for (const w of [320, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 780 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/home-${w}.png` });
  res[w] = { axe: await runAxe(p), pageErrors: errs, hScroll: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth) };
  await p.close();
}
await writeFile(`${out}/axe.json`, JSON.stringify(res, null, 2));
for (const [w, r] of Object.entries(res)) console.log(w, 'axe:', r.axe.map(v => `${v.id}(${v.impact},${v.nodes})`).join(' ') || 'brak', '| hscroll', r.hScroll, '| errors', r.pageErrors.length);
await b.close();
