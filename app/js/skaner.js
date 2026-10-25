// Skaner kodów QR: aparat telefonu, kody mObywatela (kasa w sklepie, okienko urzędu, logowanie
// na komputerze) i ostrzeżenie przed kodami prowadzącymi na obce strony (np. naklejki na parkometrach).
// Kod czyta wbudowany BarcodeDetector, a gdy go brak (np. Safari): biblioteka jsQR, ładowana dopiero tutaj.
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, podpis, ogloszenie, toast, cel, wTelefonie } from './core.js';
import { ja } from './data.js';
import { wysun, schowaj, wyskocz, kaskada } from './ruch.js';

// Prośby zakodowane w kodach pokazowych (app/img/kod-*.svg). Instytucje FIKCYJNE.
export const PROSBY = {
  sklep: { kto: 'Sklep „Przykład”, kasa nr 2', ikona: 'case', tytul: 'Potwierdź pełnoletność', widzi: [['Ukończone 18 lat', 'tak']], nieWidzi: 'imienia, nazwiska, daty urodzenia, adresu ani numeru PESEL', po: 'sprzedaż produktu dla dorosłych' },
  urzad: { kto: 'Urząd Miasta Łodzi, stanowisko 7', ikona: 'id', tytul: 'Potwierdź tożsamość w okienku', widzi: [['Imię i nazwisko', `${ja.imie} ${ja.nazwisko}`], ['Numer PESEL', ja.pesel], ['Zdjęcie', 'z dowodu osobistego']], nieWidzi: 'adresu ani innych danych z rejestrów', po: 'obsługa sprawy w okienku' },
  logowanie: { kto: 'pacjent.gov.pl', ikona: 'lock', tytul: 'Czy to Ty logujesz się na komputerze?', logowanie: true, po: 'logowanie kodem QR' },
};
export const POKAZOWE = [['sklep', 'Kasa w sklepie'], ['urzad', 'Okienko urzędu'], ['logowanie', 'Logowanie na komputerze'], ['parkometr', 'Naklejka na parkometrze']];
const PARKOMETR = 'https://oplata-parkingu.example/zaplac?strefa=A';

// Co jest w kodzie: prośba mObywatela, obcy adres albo zwykły tekst.
export function rozpoznajKod(tekst) {
  const t = String(tekst || '').trim();
  const m = t.match(/^https:\/\/([^/]+)\/[^#]*#\/kod\/([a-z]+)$/);
  if (m && (m[1] === 'quaquu.github.io' || m[1] === location.host) && PROSBY[m[2]]) return { rodzaj: 'prosba', id: m[2] };
  if (/^https?:\/\//i.test(t)) {
    let host = ''; try { host = new URL(t).hostname; } catch {}
    return { rodzaj: /(^|\.)gov\.pl$/.test(host) ? 'gov' : 'obcy', adres: t, host };
  }
  return { rodzaj: 'tekst', tekst: t };
}

let S = null; // bieżąca sesja skanera: { d, strumien, dziala }
// Aparat gaśnie, gdy aplikacja schodzi w tło.
document.addEventListener('visibilitychange', () => { if (document.hidden && S?.dziala) zamknij(); });

const gora = tytul => `<div class="sk-gora"><button class="sk-zamknij" data-zamknij aria-label="Zamknij skaner">${ic('close')}</button><h2 id="sk-t">${esc(tytul)}</h2><span></span></div>`;

function ekran(html, jasny) {
  const d = S.d;
  d.classList.toggle('jasny', !!jasny);
  d.innerHTML = `<div class="sk-wn">${html}</div>`;
  $$('[data-zamknij]', d).forEach(b => b.onclick = () => zamknij());
  const c = $('.sk-tresc', d); if (c && jasny) wyskocz(c);
}

function zatrzymajAparat() {
  if (!S) return;
  S.dziala = false;
  S.strumien?.getTracks().forEach(t => t.stop());
  S.strumien = null;
}

export async function zamknij() {
  if (!S) return;
  const { d } = S;
  zatrzymajAparat(); S = null;
  if (d.open) { await schowaj(d); if (d.open) d.close('anuluj'); }
}

// Otwiera skaner. `prosba`: od razu pokaż prośbę (wejście z adresu #/kod/…, bez aparatu).
export function otworzSkaner({ prosba } = {}) {
  if (S) zatrzymajAparat();
  $$('dialog.skaner').forEach(x => x.remove());
  const d = document.createElement('dialog');
  d.className = 'skaner';
  d.setAttribute('aria-labelledby', 'sk-t');
  document.body.append(d);
  S = { d, strumien: null, dziala: false };
  d.addEventListener('cancel', e => { e.preventDefault(); zamknij(); });
  d.addEventListener('close', () => { zatrzymajAparat(); d.remove(); if (S?.d === d) S = null; });
  d.showModal();
  wTelefonie(d, true);
  wysun(d);
  if (prosba && PROSBY[prosba]) pokazProsbe(prosba);
  else kamera();
}

function kamera() {
  ekran(`${gora('Zeskanuj kod')}
    <div class="sk-kamera">
      <video playsinline muted autoplay aria-hidden="true"></video>
      <div class="sk-celownik" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="sk-dol">
      <p class="sk-stan" id="sk-stan" role="status">Uruchamiam aparat…</p>
      <p class="sk-rada">Nakieruj aparat na kod QR w sklepie, w urzędzie albo na stronie, na której się logujesz.</p>
      <button class="sk-latarka" id="sk-latarka" hidden>${ic('bolt')}Latarka</button>
      <p class="sk-pok">Nie masz kodu pod ręką? Kody pokazowe:</p>
      <div class="sk-chipy">${POKAZOWE.map(([id, t]) => `<button data-kod="${id}">${esc(t)}</button>`).join('')}</div>
    </div>`);
  const d = S.d;
  $$('[data-kod]', d).forEach(b => b.onclick = () => { zatrzymajAparat(); obsluz(b.dataset.kod === 'parkometr' ? PARKOMETR : `https://quaquu.github.io/nowy_mobywatel/#/kod/${b.dataset.kod}`); });
  $('.sk-zamknij', d).focus({ preventScroll: true });
  uruchomAparat();
}

const stanTxt = t => { const el = S && $('#sk-stan', S.d); if (el) el.textContent = t; };

async function uruchomAparat() {
  const sesja = S;
  if (!navigator.mediaDevices?.getUserMedia || !isSecureContext) { stanTxt('Aparat działa tylko na stronie https. Użyj kodu pokazowego poniżej.'); return; }
  let strumien;
  try {
    strumien = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
  } catch (e) {
    stanTxt(e?.name === 'NotAllowedError' ? 'Brak zgody na aparat. Zezwól na aparat w ustawieniach przeglądarki albo użyj kodu pokazowego.' : 'Nie znaleziono aparatu. Użyj kodu pokazowego poniżej.');
    return;
  }
  if (S !== sesja) { strumien.getTracks().forEach(t => t.stop()); return; }
  S.strumien = strumien; S.dziala = true;
  const v = $('video', S.d);
  v.srcObject = strumien;
  try { await v.play(); } catch {}
  const sciezka = strumien.getVideoTracks()[0];
  const ust = sciezka?.getSettings?.() || {};
  // Przednia kamera (np. w laptopie) pokazuje obraz jak w lustrze, tak jest naturalniej.
  if (ust.facingMode !== 'environment') v.classList.add('lustro');
  if (sciezka?.getCapabilities?.().torch) {
    const b = $('#sk-latarka', S.d); b.hidden = false;
    let wl = false; b.onclick = () => { wl = !wl; sciezka.applyConstraints({ advanced: [{ torch: wl }] }).catch(() => {}); b.setAttribute('aria-pressed', wl); };
  }
  $('.sk-kamera', S.d).classList.add('na-zywo');
  stanTxt('Szukam kodu…');
  szukaj(sesja, v);
}

let jsQRwczytany = null;
function wczytajJsQR() {
  return jsQRwczytany ||= new Promise((ok, zle) => {
    const s = document.createElement('script');
    s.src = new URL('../vendor/jsQR.js', import.meta.url).href;
    s.onload = () => ok(window.jsQR); s.onerror = zle;
    document.head.append(s);
  });
}

async function czytnik() {
  try {
    if ('BarcodeDetector' in window && (await BarcodeDetector.getSupportedFormats()).includes('qr_code')) {
      const bd = new BarcodeDetector({ formats: ['qr_code'] });
      return async zrodlo => (await bd.detect(zrodlo))[0]?.rawValue || null;
    }
  } catch {}
  const jsQR = await wczytajJsQR();
  const pl = document.createElement('canvas'), cx = pl.getContext('2d', { willReadFrequently: true });
  return async zrodlo => {
    const W = 480, H = Math.round(W * zrodlo.videoHeight / zrodlo.videoWidth) || 360;
    pl.width = W; pl.height = H; cx.drawImage(zrodlo, 0, 0, W, H);
    return jsQR(cx.getImageData(0, 0, W, H).data, W, H, { inversionAttempts: 'dontInvert' })?.data || null;
  };
}

async function szukaj(sesja, v) {
  let czytaj;
  try { czytaj = await czytnik(); } catch { stanTxt('Nie udało się uruchomić czytnika kodów. Użyj kodu pokazowego.'); return; }
  const petla = async () => {
    if (S !== sesja || !sesja.dziala) return;
    if (v.readyState >= 2 && v.videoWidth) {
      let t = null; try { t = await czytaj(v); } catch {}
      if (t && S === sesja) { try { navigator.vibrate?.(60); } catch {} zatrzymajAparat(); obsluz(t); return; }
    }
    setTimeout(petla, 120);
  };
  petla();
}

function obsluz(tekst) {
  if (!S) return;
  const k = rozpoznajKod(tekst);
  cel('kod-zeskanowany');
  if (k.rodzaj === 'prosba') return pokazProsbe(k.id);
  if (k.rodzaj === 'obcy') return ostrzezenie(k);
  if (k.rodzaj === 'gov') return ekran(`${gora('Kod ze strony gov.pl')}<div class="sk-tresc">
      <p>Ten kod prowadzi do strony <b>${esc(k.host)}</b>. To adres administracji publicznej.</p>
      <div class="przyciski pion"><a class="btn glowny" href="${esc(k.adres)}" target="_blank" rel="noopener">Otwórz stronę</a><button class="btn drugi" data-zamknij>Zamknij</button></div></div>`, true);
  ekran(`${gora('To nie jest kod mObywatela')}<div class="sk-tresc">
    <p>W kodzie jest tekst:</p><p class="sk-tekst">${esc(k.tekst.slice(0, 160))}</p>
    <div class="przyciski pion"><button class="btn glowny" id="sk-znowu">Skanuj jeszcze raz</button><button class="btn drugi" data-zamknij>Zamknij</button></div></div>`, true);
  $('#sk-znowu', S.d).onclick = () => kamera();
}

function ostrzezenie(k) {
  ekran(`${gora('Uwaga na ten kod')}<div class="sk-tresc">
    <div class="sk-ikona zla">${ic('alert', 'duza')}</div>
    <h3 class="sk-h">Kod prowadzi poza gov.pl</h3>
    <p class="sk-adres">${esc(k.host || k.adres)}</p>
    <p>Oszuści naklejają fałszywe kody na parkometrach i plakatach. Strona wygląda jak urzędowa i prosi o kod BLIK albo dane karty.</p>
    <p class="maly">Opłaty i sprawy urzędowe załatwisz w mObywatelu, bez skanowania obcych kodów. Strony nie otworzyliśmy.</p>
    <div class="przyciski pion"><button class="btn glowny" data-zamknij>Nie otwieraj</button><button class="btn drugi" id="sk-cert">${ic('shield')}Zgłoś do CERT Polska</button></div></div>`, true);
  $('#sk-cert', S.d).onclick = e => { e.currentTarget.disabled = true; toast('Zgłoszenie trafi do CERT Polska. Dziękujemy.'); };
  ogloszenie('Uwaga: kod prowadzi poza gov.pl');
}

function pokazProsbe(id) {
  const p = PROSBY[id];
  if (p.logowanie) {
    const teraz = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    ekran(`${gora('Logowanie kodem QR')}<div class="sk-tresc">
      <div class="sk-kto">${ic(p.ikona, 'okr')}<span><small>Strona prosi o zalogowanie</small><b>${esc(p.kto)}</b></span></div>
      <h3 class="sk-h">${esc(p.tytul)}</h3>
      <div class="karta">${[['Przeglądarka', 'Safari, komputer Mac'], ['Miejsce (przybliżone)', 'Łódź'], ['Godzina', teraz]].map(([a, b]) => `<div class="wiersz"><span>${a}</span><b>${b}</b></div>`).join('')}</div>
      <p class="ostrz">${ic('alert')}<span>Jeśli ktoś przez telefon prosi Cię o zeskanowanie kodu, to oszust. Wybierz „To nie ja”.</span></p>
      <div class="przyciski"><button class="btn drugi" id="sk-nie">To nie ja</button><button class="btn glowny" id="sk-tak">${ic('key')}Tak, to ja</button></div></div>`, true);
    $('#sk-nie', S.d).onclick = () => gotowe(p, false);
    $('#sk-tak', S.d).onclick = async () => { await podpis($('.sk-wn', S.d)); gotowe(p, true); };
    return;
  }
  ekran(`${gora('Przekazanie danych')}<div class="sk-tresc">
    <div class="sk-kto">${ic(p.ikona, 'okr')}<span><small>Prosi o dane</small><b>${esc(p.kto)}</b></span></div>
    <h3 class="sk-h">${esc(p.tytul)}</h3>
    <p class="maly">Zobaczy tylko:</p>
    <div class="karta">${p.widzi.map(([a, b]) => `<div class="wiersz"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div>
    <p class="uwaga">${ic('eye')}<span>Nie zobaczy ${esc(p.nieWidzi)}. Dane trafią jednorazowo; zapiszemy to w „Kto sprawdzał moje dane”.</span></p>
    <div class="przyciski"><button class="btn drugi" id="sk-nie">Odmów</button><button class="btn glowny" id="sk-tak">${ic('key')}Potwierdź</button></div></div>`, true);
  $('#sk-nie', S.d).onclick = () => { toast('Odmówiono. Nic nie zostało przekazane.'); zamknij(); };
  $('#sk-tak', S.d).onclick = async () => { await podpis($('.sk-wn', S.d)); gotowe(p, true); };
}

function gotowe(p, ok) {
  if (!S) return;
  const godz = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  if (ok) {
    stan.noweDostepy.unshift({ kto: p.kto, co: p.logowanie ? 'potwierdzenie tożsamości przy logowaniu' : p.widzi.map(w => w[0].toLowerCase()).join(', '), po: p.po + ' (Twoja zgoda w aplikacji)', kiedy: Date.now() });
    zapisz(); cel(p.logowanie ? 'logowanie-qr' : 'dane-przekazane');
  }
  const [tytul, opis] = !ok ? ['Logowanie zablokowane', 'Nikt nie zaloguje się tym kodem. Jeśli podano komuś hasło albo kod, zmień je i zgłoś sprawę na policję.']
    : p.logowanie ? ['Zalogowano na komputerze', `${p.kto}, godz. ${godz}. Sesję zakończysz w „Ustawieniach”.`]
    : ['Dane przekazane', `${p.kto}, godz. ${godz}. Tylko: ${p.widzi.map(w => w[0].toLowerCase()).join(', ')}.`];
  ekran(`${gora(ok ? 'Gotowe' : 'Zablokowano')}<div class="sk-tresc srodek">
    <div class="sk-ikona ${ok ? 'ok' : 'zla'}">${ic(ok ? 'check' : 'shield', 'duza' + (ok ? ' rysuj' : ''))}</div>
    <h3 class="sk-h">${tytul}</h3><p>${esc(opis)}</p>
    <div class="przyciski pion"><button class="btn glowny" data-zamknij>Gotowe</button>${ok ? '<a class="btn drugi" href="#/dane/dostep">Kto sprawdzał moje dane</a>' : ''}</div></div>`, true);
  wyskocz($('.sk-ikona', S.d)); kaskada($$('.sk-tresc > :not(.sk-ikona)', S.d), 40);
  ogloszenie(tytul);
}

// Widok pod adresem #/kod/… (gdy kod zeskanowano zwykłym aparatem telefonu).
export function kodWidok(id) {
  if (!PROSBY[id]) return null;
  return {
    tytul: 'Kod mObywatela',
    html: `<h1 tabindex="-1">Kod mObywatela</h1>
    <p class="wstep">Zeskanowany kod prosi o: ${esc(PROSBY[id].tytul.toLowerCase())}. Nic nie zostanie przekazane bez Twojego potwierdzenia.</p>
    <button class="btn glowny szeroki" id="kod-pokaz">${ic('scan')}Pokaż prośbę</button>`,
    po(root) {
      $('#kod-pokaz', root).onclick = () => otworzSkaner({ prosba: id });
      if (!window.__SZYBKO) setTimeout(() => otworzSkaner({ prosba: id }), 350);
    },
  };
}
