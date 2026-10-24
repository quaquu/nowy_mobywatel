// Sprawdza na stronie mobywatel.ai (na żywo), czy podpowiedzi z ekranu startowego czterech osób prowadzą do scenariusza,
// czy kończą się odpowiedzią „Tego w tej wersji jeszcze nie załatwię”. Wymaga internetu: node research/referencja-na-zywo/podpowiedzi.mjs
import { loadPlaywright } from '../../tests/lib.mjs';
const { chromium } = loadPlaywright();
const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
const wyniki = [];
for (const os of ['marta', 'jan', 'ewa', 'kacper']) {
  const U = `https://mobywatel.ai/aplikacja?osoba=${os}`;
  await p.goto(U, { waitUntil: 'networkidle' }); await p.waitForTimeout(800); await p.click('#prompt'); await p.waitForTimeout(500);
  const chipy = await p.evaluate(() => [...document.querySelectorAll('.sugg button span')].map(s => s.firstChild.textContent.trim()));
  for (const c of chipy) {
    await p.goto(U, { waitUntil: 'networkidle' }); await p.waitForTimeout(700); await p.click('#prompt'); await p.waitForTimeout(400);
    await p.locator('.sugg button', { hasText: c }).first().click();
    await p.waitForTimeout(4500);
    const txt = await p.evaluate(() => document.querySelector('#chat')?.innerText || '');
    const slepy = /Tego w tej wersji jeszcze nie załatwię/.test(txt);
    wyniki.push({ os, c, slepy });
    console.log(`${os.padEnd(7)} ${slepy ? '✗ ślepy zaułek' : '✓ działa     '}  ${c}`);
  }
}
const sl = wyniki.filter(w => w.slepy).length;
console.log(`\nŚlepe zaułki: ${sl} z ${wyniki.length} podpowiedzi na ekranie startowym`);
await b.close();
