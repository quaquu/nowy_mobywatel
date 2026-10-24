import { serve } from './lib.mjs';
import { crawler, sprawy, offline } from './e2e.mjs';
const { srv, url } = await serve();
const c = await crawler(url); console.log('crawler', c.strony, c.trasy, c.problemy);
const s = await sprawy(url); console.log('sprawy', JSON.stringify(s, null, 1));
console.log('offline', await offline(url));
srv.close();
