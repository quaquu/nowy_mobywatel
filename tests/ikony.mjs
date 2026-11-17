// Ikony PNG ze znaku app/icon.svg: `node tests/ikony.mjs`.
// 180 px dla iPhone'a (ekran początkowy; Safari nie bierze SVG), 192 i 512 px dla manifestu.
// Pełny kwadrat bez zaokrągleń (systemy nakładają własną maskę), znak pomniejszony do strefy bezpiecznej
// masek Androida (koło o promieniu 40% boku).
import { readFileSync } from 'node:fs';
import { loadPlaywright, ROOT } from './lib.mjs';
const { chromium } = loadPlaywright();
const APP = ROOT + 'app/';
const svg = readFileSync(APP + 'icon.svg', 'utf8')
  .replace('rx="16"', 'rx="0"')
  .replace('<path d="M22.2', '<g transform="translate(4.5 4.5) scale(.86)"><path d="M22.2')
  .replace('</svg>', '</g></svg>');
const b = await chromium.launch(); const p = await b.newPage();
for (const [plik, s] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await p.setViewportSize({ width: s, height: s });
  await p.setContent(`<style>html,body{margin:0;background:#004a93}</style><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${s}" height="${s}" style="display:block">`);
  await p.screenshot({ path: APP + plik });
  console.log('app/' + plik);
}
await b.close();
