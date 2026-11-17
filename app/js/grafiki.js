// Ilustracje: portrety osób z pokazu (raster), auto z boku i zdjęcie z fotoradaru (wektor).
// Wszystkie przedstawiają osoby FIKCYJNE (bez zdjęć prawdziwych ludzi).
// Każde wywołanie dostaje własne identyfikatory gradientów (ten sam rysunek może być dwa razy na ekranie).
let licznik = 0;
const svg = (vb, tresc, opis) => {
  const n = 'g' + (++licznik) + '-';
  return `<svg viewBox="${vb}" ${opis ? `role="img" aria-label="${opis}"` : 'aria-hidden="true"'} focusable="false" xmlns="http://www.w3.org/2000/svg">${tresc.replace(/id="([^"]+)"/g, `id="${n}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${n}$1)`)}</svg>`;
};

// Portrety osób z pokazu: rastrowe ilustracje osób FIKCYJNYCH (img/osoby/*.webp). Wygenerowane lokalnie modelami
// Stable Diffusion 1.5 (Realistic Vision 5.1, potem DreamShaper 8; licencja CreativeML OpenRAIL-M), skrypt i ziarna:
// narzedzia/portrety.py. Kadr „dowod” to całe zdjęcie 4:5, „awatar” przybliża twarz w kółku (CSS).
const PODPIS = { anna: 'Anna Wójcik', halina: 'Halina Nowicka', jakub: 'Jakub Lis', kasia: 'Katarzyna Lis', niemowle: 'córka' };
const obraz = (plik, opis, kadr, w, h) => `<img class="portret portret-${kadr}" src="img/osoby/${plik}.webp" width="${w}" height="${h}" alt="${opis ? opis.replace(/"/g, '&quot;') : ''}" decoding="async"${opis ? '' : ' aria-hidden="true"'}>`;
export function portret(kto = 'anna', opis, kadr = 'dowod') {
  return obraz(PODPIS[kto] ? kto : 'anna', opis, kadr, 320, 400);
}
// Niemowlę zawinięte w kocyk, śpi. Ten sam styl co portrety dorosłych.
export function niemowle(opis) {
  return obraz('niemowle', opis, 'dziecko', 256, 256);
}

// Auto z boku: płaska, nowoczesna ilustracja w kolorze nadwozia z rejestru, bez znaków marki i bez obrysów.
const NADWOZIE = { czerwony: ['#e5484d', '#c22f36', '#9e2129'], srebrny: ['#d7dce3', '#b4bcc7', '#8e98a6'], granatowy: ['#3d63c9', '#2a4aa3', '#1f377c'] };
export function autoZBoku({ kolor = 'czerwony', opis } = {}) {
  const [j, s1, c] = NADWOZIE[kolor] || NADWOZIE.czerwony;
  const kolo = x => `<g transform="translate(${x} 79)"><circle r="14.5" fill="#1d2129"/><circle r="9" fill="#e9edf2"/><circle r="9" fill="none" stroke="#c4cbd5" stroke-width="2.2"/>
    ${[0, 72, 144, 216, 288].map(a => `<path d="M-1.4-2.4L-1-8.4h2l.4 6z" fill="#aab3bf" transform="rotate(${a})"/>`).join('')}<circle r="2.4" fill="#7c8695"/></g>`;
  return svg('0 0 210 104', `
    <defs>
      <linearGradient id="nad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${j}"/><stop offset=".62" stop-color="${s1}"/><stop offset="1" stop-color="${c}"/></linearGradient>
      <linearGradient id="szyba" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d7290"/><stop offset=".5" stop-color="#2b3647"/><stop offset="1" stop-color="#3a4a61"/></linearGradient>
    </defs>
    <ellipse cx="108" cy="95" rx="90" ry="4.5" fill="#000" opacity=".18"/>
    <path d="M17 78V62c0-6.4 2.2-11.2 6.4-14.6L38 33c3.2-3 7.4-4.4 13.2-4.8l53-1.4c9.6 0 16 2.2 21.4 6.6l20.6 16.2 30.6 4.6c8.4 1.4 13.6 5.4 14.6 11.6l.8 12.2h-7.4a19 19 0 0 0-37.6 0H72.4a19 19 0 0 0-37.6 0z" fill="url(#nad)"/>
    <path d="M40 47.6 46.4 36c2.6-3 5.6-4.2 9.2-4.4l46.8-1.2c7.2 0 12.2 1.8 16.2 5l14.6 12.2z" fill="url(#szyba)"/>
    <path d="M86.4 30.8 85 47.8" stroke="${c}" stroke-width="3.4"/>
    <path d="M58 35.6l26-1" stroke="#fff" stroke-width="2" opacity=".22" stroke-linecap="round"/>
    <path d="M20 55.6c42-1.6 96-1.8 160 2.4" stroke="#fff" stroke-width="1.6" opacity=".35" fill="none" stroke-linecap="round"/>
    <path d="M88 50v26M134 50.4v26.4" stroke="${c}" stroke-width="1" opacity=".55"/>
    <rect x="70" y="56.4" width="10" height="2.6" rx="1.3" fill="${c}" opacity=".8"/><rect x="116" y="56.4" width="10" height="2.6" rx="1.3" fill="${c}" opacity=".8"/>
    <path d="M178 55.6c5 .4 9.4 1.6 12 3.4l-.6 2.6c-3.4-.8-7.6-1.4-11.8-1.6z" fill="#fff4cf"/>
    <path d="M18.4 50h5.2l.8 8.6h-6.2z" fill="#ff6b6b"/>
    <path d="M72 78h70" stroke="#00000033" stroke-width="3" stroke-linecap="round"/>
    ${kolo(53)}${kolo(166)}`, opis);
}


// Toyota Yaris Cross z boku, w proporcjach prawdziwego auta: długość 4180, wysokość 1560, rozstaw osi 2560 mm,
// koło 18" (skala 1 px ≈ 22,5 mm; ziemia y 94, osie x 46 i 160). Podwyższone zawieszenie, poszerzone czarne
// nadkola i progi, opadający dach z relingami, pochylona tylna szyba, linia okien rosnąca ku tyłowi, czarny dach.
// Bez znaków marki. Przód po prawej.
const LAKIER = { bialy: ['#ffffff', '#eceef1', '#c5cad2'], czerwony: ['#e1424a', '#c0262f', '#8f1a22'], szary: ['#a7aeb8', '#868e9a', '#5f6773'] };
export function yarisCross({ kolor = 'bialy', opis } = {}) {
  const [j, s1, c] = LAKIER[kolor] || LAKIER.bialy;
  const czern = '#1b1f26', plastik = '#262b33';
  const kolo = x => `<g transform="translate(${x} 78.7)">
      <circle r="15.3" fill="${czern}"/><circle r="10.6" fill="#cfd5dd"/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M-1-3.2L-1.8-10.1h3.6L1-3.2z" fill="#39404a" transform="rotate(${i * 36})"/>`).join('')}
      <circle r="10.6" fill="none" stroke="#eef1f5" stroke-width=".9"/><circle r="3.1" fill="#59626e"/><circle r="1.1" fill="#cfd5dd"/></g>`;
  return svg('0 0 210 104', `
    <defs>
      <linearGradient id="lak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${j}"/><stop offset=".5" stop-color="${s1}"/><stop offset="1" stop-color="${c}"/></linearGradient>
      <linearGradient id="szk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#71849e"/><stop offset=".45" stop-color="#29323f"/><stop offset="1" stop-color="#3a4960"/></linearGradient>
    </defs>
    <ellipse cx="106" cy="95" rx="92" ry="3.8" fill="#000" opacity=".2"/>
    <path d="M15.4 84.2c-1.6 0-2.6-1-2.6-2.6V60.4c0-3 .6-5.6 1.8-7.8L20 44 34 30.2c1.4-1.2 3.2-1.9 5.2-2l55.4-2.6c9.8-.3 18.6.2 24.4 1.2 2.4.4 4.6 1.4 6.6 3l23.6 15.4c13.4 1.4 25.4 3.6 33.6 6.4 4.4 1.6 7.6 4.6 9.2 8.8l2.4 7.4-.4 9.4c-.2 1.8-1.4 3-3.2 3.2l-11.8-.2a19.6 19.6 0 0 0-37.6 0H65a19.6 19.6 0 0 0-37.6 0z" fill="url(#lak)"/>
    <path d="M34 30.2c1.4-1.2 3.2-1.9 5.2-2l55.4-2.6c9.8-.3 18.6.2 24.4 1.2 2.4.4 4.6 1.4 6.6 3l1.8 1.4-2 1.4-1.6-1c-2-1.3-4.2-2-6.6-2.2l-20.6-.1-3 .1-32.4 1.1-2.8.2-21.8 1.1c-1.4.1-2.6.6-3.6 1.6l-1.2 1.3-3.4.6z" fill="${czern}"/>
    <path d="M44.2 26.8l68.6-2.4" stroke="${czern}" stroke-width="1.9" stroke-linecap="round"/><path d="M48 26.6v1.6M64 26v1.6M92 25v1.6M108 24.4v1.8" stroke="${czern}" stroke-width="1.6"/>
    <path d="M100.8 31.2l20.6.1c2.4 0 4.4.7 6.4 2.1l14.4 11.2-41.4-1.6z" fill="url(#szk)"/>
    <path d="M65.4 32.4l32.4-1.1v12.4l-27.6-1.1z" fill="url(#szk)"/>
    <path d="M62.6 32.6l-21.8 1.1c-1.4.1-2.6.6-3.6 1.6l-6.4 6.8 34.8-.8z" fill="url(#szk)"/>
    <path d="M97.8 31.2h3v12.6h-3zM62.6 32.6l2.8-.2 4.8 10-4.6.1z" fill="${czern}"/>
    <path d="M141.8 44.6l-14-10.8c-2.2-1.6-4.6-2.4-7.2-2.5" stroke="${czern}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
    <path d="M30.8 42.2c34.2-.9 77.6-.1 111 2.4" stroke="${czern}" stroke-width="1.1" opacity=".6" fill="none"/>
    <path d="M18 57.8c34-2.6 96-3 156 .8" stroke="#fff" stroke-width="1.3" opacity=".7" fill="none"/>
    <path d="M99.6 44.8v28.6M66.8 43.4v25.4" stroke="${c}" stroke-width=".9" opacity=".75" fill="none"/>
    <rect x="84" y="49.2" width="9" height="2.2" rx="1.1" fill="${c}"/><rect x="121.4" y="50" width="9" height="2.2" rx="1.1" fill="${c}"/>
    <path d="M136 42c2.4-1.8 6-1.8 7.8.4l-.4 3.4h-7.6z" fill="${czern}"/>
    <path d="M25.2 80.6a21.6 21.6 0 0 1 41.6 0H63a17.6 17.6 0 0 0-34 0zM139.2 80.6a21.6 21.6 0 0 1 41.6 0H177a17.6 17.6 0 0 0-34 0z" fill="${plastik}"/>
    <path d="M66.4 79.6h72.8l.4 5.6H65.8zM12.8 72.6h12.8l.2 8.6-1.8 3H15.4c-1.6 0-2.6-1-2.6-2.6zM180.4 79.6h14.8c1.4 0 2.6-1 2.8-2.4l.4 5c-.2 1.6-1.4 2.8-3.2 2.8h-14.4z" fill="${plastik}"/>
    <path d="M176.4 52.8c5 .4 9.6 1.4 13.6 3l1.6 2.6c-4.6-1.4-10-2.2-15.4-2.4z" fill="#eef4ff"/><path d="M177 55.6c4.8.2 9.6.8 14 2" stroke="#8fc9ff" stroke-width=".7"/>
    <path d="M190.8 63.4l5.8.6.6 6.6-6.4-.4z" fill="${czern}" opacity=".9"/>
    <path d="M13.2 52l8-1.2.8 3.6-8.8.8z" fill="#d6252d"/><path d="M13.4 53.8l8.2-.7" stroke="#ff9096" stroke-width=".6"/>
    ${kolo(46)}${kolo(160)}`, opis);
}

// Zdjęcie z fotoradaru: auto od przodu, tablica w ramce, pasek z danymi pomiaru (jak w CANARD).
export function zdjecieFotoradaru({ nr = 'EL 4K217', v = 68, vdop = 50, miejsce = 'ZGIERZ, UL. ŁÓDZKA', kiedy = '', opis } = {}) {
  return svg('0 0 320 200', `
    <defs>
      <linearGradient id="fr-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f58"/><stop offset=".45" stop-color="#33373e"/><stop offset="1" stop-color="#1f2226"/></linearGradient>
      <linearGradient id="fr-k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9da2aa"/><stop offset="1" stop-color="#5d626b"/></linearGradient>
      <radialGradient id="fr-sw" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#f2f2f2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="320" height="200" fill="url(#fr-t)"/>
    <path d="M0 200L120 70h80l120 130z" fill="#2a2d32"/>
    <path d="M158 78h4l1 14h-6zM156 104h8l2 22h-12zM152 140h16l3 34h-22z" fill="#6c7078" opacity=".55"/>
    <path d="M86 112c2-14 8-32 16-38 8-5 40-6 58-6s50 1 58 6c8 6 14 24 16 38z" fill="#505560"/>
    <path d="M103 109l9-29c2-4 6-6 12-6.4 14-.8 58-.8 72 0 6 .4 10 2.4 12 6.4l9 29z" fill="#16181c"/>
    <path d="M120 82c20-2 50-2 70 0" stroke="#fff" stroke-width="1.5" opacity=".12"/>
    <path d="M74 118c0-6 6-10 14-11l144 0c8 1 14 5 14 11v34c0 6-4 10-10 10H84c-6 0-10-4-10-10z" fill="url(#fr-k)"/>
    <path d="M80 112l30-1 3 12-34 2zM240 112l-30-1-3 12 34 2z" fill="#e9ebee"/>
    <ellipse cx="96" cy="118" rx="22" ry="12" fill="url(#fr-sw)" opacity=".85"/><ellipse cx="224" cy="118" rx="22" ry="12" fill="url(#fr-sw)" opacity=".85"/>
    <path d="M124 126h72l-6 10h-60z" fill="#2c2f35"/>
    <path d="M128 129h64M131 132.5h58" stroke="#4b4f57" stroke-width="1"/>
    <rect x="78" y="160" width="26" height="14" rx="3" fill="#121316"/><rect x="216" y="160" width="26" height="14" rx="3" fill="#121316"/>
    <path d="M70 100l-10-3v-6l12 2zM250 100l10-3v-6l-12 2z" fill="#3e424b"/>
    <rect x="127" y="140" width="66" height="15" rx="2" fill="#f4f4f4" stroke="#222" stroke-width=".8"/>
    <rect x="127" y="140" width="9" height="15" rx="1.5" fill="#2a4fa0"/>
    <text x="131.5" y="153" font-family="ui-monospace, Menlo, monospace" font-size="4.6" fill="#fff" text-anchor="middle">PL</text>
    <text x="164.5" y="151.6" font-family="ui-monospace, Menlo, monospace" font-size="10" font-weight="700" fill="#111" text-anchor="middle" letter-spacing=".6">${nr}</text>
    <rect x="121" y="135" width="78" height="25" fill="none" stroke="#ffd43b" stroke-width="1.6"/>
    <path d="M160 50v8M160 62v8M150 60h8M162 60h8" stroke="#ffd43b" stroke-width="1.2" opacity=".85"/>
    <rect width="320" height="18" fill="#000" opacity=".72"/>
    <text x="8" y="12.4" font-family="ui-monospace, Menlo, monospace" font-size="8.4" fill="#fff">${kiedy}</text>
    <text x="312" y="12.4" font-family="ui-monospace, Menlo, monospace" font-size="8.4" fill="#fff" text-anchor="end">CANARD · NR 1042</text>
    <rect y="182" width="320" height="18" fill="#000" opacity=".72"/>
    <text x="8" y="194.4" font-family="ui-monospace, Menlo, monospace" font-size="8.4" fill="#ffd43b">V=${v} km/h</text>
    <text x="78" y="194.4" font-family="ui-monospace, Menlo, monospace" font-size="8.4" fill="#fff">Vdop=${vdop} km/h</text>
    <text x="312" y="194.4" font-family="ui-monospace, Menlo, monospace" font-size="8.4" fill="#fff" text-anchor="end">${miejsce}</text>`, opis);
}
