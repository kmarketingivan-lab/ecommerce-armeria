import { describe, it, expect } from "vitest";
import { blogPostSchema } from "@/lib/validators/blog-posts";

describe("blogPostSchema", () => {
  it("should accept valid blog post", () => {
    const result = blogPostSchema.safeParse({
      title: "Il mio primo post",
      slug: "il-mio-primo-post",
      content: "Contenuto del post...",
      tags: ["news", "intro"],
    });
    expect(result.success).toBe(true);
  });

  it("should accept post without tags", () => {
    const result = blogPostSchema.safeParse({
      title: "Post senza tag",
      slug: "post-senza-tag",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it("should reject invalid slug", () => {
    const result = blogPostSchema.safeParse({
      title: "Test Post",
      slug: "Invalid Slug!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short title", () => {
    const result = blogPostSchema.safeParse({
      title: "A",
      slug: "a",
    });
    expect(result.success).toBe(false);
  });

  it("should accept tags as array of strings", () => {
    const result = blogPostSchema.safeParse({
      title: "Tagged Post",
      slug: "tagged-post",
      tags: ["tag1", "tag2", "tag3"],
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty string tag", () => {
    const result = blogPostSchema.safeParse({
      title: "Tagged Post",
      slug: "tagged-post",
      tags: ["valid", ""],
    });
    expect(result.success).toBe(false);
  });
});
