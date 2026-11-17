// Ilustracje wektorowe: twarze osób z historii pokazowej, auto z boku i zdjęcie z fotoradaru.
// Wszystkie rysunki są własne i przedstawiają osoby FIKCYJNE (bez zdjęć prawdziwych ludzi).
// Każde wywołanie dostaje własne identyfikatory gradientów (ten sam rysunek może być dwa razy na ekranie).
let licznik = 0;
const svg = (vb, tresc, opis) => {
  const n = 'g' + (++licznik) + '-';
  return `<svg viewBox="${vb}" ${opis ? `role="img" aria-label="${opis}"` : 'aria-hidden="true"'} focusable="false" xmlns="http://www.w3.org/2000/svg">${tresc.replace(/id="([^"]+)"/g, `id="${n}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${n}$1)`)}</svg>`;
};

// Zdjęcia do dokumentów: przodem, neutralna mina, jednolite jasne tło, proporcje dorosłej twarzy (jak 35 × 45 mm).
// Na kartach dokumentów zdjęcie jest w odcieniach szarości z rastrem (CSS), jak grawerowane zdjęcie na dowodzie.
// `w`: włosy [jasne, ciemne], `fryzura`: dlugie | krotkie | siwe, `stroj`: zakiet | sweter | bluza | kardigan.
const PORTRETY = {
  anna: { skora: ['#f1c8a8', '#dea47f', '#c4825f'], w: ['#7b4a2e', '#4e2c1a'], fryzura: 'dlugie', stroj: 'zakiet', ubranie: '#2f5bd3', tlo: ['#dbe8ff', '#c3d6fb'] },
  kasia: { skora: ['#f6d2b6', '#e4ad8c', '#c98a6a'], w: ['#d29a55', '#a06a32'], fryzura: 'dlugie', stroj: 'sweter', ubranie: '#e0913a', tlo: ['#fde9d2', '#f8d6b0'] },
  jakub: { skora: ['#e9bf9c', '#d39c76', '#b67a58'], w: ['#3d2b22', '#22170f'], fryzura: 'krotkie', stroj: 'bluza', ubranie: '#169f8a', tlo: ['#d5f3ec', '#b8e8dd'] },
  halina: { skora: ['#f1cdb6', '#dcab90', '#be8a70'], w: ['#e9e9ee', '#c2c4cd'], fryzura: 'siwe', stroj: 'kardigan', ubranie: '#8e4fb3', tlo: ['#ece2fb', '#dccbf6'], okulary: true, starsza: true },
};
const WLOSY_TYL = {
  dlugie: 'M17.4 30C16 44 16.6 57 12 70.5c8.6 4.4 31.4 4.4 40 0C47.4 57 48 44 46.6 30 45.4 17.6 39.6 11.6 32 11.6S18.6 17.6 17.4 30z',
  krotkie: '',
  siwe: 'M15.4 38.4C12.6 24.6 19.6 10.8 32 10.8S51.4 24.6 48.6 38.4c-1.4 4.6-3.6 7.4-6 8.6L41.6 33H22.4l-1 14C19 45.8 16.8 43 15.4 38.4z',
};
const WLOSY_PRZOD = {
  dlugie: 'M18.6 32.4C17.6 20.6 23.2 12.6 32.6 12.6c9.4 0 14.6 7.2 13 19.4-1.4-5.8-3.8-9.6-7.8-11.4-4 2.6-10.4 3.8-16.6 2.8-1.2 2.4-2.1 5.4-2.6 9z',
  krotkie: 'M19 29.2C18.4 19 24 13.2 32.2 13.2c8.4 0 13.8 5.6 13.2 16-1-4.2-2.8-6.8-5.4-8.2-4.6 1.6-11.6 1.6-16.2.2-2.4 1.4-4 4-4.8 8z',
  siwe: 'M16.6 34.6C13.6 20.8 21.4 10.4 32.2 10.4c11.2 0 19 10 15.6 24.4-1.2-5.4-3.2-9.2-6-11.2-3.6 2.4-8.4 3.4-13.2 2.8-3.8-.4-6.8-1.6-8.8-3.4-1.8 2.8-2.6 6.2-3.2 11.6z',
};
const STROJ = {
  zakiet: (u, cien) => `<path d="M24 60.8 32 72.6l8-11.8z" fill="#fbfaf7"/>
    <path d="M1.5 80C3 70.4 9.8 65.8 18.6 63.8l7.6-2.4L32 72.6l5.8-11.2 7.6 2.4C54.2 65.8 61 70.4 62.5 80z" fill="${u}"/>
    <path d="M26.2 61.4 30 70.8l-4.8 1.8L21 64.2M37.8 61.4 34 70.8l4.8 1.8L43 64.2" fill="${cien}" opacity=".55"/>`,
  sweter: (u, cien) => `<path d="M2 80C3.6 70.4 10.4 65.8 19.2 63.8c3-.7 5.6-1.6 7.4-2.4 1.4 2.6 3.2 4 5.4 4s4-1.4 5.4-4c1.8.8 4.4 1.7 7.4 2.4C53.6 65.8 60.4 70.4 62 80z" fill="${u}"/>
    <path d="M26.6 61.4c1.4 3.4 3.2 5.2 5.4 5.2s4-1.8 5.4-5.2" stroke="${cien}" stroke-width="1.6" fill="none" opacity=".7"/>`,
  bluza: (u, cien) => `<path d="M2 80C3.6 69.4 10.4 63.4 19.2 61.4c3-.7 5.4-1.8 7-3.2 1.4 2.6 3.4 3.8 5.8 3.8s4.4-1.2 5.8-3.8c1.6 1.4 4 2.5 7 3.2C53.6 63.4 60.4 69.4 62 80z" fill="${u}"/>
    <path d="M26.2 58.2c1.4 3.4 3.4 5 5.8 5s4.4-1.6 5.8-5" stroke="${cien}" stroke-width="1.4" fill="none" opacity=".6"/>
    <path d="M28.6 65.6v8M35.4 65.6v8" stroke="${cien}" stroke-width=".9" opacity=".7"/>`,
  kardigan: (u, cien) => `<path d="M25.6 61 32 69.4l6.4-8.4z" fill="#ece6df"/><path d="M27.4 61.8 32 66l4.6-4.2" stroke="#d6cdc3" stroke-width="1.2" fill="none"/>
    <path d="M2 80C3.6 70.4 10.4 65.8 19.2 63.8l6.6-2.6L32 76l6.2-14.8 6.6 2.6C53.6 65.8 60.4 70.4 62 80z" fill="${u}"/>
    <circle cx="32" cy="76.6" r=".9" fill="${cien}"/>`,
};
export function portret(kto = 'anna', opis, kadr = 'dowod') {
  const P = PORTRETY[kto] || PORTRETY.anna, [s, sc, sl] = P.skora, [w1, w2] = P.w;
  const cien = '#00000040';
  const brew = P.fryzura === 'siwe' ? '#8f8a86' : w2;
  return svg(kadr === 'dowod' ? '0 0 64 80' : '11 12 42 42', `
    <defs>
      <linearGradient id="tlo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.tlo[0]}"/><stop offset="1" stop-color="${P.tlo[1]}"/></linearGradient>
      <linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w1}"/><stop offset="1" stop-color="${w2}"/></linearGradient>
      <radialGradient id="tw" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="${s}"/><stop offset=".72" stop-color="${s}"/><stop offset="1" stop-color="${sc}"/></radialGradient>
      <linearGradient id="szyja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sl}"/><stop offset=".45" stop-color="${sc}"/></linearGradient>
    </defs>
    <rect width="64" height="80" fill="url(#tlo)"/>
    ${WLOSY_TYL[P.fryzura] ? `<path d="${WLOSY_TYL[P.fryzura]}" fill="url(#wl)"/>` : ''}
    <path d="M27.2 47.6h9.6v14.6c-2.4 2.6-7.2 2.6-9.6 0z" fill="url(#szyja)"/>
    ${STROJ[P.stroj](P.ubranie, cien)}
    <ellipse cx="18.9" cy="33.6" rx="1.7" ry="3.1" fill="${sc}"/><ellipse cx="45.1" cy="33.6" rx="1.7" ry="3.1" fill="${sc}"/>
    <path d="M32 15.2c8.2 0 12.8 6.4 12.8 15.4 0 8.4-2.4 14.6-6 18.2-2 2-4.3 2.9-6.8 2.9s-4.8-.9-6.8-2.9c-3.6-3.6-6-9.8-6-18.2 0-9 4.6-15.4 12.8-15.4z" fill="url(#tw)"/>
    <path d="M21.6 41.4c1.4 3.6 3.4 6.2 5.6 7.6M42.4 41.4c-1.4 3.6-3.4 6.2-5.6 7.6" stroke="${sc}" stroke-width="1.2" fill="none" opacity=".55"/>
    <path d="${WLOSY_PRZOD[P.fryzura]}" fill="url(#wl)"/>
    <path d="M26 15.6c-3.4 2.4-5.6 6-6.4 10.8M31 14.2c-1.6 3.6-1.6 6.6-.6 8.6M37.4 15c2.6 2 4.6 5.4 5.4 9.6" stroke="${w1}" stroke-width=".7" fill="none" opacity=".55" stroke-linecap="round"/>
    ${P.fryzura === 'dlugie' ? `<path d="M18.4 40c.4 9-1 18-4 26M45.6 40c-.4 9 1 18 4 26" stroke="${w1}" stroke-width=".7" fill="none" opacity=".45"/>` : ''}
    <path d="M30.2 31.6c-.6 1.8-.8 4-.7 6.2M24.2 34.4c1.2.8 2.6 1 4 .7M39.8 34.4c-1.2.8-2.6 1-4 .7" stroke="${sc}" stroke-width=".7" fill="none" opacity=".6" stroke-linecap="round"/>
    <path d="M22.8 28.4c1.8-1.1 4.2-1.4 6.2-.7M35 27.7c2-.7 4.4-.4 6.2.7" stroke="${brew}" stroke-width="1.15" stroke-linecap="round" fill="none"/>
    <path d="M23.6 32.2c1.6-1.4 3.4-1.6 5-.1-1.6.9-3.4.9-5 .1zM35.4 32.1c1.6-1.5 3.4-1.3 5 .1-1.6.8-3.4.8-5-.1z" fill="#f3efea"/>
    <circle cx="26.1" cy="31.7" r="1.05" fill="#3a2e28"/><circle cx="37.9" cy="31.7" r="1.05" fill="#3a2e28"/>
    <path d="M23.4 32.1c1.7-1.8 3.6-2 5.4-.2M35.2 31.9c1.8-1.8 3.7-1.6 5.4.2" stroke="#2d2420" stroke-width=".75" stroke-linecap="round" fill="none"/>
    <path d="M31.4 32.6c-.2 2.6-.7 4.6-1.5 5.8.8.8 2.5 1 3.9.3" stroke="${sl}" stroke-width=".7" fill="none" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="23.6" cy="39.6" rx="2.6" ry="1.4" fill="#ff8a7a" opacity=".16"/><ellipse cx="40.4" cy="39.6" rx="2.6" ry="1.4" fill="#ff8a7a" opacity=".16"/>
    <path d="M28.8 43.6c1.1-.6 2.2-.6 3.2-.2 1-.4 2.1-.4 3.2.2-1 .5-2.1.7-3.2.6-1.1.1-2.2-.1-3.2-.6z" fill="#a5675d"/>
    <path d="M29.2 43.9c1.8 1.3 3.8 1.3 5.6 0-.8 1.3-1.8 1.9-2.8 1.9s-2-.6-2.8-1.9z" fill="#bf7f73"/>
    ${P.starsza ? `<path d="M28.2 39.4c-.9 1.2-1.4 2.5-1.4 3.8M35.8 39.4c.9 1.2 1.4 2.5 1.4 3.8M24 35.4c.8.5 1.6.7 2.4.7M40 35.4c-.8.5-1.6.7-2.4.7" stroke="${sc}" stroke-width=".6" fill="none" opacity=".8" stroke-linecap="round"/>` : ''}
    ${P.okulary ? '<g fill="none" stroke="#5a5f69" stroke-width=".8"><rect x="22.2" y="29.2" width="8.6" height="5.8" rx="2.2"/><rect x="33.2" y="29.2" width="8.6" height="5.8" rx="2.2"/><path d="M30.8 31.6c.8-.5 1.6-.5 2.4 0M22.2 31.2l-2.8-.6M41.8 31.2l2.8-.6"/></g>' : ''}`, opis);
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
