// Detektor Impeccable (impeccable.style): wzorce „interfejsu z AI” i błędy jakości w kodzie i na wyrenderowanych ekranach.
// Ekrany skanujemy w widoku pełnym (?widok=pelny): ramka telefonu na komputerze to oprawa prezentacji, nie interfejs.
// Wyjątki (np. świadomie wybrany krój Lato) są zapisane z uzasadnieniem w .impeccable/config.json.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BIN = new URL('../node_modules/.bin/impeccable', import.meta.url).pathname;
const KORZEN = new URL('..', import.meta.url).pathname;

function chromeDlaRoota(chrome) {
  // Chromium nie startuje jako root bez --no-sandbox (kontener); na zwykłym koncie zostawiamy przeglądarkę bez zmian.
  if (!chrome || process.getuid?.() !== 0) return chrome;
  const f = join(mkdtempSync(join(tmpdir(), 'imp-')), 'chrome.sh');
  writeFileSync(f, `#!/bin/sh\nexec "${chrome}" --no-sandbox "$@"\n`, { mode: 0o755 });
  return f;
}

function skan(cele, env) {
  let wyj;
  try { wyj = execFileSync(BIN, ['detect', '--json', ...cele], { cwd: KORZEN, env, encoding: 'utf8', maxBuffer: 1 << 26, timeout: 600000, stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch (e) { wyj = e.stdout; } // kod wyjścia ≠ 0, gdy są zgłoszenia
  const lista = JSON.parse(wyj || '[]');
  return lista.filter(f => !f.advisory);
}

export function impeccable(url, trasy, chrome) {
  const env = { ...process.env, CHROME_PATH: chromeDlaRoota(chrome) || process.env.CHROME_PATH };
  try { execFileSync(BIN, ['telemetry', 'off'], { env, stdio: 'ignore' }); } catch {}
  const kod = skan(['app/'], env);
  const ekrany = skan(trasy.map(t => `${url}?widok=pelny${t}`), env);
  const ramka = skan([`${url}?widok=telefon#/start`], env);
  const wszystkie = [...kod, ...ekrany, ...ramka];
  return { kod: kod.length, ekrany: ekrany.length, ramka: ramka.length, razem: wszystkie.length, ekranow: trasy.length, szczegoly: wszystkie.map(f => `${f.antipattern} @ ${String(f.file).replace(url, '/')} ${f.selector || f.snippet || ''}`) };
}

// Ten sam detektor na prototypie referencyjnym: kod (katalog mockup/) i ekran startowy.
export function impeccableRef(refUrl, refDir, chrome) {
  const env = { ...process.env, CHROME_PATH: chromeDlaRoota(chrome) || process.env.CHROME_PATH };
  const kod = refDir ? skan([refDir + '/mockup/'], env) : [];
  const ekran = skan([refUrl], env);
  return { kod: kod.length, ekrany: ekran.length, razem: kod.length + ekran.length, reguly: [...new Set([...kod, ...ekran].map(f => f.antipattern))] };
}
