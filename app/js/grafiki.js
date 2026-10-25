// Ilustracje wektorowe: twarze osób z historii pokazowej, auto z boku i zdjęcie z fotoradaru.
// Wszystkie rysunki są własne i przedstawiają osoby FIKCYJNE (bez zdjęć prawdziwych ludzi).
// Każde wywołanie dostaje własne identyfikatory gradientów (ten sam rysunek może być dwa razy na ekranie).
let licznik = 0;
const svg = (vb, tresc, opis) => {
  const n = 'g' + (++licznik) + '-';
  return `<svg viewBox="${vb}" ${opis ? `role="img" aria-label="${opis}"` : 'aria-hidden="true"'} focusable="false" xmlns="http://www.w3.org/2000/svg">${tresc.replace(/id="([^"]+)"/g, `id="${n}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${n}$1)`)}</svg>`;
};

const SKORA = { jasna: ['#f3cdb0', '#e2ad8c', '#c98a6b'], starsza: ['#efcbb4', '#dcae94', '#c4917a'] };

// Zdjęcie do dowodu: przodem, neutralna mina, jasne tło (jak 35 × 45 mm).
export function zdjecieAnny(opis) {
  const [s, sc, sl] = SKORA.jasna;
  return svg('0 0 64 80', `
    <defs>
      <linearGradient id="za-tlo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f6"/><stop offset="1" stop-color="#dde3ec"/></linearGradient>
      <linearGradient id="za-wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4631"/><stop offset="1" stop-color="#4a2c1d"/></linearGradient>
      <radialGradient id="za-tw" cx=".45" cy=".38" r=".72"><stop offset="0" stop-color="${s}"/><stop offset="1" stop-color="${sc}"/></radialGradient>
    </defs>
    <rect width="64" height="80" fill="url(#za-tlo)"/>
    <path d="M14.5 31C13 45 15 57 9.5 71 18 75 46 75 54.5 71 49 57 51 45 49.5 31 48 17 41 10.5 32 10.5S16 17 14.5 31z" fill="url(#za-wl)"/>
    <path d="M3 80c1.5-8.5 7.5-13 15.5-14.5L27 62h10l8.5 3.5C53.5 67 59.5 71.5 61 80z" fill="#2f3b52"/>
    <path d="M27 61.6 32 68l5-6.4z" fill="${sc}"/>
    <path d="M27.6 47.5h8.8v12.5c-1.8 2.4-7 2.4-8.8 0z" fill="${sc}"/>
    <ellipse cx="32" cy="50.6" rx="5" ry="2.4" fill="${sl}" opacity=".45"/>
    <ellipse cx="18.6" cy="35.5" rx="2" ry="3.3" fill="${sc}"/><ellipse cx="45.4" cy="35.5" rx="2" ry="3.3" fill="${sc}"/>
    <path d="M18.8 31.5c0-10 5.8-16.5 13.2-16.5s13.2 6.5 13.2 16.5c0 12.2-5.8 20.5-13.2 20.5S18.8 43.7 18.8 31.5z" fill="url(#za-tw)"/>
    <path d="M18 34c-1.6-13 4.5-21.5 14-21.5 10.5 0 15.6 8 14.2 20.5-1.8-6.8-6.6-11-14-12.5C28.6 24.9 24 28.6 18 34z" fill="url(#za-wl)"/>
    <path d="M23.3 31.4c1.6-1 3.6-1.1 5.2-.3M35.5 31.1c1.6-.8 3.6-.7 5.2.3" stroke="#4a2c1d" stroke-width="1.05" stroke-linecap="round" fill="none"/>
    <ellipse cx="26.2" cy="35.2" rx="1.7" ry="1.2" fill="#3a2a22"/><ellipse cx="37.8" cy="35.2" rx="1.7" ry="1.2" fill="#3a2a22"/>
    <circle cx="26.7" cy="34.8" r=".4" fill="#fff"/><circle cx="38.3" cy="34.8" r=".4" fill="#fff"/>
    <path d="M32 37c-.4 2.8-1 4.7-2 5.7 1 .7 2.9.7 4 0" stroke="${sl}" stroke-width=".85" fill="none" stroke-linecap="round"/>
    <path d="M28.2 46.3c2.5 1 5.1 1 7.6 0" stroke="#b5655a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="23.6" cy="41" rx="2.4" ry="1.4" fill="#e79a8a" opacity=".22"/><ellipse cx="40.4" cy="41" rx="2.4" ry="1.4" fill="#e79a8a" opacity=".22"/>`, opis);
}

// Mama, 78 lat: krótkie siwe włosy, okulary, sweter. Kadr kwadratowy (awatar).
export function twarzMamy(opis) {
  const [s, sc, sl] = SKORA.starsza;
  return svg('7 5 50 50', `
    <rect width="64" height="64" fill="#e6e9f2"/>
    <path d="M5 64c2-8 9-11.5 17-12.5l10 3 10-3c8 1 15 4.5 17 12.5z" fill="#7a2f3d"/>
    <path d="M27.4 45h9.2v8.2c-1.8 2.6-7.4 2.6-9.2 0z" fill="${sc}"/>
    <ellipse cx="32" cy="47.4" rx="5" ry="2.2" fill="${sl}" opacity=".45"/>
    <path d="M26 52.5l6 4.5 6-4.5" stroke="#5e2330" stroke-width="2" fill="none"/>
    <ellipse cx="18.8" cy="31" rx="2" ry="3.2" fill="${sc}"/><ellipse cx="45.2" cy="31" rx="2" ry="3.2" fill="${sc}"/>
    <path d="M19.2 27.5c0-9.5 5.6-15.5 12.8-15.5s12.8 6 12.8 15.5c0 11.5-5.6 19-12.8 19s-12.8-7.5-12.8-19z" fill="${s}"/>
    <path d="M17.6 30c-2.4-13 4.4-21 14.4-21 10.4 0 16.6 7.4 14.4 21-1-4.6-2.4-7.6-4.6-9-2.6 2.2-6 3.2-9.8 3.2s-7.6-1-10-3.2c-2.4 1.4-3.6 4.4-4.4 9z" fill="#d3d5dc"/>
    <path d="M20.5 18.5c2.2-2.4 4.6-3.6 7-3.6M37 11.6c3.4 1 5.8 2.8 7 5.8M25.6 11.8c2.4-1.2 5.6-1.3 8.2-.1" stroke="#b4b7c0" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g fill="none" stroke="#3b3f4a" stroke-width="1.15"><rect x="22.4" y="27" width="8.2" height="6" rx="2.6"/><rect x="33.4" y="27" width="8.2" height="6" rx="2.6"/><path d="M30.6 29.6h2.8M22.4 29.4l-3.2-.8M41.6 29.4l3.2-.8"/></g>
    <circle cx="26.5" cy="30" r="1.2" fill="#3a2a22"/><circle cx="37.5" cy="30" r="1.2" fill="#3a2a22"/>
    <path d="M32 32.2c-.3 2.1-.9 3.5-1.7 4.2.9.6 2.3.6 3.2 0" stroke="${sl}" stroke-width=".85" fill="none" stroke-linecap="round"/>
    <path d="M28.2 40.2c2.3 1.4 5.3 1.4 7.6 0" stroke="#a65d55" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M23.8 37.2c.7.9 1.6 1.5 2.6 1.7M40.2 37.2c-.7.9-1.6 1.5-2.6 1.7M27 24.6c1.2-.5 2.6-.5 3.6 0M33.4 24.6c1-.5 2.4-.5 3.6 0" stroke="${sl}" stroke-width=".65" fill="none" opacity=".7" stroke-linecap="round"/>`, opis);
}

// Córka, kilka dni: śpiąca buzia w różowym kocyku.
export function twarzCorki(opis) {
  return svg('0 0 64 64', `
    <rect width="64" height="64" fill="#fbe9ee"/>
    <path d="M10 64c0-16 9-27 22-27s22 11 22 27z" fill="#f4b8c8"/>
    <path d="M14 38c2-14 10-22 18-22s16 8 18 22c-4 6-10 9-18 9s-14-3-18-9z" fill="#f7c9d6"/>
    <circle cx="32" cy="33" r="12.5" fill="#f6d2bd"/>
    <path d="M29 21.5c1.5-1.8 4.5-1.8 5.5.3" stroke="#a87a5e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M25.5 33c1.2 1 2.8 1 4 0M34.5 33c1.2 1 2.8 1 4 0" stroke="#6b4a3a" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <path d="M30.6 39c.9.7 1.9.7 2.8 0" stroke="#c4776c" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <ellipse cx="25" cy="37" rx="2.4" ry="1.4" fill="#f09a9a" opacity=".35"/><ellipse cx="39" cy="37" rx="2.4" ry="1.4" fill="#f09a9a" opacity=".35"/>`, opis);
}

// Auto z boku (hatchback, bez znaków marki). `kolor`: kolor nadwozia z rejestru.
const ODCIENIE = { czerwony: ['#d23a44', '#a3202b'], srebrny: ['#d5dae2', '#9aa2ae'], granatowy: ['#3e5f94', '#22385e'] };
export function autoZBoku({ kolor = 'czerwony', opis } = {}) {
  const [jasny, ciemny] = ODCIENIE[kolor] || ODCIENIE.czerwony, id = 'a' + kolor;
  const kolo = x => `<g transform="translate(${x} 80)"><circle r="15" fill="#1b1d22"/><circle r="9.4" fill="#c9ced6"/><circle r="9.4" fill="none" stroke="#9097a3" stroke-width="1"/>
    ${[0, 72, 144, 216, 288].map(a => `<path d="M0-2.8L-1.8-8.6h3.6z" fill="#8a919c" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#6d737e"/></g>`;
  return svg('0 0 210 104', `
    <defs>
      <linearGradient id="${id}-n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${jasny}"/><stop offset=".6" stop-color="${jasny}"/><stop offset="1" stop-color="${ciemny}"/></linearGradient>
      <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4553"/><stop offset=".55" stop-color="#1e252f"/><stop offset="1" stop-color="#2c3540"/></linearGradient>
    </defs>
    <ellipse cx="105" cy="97" rx="92" ry="5" fill="#000" opacity=".16"/>
    <path d="M32 78a20 20 0 0 1 40 0zM146 78a20 20 0 0 1 40 0z" fill="#2a2d33"/>
    <path d="M18 78V60c0-7 2-12 6-16l12-14c3-3 7-4 13-4.5l54-1.5c9 0 15 2 20 6l22 18 32 5c8 1.5 13 5 14 11l1 14h-7a19 19 0 0 0-38 0H71a19 19 0 0 0-38 0z" fill="url(#${id}-n)"/>
    <path d="M36 46l6-12c2.5-3 5.5-4.2 9-4.4l50-1.2c7 0 12 1.8 16 5l18 14.6z" fill="url(#${id}-s)"/>
    <path d="M47 30.6h7V47h-7zM84 29.4h5V47.4h-5z" fill="${ciemny}"/>
    <path d="M60 33l20-1" stroke="#fff" stroke-width="1.5" opacity=".18" stroke-linecap="round"/>
    <path d="M22 52c40-1 92-1.5 156 3" stroke="#fff" stroke-width="1.2" opacity=".3" fill="none"/>
    <path d="M89 49.5v26M133 49v27" stroke="${ciemny}" stroke-width="1" opacity=".65"/>
    <rect x="70" y="54" width="9" height="2.6" rx="1.3" fill="${ciemny}"/><rect x="114" y="53.6" width="9" height="2.6" rx="1.3" fill="${ciemny}"/>
    <path d="M133 46c3-2 7-2 9 1l-1 3h-8z" fill="${ciemny}"/>
    <path d="M177 53.5c5 .4 9.6 1.6 12.4 3.6l-.6 2.6c-3.6-.8-8-1.4-12.4-1.6z" fill="#f4f6fa"/>
    <path d="M18.6 47h5.4l1 10h-6.4z" fill="#e2414f"/>
    <path d="M71 77.5h76" stroke="#1d2027" stroke-width="3" opacity=".45"/>
    ${kolo(52)}${kolo(166)}`, opis);
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
