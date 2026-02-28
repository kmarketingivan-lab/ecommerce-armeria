import { z } from "zod/v4";

/**
 * Zod schema for product image creation/update.
 */
export const productImageSchema = z.object({
  product_id: z.uuid("ID prodotto non valido"),
  url: z.url("URL immagine non valido"),
  alt_text: z.string().max(255, "Alt text troppo lungo").nullish(),
  sort_order: z.number().int().nonnegative().default(0),
  is_primary: z.boolean().default(false),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;
