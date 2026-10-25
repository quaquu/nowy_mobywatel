// Generuje kody QR do pokazu skanera (app/img/kod-*.svg). Uruchom: node skrypty/kody-qr.mjs
// Kody mObywatela prowadzą na adres prototypu, więc zwykły aparat telefonu też je otworzy.
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

const ADRES = 'https://quaquu.github.io/nowy_mobywatel/';
export const KODY = {
  sklep: ADRES + '#/kod/sklep',
  urzad: ADRES + '#/kod/urzad',
  logowanie: ADRES + '#/kod/logowanie',
  parkometr: 'https://oplata-parkingu.example/zaplac?strefa=A', // domena .example: nigdy nie istnieje
};

for (const [id, tekst] of Object.entries(KODY)) {
  const svg = await QRCode.toString(tekst, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#111216', light: '#ffffff' } });
  writeFileSync(new URL(`../app/img/kod-${id}.svg`, import.meta.url), svg);
  console.log(id, tekst);
}
