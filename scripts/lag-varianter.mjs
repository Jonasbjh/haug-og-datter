/**
 * Lager små bildevarianter som brukes der originalen er overkill:
 *   - public/icons/<slug>-144.webp  (72 px-bokser i vifta og rail-en, 2x)
 *   - public/video/hero-fjord-poster.webp  (plakat for hero-videoen)
 *
 * Kjør: node scripts/lag-varianter.mjs
 * Kjør på nytt når et ikon eller plakaten byttes ut.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const IKONER = path.join(ROOT, 'public', 'icons');

for (const fil of await fs.readdir(IKONER)) {
  if (!fil.endsWith('.png')) continue;
  const ut = path.join(IKONER, fil.replace(/\.png$/, '-144.webp'));
  await sharp(path.join(IKONER, fil)).resize({ width: 144 }).webp({ quality: 85 }).toFile(ut);
  console.log(`icons/${path.basename(ut)}  ${((await fs.stat(ut)).size / 1024).toFixed(0)}K`);
}

const plakatInn = path.join(ROOT, 'public', 'video', 'hero-fjord-poster.jpg');
const plakatUt = path.join(ROOT, 'public', 'video', 'hero-fjord-poster.webp');
await sharp(plakatInn).webp({ quality: 78 }).toFile(plakatUt);
console.log(`video/hero-fjord-poster.webp  ${((await fs.stat(plakatUt)).size / 1024).toFixed(0)}K`);
