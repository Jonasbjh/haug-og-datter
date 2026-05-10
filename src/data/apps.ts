/**
 * Sentral app-konfig. preview.html er fasiten — denne filen følger
 * den. Hvis du legger til en ny app: legg til en oppføring her, en
 * glyph i Glyph.astro, et ikon i public/icons/<slug>.png, og fire
 * sider under src/pages/<slug>/.
 */
export type GlyphKind =
  | 'circles'   // bumle-bjorn
  | 'grid'      // plantekn
  | 'dots'      // tenkt
  | 'lines'     // kvitteringsvakt
  | 'script';   // inklings-journal

export interface AppDef {
  slug: string;
  name: string;
  tagline: string;
  /** App Store-URL. Tom streng eller '#' = «Kommer snart»-pille. */
  appStoreUrl: string;
  /** Sti til 1024×1024 PNG i public/icons/. */
  iconPath: string;
  /** Brand-accent. Brukes som --accent på theme-root og i swatcher. */
  accent: string;
  /** SVG-glyph som ligger som dempet vannmerke bak app-hero. */
  glyph: GlyphKind;
}

export const apps: AppDef[] = [
  {
    slug: 'bumle-bjorn',
    name: 'Bumle Bjørn',
    tagline: 'Pedagogisk app for barn 1 til 8 år.',
    appStoreUrl: '#',
    iconPath: '/icons/bumle-bjorn.png',
    accent: '#A85436',
    glyph: 'circles',
  },
  {
    slug: 'plantekn',
    name: 'Plantekn',
    tagline: 'Tegn romplaner, møbler og ledningsføring.',
    appStoreUrl: '#',
    iconPath: '/icons/plantekn.png',
    accent: '#2C4A3A',
    glyph: 'grid',
  },
  {
    slug: 'tenkt',
    name: 'Tenkt',
    tagline: 'Daglige logikkpuslespill.',
    appStoreUrl: '#',
    iconPath: '/icons/tenkt.png',
    accent: '#8B6F47',
    glyph: 'dots',
  },
  {
    slug: 'kvitteringsvakt',
    name: 'Kvitteringsvakt',
    tagline: 'Kvittering- og garantitracker for det norske markedet.',
    appStoreUrl: '#',
    iconPath: '/icons/kvitteringsvakt.png',
    accent: '#7A3A22',
    glyph: 'lines',
  },
  {
    slug: 'inklings-journal',
    name: 'Inklings Journal',
    tagline: 'En journalapp.',
    appStoreUrl: '#',
    iconPath: '/icons/inklings-journal.png',
    accent: '#1F3528',
    glyph: 'script',
  },
];

export function getApp(slug: string): AppDef {
  const app = apps.find((a) => a.slug === slug);
  if (!app) throw new Error(`Ukjent app: ${slug}`);
  return app;
}

export function siblings(slug: string): { prev: AppDef; next: AppDef } {
  const i = apps.findIndex((a) => a.slug === slug);
  if (i === -1) throw new Error(`Ukjent app: ${slug}`);
  const prev = apps[(i - 1 + apps.length) % apps.length];
  const next = apps[(i + 1) % apps.length];
  return { prev, next };
}

export function indexOf(slug: string): number {
  return apps.findIndex((a) => a.slug === slug);
}
