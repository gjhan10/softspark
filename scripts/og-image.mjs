// Genera public/og-image.png (1200x630) con Chrome sin interfaz. Uso: node scripts/og-image.mjs [chrome]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.argv[2] ?? process.env.CHROME_BIN ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const logo = `data:image/webp;base64,${readFileSync('public/brand/softspark-mark-480.webp').toString('base64')}`;
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{font-family:'Segoe UI',system-ui,sans-serif;color:#111827;background:#fff;position:relative;padding:76px 84px;display:flex;flex-direction:column}
.mesh{position:absolute;inset:0;background:radial-gradient(55% 60% at 88% 8%,rgba(128,87,232,.22),transparent 70%),radial-gradient(45% 55% at 8% 18%,rgba(66,99,235,.16),transparent 70%),radial-gradient(40% 45% at 70% 100%,rgba(32,184,213,.18),transparent 70%)}
.brand{position:relative;display:flex;align-items:center;gap:18px;font-size:34px;font-weight:700;letter-spacing:-.03em}
.brand img{width:64px;height:64px;border-radius:16px}
.g{background:linear-gradient(100deg,#4263eb 10%,#8057e8 60%,#1497b3);-webkit-background-clip:text;color:transparent}
h1{position:relative;margin-top:56px;font-size:74px;line-height:1.03;letter-spacing:-.05em;font-weight:700;max-width:900px}
p{position:relative;margin-top:26px;font-size:28px;color:#475569;max-width:860px;line-height:1.35}
.chips{position:relative;margin-top:auto;display:flex;gap:12px}
.chips span{padding:10px 18px;border:1px solid #e7ecf3;border-radius:999px;background:#fff;font-size:20px;color:#475569}
</style></head><body><div class="mesh"></div>
<div class="brand"><img src="${logo}" alt=""><span>Soft<span class="g">Spark</span></span></div>
<h1>Construimos tecnología que <span class="g">transforma negocios.</span></h1>
<p>Webs, aplicaciones, ERP, CRM, APIs y automatización a medida.</p>
<div class="chips"><span>Desarrollo web</span><span>Sistemas empresariales</span><span>Automatización</span></div>
</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
try {
  const file = join(tmp, 'og.html');
  writeFileSync(file, html);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', `--screenshot=${resolve('public/og-image.png')}`, pathToFileURL(file).href], { stdio: 'ignore' });
  console.log('public/og-image.png');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
