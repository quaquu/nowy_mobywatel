// Alarm i miejsca ochronne. Dane: rejestr PSP „Punkty schronienia w Polsce” (dane.gov.pl, CC BY 4.0), wycinek dla
// Łodzi i Zgierza wbudowany w aplikację (narzedzia/schrony.py). Najbliższe miejsca liczy telefon, więc działa bez sieci.
// Instrukcja: MSWiA i RCB, „Zagrożenie atakiem z powietrza. Instrukcja reagowania”.
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, toast, ogloszenie, cel } from './core.js';
import { OSOBA, osoba } from './data.js';

let DANE = null;
const wczytaj = async () => DANE || (DANE = await (await fetch('dane/schrony.json')).json());

// Miejsce, od którego liczymy (adres zameldowania osoby z pokazu, przybliżony do ulicy) i bliscy, którzy też dostali alarm.
const SKAD = {
  anna: { gdzie: [51.7712, 19.45], opis: 'ul. Zielona 8, Łódź (adres zameldowania)', bliscy: [
    { kto: 'Mama, Halina Nowicka', k: 1, gdzie: [51.8575, 19.406], tel: '+48 600 410 233' },
    { kto: 'Piotr, partner', k: 0, kiedy: '2 minuty temu' }] },
  halina: { gdzie: [51.8575, 19.406], opis: 'ul. Lipowa 3, Zgierz (adres zameldowania)', bliscy: [
    { kto: 'Córka, Anna Wójcik', k: 1, kiedy: 'minutę temu' }] },
  jakub: { gdzie: [51.738, 19.465], opis: 'ul. Wróblewskiego 18, Łódź (adres zameldowania)', bliscy: [
    { kto: 'Mama, Monika Lis', k: 1, kiedy: 'minutę temu' },
    { kto: 'Siostra, Katarzyna Lis', k: 1, gdzie: [51.7712, 19.469], tel: '+48 512 330 118' }] },
  kasia: { gdzie: [51.7712, 19.469], opis: 'ul. Narutowicza 40, Łódź (adres zameldowania)', bliscy: [
    { kto: 'Tomasz Bąk', k: 0, kiedy: '3 minuty temu' },
    { kto: 'Brat, Jakub Lis', k: 0, gdzie: [51.738, 19.465], tel: '+48 501 220 774' }] },
};
const DOST = ['całodobowo', 'w określonych godzinach', 'na żądanie'];
const KIER = ['północ', 'północny wschód', 'wschód', 'południowy wschód', 'południe', 'południowy zachód', 'zachód', 'północny zachód'];

// Odległość po kuli (m) i kierunek (stopnie od północy).
const rad = x => x * Math.PI / 180;
function odl([a, b], [c, d]) { const h = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2; return 2 * 6371000 * Math.asin(Math.sqrt(h)); }
function kurs([a, b], [c, d]) { const y = Math.sin(rad(d - b)) * Math.cos(rad(c)), x = Math.cos(rad(a)) * Math.sin(rad(c)) - Math.sin(rad(a)) * Math.cos(rad(c)) * Math.cos(rad(d - b)); return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360; }
const najblizsze = (skad, n = 3) => DANE.punkty.map(p => ({ lat: p[0], lon: p[1], adres: p[2], dost: p[3], m: odl(skad, [p[0], p[1]]), kurs: kurs(skad, [p[0], p[1]]) })).sort((x, y) => x.m - y.m).slice(0, n);
const metry = m => m < 1000 ? `${Math.round(m / 10) * 10}\u00a0m` : `${(m / 1000).toFixed(1).replace('.', ',')}\u00a0km`; // twarda spacja: liczba nie odrywa się od jednostki
const pieszo = m => `ok.\u00a0${Math.max(1, Math.ceil(m / 80))}\u00a0min pieszo`; // 4,8 km/h
const kierunek = k => KIER[Math.round(k / 45) % 8];
const trasa = (z, p) => `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${z[0]}%2C${z[1]}%3B${p.lat}%2C${p.lon}`;

// Mapa w odwzorowaniu Merkatora (jak OpenStreetMap, zoom 15): Ty w środku, kręgi 250 i 500 m, punkty PSP w kadrze,
// trzy najbliższe z numerami. Z internetem pod spodem są kafelki OSM; bez sieci zostaje sam schemat, który działa zawsze.
const Z = 15, W = 360;
const merk = (lat, lon) => { const n = 256 * 2 ** Z; return [(lon + 180) / 360 * n, (1 - Math.log(Math.tan(rad(lat)) + 1 / Math.cos(rad(lat))) / Math.PI) / 2 * n]; };
function mapa(skad, top) {
  const [cx, cy] = merk(...skad), x0 = cx - W / 2, y0 = cy - W / 2, mpp = 156543.03 * Math.cos(rad(skad[0])) / 2 ** Z;
  const xy = (lat, lon) => { const [x, y] = merk(lat, lon); return [x - x0, y - y0]; };
  const wKadrze = ([x, y]) => x > 6 && y > 6 && x < W - 6 && y < W - 6;
  const nr = new Set(top.map(p => p.lat + ',' + p.lon));
  const inne = DANE.punkty.filter(p => !nr.has(p[0] + ',' + p[1])).map(p => xy(p[0], p[1])).filter(wKadrze);
  const kafle = [];
  if (navigator.onLine && !window.__SZYBKO) for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W) / 256); tx++) for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + W) / 256); ty++)
    kafle.push(`<image href="https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png" x="${(tx * 256 - x0).toFixed(1)}" y="${(ty * 256 - y0).toFixed(1)}" width="256" height="256"/>`);
  const r = m => (m / mpp).toFixed(1), c = W / 2;
  return `<figure class="schr-mapa-w"><svg class="schr-mapa${kafle.length ? ' z-kaflami' : ''}" viewBox="0 0 ${W} ${W}" role="img" aria-label="Mapa: ${inne.length + top.length} miejsc ochronnych w kadrze, najbliższe ${metry(top[0].m)} na ${kierunek(top[0].kurs)}">
    <defs><filter id="mapa-noc"><feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"/><feColorMatrix type="hueRotate" values="180"/></filter><clipPath id="mapa-ramka"><rect width="${W}" height="${W}" rx="14"/></clipPath></defs>
    <g clip-path="url(#mapa-ramka)"><rect width="${W}" height="${W}" class="tlo-mapy"/>${kafle.length ? `<g class="kafle">${kafle.join('')}</g>` : ''}
    <circle cx="${c}" cy="${c}" r="${r(500)}" class="krag"/><circle cx="${c}" cy="${c}" r="${r(250)}" class="krag"/>
    <g class="opis-kr-t"><rect x="${(c + +r(250) * .71 - 2).toFixed(1)}" y="${(c + +r(250) * .71 - 11).toFixed(1)}" width="40" height="15" rx="7"/><text x="${(c + +r(250) * .71 + 18).toFixed(1)}" y="${(c + +r(250) * .71).toFixed(1)}" text-anchor="middle" class="opis-kr">250 m</text></g>
    <g class="opis-kr-t"><rect x="${(c + +r(500) * .71 - 2).toFixed(1)}" y="${(c + +r(500) * .71 - 11).toFixed(1)}" width="40" height="15" rx="7"/><text x="${(c + +r(500) * .71 + 18).toFixed(1)}" y="${(c + +r(500) * .71).toFixed(1)}" text-anchor="middle" class="opis-kr">500 m</text></g>
    <g class="polnoc-t"><circle cx="20" cy="20" r="13"/><path d="M20 10l4 8h-8z"/><text x="20" y="29" text-anchor="middle" class="polnoc">N</text></g>
    ${inne.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="pkt"/>`).join('')}
    ${top.map((p, i) => { const [x, y] = xy(p.lat, p.lon); return `<g class="top${i ? '' : ' pierwszy'}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i ? 10 : 12}"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${i + 1}</text></g>`; }).join('')}
    <circle cx="${c}" cy="${c}" r="9" class="ty"/><circle cx="${c}" cy="${c}" r="16" class="ty-puls"/></g>
  </svg>${kafle.length ? '<figcaption>Mapa: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">autorzy OpenStreetMap</a>. Bez internetu zostaje schemat.</figcaption>' : ''}</figure>`;
}

// Komunikat i instrukcja w trzech językach (EU-Alert pozwala nadawać wersje językowe). Reszta ekranu po polsku.
const KIER_J = { en: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'], uk: ['північ', 'північний схід', 'схід', 'південний схід', 'південь', 'південний захід', 'захід', 'північний захід'] };
const J = {
  pl: { etyk: 'Alarm powietrzny · ćwiczenie w pokazie', h1: 'Idź do najbliższego miejsca ochronnego', p: (g, a, d, k) => `Komunikat RCB dla Łodzi i Zgierza, ${g}. Najbliższe: <b>${a}</b>, ${d} na ${k}.`,
    teraz: 'Co teraz', kroki: ['Weź telefon, leki i plecak ewakuacyjny. Dokumenty masz w mObywatelu, działają bez internetu.', 'Idź schodami, nie windą.', 'Nie zdążysz bezpiecznie dojść? Zostań w budynku, w pomieszczeniu bez okien, z dala od ścian zewnętrznych.'],
    bezp: on => `Jestem ${on ? 'bezpieczny' : 'bezpieczna'}` },
  en: { etyk: 'Air raid alert · demo exercise', h1: 'Go to the nearest shelter', p: (g, a, d, k) => `RCB alert for Łódź and Zgierz, ${g}. Nearest: <b>${a}</b>, ${d} to the ${k}.`,
    teraz: 'What to do now', kroki: ['Take your phone, medicines and emergency backpack. Your documents are in mObywatel and work offline.', 'Use the stairs, not the lift.', 'Can’t get there safely in time? Stay inside, in a room without windows, away from outer walls.'],
    bezp: () => 'I am safe' },
  uk: { etyk: 'Повітряна тривога · навчання', h1: 'Йдіть до найближчого укриття', p: (g, a, d, k) => `Повідомлення RCB для Лодзі та Згежа, ${g}. Найближче: <b>${a}</b>, ${d} на ${k}.`,
    teraz: 'Що робити зараз', kroki: ['Візьміть телефон, ліки та тривожний рюкзак. Документи у mObywatel працюють без інтернету.', 'Ідіть сходами, не ліфтом.', 'Не встигаєте безпечно дійти? Залишайтеся в будівлі, у приміщенні без вікон, подалі від зовнішніх стін.'],
    bezp: () => 'Я в безпеці' },
};
const JEZ = [['pl', 'PL'], ['en', 'EN'], ['uk', 'UA']];
// Komunikat z sieci komórkowej (Cell Broadcast, EU-Alert): przychodzi na każdy telefon w zasięgu, bez numeru i bez internetu.
// mObywatel go odczytuje i otwiera na najbliższym miejscu ochronnym.
const alertCB = godz => `<div class="cb-alert" role="alertdialog" aria-modal="true" aria-labelledby="cb-t" aria-describedby="cb-o">
  <div class="cb-karta">
    <p class="cb-glowa">${ic('alert')}<span>Alert ekstremalny</span><small>${godz}</small></p>
    <h2 id="cb-t">Alarm powietrzny: Łódź, Zgierz</h2>
    <p id="cb-o">Ogłoszono alarm powietrzny. Udaj się do najbliższego miejsca ochronnego. Szczegóły w aplikacji mObywatel. <span lang="en">Air raid alert. Go to the nearest shelter.</span></p>
    <p class="cb-zrodlo">Rządowe Centrum Bezpieczeństwa · komunikat z sieci komórkowej (Cell Broadcast) · ćwiczenie w pokazie</p>
    <div class="cb-przyciski"><button type="button" class="btn drugi" id="cb-ok">OK</button><button type="button" class="btn glowny" id="cb-otworz">Otwórz w mObywatelu</button></div>
  </div></div>`;

const kartaMiejsca = (p, i, skad) => `<li class="schron${i ? '' : ' schron-1'}">
  <span class="schr-nr" aria-hidden="true">${i + 1}</span>
  <span class="schr-tr"><b>${esc(p.adres)}</b><small>${metry(p.m)} na ${kierunek(p.kurs)} · ${pieszo(p.m)} · dostępne ${DOST[p.dost]}</small></span>
  <a class="btn drugi maly-btn" href="${trasa(skad, p)}" target="_blank" rel="noopener">Prowadź</a></li>`;

export async function alarmWidok(alarm, cb) {
  await wczytaj();
  const jez = J[stan.alarmJezyk] ? stan.alarmJezyk : 'pl', T = J[jez], kier = k => jez === 'pl' ? kierunek(k) : KIER_J[jez][Math.round(k / 45) % 8];
  if (alarm && cb) { stan.alarm = { ...stan.alarm, aktywny: Date.now() }; zapisz(); }
  const S = SKAD[OSOBA] || SKAD.anna;
  const skad = stan.alarmTu?.gdzie || S.gdzie, skadOpis = stan.alarmTu?.opis || S.opis;
  const top = najblizsze(skad), on = OSOBA === 'jakub';
  const bezp = stan.alarm?.bezpieczna;
  const godz = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  // Bliski z „kiedy” już potwierdził; bez niego czeka, a Ty możesz wysłać mu drogę do jego najbliższego miejsca.
  const bliscy = S.bliscy.map((b, i) => {
    const a = b.k ? 'a' : '', ok = !!b.kiedy, ich = b.gdzie && najblizsze(b.gdzie, 1)[0], wyslane = stan.alarm?.wyslane?.[i];
    return `<li class="poz">${ic(ok ? 'check' : 'clock', 'okr' + (ok ? ' zielona' : ''))}<span><b>${esc(b.kto)}</b><small>${ok
      ? `bezpieczn${b.k ? 'a' : 'y'}, potwierdził${a} ${esc(b.kiedy)}`
      : `jeszcze nie potwierdził${a}. ${b.k ? 'Jej' : 'Jego'} najbliższe miejsce ochronne: ${esc(ich.adres)}, ${metry(ich.m)}`}</small>
      ${ok ? '' : `<span class="przyciski">${wyslane ? `<span class="maly" role="status">Wysłano drogę do ${esc(ich.adres)}.</span>` : `<button type="button" class="btn drugi maly-btn" data-wyslij="${i}">Wyślij drogę</button>`}<a class="btn tekst maly-btn" href="tel:${b.tel.replace(/ /g, '')}">${ic('phone')}Zadzwoń</a></span>`}</span></li>`;
  }).join('');
  return {
    tytul: alarm ? 'Alarm' : 'Miejsca ochronne',
    html: `${alarm && cb ? alertCB(godz) : ''}${alarm ? `<section class="alarm-pas" role="alert" lang="${jez}">
        <fieldset class="segment jez-alarm"><legend class="sr">Język komunikatu</legend>${JEZ.map(([k, t]) => `<label><input type="radio" name="jezyk" value="${k}" ${k === jez ? 'checked' : ''}><span lang="${k}">${t}</span></label>`).join('')}</fieldset>
        <small>${T.etyk}</small>
        <h1 tabindex="-1">${T.h1}</h1>
        <p>${T.p(godz, esc(top[0].adres), metry(top[0].m), kier(top[0].kurs))}</p>
      </section>` : `<h1 tabindex="-1">Miejsca ochronne</h1><p class="wstep">Sprawdź teraz, dokąd pójdziesz, gdy usłyszysz syrenę. Działa także bez internetu.</p>`}
    <section class="karta schr-karta" aria-labelledby="h-schr">
      <h2 class="nag" id="h-schr">Najbliższe miejsca ochronne</h2>
      <p class="maly">Liczymy od: ${esc(skadOpis)}.</p>
      <button type="button" class="btn tekst maly-btn" id="schr-gps">${ic('search')}Użyj mojej lokalizacji</button>
      <p class="maly" id="schr-gps-st" role="status"></p>
      ${mapa(skad, top)}
      <ol class="schrony">${top.map((p, i) => kartaMiejsca(p, i, skad)).join('')}</ol>
      <p class="offline-info">${ic('check')}<span>Działa bez internetu: ${DANE.punkty.length.toLocaleString('pl-PL')} miejsc z rejestru PSP zapisanych w telefonie, stan na ${esc(DANE.stan)}.</span></p>
    </section>
    ${alarm ? `<section class="karta" aria-labelledby="h-teraz" lang="${jez}"><h2 class="nag" id="h-teraz">${T.teraz}</h2>
      <ol class="punkty kroki-alarm">${T.kroki.map(k => `<li>${k}</li>`).join('')}</ol></section>
    <section aria-labelledby="h-bliscy"><h2 class="sekcja" id="h-bliscy">Bliscy</h2><ul class="lista">${bliscy}</ul></section>
    ${bezp ? `<p class="potw-rez" role="status">${ic('check', 'okr zielona')}<span><b>Bliscy wiedzą, że jesteś ${on ? 'bezpieczny' : 'bezpieczna'}</b><small>Wysłano ${new Date(bezp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}. Bez lokalizacji, tylko ta wiadomość.</small></span></p>`
      : `<button type="button" class="btn glowny szeroki" id="bezpieczna" lang="${jez}">${ic('check')}${T.bezp(on)}</button><p class="maly srodek">Wiadomość dostaną bliscy z zakładki Bliscy. Bez lokalizacji.</p>`}
    <button type="button" class="btn tekst szeroki" id="alarm-koniec">Zakończ ćwiczenie</button>`
      : `<a class="btn drugi szeroki" href="#/alarm?cb=1">${ic('alert')}Zobacz, jak przyjdzie alarm</a>`}
    <p class="notka"><b>O prototypie.</b> Dziś Alert RCB przychodzi SMS-em, a mapa miejsc ochronnych jest na gdziesieukryc.pl. Zapowiedziano alerty RCB w mObywatelu, a 14.10.2026 MSWiA, RCB, UKE i czterej operatorzy podpisali list intencyjny w sprawie Cell Broadcast (EU-Alert, jak CMAS w USA): komunikat z sieci komórkowej trafi do każdego telefonu w zasięgu, także bez internetu, od II połowy 2027 r. Nowe w prototypie: taki komunikat otwiera mObywatela, który bez sieci pokazuje najbliższe miejsce, instrukcję w trzech językach i bliskich. W pokazie są dane dla Łodzi i Zgierza; w aplikacji byłoby 88 tys. miejsc z całej Polski.</p>
    <p class="zrodlo">${ic('info')}<span>Miejsca ochronne: <a href="${esc(DANE.url)}" target="_blank" rel="noopener">${esc(DANE.zrodlo)}</a>, stan na ${esc(DANE.stan)}. Instrukcja: <a href="https://www.gov.pl/web/rcb/instrukcje-reagowania-podczas-zagrozenia-atakiem-z-powietrza" target="_blank" rel="noopener">RCB i MSWiA, zagrożenie atakiem z powietrza</a>.</span></p>`,
    po(root) {
      const cbA = $('.cb-alert', root);
      if (cbA) {
        try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.([600, 200, 600, 200, 600]); } catch {} // bez gestu przeglądarka blokuje wibrację
        const zamknijCB = dalej => { cbA.remove(); history.replaceState(null, '', '#/alarm'); if (dalej) $('h1', root)?.focus(); else location.hash = '#/start'; };
        $('#cb-otworz', root).onclick = () => zamknijCB(true);
        $('#cb-ok', root).onclick = () => zamknijCB(false);
        requestAnimationFrame(() => $('#cb-otworz', root)?.focus({ preventScroll: true }));
      }
      $$('input[name=jezyk]', root).forEach(x => x.onchange = () => { stan.alarmJezyk = x.value; zapisz(); dispatchEvent(new HashChangeEvent('hashchange')); });
      const kon = $('#alarm-koniec', root);
      if (kon) kon.onclick = () => { stan.alarm = null; zapisz(); toast('Ćwiczenie zakończone.'); location.hash = '#/start'; };
      const b = $('#bezpieczna', root);
      if (b) b.onclick = () => { stan.alarm = { ...stan.alarm, bezpieczna: Date.now() }; zapisz(); cel('alarm-bezpieczna'); ogloszenie(`Bliscy dostali wiadomość, że jesteś ${on ? 'bezpieczny' : 'bezpieczna'}.`); dispatchEvent(new HashChangeEvent('hashchange')); };
      $$('[data-wyslij]', root).forEach(x => x.onclick = () => { const w = { ...(stan.alarm?.wyslane || {}), [x.dataset.wyslij]: Date.now() }; stan.alarm = { ...stan.alarm, wyslane: w }; zapisz(); toast('Wysłano drogę do najbliższego miejsca ochronnego.'); dispatchEvent(new HashChangeEvent('hashchange')); });
      $('#schr-gps', root).onclick = () => {
        const st = $('#schr-gps-st', root);
        if (!navigator.geolocation) { st.textContent = 'Ta przeglądarka nie udostępnia lokalizacji.'; return; }
        st.textContent = 'Szukam Twojej lokalizacji…';
        navigator.geolocation.getCurrentPosition(pos => {
          const tu = [pos.coords.latitude, pos.coords.longitude], n = najblizsze(tu, 1)[0];
          if (n.m > 5000) { st.textContent = `Jesteś ${metry(n.m)} od najbliższego miejsca w pokazie. W pokazie są dane dla Łodzi i Zgierza; w aplikacji byłyby dane z całej Polski.`; return; }
          stan.alarmTu = { gdzie: tu, opis: 'Twoja lokalizacja' }; dispatchEvent(new HashChangeEvent('hashchange'));
        }, () => { st.textContent = 'Bez zgody na lokalizację liczymy od adresu zameldowania.'; }, { timeout: 10000, maximumAge: 60000 });
      };
    },
  };
}
