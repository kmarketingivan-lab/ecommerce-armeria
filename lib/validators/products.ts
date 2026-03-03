import { z } from "zod/v4";

/** Regex for valid slugs: lowercase alphanumeric with hyphens */
const slugRegex = /^[a-z0-9-]+$/;

/** UUID regex for manual validation */
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Zod schema for product creation/update.
 * category_id is handled separately in the action to avoid Zod v4 union issues.
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(200, "Il nome non può superare 200 caratteri"),
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .regex(slugRegex, "Lo slug può contenere solo lettere minuscole, numeri e trattini"),
  description: z.string().nullish(),
  rich_description: z.string().nullish(),
  price: z.number().nonnegative("Il prezzo deve essere >= 0"),
  compare_at_price: z.number().nonnegative().nullish(),
  cost_price: z.number().nonnegative().nullish(),
  sku: z.string().nullish(),
  barcode: z.string().nullish(),
  stock_quantity: z.number().int().nonnegative().default(0),
  low_stock_threshold: z.number().int().nonnegative().default(5),
  weight_grams: z.number().int().nonnegative().nullish(),
  product_type: z
    .enum(["standard", "arma_fuoco", "munizioni", "fuochi_artificiali", "accessori"])
    .default("standard"),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  seo_title: z.string().max(70).nullish(),
  seo_description: z.string().max(160).nullish(),
});

/**
 * Safely parse a category_id from a form value.
 * Returns null if empty/invalid, otherwise returns the UUID string.
 */
export function parseCategoryId(value: unknown): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  if (!uuidRegex.test(value.trim())) return null;
  return value.trim();
}

export type ProductInput = z.infer<typeof productSchema>;
