import { z } from "zod/v4";

/** Allowed MIME types for upload */
const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;

const ALLOWED_DOCUMENT_MIMES = ["application/pdf"] as const;

const ALL_ALLOWED_MIMES = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_DOCUMENT_MIMES] as const;

/** Max file sizes in bytes */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * Zod schema for media upload validation.
 */
export const mediaUploadSchema = z
  .object({
    filename: z.string().min(1, "Il nome del file è obbligatorio"),
    original_filename: z.string().min(1, "Il nome originale è obbligatorio"),
    mime_type: z.enum(ALL_ALLOWED_MIMES, {
      message: `Tipo file non supportato. Tipi ammessi: ${ALL_ALLOWED_MIMES.join(", ")}`,
    }),
    size_bytes: z.number().int().positive("La dimensione deve essere > 0"),
    alt_text: z.string().max(255).nullish(),
    folder: z.string().default("general"),
  })
  .refine(
    (data) => {
      if (data.mime_type === "application/pdf") {
        return data.size_bytes <= MAX_PDF_SIZE;
      }
      return data.size_bytes <= MAX_IMAGE_SIZE;
    },
    {
      message: "File troppo grande. Max 5MB per immagini, 20MB per PDF",
      path: ["size_bytes"],
    }
  );

/**
 * Zod schema for media alt text update.
 */
export const mediaAltTextSchema = z.object({
  alt_text: z.string().max(255, "Alt text troppo lungo"),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
export type MediaAltTextInput = z.infer<typeof mediaAltTextSchema>;

export { ALLOWED_IMAGE_MIMES, ALLOWED_DOCUMENT_MIMES, ALL_ALLOWED_MIMES, MAX_IMAGE_SIZE, MAX_PDF_SIZE };
