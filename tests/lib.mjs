// Wspólne narzędzia testów: Playwright (preinstalowany lub z node_modules), axe-core, prosty serwer.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
export const ROOT = fileURLToPath(new URL('..', import.meta.url));

export function loadPlaywright() {
  for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(p); } catch {}
  }
  throw new Error('Brak Playwright: npm i -D playwright && npx playwright install chromium');
}

export const AXE_SOURCE = () => readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.md': 'text/markdown; charset=utf-8' };

// Serwuje katalog app/ tak jak GitHub Pages (statycznie, bez logowania).
export function serve(dir = join(ROOT, 'app'), port = 0) {
  return new Promise(res => {
    const srv = createServer(async (req, rsp) => {
      let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
      if (p.includes('..')) { rsp.writeHead(400); return rsp.end(); }
      let f = join(dir, p);
      try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch {}
      try {
        const b = await readFile(f);
        rsp.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream', 'cache-control': 'no-cache' });
        rsp.end(b);
      } catch { rsp.writeHead(404); rsp.end('404'); }
    });
    srv.listen(port, '127.0.0.1', () => res({ srv, url: `http://127.0.0.1:${srv.address().port}/` }));
  });
}

export async function runAxe(page) {
  await page.addScriptTag({ content: await AXE_SOURCE() });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  });
}
