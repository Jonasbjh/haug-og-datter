import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://haugogdatter.no',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  // Crawlerne spurte etter /sitemap.xml 15 ganger i døgnet og fikk forsiden.
  // i18n-blokka gir hreflang-alternativer, slik at no- og en-sidene kobles
  // som samme innhold på to språk i stedet for å konkurrere.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'no',
        locales: { no: 'nb-NO', en: 'en', de: 'de', ja: 'ja' },
      },
    }),
  ],
  i18n: {
    locales: ['no', 'en', 'de', 'ja'],
    defaultLocale: 'no',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
