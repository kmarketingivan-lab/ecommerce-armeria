import { describe, it, expect } from "vitest";
import { productVariantSchema } from "@/lib/validators/product-variants";

describe("productVariantSchema", () => {
  it("should accept valid variant", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Rosso XL",
      attributes: { color: "rosso", size: "XL" },
    });
    expect(result.success).toBe(true);
  });

  it("should accept variant with price adjustment", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Premium",
      price_adjustment: 5.0,
      stock_quantity: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative stock quantity", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test",
      stock_quantity: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-string attribute values", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test",
      attributes: { color: 123 },
    });
    expect(result.success).toBe(false);
  });

  it("should default attributes to empty object", () => {
    const result = productVariantSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attributes).toEqual({});
    }
  });
});
