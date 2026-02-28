import { z } from "zod/v4";

/** Regex for valid slugs: lowercase alphanumeric with hyphens */
const slugRegex = /^[a-z0-9-]+$/;

/**
 * Zod schema for category creation/update.
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(100, "Il nome non può superare 100 caratteri"),
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .regex(slugRegex, "Lo slug può contenere solo lettere minuscole, numeri e trattini"),
  description: z.string().nullish(),
  image_url: z.string().nullish(),
  parent_id: z.uuid("ID categoria padre non valido").nullish(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
