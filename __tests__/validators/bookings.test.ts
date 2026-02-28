import { describe, it, expect } from "vitest";
import {
  bookingServiceSchema,
  bookingAvailabilitySchema,
  bookingSchema,
  bookingStatusEnum,
} from "@/lib/validators/bookings";

describe("bookingStatusEnum", () => {
  it("should accept valid statuses", () => {
    const statuses = ["pending", "confirmed", "cancelled", "completed", "no_show"];
    for (const status of statuses) {
      expect(bookingStatusEnum.safeParse(status).success).toBe(true);
    }
  });

  it("should reject invalid status", () => {
    expect(bookingStatusEnum.safeParse("invalid").success).toBe(false);
  });
});

describe("bookingServiceSchema", () => {
  it("should accept valid service", () => {
    const result = bookingServiceSchema.safeParse({
      name: "Taglio capelli",
      duration_minutes: 30,
      price: 25.0,
    });
    expect(result.success).toBe(true);
  });

  it("should reject duration 0", () => {
    const result = bookingServiceSchema.safeParse({
      name: "Test",
      duration_minutes: 0,
      price: 10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative price", () => {
    const result = bookingServiceSchema.safeParse({
      name: "Test",
      duration_minutes: 30,
      price: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingAvailabilitySchema", () => {
  it("should accept valid availability", () => {
    const result = bookingAvailabilitySchema.safeParse({
      day_of_week: 1,
      start_time: "09:00",
      end_time: "18:00",
    });
    expect(result.success).toBe(true);
  });

  it("should reject day_of_week > 6", () => {
    const result = bookingAvailabilitySchema.safeParse({
      day_of_week: 7,
      start_time: "09:00",
      end_time: "18:00",
    });
    expect(result.success).toBe(false);
  });

  it("should reject day_of_week < 0", () => {
    const result = bookingAvailabilitySchema.safeParse({
      day_of_week: -1,
      start_time: "09:00",
      end_time: "18:00",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid time format", () => {
    const result = bookingAvailabilitySchema.safeParse({
      day_of_week: 1,
      start_time: "9:00",
      end_time: "18:00",
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingSchema", () => {
  it("should accept valid booking", () => {
    const result = bookingSchema.safeParse({
      service_id: "550e8400-e29b-41d4-a716-446655440000",
      customer_name: "Mario Rossi",
      customer_email: "mario@example.com",
      booking_date: "2025-06-15",
      start_time: "10:00",
      end_time: "10:30",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = bookingSchema.safeParse({
      service_id: "550e8400-e29b-41d4-a716-446655440000",
      customer_name: "Mario Rossi",
      customer_email: "not-email",
      booking_date: "2025-06-15",
      start_time: "10:00",
      end_time: "10:30",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid date format", () => {
    const result = bookingSchema.safeParse({
      service_id: "550e8400-e29b-41d4-a716-446655440000",
      customer_name: "Mario Rossi",
      customer_email: "mario@example.com",
      booking_date: "15/06/2025",
      start_time: "10:00",
      end_time: "10:30",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short customer name", () => {
    const result = bookingSchema.safeParse({
      service_id: "550e8400-e29b-41d4-a716-446655440000",
      customer_name: "M",
      customer_email: "mario@example.com",
      booking_date: "2025-06-15",
      start_time: "10:00",
      end_time: "10:30",
    });
    expect(result.success).toBe(false);
  });
});
