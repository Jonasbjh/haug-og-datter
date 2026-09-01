/**
 * Henter Newsreader og Inter fra Google Fonts som woff2 og legger dem i
 * public/fonts/, og skriver src/styles/fonts.css med @font-face-regler
 * som peker lokalt. Selvhosting fjerner den render-blokkerende CSS-en
 * fra fonts.googleapis.com (ca. 0,8 s på mobil i Lighthouse) og to
 * tredjepartsforespørsler per side.
 *
 * Kjør: node scripts/hent-fonter.mjs
 * Kjør på nytt hvis du vil ha andre vekter/akser. Begge fontene er
 * OFL-lisensiert, så selvhosting er lov.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const UT = path.join(ROOT, 'public', 'fonts');
const CSS_UT = path.join(ROOT, 'src', 'styles', 'fonts.css');

/* Variable fonter: én fil per stil per subset i stedet for én per vekt. */
const URL_ =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter:wght@400..600&display=swap';
/* Norsk trenger bare latin (æøå ligger i U+00C0–00FF). latin-ext tas med
   for tysk (Plantekn har DE-sider). Resten hoppes over. */
const SUBSETS = new Set(['latin', 'latin-ext']);

const res = await fetch(URL_, {
  headers: {
    // Moderne UA → Google svarer med woff2 og unicode-range-oppdelte subsets.
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
  },
});
const css = await res.text();

await fs.mkdir(UT, { recursive: true });

const blokker = css.split('@font-face').slice(1);
const regler = [];
const filer = [];
for (const b of blokker) {
  const subset = (b.match(/\/\* (\S+) \*\//) || [])[1];
  if (!SUBSETS.has(subset)) continue;
  const family = b.match(/font-family: '([^']+)'/)[1];
  const style = b.match(/font-style: (\w+)/)[1];
  const weight = b.match(/font-weight: ([\d ]+)/)[1];
  const url = b.match(/url\((https:[^)]+)\)/)[1];
  const range = b.match(/unicode-range: ([^;]+);/)[1];
  const fil = `${family.toLowerCase()}-${style}-${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await fs.writeFile(path.join(UT, fil), buf);
  filer.push(`${fil}  ${(buf.length / 1024).toFixed(0)}K`);
  regler.push(
    `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${fil}') format('woff2');
  unicode-range: ${range};
}`
  );
}

await fs.writeFile(
  CSS_UT,
  `/* Generert av scripts/hent-fonter.mjs — ikke rediger for hånd.
   Selvhostede variable fonter (Newsreader + Inter, latin + latin-ext). */
${regler.join('\n')}
`
);

console.log(filer.join('\n'));
console.log(`\n${regler.length} @font-face-regler skrevet til src/styles/fonts.css`);
