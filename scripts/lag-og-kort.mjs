/**
 * Genererer OG-delingskort (1200×630 PNG) til public/og/: ett per app i
 * appens aksentfarge, pluss ett hub-kort. Rendres med headless Chrome så
 * Newsreader/Inter lastes fra Google Fonts og matcher nettsiden.
 *
 * Kjør: node scripts/lag-og-kort.mjs
 * Kjør på nytt når ikon, navn eller tagline endres.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const UT = path.join(ROOT, 'public', 'og');
const TMP = path.join(ROOT, '.astro', 'og-tmp');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* Importer apps.ts via en kopi der i18n-importen (som Node ikke løser
   uten filendelse) er byttet ut med en stub — scriptet trenger bare
   slug/navn/tagline/accent/ikon. */
await fs.mkdir(TMP, { recursive: true });
const appsKilde = (await fs.readFile(path.join(ROOT, 'src', 'data', 'apps.ts'), 'utf8'))
  .replace("import { resolveLocale } from '../i18n/translations';", 'const resolveLocale = () => "no";');
await fs.writeFile(path.join(TMP, 'apps.ts'), appsKilde);
const { apps } = await import(path.join(TMP, 'apps.ts'));

const FONTS = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=block" />
`;

const FELLES_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Inter', sans-serif;
    color: #EFEAE0;
    position: relative;
    padding: 64px 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ramme {
    position: absolute; inset: 20px;
    border: 1px solid rgba(239,234,224,0.28);
    border-radius: 8px;
    pointer-events: none;
  }
  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    letter-spacing: 0.14em;
    opacity: 0.75;
  }
  .topp { display: flex; justify-content: space-between; align-items: baseline; }
  .midt { display: flex; align-items: center; gap: 56px; }
  .ikon {
    width: 216px; height: 216px;
    border-radius: 48px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(239,234,224,0.25);
    flex: none;
  }
  .navn {
    font-family: 'Newsreader', serif;
    font-weight: 500;
    font-size: 104px;
    line-height: 1.02;
    letter-spacing: -0.015em;
  }
  .tagline {
    font-size: 34px;
    line-height: 1.35;
    margin-top: 18px;
    opacity: 0.88;
    max-width: 720px;
  }
  .bunn { display: flex; justify-content: space-between; align-items: baseline; }
  .amp { font-style: italic; font-weight: 400; }
`;

function appKort(app) {
  const ikonFil = path.join(ROOT, 'public', app.iconPath.split('?')[0]);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
    ${FELLES_CSS}
    body { background: color-mix(in oklab, ${app.accent} 84%, #16120E 16%); }
  </style></head><body>
    <div class="ramme"></div>
    <div class="topp">
      <span class="mono">HAUG &amp; DATTER</span>
      <span class="mono">DRAMMEN · NORGE</span>
    </div>
    <div class="midt">
      <img class="ikon" src="file://${ikonFil}" alt="" />
      <div>
        <div class="navn">${app.name}</div>
        <div class="tagline">${app.tagline.no}</div>
      </div>
    </div>
    <div class="bunn">
      <span class="mono">haugogdatter.no/${app.slug}</span>
      <span class="mono">${app.accent.toUpperCase()}</span>
    </div>
  </body></html>`;
}

function hubKort() {
  const segl = path.join(ROOT, 'public', 'logo', 'haug-datter-skogen.svg');
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
    ${FELLES_CSS}
    body { background: color-mix(in oklab, #1F3528 88%, #16120E 12%); align-items: center; text-align: center; }
    .topp, .bunn { width: 100%; text-align: initial; }
    .hub-midt { display: flex; flex-direction: column; align-items: center; gap: 22px; }
    .segl { width: 150px; height: 150px; }
    .lede { font-size: 30px; opacity: 0.85; }
  </style></head><body>
    <div class="ramme"></div>
    <div class="topp">
      <span class="mono">EST · DRAMMEN · NORGE</span>
      <span class="mono">${apps.length} APPER</span>
    </div>
    <div class="hub-midt">
      <img class="segl" src="file://${segl}" alt="" />
      <div class="navn">Haug <span class="amp">&amp;</span> Datter</div>
      <div class="lede">Apper laget med tid, tålmodighet og litt for mye kaffe.</div>
    </div>
    <div class="bunn">
      <span class="mono">haugogdatter.no</span>
      <span class="mono">APP-MAKERI</span>
    </div>
  </body></html>`;
}

await fs.mkdir(UT, { recursive: true });
await fs.mkdir(TMP, { recursive: true });

const kort = [
  ...apps.map((a) => ({ navn: a.slug, html: appKort(a) })),
  { navn: 'hub', html: hubKort() },
];

for (const k of kort) {
  const htmlFil = path.join(TMP, `${k.navn}.html`);
  const pngFil = path.join(UT, `${k.navn}.png`);
  await fs.writeFile(htmlFil, k.html);
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1200,630',
    '--virtual-time-budget=8000',
    `--screenshot=${pngFil}`,
    `file://${htmlFil}`,
  ], { stdio: 'pipe' });
  const kb = ((await fs.stat(pngFil)).size / 1024).toFixed(0);
  console.log(`og/${k.navn}.png  ${kb}K`);
}

await fs.rm(TMP, { recursive: true, force: true });
console.log('Ferdig.');
