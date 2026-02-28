import { z } from "zod/v4";

/**
 * Zod schema for product variant creation/update.
 * Attributes is a flexible record of string key-value pairs (e.g., color, size).
 */
export const productVariantSchema = z.object({
  product_id: z.uuid("ID prodotto non valido"),
  name: z
    .string()
    .min(1, "Il nome della variante è obbligatorio")
    .max(100, "Il nome non può superare 100 caratteri"),
  sku: z.string().nullish(),
  price_adjustment: z.number().default(0),
  stock_quantity: z
    .number()
    .int("La quantità deve essere un intero")
    .nonnegative("La quantità non può essere negativa")
    .default(0),
  attributes: z.record(z.string(), z.string()).default({}),
  is_active: z.boolean().default(true),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
