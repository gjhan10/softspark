import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const config = readFileSync(join('src', 'app', 'core', 'site.config.ts'), 'utf8');
const match = config.match(/siteUrl:\s*'([^']+)'/);
if (!match) throw new Error('No se encontró siteUrl en src/app/core/site.config.ts');
const SITE_URL = match[1].replace(/\/+$/, '');
const dir = join('dist', 'softspark', 'browser');
if (!existsSync(dir)) throw new Error(`No existe ${dir}. Ejecuta primero ng build.`);

const shell = existsSync(join(dir, 'index.csr.html')) ? 'index.csr.html' : 'index.html';
copyFileSync(join(dir, shell), join(dir, '404.html'));
writeFileSync(join(dir, '.nojekyll'), '');

const routes = [];
(function walk(d) {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === 'index.html') {
      const html = readFileSync(p, 'utf8');
      if (/<meta name="robots" content="noindex"/.test(html) || /http-equiv="refresh"/.test(html)) continue;
      routes.push(relative(dir, d).split(sep).join('/'));
    }
  }
})(dir);
routes.sort();

const today = new Date().toISOString().slice(0, 10);
const urls = routes.map((r) => `  <url><loc>${SITE_URL}/${r ? r + '/' : ''}</loc><lastmod>${today}</lastmod></url>`).join('\n');
writeFileSync(join(dir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`post-build: 404.html <- ${shell}, .nojekyll, robots.txt, sitemap.xml (${routes.length} rutas) para ${SITE_URL}`);
