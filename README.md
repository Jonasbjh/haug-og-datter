# Haug og Datter — astro

Statisk Astro-side for **haugogdatter.no**. Hub + 5 apper × 4 sider = 21 sider totalt.

`preview.html` i roten er **fasiten på design og oppførsel**. Endringer skjer der først, så portes til `src/`.

## Kjøre lokalt

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # bygger til ./dist
npm run preview      # serverer ./dist lokalt
```

## Deploy til GitHub Pages

```bash
npm run deploy
```

`deploy`-scriptet kjører `astro build` og pusher `dist/` til `gh-pages`-branchen via `gh-pages`-pakken. CNAME-filen i `public/` peker på `haugogdatter.no` og blir kopiert med inn i `dist/` automatisk.

I GitHub-repoet: Settings → Pages → Source = `gh-pages`-branch, Custom domain = `haugogdatter.no`. La DNS peke A-records på GitHub Pages, eller CNAME til `<bruker>.github.io`.

## Filstruktur

```
src/
  components/
    Topbar.astro          Live klokke + GPS (hub) eller Tilbake/Kontakt-lenker (app)
    Footer.astro          Hairline-divider + kontekstuell tekst + live klokke
    AppCard.astro         Verket-rad på hub-en (segl + navn + tagline + swatch)
    AppHero.astro         App-side-hero med eyebrow + tittel + ikon + soon-pille
    AppNav.astro          Sub-nav (Oversikt / Personvern / Vilkår / Support)
    ScreenshotStrip.astro Snap-scroll iPhone-rammer (placeholders nå)
    Glyph.astro           Per-app SVG-vannmerke bak app-hero
    PrevNextApp.astro     Forrige/Neste-blokk over sub-nav, looper sirkulært
  layouts/
    HubLayout.astro       Forsiden — chrome + theme-root + spotlight
    AppLayout.astro       Alle app-sider — chrome + theme-root[data-app]
  data/
    apps.ts               Sentral app-konfig (slug, navn, tagline, accent, glyph)
  scripts/
    main.ts               All klient-JS: klokke, progress, reveals,
                          parallax, palett, sweep, kbd-hint
  styles/
    global.css            Portert fra preview.html i sin helhet
  pages/
    index.astro                          Hub
    <slug>/index.astro                   Oversikt
    <slug>/personvern.astro              Personvern
    <slug>/vilkar.astro                  Vilkår
    <slug>/support.astro                 Support
public/
  CNAME                   haugogdatter.no
  icons/                  1024×1024 PNG per app (bytt ut med ekte ikoner)
  screenshots/            iPhone-screenshots (legg til som <slug>/01.png …)
```

## Designsystem

Alle CSS-variabler ligger i `:root` i `src/styles/global.css`:

```css
--paper, --paper-warm, --card    /* surfaces */
--ink, --ink-soft, --ink-mute    /* text */
--line, --line-strong            /* hairlines */
--forest, --rust, --wood-deep    /* brand */
--accent                          /* settes per app via inline style */
```

App-tema settes på `theme-root`-wrapper:

```html
<div class="theme-root" data-app="bumle-bjorn" style="--accent:#A85436">
```

CSS bruker `data-app`-attributtet for å velge backdrop-mønster, og
`color-mix(in oklab, var(--paper) 90%, var(--accent) 10%)` for å tinte
bakgrunnen subtilt i appens retning.

## Klient-JS

Én entry: `src/scripts/main.ts`. Kjører på alle sider via en
`<script>`-tag i layouts. Astro bundler det automatisk.

Funksjonalitet:

- Live klokke (alle `[data-clock]`-elementer)
- Reading-progress-bar i toppen
- IntersectionObserver scroll-reveals
- Mus-følgende spotlight (kun hub via `[data-spotlight]`)
- Letter-parallax på hero-tittelen
- ⌘K kommandopalett med fuzzy-søk
- Tastatur-snarveier: 1–5, ←/→, Esc
- Accent-svep ved klikk på sweepable lenker (`.verket__row`, `.siblings`)

Alt respekterer `prefers-reduced-motion`.

## Legge til en ny app

1. Legg til en oppføring i `src/data/apps.ts`:

   ```ts
   {
     slug: 'min-app',
     name: 'Min App',
     tagline: 'Kort tagline.',
     appStoreUrl: '#',
     iconPath: '/icons/min-app.png',
     accent: '#...',
     glyph: 'circles' | 'grid' | 'dots' | 'lines' | 'script',
   }
   ```

2. Kopier en eksisterende app-mappe under `src/pages/` til `src/pages/min-app/`. Endre `getApp('...')`-kallet i alle fire filer til `getApp('min-app')`.

3. Legg ikon i `public/icons/min-app.png` (1024×1024 PNG).

4. Oppdater `APPS`-katalogen i toppen av `src/scripts/main.ts` så palett + sweep finner den nye appen.

5. Hvis `glyph` skal være ny type: legg til en case i `src/components/Glyph.astro` og en `glyph: 'min-glyph'` i `GlyphKind`-typen i `apps.ts`.

Hub-en plukker opp den nye appen automatisk fra `apps.ts`.

## Regler

- Norsk bokmål overalt. Norske «anførselstegn». Ingen em-dash i copy.
- Ingen tracking, ingen analytics, ingen tredjeparts-script utenom Google Fonts.
- Ingen mørk modus, ingen modals utenom kommandopaletten, ingen karuseller.
- Engangskjøp framfor abonnement der det går.
- Lokale data framfor sky der det går.
- JavaScript kun der det gir innholdet en taktil eller funksjonell verdi.
