// Te same zdania co w podpowiedziach, ale wpisane w pole rozmowy na stronie mobywatel.ai (osoba Jan).
import { loadPlaywright } from '../../tests/lib.mjs';
const { chromium } = loadPlaywright();
const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true })).newPage();
let sl = 0; const zdania = ['Co chce ode mnie Urząd Skarbowy?', 'Chcę na chwilę odblokować PESEL', 'Jedziemy z dziećmi do Egiptu', 'Ile będę miała emerytury?', 'Jakie recepty ma moja mama?', 'Chcę głosować w Gdańsku', 'Mój dowód traci ważność', 'Zgubiłem portfel'];
for (const z of zdania) {
  await p.goto('https://mobywatel.ai/aplikacja?osoba=jan', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.fill('#prompt', z); await p.press('#prompt', 'Enter'); await p.waitForTimeout(4500);
  const s = /Tego w tej wersji jeszcze nie załatwię/.test(await p.evaluate(() => document.querySelector('#chat')?.innerText || ''));
  sl += s; console.log(`${s ? '✗ nie rozpoznaje' : '✓ rozpoznaje   '}  ${z}`);
}
console.log(`\nWpisane tekstem: ${sl} z ${zdania.length} zdań z podpowiedzi kończy się „Tego w tej wersji jeszcze nie załatwię”`);
await b.close();
