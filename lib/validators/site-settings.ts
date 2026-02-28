import { z } from "zod/v4";

/**
 * Zod schema for site name setting.
 */
export const siteNameSchema = z.string().min(1, "Il nome del sito è obbligatorio").max(100);

/**
 * Zod schema for site description setting.
 */
export const siteDescriptionSchema = z.string().max(500);

/**
 * Zod schema for contact email setting.
 */
export const contactEmailSchema = z.email("Email di contatto non valida");

/**
 * Zod schema for contact phone setting.
 */
export const contactPhoneSchema = z.string().max(30);

/**
 * Zod schema for address setting.
 */
export const addressSettingSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
});

/**
 * Zod schema for social links setting.
 */
export const socialLinksSchema = z.object({
  facebook: z.string().default(""),
  instagram: z.string().default(""),
  twitter: z.string().default(""),
});

/**
 * Zod schema for business hours setting.
 */
export const businessHoursSchema = z.object({
  mon_fri: z.string(),
  sat: z.string(),
  sun: z.string(),
});

/**
 * Zod schema for currency setting.
 */
export const currencySchema = z.string().length(3, "Il codice valuta deve essere di 3 caratteri");

/**
 * Zod schema for tax rate setting (percentage).
 */
export const taxRateSchema = z.number().min(0).max(100, "L'aliquota IVA deve essere tra 0 e 100");

/**
 * Generic setting update schema.
 */
export const settingUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export type SiteSettingUpdate = z.infer<typeof settingUpdateSchema>;
