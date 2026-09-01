import { defineCollection, z } from 'astro:content';

/**
 * Verkstedet — korte, daterte notater fra byggingen av appene.
 * Én markdown-fil per notat. Norske notater ligger rett i
 * src/content/verkstedet/, engelske oversettelser i en/-undermappa
 * med lang: en i frontmatter.
 *
 * Frontmatter:
 *   title: Notatets tittel
 *   date:  Publiseringsdato (YYYY-MM-DD)
 *   app:   Valgfri app-slug — gir notatet appens aksentfarge
 *   lang:  no (standard) eller en
 */
const verkstedet = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    app: z.string().optional(),
    lang: z.enum(['no', 'en']).default('no'),
  }),
});

export const collections = { verkstedet };
