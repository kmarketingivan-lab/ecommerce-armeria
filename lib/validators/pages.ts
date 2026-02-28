import { z } from "zod/v4";

const slugRegex = /^[a-z0-9-]+$/;

/**
 * Zod schema for page creation/update.
 */
export const pageSchema = z.object({
  title: z
    .string()
    .min(2, "Il titolo deve avere almeno 2 caratteri")
    .max(200, "Il titolo non può superare 200 caratteri"),
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .regex(slugRegex, "Lo slug può contenere solo lettere minuscole, numeri e trattini"),
  content: z.string().nullish(),
  rich_content: z.string().nullish(),
  seo_title: z.string().max(70, "Il titolo SEO non può superare 70 caratteri").nullish(),
  seo_description: z.string().max(160, "La descrizione SEO non può superare 160 caratteri").nullish(),
  is_published: z.boolean().default(false),
});

export type PageInput = z.infer<typeof pageSchema>;
