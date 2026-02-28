import { describe, it, expect } from "vitest";
import { mediaUploadSchema } from "@/lib/validators/media";

describe("mediaUploadSchema", () => {
  it("should accept valid JPEG upload", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.jpg",
      original_filename: "photo.jpg",
      mime_type: "image/jpeg",
      size_bytes: 1024 * 1024, // 1MB
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid PNG upload", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.png",
      original_filename: "screenshot.png",
      mime_type: "image/png",
      size_bytes: 2 * 1024 * 1024, // 2MB
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid WebP upload", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.webp",
      original_filename: "image.webp",
      mime_type: "image/webp",
      size_bytes: 500 * 1024, // 500KB
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid SVG upload", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.svg",
      original_filename: "icon.svg",
      mime_type: "image/svg+xml",
      size_bytes: 10 * 1024, // 10KB
    });
    expect(result.success).toBe(true);
  });

  it("should accept valid PDF upload", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.pdf",
      original_filename: "document.pdf",
      mime_type: "application/pdf",
      size_bytes: 10 * 1024 * 1024, // 10MB
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid MIME type", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.exe",
      original_filename: "virus.exe",
      mime_type: "application/x-msdownload",
      size_bytes: 1024,
    });
    expect(result.success).toBe(false);
  });

  it("should reject image over 5MB", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.jpg",
      original_filename: "huge.jpg",
      mime_type: "image/jpeg",
      size_bytes: 6 * 1024 * 1024, // 6MB
    });
    expect(result.success).toBe(false);
  });

  it("should reject PDF over 20MB", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.pdf",
      original_filename: "huge.pdf",
      mime_type: "application/pdf",
      size_bytes: 21 * 1024 * 1024, // 21MB
    });
    expect(result.success).toBe(false);
  });

  it("should accept PDF at exactly 20MB", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.pdf",
      original_filename: "max.pdf",
      mime_type: "application/pdf",
      size_bytes: 20 * 1024 * 1024, // 20MB
    });
    expect(result.success).toBe(true);
  });

  it("should reject GIF (not in whitelist)", () => {
    const result = mediaUploadSchema.safeParse({
      filename: "abc123.gif",
      original_filename: "animation.gif",
      mime_type: "image/gif",
      size_bytes: 1024,
    });
    expect(result.success).toBe(false);
  });
});
