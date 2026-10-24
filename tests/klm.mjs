// Historia flagowa „Narodziny dziecka”: liczba akcji użytkownika, podpisów i spraw oraz przewidywany
// czas według modelu KLM (Keystroke-Level Model, Card, Moran, Newell 1980), bez skracania animacji.
// Operatory: M (namysł) 1,35 s; P (wskazanie palcem) 1,1 s; B (dotknięcie i puszczenie) 0,2 s.
// Każde dotknięcie liczymy jako M + P + B = 2,65 s; do tego mierzony czas reakcji systemu.
import { loadPlaywright } from './lib.mjs';
const DOTKNIECIE = 1.35 + 1.1 + 0.2;

async function zmierz(b, url, kroki) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(url); await p.waitForTimeout(800);
  let systemMs = 0, akcje = 0;
  for (const [opis, sel, czekaj] of kroki) {
    await p.locator(sel).first().waitFor({ state: 'visible', timeout: 15000 });
    const t = Date.now();
    await p.locator(sel).first().click(); akcje++;
    if (czekaj) await p.locator(czekaj).first().waitFor({ state: 'visible', timeout: 15000 });
    systemMs += Date.now() - t;
  }
  p.przyciskiNaKoniec = await p.locator('#chat button:visible').allTextContents().catch(() => []);
  await p.close();
  return { przyciskiNaKoniec: p.przyciskiNaKoniec, akcje, systemS: +(systemMs / 1000).toFixed(1), sekundy: Math.round(akcje * DOTKNIECIE + systemMs / 1000) };
}

export async function klm(url, refUrl) {
  const { chromium } = loadPlaywright();
  const b = await chromium.launch();
  const ctx = await b.newContext(); // bez __SZYBKO: prawdziwe animacje
  const nasz = await zmierz(ctx, url + '#/start', [
    ['karta sprawy', 'a.hero', '#imie'],
    ['imię', '[data-imie="Zofia"]'],
    ['przejrzyj i podpisz', '#nar-dalej', '#arkusz-ok'],
    ['podpisz', '#arkusz-ok', 'text=Wszystko wysłane jednym podpisem'],
  ]);
  Object.assign(nasz, { podpisy: 1, sprawy: 5, instytucje: 4 });
  let ref = null;
  if (refUrl) {
    // Prototyp referencyjny (tryb skryptowy z mobywatel.ai), osoba „Marta”: zgłoszenie urodzenia i 800+.
    // Po wyborze 800+ podpowiedź „Karta Dużej Rodziny” znika, więc liczymy dwie sprawy.
    ref = await zmierz(ctx, refUrl, [
      ['pole rozmowy', '#prompt', 'button:has-text("Urodziło nam się dziecko")'],
      ['podpowiedź', 'button:has-text("Urodziło nam się dziecko")', 'button:has-text("Helena")'],
      ['imię', 'button:has-text("Helena")', 'button:has-text("Podpisz i wyślij")'],
      ['podpisz USC', 'button:has-text("Podpisz i wyślij")', 'button:has-text("Złóż wniosek o 800+")'],
      ['800+', 'button:has-text("Złóż wniosek o 800+")', 'button:has-text("Wyślij do ZUS")'],
      ['podpisz ZUS', 'button:has-text("Wyślij do ZUS")', 'text=Wniosek wysłany do ZUS'],
    ]);
    Object.assign(ref, { podpisy: 2, sprawy: 2, instytucje: 2 });
  }
  await b.close();
  return { nasz, ref, operatorDotkniecia: DOTKNIECIE };
}
