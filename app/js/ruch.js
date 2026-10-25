// Ruch w interfejsie: krótko, z jednym kierunkiem i bez ozdobników, jak w iOS.
// Ekran głębiej wjeżdża z prawej, powrót z lewej, zmiana zakładki to samo przenikanie.
// Przy „ogranicz ruch” w systemie (i w testach) nic się nie porusza.
export const spokojnie = () => !!window.__SZYBKO || matchMedia('(prefers-reduced-motion: reduce)').matches;

const KRZYWA = 'cubic-bezier(.2, .8, .2, 1)';
const KRZYWA_ARKUSZA = 'cubic-bezier(.32, .72, 0, 1)'; // krzywa arkuszy w iOS

export function animuj(el, klatki, opcje = {}) {
  if (!el?.animate || spokojnie()) return null;
  return el.animate(klatki, { duration: 280, easing: KRZYWA, ...opcje });
}

export function wjazdEkranu(el, kierunek) {
  if (kierunek === 'zakladka') return animuj(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
  const x = kierunek === 'wstecz' ? -24 : 24;
  return animuj(el, [{ opacity: 0, transform: `translateX(${x}px)` }, { opacity: 1, transform: 'none' }], { duration: 300 });
}

// Elementy listy pojawiają się po kolei (oś czasu po wysłaniu, wiadomości).
export function kaskada(elementy, odstep = 60) {
  [...elementy].forEach((el, i) => animuj(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: 80 + i * odstep, fill: 'backwards' }));
}

export function wysun(el) {
  return animuj(el, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 380, easing: KRZYWA_ARKUSZA });
}

// Zwraca obietnicę, żeby element zniknął dopiero po animacji.
export function schowaj(el) {
  const a = animuj(el, [{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 260, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' });
  return a ? a.finished.catch(() => {}) : Promise.resolve();
}

export function wyskocz(el) {
  return animuj(el, [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.34, 1.4, .64, 1)' });
}
