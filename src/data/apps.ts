/**
 * Sentral app-konfig. preview.html er fasiten — denne filen følger
 * den. Hvis du legger til en ny app: legg til en oppføring her, en
 * glyph i Glyph.astro, et ikon i public/icons/<slug>.png, og fire
 * sider under src/pages/<slug>/.
 *
 * App Store-URL-er:
 *   Når en app er live, bytt ut search-URL-en med den kanoniske app-
 *   siden:  https://apps.apple.com/no/app/<slug>/id<10-sifret-tall>
 *   (slug-en kan være hva som helst, det er id-en som teller). Du
 *   finner id-en øverst i App Store Connect, eller i App-Store-URL-
 *   en når du åpner appen i App Store. Inntil da peker hver app til
 *   App Store-søk så lenken funker dag én og auto-løser seg når
 *   appen publiseres.
 */
export type GlyphKind =
  | 'circles'   // bumle-bjorn
  | 'grid'      // plantekn
  | 'dots'      // tenkt
  | 'lines'     // kvitteringsvakt
  | 'script'    // inklings-journal
  | 'rings'     // naboskap
  | 'cabin'     // hytteliv
  | 'cairn';    // roys

export interface AppDef {
  slug: string;
  name: string;
  /** Tagline i begge språk. Bruk getTagline(app, locale) for å hente. */
  tagline: { no: string; en: string };
  /** App Store-URL. Bytt til kanonisk app-side (`/app/<slug>/id<n>`)
   *  så snart appen er live. Søk-URL er fallback inntil da. */
  appStoreUrl: string;
  /** Sti til 1024×1024 PNG i public/icons/. */
  iconPath: string;
  /** Brand-accent. Brukes som --accent på theme-root og i swatcher. */
  accent: string;
  /** SVG-glyph som ligger som dempet vannmerke bak app-hero. */
  glyph: GlyphKind;
  /** Hvis true: appen vises ikke i hub-vifta, top-meny eller
   *  forrige/neste-navigasjon, men sidene fungerer fortsatt på
   *  `/<slug>` for direkte lenking. Brukes for apper som ikke er
   *  lansert ennå (typisk for å gi App Store Connect URL-er). */
  hidden?: boolean;
}

export const apps: AppDef[] = [
  {
    slug: 'bumle-bjorn',
    name: 'Bumle Bjørn',
    tagline: {
      no: 'Pedagogisk app for barn 1 til 8 år.',
      en: 'Educational app for kids ages 1 to 8.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/bumle-bjorn/id6761500591',
    iconPath: '/icons/bumle-bjorn.png',
    accent: '#A85436',
    glyph: 'circles',
  },
  {
    slug: 'naboskap',
    name: 'Naboskap',
    tagline: {
      no: 'For lånegrupper du bygger selv.',
      en: 'For lending groups you build yourself.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/naboskap/id6768093048',
    iconPath: '/icons/naboskap.png',
    accent: '#4A6B58',
    glyph: 'rings',
  },
  {
    slug: 'plantekn',
    name: 'Plantekn',
    tagline: {
      no: 'Tegn romplaner, møbler og ledningsføring.',
      en: 'Draw floor plans, furniture and wiring.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/plantekn/id6760789999',
    iconPath: '/icons/plantekn.png',
    accent: '#2C4A3A',
    glyph: 'grid',
  },
  {
    slug: 'tenkt',
    name: 'Tenkt',
    tagline: {
      no: 'Daglige logikkpuslespill.',
      en: 'Daily logic puzzles.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/tenkt/id6766308807',
    iconPath: '/icons/tenkt.png',
    accent: '#8B6F47',
    glyph: 'dots',
  },
  {
    slug: 'kvitteringsvakt',
    name: 'Kvitteringsvakt',
    tagline: {
      no: 'Kvittering- og garantitracker for det norske markedet.',
      en: 'Receipt and warranty tracker for the Norwegian market.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/kvitteringsvakt/id6761110905',
    iconPath: '/icons/kvitteringsvakt.png',
    accent: '#7A3A22',
    glyph: 'lines',
  },
  {
    slug: 'inklings-journal',
    name: 'Inklings Journal',
    tagline: {
      no: 'En journalapp.',
      en: 'A journal app.',
    },
    appStoreUrl: 'https://apps.apple.com/no/app/inklings-journal/id6760267915',
    iconPath: '/icons/inklings-journal.png',
    accent: '#1F3528',
    glyph: 'script',
  },
  {
    slug: 'hyttepermen',
    name: 'Hyttepermen',
    tagline: {
      no: 'For hytta dere eier sammen.',
      en: 'For the cabin you share.',
    },
    /* App Store-URL: bytt til kanonisk app-side når Hyttepermen er live. */
    appStoreUrl: 'https://apps.apple.com/no/search?term=Hyttepermen',
    iconPath: '/icons/hyttepermen.png?v=2',
    accent: '#C97B5A',
    glyph: 'cabin',
    hidden: true,
  },
  {
    slug: 'roys',
    name: 'Røys',
    tagline: {
      no: 'Et lite, stille fjell du eier.',
      en: 'A small, quiet mountain you own.',
    },
    /* App Store-URL: bytt til kanonisk app-side når Røys er live. */
    appStoreUrl: 'https://apps.apple.com/no/search?term=Røys',
    iconPath: '/icons/roys.png',
    accent: '#4A5D75',
    glyph: 'cairn',
    hidden: true,
  },
];

/** Apper som vises i hub-vifta og top-menyen. Filtrerer ut alt som
 *  har `hidden: true` (typisk apper som ikke er lansert ennå). */
export const visibleApps: AppDef[] = apps.filter((a) => !a.hidden);

/** Hent tagline i riktig locale med no som fallback. */
export function getTagline(app: AppDef, locale: string | undefined): string {
  return locale === 'en' ? app.tagline.en : app.tagline.no;
}

export function getApp(slug: string): AppDef {
  const app = apps.find((a) => a.slug === slug);
  if (!app) throw new Error(`Ukjent app: ${slug}`);
  return app;
}

/** Naboer i forrige/neste-navigasjon. Henter fra visibleApps slik at
 *  hidden apper ikke dukker opp som naboer, og hidden apper får
 *  visibleApps[0]/visibleApps[siste] som fallback. */
export function siblings(slug: string): { prev: AppDef; next: AppDef } {
  const list = visibleApps;
  const i = list.findIndex((a) => a.slug === slug);
  if (i === -1) {
    return { prev: list[list.length - 1], next: list[0] };
  }
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  return { prev, next };
}

export function indexOf(slug: string): number {
  return visibleApps.findIndex((a) => a.slug === slug);
}
