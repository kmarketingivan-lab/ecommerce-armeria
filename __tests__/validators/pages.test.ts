import { describe, it, expect } from "vitest";
import { pageSchema } from "@/lib/validators/pages";

describe("pageSchema", () => {
  it("should accept valid page", () => {
    const result = pageSchema.safeParse({
      title: "Chi siamo",
      slug: "chi-siamo",
      content: "La nostra storia...",
    });
    expect(result.success).toBe(true);
  });

  it("should reject short title", () => {
    const result = pageSchema.safeParse({
      title: "A",
      slug: "a",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid slug", () => {
    const result = pageSchema.safeParse({
      title: "Test Page",
      slug: "Test Page!",
    });
    expect(result.success).toBe(false);
  });

  it("should default is_published to false", () => {
    const result = pageSchema.safeParse({
      title: "Draft Page",
      slug: "draft-page",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_published).toBe(false);
    }
  });
});
