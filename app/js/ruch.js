// Ruch w interfejsie według zasad Impeccable (animate.md) i iOS: ruch tłumaczy stan i kierunek,
// nie zdobi. Ekran głębiej wjeżdża z prawej, powrót z lewej, zmiana zakładki to przenikanie.
// Czasy: odpowiedź 100–150 ms, zmiana stanu 150–300 ms, przejście widoku 300–500 ms; wyjście szybsze niż wejście.
// Krzywa: naturalne wyhamowanie, bez odbić i sprężyn.
// „Ogranicz ruch”: bez przesuwania i skalowania, zostaje krótkie przenikanie (informacja o zmianie nie znika).
export const ograniczRuch = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const spokojnie = () => !!window.__SZYBKO || ograniczRuch();

export const WYHAMOWANIE = 'cubic-bezier(.16, 1, .3, 1)';
const ARKUSZ = 'cubic-bezier(.32, .72, 0, 1)'; // krzywa arkuszy w iOS
const ODJAZD = 'cubic-bezier(.4, 0, 1, 1)';

export function animuj(el, klatki, opcje = {}) {
  if (!el?.animate || window.__SZYBKO) return null;
  if (ograniczRuch()) {
    // tylko przenikanie, krótko; bez przenikania nie ma czego pokazać
    if (!klatki.some(k => 'opacity' in k)) return null;
    return el.animate(klatki.map(k => ({ opacity: k.opacity ?? 1 })), { duration: 150, easing: 'linear', fill: opcje.fill });
  }
  return el.animate(klatki, { duration: 300, easing: WYHAMOWANIE, ...opcje });
}

export function wjazdEkranu(el, kierunek) {
  if (kierunek === 'zakladka') return animuj(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
  const x = kierunek === 'wstecz' ? -28 : 28;
  return animuj(el, [{ opacity: 0, transform: `translateX(${x}px)` }, { opacity: 1, transform: 'none' }], { duration: 380 });
}

// Lista, która pojawia się jako lista (oś czasu po wysłaniu): po kolei, łącznie najwyżej ~0,4 s opóźnienia.
export function kaskada(elementy, odstep = 60) {
  const lista = [...elementy], krok = Math.min(odstep, 400 / Math.max(1, lista.length));
  lista.forEach((el, i) => animuj(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 120 + i * krok, fill: 'backwards' }));
}

export function wysun(el) {
  return animuj(el, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 420, easing: ARKUSZ });
}

// Zwraca obietnicę, żeby element zniknął dopiero po animacji. Wyjście szybsze niż wejście.
export function schowaj(el) {
  const a = animuj(el, [{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 240, easing: ODJAZD, fill: 'forwards' });
  return a ? a.finished.catch(() => {}) : Promise.resolve();
}

// Pojawienie się potwierdzenia: lekkie powiększenie z wyhamowaniem, bez odbicia.
export function wyskocz(el) {
  return animuj(el, [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
}

// Liczby na widżetach „dobiegają” do wartości przy wejściu na ekran (ok. 0,7 s, wyhamowanie).
// Tylko liczby z groszami albo całe złote i dni; tekst po liczbie (np. „ zł”) zostaje.
export function dobiegnij(elementy) {
  if (spokojnie()) return;
  for (const el of elementy) {
    // grupy po 3 cyfry oddzielone spacją; spacja przed „zł” zostaje w reszcie
    const m = el.textContent.match(/^(\d{1,3}(?:[ \u00a0\u202f]\d{3})*)(.*)$/s); if (!m) continue;
    const cel = parseInt(m[1].replace(/\D/g, ''), 10); if (!(cel >= 10)) continue;
    const reszta = m[2], t0 = performance.now(), czas = 700;
    el.setAttribute('aria-label', el.textContent); // czytnik ekranu dostaje od razu końcową wartość
    const krok = t => {
      const p = Math.min(1, (t - t0) / czas), e = 1 - (1 - p) ** 3;
      el.textContent = Math.round(cel * e).toLocaleString('pl-PL') + reszta;
      if (p < 1) requestAnimationFrame(krok); else el.removeAttribute('aria-label');
    };
    requestAnimationFrame(krok);
  }
}

// Przełącznik segmentowy jak w iOS: podświetlenie przesuwa się do wybranej opcji zamiast przeskakiwać.
// Działa dla każdego .segment w drzewie; dla „ogranicz ruch” bez przesuwania (CSS).
export function segmenty(root = document) {
  // przełącznik języka w alarmie przerysowuje cały ekran, więc zostaje bez przesuwania (i z własnymi kolorami)
  root.querySelectorAll('.segment:not(.jez-alarm)').forEach(seg => {
    if (seg.querySelector(':scope > .seg-kciuk')) { ustawKciuk(seg); return; }
    const k = document.createElement('span'); k.className = 'seg-kciuk'; k.setAttribute('aria-hidden', 'true');
    seg.prepend(k); seg.classList.add('z-kciukiem');
    ustawKciuk(seg, true);
    seg.addEventListener('change', () => ustawKciuk(seg));
    // szerokość opcji zmienia się też po wczytaniu czcionki, choć cały przełącznik ma tę samą szerokość
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => ustawKciuk(seg, true)); ro.observe(seg); seg.querySelectorAll('label').forEach(l => ro.observe(l)); }
  });
}
function ustawKciuk(seg, bezRuchu) {
  const k = seg.querySelector(':scope > .seg-kciuk'), wyb = seg.querySelector('input:checked')?.closest('label');
  if (!k) return;
  if (!wyb || !wyb.offsetWidth) { k.style.opacity = '0'; return; }
  if (bezRuchu) k.style.transition = 'none';
  k.style.opacity = ''; k.style.translate = wyb.offsetLeft + 'px 0'; k.style.width = wyb.offsetWidth + 'px';
  if (bezRuchu) { k.offsetWidth; k.style.transition = ''; }
}
