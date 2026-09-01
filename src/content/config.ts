import { defineCollection, z } from 'astro:content';

/**
 * Verkstedet — korte, daterte notater fra byggingen av appene.
 * Én markdown-fil per notat i src/content/verkstedet/. Norsk only.
 *
 * Frontmatter:
 *   title: Notatets tittel (kan bruke <em> for kursiv aksent)
 *   date:  Publiseringsdato (YYYY-MM-DD)
 *   app:   Valgfri app-slug — gir notatet appens aksentfarge
 */
const verkstedet = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    app: z.string().optional(),
  }),
});

export const collections = { verkstedet };
