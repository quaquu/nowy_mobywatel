// Dostępność (axe-core, WCAG 2.2 AA + dobre praktyki), Lighthouse (telefon) i czytelność tekstów (FOG-PL).
import { loadPlaywright, runAxe } from './lib.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sh = promisify(execFile);

function zbierz(wyniki) {
  const reguly = {};
  for (const [stan, lista] of Object.entries(wyniki)) for (const v of lista) {
    reguly[v.id] ||= { impact: v.impact, help: v.help, wezly: 0, stany: [] };
    reguly[v.id].wezly += v.nodes; reguly[v.id].stany.push(stan);
  }
  return { naruszenia: Object.keys(reguly).length, wezly: Object.values(reguly).reduce((a, r) => a + r.wezly, 0), reguly };
}

// Nasza aplikacja: każda trasa + stany z otwartym arkuszem zgody, rozmową i paskiem testu, w 320 i 390 px.
export async function axeNasz(url, trasy) {
  const { chromium } = loadPlaywright();
  const b = await chromium.launch();
  const wyniki = {};
  for (const w of [320, 390]) for (const ciemny of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, colorScheme: ciemny ? 'dark' : 'light', serviceWorkers: 'block' });
    await ctx.addInitScript(() => { window.__SZYBKO = true; });
    const p = await ctx.newPage();
    for (const h of trasy) { await p.goto(url + h); await p.waitForSelector('main h1'); wyniki[`${w}${ciemny ? 'c' : ''} ${h}`] = await runAxe(p); }
    await p.goto(url + '#/sprawa/narodziny'); await p.click('[data-imie="Zofia"]'); await p.click('#nar-dalej'); await p.waitForSelector('dialog.arkusz');
    wyniki[`${w}${ciemny ? 'c' : ''} arkusz zgody`] = await runAxe(p);
    await p.goto(url + '#/asystent?q=zgubi%C5%82am%20portfel'); await p.waitForSelector('.msg.bot >> nth=1');
    wyniki[`${w}${ciemny ? 'c' : ''} rozmowa`] = await runAxe(p);
    await p.goto(url + '#/ustawienia'); await p.check('[data-ust="prosty"]'); await p.check('[data-ust="kontrast"]'); await p.goto(url + '#/start');
    wyniki[`${w}${ciemny ? 'c' : ''} tryb prosty`] = await runAxe(p);
    await ctx.close();
  }
  // Komputer: symulacja telefonu z panelem opisu (jasny i ciemny motyw)
  for (const ciemny of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: ciemny ? 'dark' : 'light', serviceWorkers: 'block' });
    const p = await ctx.newPage();
    await p.goto(url + '#/start'); await p.waitForSelector('main h1');
    wyniki[`1440${ciemny ? 'c' : ''} telefon z panelem`] = await runAxe(p);
    await ctx.close();
  }
  await b.close();
  return zbierz(wyniki);
}

// Referencja: ekran główny, rozmowa w toku i karta potwierdzenia (tryb skryptowy).
export async function axeRef(refUrl) {
  const { chromium } = loadPlaywright();
  const b = await chromium.launch();
  const wyniki = {};
  for (const w of [320, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto(refUrl); await p.waitForTimeout(800);
    wyniki[`${w} start`] = await runAxe(p);
    await p.click('#prompt'); await p.click('button:has-text("Urodziło nam się dziecko")'); await p.click('button:has-text("Helena")');
    await p.waitForSelector('button:has-text("Podpisz i wyślij")');
    wyniki[`${w} rozmowa z kartą potwierdzenia`] = await runAxe(p);
    await p.close();
  }
  await b.close();
  return zbierz(wyniki);
}

export async function lighthouse(url, chromePath) {
  const dir = await mkdtemp(join(tmpdir(), 'lh-'));
  const out = join(dir, 'lh.json');
  const bin = new URL('../node_modules/.bin/lighthouse', import.meta.url).pathname;
  await sh(bin, [url, '--quiet', '--output=json', `--output-path=${out}`, '--only-categories=performance,accessibility,best-practices',
    `--chrome-flags=--headless=new --no-sandbox --disable-gpu`, '--form-factor=mobile'], { env: { ...process.env, CHROME_PATH: chromePath }, maxBuffer: 1 << 26, timeout: 240000 });
  const j = JSON.parse(await readFile(out, 'utf8'));
  const s = k => Math.round(j.categories[k].score * 100);
  return { performance: s('performance'), accessibility: s('accessibility'), bestPractices: s('best-practices'), lcpMs: Math.round(j.audits['largest-contentful-paint'].numericValue), tbtMs: Math.round(j.audits['total-blocking-time'].numericValue) };
}

/* ---- Czytelność: FOG-PL (Gunning FOG dostosowany do polszczyzny: trudne słowa = 4+ sylaby) ---- */
const SAMOGL = /[aąeęioóuy]/;
export function sylaby(slowo) {
  const s = slowo.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, '');
  if (!s) return 0;
  let n = 0, poprz = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i], sam = SAMOGL.test(c);
    // „i” przed samogłoską zmiękcza (np. „nie”, „sió”) i nie tworzy osobnej sylaby
    if (c === 'i' && SAMOGL.test(s[i + 1] || '')) { poprz = false; continue; }
    if (sam && !poprz) n++;
    poprz = sam;
  }
  return Math.max(1, n);
}
export function fogPl(tekst) {
  const zdania = tekst.split(/[.!?…:\n]+/).map(z => z.trim()).filter(z => z.split(/\s+/).length >= 2);
  const slowa = zdania.flatMap(z => z.split(/\s+/)).map(w => w.replace(/[^\p{L}]/gu, '')).filter(Boolean);
  const trudne = slowa.filter(w => sylaby(w) >= 4).length;
  const asl = slowa.length / zdania.length, phw = 100 * trudne / slowa.length;
  return { zdania: zdania.length, slowa: slowa.length, sredniaDlugoscZdania: +asl.toFixed(1), procentTrudnych: +phw.toFixed(1), fog: +(0.4 * (asl + phw)).toFixed(1) };
}

// Teksty naszej aplikacji: treść każdej trasy (bez nawigacji) i wszystkie odpowiedzi asystenta.
export async function tekstyNasze(url, trasy) {
  const { chromium } = loadPlaywright();
  const b = await chromium.launch();
  const p = await b.newPage();
  const teksty = new Set();
  for (const h of trasy) {
    if (/\/(test|jury)/.test(h)) continue; // ekrany dla jury/testerów nie są dla obywatela
    await p.goto(url + h); await p.waitForSelector('main h1');
    const t = await p.evaluate(() => [...document.querySelectorAll('main p, main li, main small, main summary, main h1, main h2, main label, main .btn')].map(e => e.innerText.trim()).filter(x => x.length > 2));
    t.forEach(x => teksty.add(x));
  }
  await b.close();
  const { O } = await import('../app/js/asystent.js');
  Object.values(O).forEach(o => teksty.add(o.t));
  return [...teksty].join('.\n');
}

// Teksty prototypu referencyjnego: wszystkie wypowiedzi asystenta w trybie skryptowym (say('…')).
export async function tekstyRef(plikScenariuszy) {
  const src = await readFile(plikScenariuszy, 'utf8');
  return [...src.matchAll(/say\((['`])(.*?)\1/g)].map(m => m[2].replace(/<[^>]+>/g, '').replace(/\$\{[^}]*\}/g, 'X')).join('.\n');
}
