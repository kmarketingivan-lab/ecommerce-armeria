import { describe, it, expect } from "vitest";
import {
  siteNameSchema,
  contactEmailSchema,
  taxRateSchema,
  currencySchema,
  addressSettingSchema,
} from "@/lib/validators/site-settings";

describe("siteNameSchema", () => {
  it("should accept valid site name", () => {
    expect(siteNameSchema.safeParse("My Ecommerce").success).toBe(true);
  });

  it("should reject empty site name", () => {
    expect(siteNameSchema.safeParse("").success).toBe(false);
  });
});

describe("contactEmailSchema", () => {
  it("should accept valid email", () => {
    expect(contactEmailSchema.safeParse("info@example.com").success).toBe(true);
  });

  it("should reject invalid email", () => {
    expect(contactEmailSchema.safeParse("not-email").success).toBe(false);
  });
});

describe("taxRateSchema", () => {
  it("should accept 22% (Italian IVA)", () => {
    expect(taxRateSchema.safeParse(22).success).toBe(true);
  });

  it("should accept 0%", () => {
    expect(taxRateSchema.safeParse(0).success).toBe(true);
  });

  it("should reject > 100%", () => {
    expect(taxRateSchema.safeParse(101).success).toBe(false);
  });

  it("should reject negative", () => {
    expect(taxRateSchema.safeParse(-1).success).toBe(false);
  });
});

describe("currencySchema", () => {
  it("should accept EUR", () => {
    expect(currencySchema.safeParse("EUR").success).toBe(true);
  });

  it("should reject 2-char code", () => {
    expect(currencySchema.safeParse("EU").success).toBe(false);
  });

  it("should reject 4-char code", () => {
    expect(currencySchema.safeParse("EURO").success).toBe(false);
  });
});

describe("addressSettingSchema", () => {
  it("should accept valid address", () => {
    const result = addressSettingSchema.safeParse({
      street: "Via Roma 1",
      city: "Milano",
      zip: "20121",
      country: "IT",
    });
    expect(result.success).toBe(true);
  });

  it("should reject incomplete address", () => {
    const result = addressSettingSchema.safeParse({
      street: "Via Roma 1",
      city: "Milano",
    });
    expect(result.success).toBe(false);
  });
});
