import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types/database";

interface GetPostsOptions {
  page?: number;
  perPage?: number;
  isPublished?: boolean;
}

interface PaginatedPosts {
  data: BlogPost[];
  count: number;
}

/**
 * Get blog posts with optional filtering.
 * @param options - Filtering options
 * @returns Paginated posts
 */
export async function getPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedPosts> {
  const { page = 1, perPage = 20, isPublished } = options;
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" });

  if (isPublished !== undefined) {
    query = query.eq("is_published", isPublished);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data ?? []) as BlogPost[],
    count: count ?? 0,
  };
}

/**
 * Get a blog post by slug.
 * @param slug - The post slug
 * @returns Post or null
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as BlogPost;
}

/**
 * Get published posts with pagination.
 * @param options - Pagination options
 * @returns Paginated published posts
 */
export async function getPublishedPosts(
  options: { page?: number; perPage?: number } = {}
): Promise<PaginatedPosts> {
  return getPosts({ ...options, isPublished: true });
}

/**
 * Get posts by tag.
 * @param tag - Tag to filter by
 * @returns Array of posts with that tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .contains("tags", [tag])
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}
