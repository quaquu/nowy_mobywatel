// Zdrowie: recepty, wyniki badań, wizyty, szczepienia i kto ma dostęp. Dane FIKCYJNE.
// Źródło w prawdziwej aplikacji: Internetowe Konto Pacjenta (P1, CSIOZ). Wyniki objaśniamy prostym językiem, bez diagnozy:
// pokazujemy wartość, zakres referencyjny laboratorium i co z tym zrobić (najczęściej: omów z lekarzem).
import { ic } from './icons.js';
import { stan, zapisz, esc, $, $$, arkuszZgody, toast, ogloszenie, cel } from './core.js';
import { OSOBA, ja, za, fmt, fmtPelna, mama } from './data.js';

const godz = d => d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
const dzien = d => fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
const wizytaO = (dni, h, m) => { const d = za(dni); d.setHours(h, m, 0, 0); return d; };

const Z = {
  anna: {
    recepty: [
      { id: 'r1', lek: 'Tardyferon 80 mg', dawka: '1 tabletka dziennie, rano, przez 30 dni', kod: '7315', wazna: za(26), odplatnosc: 'pełnopłatny, ok. 22 zł', od: 'dr Ewa Malinowska, Szpital im. M. Kopernika' },
    ],
    wyniki: [
      { id: 'w1', nazwa: 'Hemoglobina', wart: 11.2, jedn: 'g/dl', min: 12, max: 16, data: za(-3), lab: 'Szpital im. M. Kopernika',
        opis: 'Hemoglobina przenosi tlen we krwi. Po porodzie często jest trochę niższa.', co: 'Lekarz przepisał żelazo. Kontrolną morfologię zrób za około 4 tygodnie.' },
      { id: 'w2', nazwa: 'Ferrytyna', wart: 18, jedn: 'ng/ml', min: 15, max: 150, data: za(-3), lab: 'Szpital im. M. Kopernika',
        opis: 'Pokazuje zapas żelaza w organizmie.', co: 'Mieści się w zakresie, przy dolnej granicy.' },
    ],
    wizyty: [
      { id: 'patronaz', co: 'Wizyta patronażowa położnej', gdzie: 'w domu, ul. Zielona 8 m. 12', kiedy: wizytaO(2, 11, 0), kto: 'położna Joanna Kubiak, POZ „Zdrowie”', potwierdz: true,
        dodatek: 'Położna przychodzi 4–6 razy w pierwszych 2 miesiącach. Sprawdzi Ciebie i córkę. Bez skierowania, bezpłatnie.' },
    ],
    szczepienia: [
      { kto: 'Córka', co: 'Gruźlica (BCG) i WZW typu B', kiedy: 'w szpitalu, po urodzeniu', zrobione: true },
      { kto: 'Córka', co: 'Kolejne szczepienia z kalendarza (m.in. błonica, tężec, krztusiec, pneumokoki)', kiedy: 'w 6.–8. tygodniu życia, w przychodni', zrobione: false },
    ],
    dostep: [['Ty', 'pełny dostęp do swojego konta'], ['Córka', 'dane dziecka widzisz jako rodzic do jej 18. urodzin']],
  },
  halina: {
    recepty: [
      { id: 'r1', lek: 'Metformax 500', dawka: '1 tabletka 2 razy dziennie, po posiłku', kod: '4821', wazna: za(30), odplatnosc: 'bezpłatny (leki 65+)', od: 'dr Marek Zając, Przychodnia „Zdrowie”, Zgierz' },
      { id: 'r2', lek: 'Polpril 5 mg', dawka: '1 kapsułka rano', kod: '5590', wazna: za(12), odplatnosc: 'bezpłatny (leki 65+)', od: 'dr Marek Zając, Przychodnia „Zdrowie”, Zgierz' },
    ],
    wyniki: [
      { id: 'w1', nazwa: 'Hemoglobina glikowana (HbA1c)', wart: 7.4, jedn: '%', min: 0, max: 7, data: za(-12), lab: 'Laboratorium „Diagnostyka”, Zgierz', cel: 'Często spotykany cel przy cukrzycy',
        opis: 'Pokazuje średni poziom cukru z ostatnich 2–3 miesięcy. Swój cel ustala z Tobą lekarz; u osób starszych bywa wyższy niż 7%.', co: 'Powyżej 7%. Zapytaj diabetologa, jaki cel jest dla Ciebie.' },
      { id: 'w2', nazwa: 'Glukoza na czczo', wart: 128, jedn: 'mg/dl', min: 70, max: 99, data: za(-12), lab: 'Laboratorium „Diagnostyka”, Zgierz',
        opis: 'Poziom cukru we krwi rano, przed jedzeniem.', co: 'Powyżej zakresu. Omów z lekarzem razem z HbA1c.' },
      { id: 'w3', nazwa: 'Cholesterol LDL', wart: 96, jedn: 'mg/dl', min: 0, max: 100, data: za(-12), lab: 'Laboratorium „Diagnostyka”, Zgierz',
        opis: 'Tak zwany „zły” cholesterol. Przy cukrzycy lekarz często ustala niższy cel niż zakres laboratorium.', co: 'W zakresie laboratorium. Swój cel omów z lekarzem.' },
    ],
    wizyty: [
      { id: 'diab', co: 'Diabetolog', gdzie: 'Przychodnia Specjalistyczna, ul. Długa 15, Zgierz', kiedy: wizytaO(17, 10, 30), kto: 'na e-skierowanie od dr. Zająca, NFZ', potwierdz: true,
        dodatek: 'Weź listę leków i wyniki. Wyniki lekarz zobaczy też sam w systemie.' },
    ],
    szczepienia: [
      { kto: 'Ty', co: 'Grypa, sezon 2026/27', kiedy: 'jeszcze nie przyjęta; zaszczepisz się w przychodni albo w aptece', zrobione: false },
      { kto: 'Ty', co: 'COVID-19, przypominająca', kiedy: 'październik 2025', zrobione: true },
    ],
    dostep: [['Ty', 'pełny dostęp do swojego konta'], ['Anna Wójcik, córka', `recepty, wyniki i wizyty, do ${fmtPelna(mama.pelnomocnictwoDo)}; cofniesz to w każdej chwili`]],
  },
  jakub: {
    recepty: [],
    wyniki: [],
    wizyty: [
      { id: 'kierowca', co: 'Badanie lekarskie kandydata na kierowcę', gdzie: 'lekarz uprawniony do badania kierowców', kiedy: null, kto: 'potrzebne do prawa jazdy kat. B; płatne, ok. 200 zł', link: ['Profil kandydata na kierowcę', '#/sprawa/osiemnastka'],
        dodatek: 'Orzeczenie lekarza trafi do profilu kandydata na kierowcę.' },
    ],
    szczepienia: [{ kto: 'Ty', co: 'Szczepienia obowiązkowe z kalendarza', kiedy: 'komplet', zrobione: true }],
    dostep: [['Ty', 'Twoje konto pacjenta'], ['Monika i Paweł Lis, rodzice', 'widzą Twoje dane do 18. urodzin; potem tylko Ty decydujesz, komu je pokazać']],
  },
  kasia: {
    recepty: [
      { id: 'r1', lek: 'Euthyrox N 50', dawka: '1 tabletka rano, na czczo', kod: '2264', wazna: za(320), odplatnosc: 'refundowany, ok. 8 zł', od: 'dr Agata Nowak, endokrynolog', roczna: true },
    ],
    wyniki: [
      { id: 'w1', nazwa: 'TSH', wart: 2.1, jedn: 'µIU/ml', min: 0.27, max: 4.2, data: za(-20), lab: 'Laboratorium Szpitala im. M. Kopernika',
        opis: 'Hormon, który pokazuje, jak pracuje tarczyca. Przy leczeniu tarczycy sprawdza się, czy dawka leku jest dobra.', co: 'W zakresie. Dawka leku działa.' },
    ],
    wizyty: [
      { id: 'okresowe', co: 'Badania okresowe (medycyna pracy)', gdzie: 'Przychodnia Medycyny Pracy, ul. Kilińskiego 102, Łódź', kiedy: wizytaO(40, 8, 15), kto: 'skierowanie od pracodawcy: Szpital im. M. Kopernika', potwierdz: true,
        dodatek: 'Termin z pracodawcy. Wynik trafi do pracodawcy jako orzeczenie, bez szczegółów badań.' },
    ],
    szczepienia: [{ kto: 'Ty', co: 'Grypa, sezon 2026/27', kiedy: '10 października 2026', zrobione: true }],
    dostep: [['Ty', 'pełny dostęp do swojego konta'], ['Nikt więcej', 'możesz upoważnić bliską osobę, np. Tomasza']],
  },
};
const D = () => Z[OSOBA] || Z.anna;

// Wynik na skali: zakres referencyjny jako jasny pas, wartość jako znacznik.
function skala(w) {
  const lo = Math.min(w.min, w.wart) , hi = Math.max(w.max, w.wart), pad = (hi - lo) * 0.25 || 1;
  const a = Math.max(0, lo - pad), b = hi + pad, x = v => ((v - a) / (b - a) * 100).toFixed(1);
  const poza = w.wart < w.min || w.wart > w.max;
  return { poza, html: `<div class="wyn-skala" role="img" aria-label="${esc(w.nazwa)}: ${String(w.wart).replace('.', ',')} ${esc(w.jedn)}, ${w.cel ? 'typowy cel' : 'zakres'} ${w.min ? String(w.min).replace('.', ',') + '–' : 'poniżej '}${String(w.max).replace('.', ',')}">
    <span class="wyn-norma" style="left:${x(w.min)}%;width:${(x(w.max) - x(w.min)).toFixed(1)}%"></span>
    <span class="wyn-znak${poza ? ' poza' : ''}" style="left:${x(w.wart)}%"></span></div>
    <p class="wyn-zakres">${w.cel ? esc(w.cel) : 'Zakres laboratorium'}: ${w.min ? String(w.min).replace('.', ',') + '–' : 'poniżej '}${String(w.max).replace('.', ',')} ${esc(w.jedn)}</p>` };
}

export function zdrowieWidok() {
  const d = D(), potw = stan.zdrowie?.potwierdzone || {}, odw = stan.zdrowie?.odwolane || {};
  const najbl = d.wizyty.find(v => v.kiedy && !odw[v.id]);
  const recepty = d.recepty.map(r => `<li class="rec">
    <div class="rec-g">${ic('pill', 'okr')}<span><b>${esc(r.lek)}</b><small>${esc(r.dawka)}</small></span></div>
    <div class="rec-d"><span>Kod</span><b class="rec-kod">${r.kod}</b><span>Ważna do</span><b>${fmt(r.wazna)}${r.roczna ? ' (roczna)' : ''}</b><span>Odpłatność</span><b>${esc(r.odplatnosc)}</b></div>
    <details class="rec-apteka"><summary>${ic('scan')}Pokaż w aptece</summary>
      <div class="rec-pokaz"><p class="maly">Podaj farmaceucie kod i swój PESEL albo pokaż ten ekran.</p><p class="rec-duzy">${r.kod.split('').join(' ')}</p><p class="rec-pesel">PESEL <b>${esc(ja.pesel)}</b></p><p class="maly">${esc(r.od)}</p></div>
    </details></li>`).join('');
  const wyniki = d.wyniki.map(w => { const s = skala(w); return `<li class="wyn">
    <div class="wyn-g"><b>${esc(w.nazwa)}</b><span class="wyn-w${s.poza ? ' poza' : ''}">${String(w.wart).replace('.', ',')} <small>${esc(w.jedn)}</small></span></div>
    ${s.html}
    <p class="wyn-st ${s.poza ? 'poza' : 'ok'}">${ic(s.poza ? 'alert' : 'check')}<span>${esc(w.co)}</span></p>
    <details class="rozw"><summary>Co to znaczy</summary><p class="maly">${esc(w.opis)}</p><p class="maly">${esc(w.lab)}, ${fmt(w.data)}.</p></details></li>`; }).join('');
  const wizyty = d.wizyty.map(v => {
    const status = odw[v.id] ? '<span class="st st-pozniej">Odwołana</span>' : potw[v.id] ? '<span class="st st-ok">Potwierdzona</span>' : '';
    return `<li class="wiz">
      <div class="wiz-g">${v.kiedy ? `<span class="zad-data"><b>${v.kiedy.getDate()}</b><small>${fmt(v.kiedy, { month: 'short' })}</small></span>` : ic('doc', 'okr')}
        <span><b>${esc(v.co)} ${status}</b><small>${v.kiedy ? esc(dzien(v.kiedy)) + ', ' + godz(v.kiedy) + ' · ' : ''}${esc(v.gdzie)}</small><small>${esc(v.kto)}</small></span></div>
      <p class="maly">${esc(v.dodatek)}</p>
      ${v.link ? `<a class="btn drugi maly-btn" href="${v.link[1]}">${esc(v.link[0])}</a>` : ''}
      ${v.potwierdz && v.kiedy && !potw[v.id] && !odw[v.id] ? `<div class="przyciski"><button type="button" class="btn glowny maly-btn" data-potw="${v.id}">${ic('check')}Przyjdę</button><button type="button" class="btn tekst maly-btn" data-odw="${v.id}">Odwołaj</button></div>` : ''}
    </li>`;
  }).join('');
  return {
    tytul: 'Zdrowie',
    html: `<h1 tabindex="-1">Zdrowie</h1>
    ${najbl ? `<a class="hero zdr-hero" href="#zdr-wizyty"><span class="hero-ikona">${ic('heart')}</span><span class="hero-tr"><b class="hero-t">${esc(najbl.co)}</b><span class="hero-o">${esc(dzien(najbl.kiedy))}, ${godz(najbl.kiedy)}${potw[najbl.id] ? ' · potwierdzona' : ''}</span></span></a>` : ''}

    <section aria-labelledby="h-rec"><h2 class="sekcja" id="h-rec">Recepty <span class="licz">${d.recepty.length}</span></h2>
      ${recepty ? `<ul class="lista zdr-lista">${recepty}</ul>` : '<p class="pusto">Nie masz aktywnych recept.</p>'}</section>

    <section aria-labelledby="h-wyn"><h2 class="sekcja" id="h-wyn">Wyniki badań</h2>
      ${wyniki ? `<ul class="lista zdr-lista">${wyniki}</ul><p class="maly zdr-uwaga">${ic('info')}<span>To nie jest diagnoza. Zakres podaje laboratorium; o wyniku zawsze decyduje lekarz.</span></p>` : '<p class="pusto">Nie masz jeszcze wyników badań.</p>'}</section>

    <section aria-labelledby="h-wiz" id="zdr-wizyty"><h2 class="sekcja" id="h-wiz">Wizyty i skierowania</h2>
      <ul class="lista zdr-lista">${wizyty}</ul></section>

    <section aria-labelledby="h-szcz"><h2 class="sekcja" id="h-szcz">Szczepienia</h2>
      <ul class="lista">${d.szczepienia.map(s => `<li class="poz">${ic(s.zrobione ? 'check' : 'syringe', 'okr' + (s.zrobione ? ' zielona' : ''))}<span><b>${esc(s.co)}</b><small>${esc(s.kto)} · ${esc(s.kiedy)}</small></span></li>`).join('')}</ul></section>

    <section aria-labelledby="h-dost"><h2 class="sekcja" id="h-dost">Kto widzi Twoje dane medyczne</h2>
      <ul class="lista">${d.dostep.map(([k, o]) => `<li class="poz">${ic('eye', 'okr')}<span><b>${esc(k)}</b><small>${esc(o)}</small></span></li>`).join('')}</ul></section>

    <p class="notka"><b>O prototypie.</b> Recepty, skierowania, szczepienia i część wyników są już w Internetowym Koncie Pacjenta i w aplikacji mojeIKP. Nowe: zdrowie w tym samym miejscu co reszta spraw, wyniki objaśnione prostym językiem na tle zakresu, potwierdzenie albo odwołanie wizyty jednym dotknięciem i bliscy, którzy pomagają z upoważnienia.</p>
    <p class="zrodlo">${ic('info')}<span>Źródło w prawdziwej aplikacji: <a href="https://pacjent.gov.pl" target="_blank" rel="noopener">Internetowe Konto Pacjenta (pacjent.gov.pl)</a>. Dane w pokazie są fikcyjne.</span></p>`,
    po(root) {
      const zapiszStan = (k, id) => { stan.zdrowie = { ...stan.zdrowie, [k]: { ...(stan.zdrowie?.[k] || {}), [id]: Date.now() } }; zapisz(); };
      $$('[data-potw]', root).forEach(b => b.onclick = () => { zapiszStan('potwierdzone', b.dataset.potw); cel('wizyta-potwierdzona'); ogloszenie('Wizyta potwierdzona. Przypomnimy dzień wcześniej.'); dispatchEvent(new HashChangeEvent('hashchange')); });
      $$('[data-odw]', root).forEach(b => b.onclick = async () => {
        const v = D().wizyty.find(x => x.id === b.dataset.odw);
        const ok = await arkuszZgody({ tytul: 'Odwołanie wizyty', pozycje: [{ co: `${v.co}, ${dzien(v.kiedy)}`, do: v.gdzie }], cofniecie: 'Termin dostanie ktoś z kolejki. Nowy termin umówisz ponownie.', przycisk: 'Odwołaj wizytę', cel: 'wizyta-odwolana' });
        if (!ok) return;
        zapiszStan('odwolane', v.id); toast('Wizyta odwołana. Termin wrócił do kolejki.'); dispatchEvent(new HashChangeEvent('hashchange'));
      });
    },
  };
}
