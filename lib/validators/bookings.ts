import { z } from "zod/v4";

/** Time format HH:MM */
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Booking status enum */
export const bookingStatusEnum = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

/**
 * Zod schema for booking service creation/update.
 */
export const bookingServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(100, "Il nome non può superare 100 caratteri"),
  description: z.string().nullish(),
  duration_minutes: z
    .number()
    .int("La durata deve essere un intero")
    .positive("La durata deve essere > 0"),
  price: z.number().nonnegative("Il prezzo deve essere >= 0"),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

/**
 * Zod schema for booking availability.
 */
export const bookingAvailabilitySchema = z.object({
  day_of_week: z
    .number()
    .int()
    .min(0, "Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)")
    .max(6, "Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)"),
  start_time: z
    .string()
    .regex(timeRegex, "Formato orario non valido (HH:MM)"),
  end_time: z
    .string()
    .regex(timeRegex, "Formato orario non valido (HH:MM)"),
  is_active: z.boolean().default(true),
});

/**
 * Zod schema for booking creation.
 */
export const bookingSchema = z.object({
  service_id: z.uuid("ID servizio non valido"),
  customer_name: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(100, "Il nome non può superare 100 caratteri"),
  customer_email: z.email("Email non valida"),
  customer_phone: z.string().nullish(),
  booking_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
  start_time: z
    .string()
    .regex(timeRegex, "Formato orario non valido (HH:MM)"),
  end_time: z
    .string()
    .regex(timeRegex, "Formato orario non valido (HH:MM)"),
  notes: z.string().max(500, "Note troppo lunghe").nullish(),
});

export type BookingStatus = z.infer<typeof bookingStatusEnum>;
export type BookingServiceInput = z.infer<typeof bookingServiceSchema>;
export type BookingAvailabilityInput = z.infer<typeof bookingAvailabilitySchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
