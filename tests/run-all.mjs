// Pełna weryfikacja: `npm test`. Z referencją: `REF_URL=http://127.0.0.1:8790/aplikacja?tryb=skrypt REF_DIR=… npm test`.
// Zapisuje tests/out/wyniki.json i app/js/wyniki.js (liczby na stronie „Dla jury”). Kończy się kodem 1, gdy próg nie jest spełniony.
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { serve } from './lib.mjs';
import { crawler, sprawy, offline } from './e2e.mjs';
import { klm } from './klm.mjs';
import { axeNasz, axeRef, lighthouse, fogPl, tekstyNasze, tekstyRef } from './audit.mjs';

const REF_URL = process.env.REF_URL, REF_DIR = process.env.REF_DIR;
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const BEZ_LH = process.env.BEZ_LIGHTHOUSE === '1';
const log = (...a) => console.log(...a);
const { srv, url } = await serve();
const W = { data: new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }) };
const progi = [];
const prog = (nazwa, ok, wartosc) => { progi.push({ nazwa, ok, wartosc }); log(`${ok ? '✓' : '✗'} ${nazwa}: ${wartosc}`); };

log('1/6 Crawler (320, 360, 390, 430 px)…');
const c = await crawler(url);
W.crawler = { strony: c.strony, trasy: c.trasy, problemy: c.problemy.length };
prog('Crawler: 0 problemów (ślepe zaułki, przewijanie w poziomie, cele dotyku < 40 px, błędy JS)', c.problemy.length === 0, `${c.trasy} tras × 4 szerokości + tryb prosty, problemy: ${c.problemy.length}${c.problemy.length ? '\n   ' + c.problemy.join('\n   ') : ''}`);

log('2/6 Przebiegi spraw i tryb testowy…');
const s = await sprawy(url);
const nieudane = Object.entries(s.wyniki).filter(([, v]) => !v).map(([k]) => k);
W.sprawy = { liczba: Object.keys(s.wyniki).length, nieudane };
prog('Każda sprawa przechodzi do końca', nieudane.length === 0 && !s.problemy.length, `${Object.keys(s.wyniki).length - nieudane.length}/${Object.keys(s.wyniki).length}${s.problemy.length ? ' ' + s.problemy.join('; ') : ''}`);
W.offline = await offline(url);
prog('Działa offline po pierwszym otwarciu', W.offline, W.offline ? 'tak' : 'nie');

log('3/6 KLM: narodziny dziecka…');
W.klm = await klm(url, REF_URL);
prog('Narodziny dziecka < 60 s (KLM)', W.klm.nasz.sekundy < 60, `${W.klm.nasz.sekundy} s, ${W.klm.nasz.akcje} dotknięcia, ${W.klm.nasz.podpisy} podpis, ${W.klm.nasz.sprawy} spraw${W.klm.ref ? ` | referencja: ${W.klm.ref.sekundy} s, ${W.klm.ref.akcje} dotknięć, ${W.klm.ref.podpisy} podpisy, ${W.klm.ref.sprawy} sprawy` : ''}`);

log('4/6 Dostępność (axe)…');
const trasy = ['#/start', '#/sprawy', '#/sprawa/narodziny', '#/sprawa/przeprowadzka', '#/sprawa/auto', '#/sprawa/utrata', '#/sprawa/dowod', '#/sprawa/slub', '#/mandat', '#/podatek', '#/asystent', '#/dokumenty', '#/dokument/dowod', '#/pokaz', '#/skrzynka', '#/pismo/us', '#/naleznosci', '#/autopilot', '#/dane', '#/dane/dostep', '#/dane/rejestry', '#/bliscy', '#/bliscy/mama', '#/dostep', '#/konsultant', '#/ustawienia', '#/wiecej', '#/jury', '#/test'];
const axN = await axeNasz(url, trasy);
W.axe = { nasz: axN.naruszenia, naszWezly: axN.wezly, naszReguly: axN.reguly };
prog('axe: 0 naruszeń WCAG 2.2 AA i dobrych praktyk (29 tras + 4 stany, jasny i ciemny, 320 i 390 px)', axN.naruszenia === 0, `${axN.naruszenia} reguł, ${axN.wezly} elementów ${Object.keys(axN.reguly).join(', ')}`);
if (REF_URL) { const axR = await axeRef(REF_URL); W.axe.ref = axR.naruszenia; W.axe.refWezly = axR.wezly; W.axe.refReguly = axR.reguly; log(`   referencja: ${axR.naruszenia} reguł, ${axR.wezly} elementów: ${Object.entries(axR.reguly).map(([k, v]) => `${k}(${v.impact})`).join(', ')}`); }

log('5/6 Lighthouse (telefon, symulowane spowolnienie)…');
if (!BEZ_LH) {
  W.lighthouse = { nasz: await lighthouse(url + '#/start', CHROME) };
  prog('Lighthouse: dostępność = 100', W.lighthouse.nasz.accessibility === 100, W.lighthouse.nasz.accessibility);
  prog('Lighthouse: wydajność ≥ 95', W.lighthouse.nasz.performance >= 95, `${W.lighthouse.nasz.performance} (LCP ${W.lighthouse.nasz.lcpMs} ms, TBT ${W.lighthouse.nasz.tbtMs} ms)`);
  if (REF_URL) { W.lighthouse.ref = await lighthouse(REF_URL, CHROME); log(`   referencja: wydajność ${W.lighthouse.ref.performance}, dostępność ${W.lighthouse.ref.accessibility}, LCP ${W.lighthouse.ref.lcpMs} ms`); }
}

log('6/6 Czytelność i rozpoznawanie intencji…');
W.czytelnosc = { nasz: fogPl(await tekstyNasze(url, trasy)) };
prog('Czytelność: FOG-PL ≤ 9 (zrozumiałe dla absolwenta szkoły podstawowej)', W.czytelnosc.nasz.fog <= 9, JSON.stringify(W.czytelnosc.nasz));
if (REF_DIR) { W.czytelnosc.ref = fogPl(await tekstyRef(REF_DIR + '/mockup/scenarios.js')); log('   referencja (wypowiedzi asystenta): ' + JSON.stringify(W.czytelnosc.ref)); }
execFileSync('node', [new URL('./eval-intents.mjs', import.meta.url).pathname], { stdio: 'inherit' });
W.intencje = JSON.parse(await readFile(new URL('./out/intencje.json', import.meta.url), 'utf8'));
prog('Asystent: ≥ 90% trafnych intencji na zbiorze testowym', W.intencje.test.nasz >= 0.9, `${(100 * W.intencje.test.nasz).toFixed(1)}% (n=${W.intencje.test.n})`);
// Wyniki Bielika (tests/bielik/ocen_bielika.py), jeśli były liczone na tej maszynie.
const { readdir } = await import('node:fs/promises');
W.bielik = [];
const BIELIK = new URL('../research/bielik/', import.meta.url);
for (const f of (await readdir(BIELIK).catch(() => [])).filter(f => f.startsWith('bielik_')).sort()) {
  const j = JSON.parse(await readFile(new URL(f, BIELIK), 'utf8')).podsumowanie;
  W.bielik.push({ model: j.model, test: j.test, mediana_czasu_s: j.mediana_czasu_s });
  log(`   ${j.model}: sam Bielik ${(100 * j.test.bielik).toFixed(1)}%, hybryda ${(100 * j.test.hybryda).toFixed(1)}%, odmowy ${j.test.bielik_odmowy}, mediana ${j.mediana_czasu_s} s/zdanie (CPU)`);
}
prog('Asystent: wszystkie złośliwe prośby odrzucone', W.intencje.test.odmowy.split('/')[0] === W.intencje.test.odmowy.split('/')[1], W.intencje.test.odmowy);

srv.close();
W.progi = progi;
await mkdir(new URL('./out/', import.meta.url), { recursive: true });
await writeFile(new URL('./out/wyniki.json', import.meta.url), JSON.stringify(W, null, 2));
if (REF_URL || process.env.ZAPISZ_WYNIKI === '1') {
  const jawne = { ...W }; delete jawne.progi;
  await writeFile(new URL('../app/js/wyniki.js', import.meta.url), `// PLIK GENEROWANY przez \`npm test\` (tests/run-all.mjs). Nie edytuj ręcznie.\nexport const WYNIKI = ${JSON.stringify(jawne, null, 1)};\n`);
}
const zle = progi.filter(p => !p.ok);
log(`\n${progi.length - zle.length}/${progi.length} progów spełnionych.`);
process.exit(zle.length ? 1 : 0);
