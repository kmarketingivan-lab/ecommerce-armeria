import { describe, it, expect } from "vitest";
import { productImageSchema } from "@/lib/validators/product-images";

describe("productImageSchema", () => {
  it("should accept valid product image", () => {
    const result = productImageSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      url: "https://example.com/image.jpg",
      alt_text: "Product photo",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid product_id", () => {
    const result = productImageSchema.safeParse({
      product_id: "not-a-uuid",
      url: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid url", () => {
    const result = productImageSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should default is_primary to false", () => {
    const result = productImageSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      url: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_primary).toBe(false);
    }
  });
});
