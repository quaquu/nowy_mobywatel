// PLIK GENEROWANY przez `npm test` (tests/run-all.mjs). Nie edytuj ręcznie.
export const WYNIKI = {
 "data": "7 listopada 2026",
 "crawler": {
  "strony": 276,
  "trasy": 46,
  "problemy": 0
 },
 "sprawy": {
  "liczba": 33,
  "nieudane": []
 },
 "offline": true,
 "klm": {
  "nasz": {
   "przyciskiNaKoniec": [],
   "akcje": 4,
   "systemS": 3.2,
   "sekundy": 14,
   "podpisy": 1,
   "sprawy": 5,
   "instytucje": 4
  },
  "ref": {
   "przyciskiNaKoniec": [],
   "akcje": 6,
   "systemS": 8.3,
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
 "impeccable": {
  "kod": 0,
  "ekrany": 0,
  "ramka": 0,
  "razem": 0,
  "ekranow": 39,
  "szczegoly": [],
  "ref": {
   "kod": 7,
   "ekrany": 11,
   "razem": 18,
   "reguly": [
    "low-contrast",
    "cramped-padding",
    "pulsing-dot",
    "dark-glow",
    "overused-font",
    "undersized-ui-text"
   ]
  }
 },
 "lighthouse": {
  "nasz": {
   "performance": 96,
   "accessibility": 100,
   "bestPractices": 100,
   "lcpMs": 2708,
   "tbtMs": 33
  },
  "ref": {
   "performance": 82,
   "accessibility": 87,
   "bestPractices": 100,
   "lcpMs": 4360,
   "tbtMs": 13
  }
 },
 "czytelnosc": {
  "nasz": {
   "zdania": 922,
   "slowa": 4645,
   "sredniaDlugoscZdania": 5,
   "procentTrudnych": 11.7,
   "fog": 6.7
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
   "nasz": 0.9080459770114943,
   "referencja": 0.3103448275862069,
   "nShared": 50,
   "naszWspolne": 0.9,
   "refWspolne": 0.4,
   "odmowy": "5/5",
   "falszyweOdmowy": 1
  },
  "zbior2": {
   "dev": {
    "n": 49,
    "nasz": 1,
    "odmowy": "1/1"
   },
   "test": {
    "n": 37,
    "nasz": 0.918918918918919,
    "odmowy": "1/1"
   }
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
