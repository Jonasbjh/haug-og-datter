/**
 * Engangs-script: konverterer skjermbilder i public/screenshots til WebP
 * i visningsstørrelse, og krymper appikonene i public/icons til 512 px.
 * Originalene flyttes til originals/ (utenfor public/, deployes ikke).
 *
 * Kjør: node scripts/optimaliser-bilder.mjs
 * Trygt å kjøre flere ganger: hopper over filer som allerede er konvertert.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'public');
const ORIG = path.join(ROOT, 'originals');

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function flyttOriginal(fil) {
  const rel = path.relative(PUB, fil);
  const dest = path.join(ORIG, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.rename(fil, dest);
}

let sparte = 0;

// ---- Skjermbilder → WebP ----
// Portrett vises ~200 px bredt (3 på rad), liggende i full spaltebredde.
// 640 / 1280 px gir 2x-3x retina med god margin.
for await (const fil of walk(path.join(PUB, 'screenshots'))) {
  if (!/\.(png|jpe?g)$/i.test(fil)) continue;
  const ut = fil.replace(/\.(png|jpe?g)$/i, '.webp');
  const meta = await sharp(fil).metadata();
  const liggende = meta.width > meta.height;
  const bredde = Math.min(meta.width, liggende ? 1280 : 640);
  await sharp(fil).resize({ width: bredde }).webp({ quality: 82 }).toFile(ut);
  const foer = (await fs.stat(fil)).size;
  const etter = (await fs.stat(ut)).size;
  sparte += foer - etter;
  console.log(
    `${path.relative(PUB, fil)}  ${(foer / 1024).toFixed(0)}K → ${(etter / 1024).toFixed(0)}K  (${meta.width}×${meta.height} → ${bredde}w)`
  );
  await flyttOriginal(fil);
}

// ---- Ikoner → 512 px PNG ----
// Vises 72–150 px; 512 px dekker retina og OG-kort med god margin.
for await (const fil of walk(path.join(PUB, 'icons'))) {
  if (!/\.png$/i.test(fil)) continue;
  const meta = await sharp(fil).metadata();
  if (meta.width <= 512) {
    console.log(`${path.relative(PUB, fil)}  hoppes over (${meta.width}px)`);
    continue;
  }
  const tmp = fil + '.tmp';
  await sharp(fil)
    .resize({ width: 512 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(tmp);
  const foer = (await fs.stat(fil)).size;
  const etter = (await fs.stat(tmp)).size;
  if (etter >= foer) {
    await fs.unlink(tmp);
    console.log(`${path.relative(PUB, fil)}  beholdes (ble ikke mindre)`);
    continue;
  }
  await flyttOriginal(fil);
  await fs.rename(tmp, fil);
  sparte += foer - etter;
  console.log(`${path.relative(PUB, fil)}  ${(foer / 1024).toFixed(0)}K → ${(etter / 1024).toFixed(0)}K`);
}

console.log(`\nTotalt spart: ${(sparte / 1024 / 1024).toFixed(1)} MB`);
