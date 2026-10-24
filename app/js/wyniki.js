// PLIK GENEROWANY przez `npm test` (tests/run-all.mjs). Nie edytuj ręcznie.
export const WYNIKI = {
 "data": "24 października 2026",
 "crawler": {
  "strony": 222,
  "trasy": 37,
  "problemy": 0
 },
 "sprawy": {
  "liczba": 15,
  "nieudane": []
 },
 "offline": true,
 "klm": {
  "nasz": {
   "przyciskiNaKoniec": [],
   "akcje": 4,
   "systemS": 1.5,
   "sekundy": 12,
   "podpisy": 1,
   "sprawy": 5,
   "instytucje": 4
  },
  "ref": {
   "przyciskiNaKoniec": [],
   "akcje": 6,
   "systemS": 8.1,
   "sekundy": 24,
   "podpisy": 2,
   "sprawy": 2,
   "instytucje": 2
  },
  "operatorDotkniecia": 2.6500000000000004
 },
 "axe": {
  "nasz": 0,
  "naszWezly": 0,
  "naszReguly": {},
  "ref": 7,
  "refWezly": 26,
  "refReguly": {
   "aria-dialog-name": {
    "impact": "serious",
    "help": "ARIA dialog and alertdialog nodes should have an accessible name",
    "wezly": 4,
    "stany": [
     "320 start",
     "320 rozmowa z kartą potwierdzenia",
     "390 start",
     "390 rozmowa z kartą potwierdzenia"
    ]
   },
   "aria-hidden-focus": {
    "impact": "serious",
    "help": "ARIA hidden element must not be focusable or contain focusable elements",
    "wezly": 2,
    "stany": [
     "320 start",
     "390 start"
    ]
   },
   "aria-required-children": {
    "impact": "critical",
    "help": "Certain ARIA roles must contain particular children",
    "wezly": 4,
    "stany": [
     "320 start",
     "320 rozmowa z kartą potwierdzenia",
     "390 start",
     "390 rozmowa z kartą potwierdzenia"
    ]
   },
   "landmark-one-main": {
    "impact": "moderate",
    "help": "Document should have one main landmark",
    "wezly": 2,
    "stany": [
     "320 start",
     "390 start"
    ]
   },
   "nested-interactive": {
    "impact": "serious",
    "help": "Interactive controls must not be nested",
    "wezly": 4,
    "stany": [
     "320 start",
     "320 rozmowa z kartą potwierdzenia",
     "390 start",
     "390 rozmowa z kartą potwierdzenia"
    ]
   },
   "page-has-heading-one": {
    "impact": "moderate",
    "help": "Page should contain a level-one heading",
    "wezly": 2,
    "stany": [
     "320 start",
     "390 start"
    ]
   },
   "region": {
    "impact": "moderate",
    "help": "All page content should be contained by landmarks",
    "wezly": 8,
    "stany": [
     "320 start",
     "320 rozmowa z kartą potwierdzenia",
     "390 start",
     "390 rozmowa z kartą potwierdzenia"
    ]
   }
  }
 },
 "lighthouse": {
  "nasz": {
   "performance": 99,
   "accessibility": 100,
   "bestPractices": 100,
   "lcpMs": 2086,
   "tbtMs": 18
  },
  "ref": {
   "performance": 82,
   "accessibility": 87,
   "bestPractices": 100,
   "lcpMs": 4358,
   "tbtMs": 31
  }
 },
 "czytelnosc": {
  "nasz": {
   "zdania": 577,
   "slowa": 2806,
   "sredniaDlugoscZdania": 4.9,
   "procentTrudnych": 12.2,
   "fog": 6.8
  },
  "ref": {
   "zdania": 83,
   "slowa": 573,
   "sredniaDlugoscZdania": 6.9,
   "procentTrudnych": 10.8,
   "fog": 7.1
  }
 },
 "intencje": {
  "dev": {
   "n": 117,
   "nasz": 1,
   "referencja": 0.39316239316239315,
   "nShared": 68,
   "naszWspolne": 1,
   "refWspolne": 0.5,
   "odmowy": "6/6",
   "falszyweOdmowy": 0
  },
  "test": {
   "n": 87,
   "nasz": 0.9195402298850575,
   "referencja": 0.3103448275862069,
   "nShared": 50,
   "naszWspolne": 0.92,
   "refWspolne": 0.4,
   "odmowy": "5/5",
   "falszyweOdmowy": 1
  }
 },
 "bielik": [
  {
   "model": "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
   "test": {
    "n": 87,
    "bielik": 0.92,
    "silnik": 0.92,
    "hybryda": 0.954,
    "bielik_odmowy": "3/5",
    "bielik_falszywe_odmowy": 0
   },
   "mediana_czasu_s": 2.84
  },
  {
   "model": "Bielik-4.5B-v3.0-Instruct.Q8_0.gguf",
   "test": {
    "n": 87,
    "bielik": 0.54,
    "silnik": 0.92,
    "hybryda": 0.931,
    "bielik_odmowy": "1/5",
    "bielik_falszywe_odmowy": 1
   },
   "mediana_czasu_s": 0.95
  }
 ]
};
