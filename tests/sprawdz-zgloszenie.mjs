// Sprawdza limity znaków pól formularza mobywatel.ai w ZGLOSZENIE.md (tytul ≤ 160, opis 30–4000, technologie ≤ 300).
import { readFileSync } from 'node:fs';
const md = readFileSync(new URL('../ZGLOSZENIE.md', import.meta.url), 'utf8');
const LIMITY = { tytul: [1, 160], opis: [30, 4000], link: [8, 600], link2: [0, 600], technologie: [0, 300] };
let ok = true;
for (const [pole, [min, max]] of Object.entries(LIMITY)) {
  const m = md.match(new RegExp(`<!-- pole: ${pole}\\b[^>]*-->\\s*\`\`\`\\n([\\s\\S]*?)\\n\`\`\``));
  if (!m) { console.log(`✗ ${pole}: nie znaleziono`); ok = false; continue; }
  const n = [...m[1]].length;
  const dobrze = n >= min && n <= max;
  ok &&= dobrze;
  console.log(`${dobrze ? '✓' : '✗'} ${pole}: ${n} znaków (limit ${min}–${max})`);
}
process.exit(ok ? 0 : 1);
