// Captura páginas reales para el portfolio (escritorio y móvil) con Chrome sin interfaz y CDP.
// Uso: node scripts/capture.mjs <url> <salida-sin-extensión> [chrome]
// Genera <salida>-desktop.webp (1280x800) y <salida>-mobile.webp (390x844, densidad 2).
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, out, chromePath] = process.argv.slice(2);
if (!url || !out) throw new Error('Uso: node scripts/capture.mjs <url> <salida>');
const chrome = chromePath ?? process.env.CHROME_BIN ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = mkdtempSync(join(tmpdir(), 'capture-'));
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9334', `--user-data-dir=${profile}`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let page;
for (let i = 0; i < 40 && !page; i++) {
  try {
    page = (await (await fetch('http://127.0.0.1:9334/json')).json()).find((t) => t.type === 'page');
  } catch {
    /* Chrome todavía arranca */
  }
  await sleep(250);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m.result), pending.delete(m.id);
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await send('Page.enable');
// Las animaciones se desactivan para que la captura muestre el estado final.
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'light' }] });

for (const [name, w, h, dpr, mobile] of [['desktop', 1280, 800, 1, false], ['mobile', 390, 844, 2, true]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Page.navigate', { url });
  await sleep(4500);
  const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 82 });
  writeFileSync(`${out}-${name}.webp`, Buffer.from(data, 'base64'));
  console.log(`${out}-${name}.webp`);
}

ws.close();
proc.kill();
await sleep(300);
try { rmSync(profile, { recursive: true, force: true }); } catch { /* perfil temporal en uso */ }
