import { z } from "zod/v4";

const slugRegex = /^[a-z0-9-]+$/;

/**
 * Zod schema for blog post creation/update.
 */
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(2, "Il titolo deve avere almeno 2 caratteri")
    .max(200, "Il titolo non può superare 200 caratteri"),
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .regex(slugRegex, "Lo slug può contenere solo lettere minuscole, numeri e trattini"),
  excerpt: z.string().max(500, "L'estratto non può superare 500 caratteri").nullish(),
  content: z.string().nullish(),
  rich_content: z.string().nullish(),
  cover_image_url: z.string().nullish(),
  is_published: z.boolean().default(false),
  seo_title: z.string().max(70, "Il titolo SEO non può superare 70 caratteri").nullish(),
  seo_description: z.string().max(160, "La descrizione SEO non può superare 160 caratteri").nullish(),
  tags: z.array(z.string().min(1).max(50)).default([]),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
