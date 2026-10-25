// Sztuczny obraz z kamery do testów skanera: plik Y4M z kodem QR, podawany Chromium flagą
// --use-file-for-fake-video-capture. Dzięki temu test przechodzi całą drogę: aparat, odczyt kodu, ekran zgody.
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

export function y4mZKodem(tekst, plik, { W = 640, H = 480, klatki = 10 } = {}) {
  const q = QRCode.create(tekst, { errorCorrectionLevel: 'M' }).modules;
  const n = q.size, mod = Math.floor(Math.min(W, H) * 0.8 / (n + 8)), bok = mod * n;
  const x0 = Math.floor((W - bok) / 2), y0 = Math.floor((H - bok) / 2);
  const Y = Buffer.alloc(W * H, 235);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.get(r, c))
    for (let dy = 0; dy < mod; dy++) Y.fill(16, (y0 + r * mod + dy) * W + x0 + c * mod, (y0 + r * mod + dy) * W + x0 + (c + 1) * mod);
  const UV = Buffer.alloc((W / 2) * (H / 2) * 2, 128);
  const klatka = Buffer.concat([Buffer.from('FRAME\n'), Y, UV]);
  writeFileSync(plik, Buffer.concat([Buffer.from(`YUV4MPEG2 W${W} H${H} F10:1 Ip A1:1 C420jpeg\n`), ...Array(klatki).fill(klatka)]));
  return plik;
}
