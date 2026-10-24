// Lokalny podgląd: node tests/serve.mjs [port]
import { serve } from './lib.mjs';
const { url } = await serve(undefined, +(process.argv[2] || 8080));
console.log('Prototyp: ' + url);
