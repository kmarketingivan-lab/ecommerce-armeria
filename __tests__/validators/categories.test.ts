import { describe, it, expect } from "vitest";
import { categorySchema } from "@/lib/validators/categories";

describe("categorySchema", () => {
  it("should accept valid category", () => {
    const result = categorySchema.safeParse({
      name: "Elettronica",
      slug: "elettronica",
    });
    expect(result.success).toBe(true);
  });

  it("should accept category with all fields", () => {
    const result = categorySchema.safeParse({
      name: "Elettronica",
      slug: "elettronica",
      description: "Prodotti elettronici",
      image_url: "https://example.com/img.jpg",
      parent_id: "550e8400-e29b-41d4-a716-446655440000",
      sort_order: 5,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject name shorter than 2 chars", () => {
    const result = categorySchema.safeParse({
      name: "A",
      slug: "a",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with spaces", () => {
    const result = categorySchema.safeParse({
      name: "Test Category",
      slug: "test category",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with uppercase", () => {
    const result = categorySchema.safeParse({
      name: "Test",
      slug: "Test-Slug",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with special characters", () => {
    const result = categorySchema.safeParse({
      name: "Test",
      slug: "test_slug!",
    });
    expect(result.success).toBe(false);
  });

  it("should accept slug with numbers and hyphens", () => {
    const result = categorySchema.safeParse({
      name: "Category 42",
      slug: "category-42",
    });
    expect(result.success).toBe(true);
  });

  it("should default is_active to true", () => {
    const result = categorySchema.safeParse({
      name: "Test",
      slug: "test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_active).toBe(true);
    }
  });
});
