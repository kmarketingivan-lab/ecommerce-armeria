import { describe, it, expect, vi, beforeEach } from "vitest";

// Fluent mock helper for Supabase chained queries
function createFluentMock(resolveValue: Record<string, unknown> = {}) {
  const mock: Record<string, ReturnType<typeof vi.fn>> = {};

  const terminalResult = {
    data: resolveValue.data ?? [],
    count: resolveValue.count ?? 0,
    error: resolveValue.error ?? null,
  };

  const handler: ProxyHandler<Record<string, ReturnType<typeof vi.fn>>> = {
    get(_target, prop: string) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve(terminalResult);
      }
      if (!mock[prop]) {
        mock[prop] = vi.fn(() => new Proxy({}, handler));
      }
      return mock[prop];
    },
  };

  mock.range = vi.fn(() => Promise.resolve(terminalResult));
  mock.limit = vi.fn(() => Promise.resolve(terminalResult));
  mock.single = vi.fn(() => Promise.resolve(terminalResult));

  return { proxy: new Proxy({}, handler), mock };
}

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

vi.mock("@/lib/auth/helpers", () => ({
  requireAdmin: vi.fn(async () => ({ id: "admin-1", email: "admin@test.com", role: "admin" })),
}));

vi.mock("@/lib/utils/audit", () => ({
  logAuditEvent: vi.fn(),
}));

vi.mock("@/lib/utils/sanitize", () => ({
  sanitizeHtml: vi.fn((html: string) => html), // pass-through for test
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { createPost, togglePublished as toggleBlogPublished } from "@/app/(admin)/admin/blog/actions";
import { createPage, togglePublished as togglePagePublished } from "@/app/(admin)/admin/pages/actions";
import { getPublishedPosts, getPostBySlug } from "@/lib/dal/blog";
import { getPageBySlug } from "@/lib/dal/pages";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

describe("Content Management Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Blog post lifecycle", () => {
    it("should create a blog post as draft", async () => {
      const insertMock = createFluentMock({ data: { id: "post-1" } });
      mockFrom.mockReturnValue(insertMock.proxy);

      const fd = makeFormData({
        title: "Test Post",
        slug: "test-post",
        excerpt: "A test excerpt",
        rich_content: "<p>Hello world</p>",
        tags: "news, test",
      });

      const result = await createPost(fd);
      expect(result).toEqual({ success: true });
    });

    it("should fail with invalid slug", async () => {
      const fd = makeFormData({
        title: "Test Post",
        slug: "INVALID SLUG!",
        rich_content: "<p>Hello</p>",
        tags: "",
      });

      const result = await createPost(fd);
      expect("error" in result).toBe(true);
    });

    it("should toggle post to published", async () => {
      const getMock = createFluentMock({
        data: { is_published: false },
      });
      const updateMock = createFluentMock({});

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return getMock.proxy;
        return updateMock.proxy;
      });

      const result = await toggleBlogPublished("post-1");
      expect(result).toEqual({ success: true });
    });

    it("should fetch published posts from DAL", async () => {
      const posts = [
        {
          id: "post-1",
          title: "Published Post",
          slug: "published-post",
          excerpt: "An excerpt",
          content: null,
          rich_content: "<p>Content</p>",
          cover_image_url: null,
          author_id: "admin-1",
          is_published: true,
          published_at: "2025-01-15",
          seo_title: null,
          seo_description: null,
          tags: ["news"],
          created_at: "2025-01-15",
          updated_at: "2025-01-15",
        },
      ];

      const mock = createFluentMock({ data: posts, count: 1 });
      mockFrom.mockReturnValue(mock.proxy);

      const result = await getPublishedPosts({ page: 1, perPage: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.title).toBe("Published Post");
      expect(result.count).toBe(1);
    });

    it("should fetch a single post by slug", async () => {
      const post = {
        id: "post-1",
        title: "Test Post",
        slug: "test-post",
        is_published: true,
      };

      const mock = createFluentMock({ data: post });
      mockFrom.mockReturnValue(mock.proxy);

      const result = await getPostBySlug("test-post");
      expect(result).not.toBeNull();
      expect(result?.slug).toBe("test-post");
    });
  });

  describe("Page lifecycle", () => {
    it("should create a page", async () => {
      const insertMock = createFluentMock({ data: { id: "page-1" } });
      mockFrom.mockReturnValue(insertMock.proxy);

      const fd = makeFormData({
        title: "Chi Siamo",
        slug: "chi-siamo",
        rich_content: "<p>La nostra storia</p>",
      });

      const result = await createPage(fd);
      expect(result).toEqual({ success: true });
    });

    it("should toggle page to published", async () => {
      const getMock = createFluentMock({
        data: { is_published: false },
      });
      const updateMock = createFluentMock({});

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return getMock.proxy;
        return updateMock.proxy;
      });

      const result = await togglePagePublished("page-1");
      expect(result).toEqual({ success: true });
    });

    it("should fetch page by slug from DAL", async () => {
      const page = {
        id: "page-1",
        title: "Chi Siamo",
        slug: "chi-siamo",
        is_published: true,
        rich_content: "<p>La nostra storia</p>",
      };

      const mock = createFluentMock({ data: page });
      mockFrom.mockReturnValue(mock.proxy);

      const result = await getPageBySlug("chi-siamo");
      expect(result).not.toBeNull();
      expect(result?.title).toBe("Chi Siamo");
    });

    it("should return null for non-existent page slug", async () => {
      const mock = createFluentMock({
        data: null,
        error: { code: "PGRST116", message: "Not found" },
      });
      mockFrom.mockReturnValue(mock.proxy);

      const result = await getPageBySlug("does-not-exist");
      expect(result).toBeNull();
    });
  });
});
