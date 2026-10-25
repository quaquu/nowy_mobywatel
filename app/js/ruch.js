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
