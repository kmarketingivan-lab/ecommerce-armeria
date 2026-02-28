import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/types/database";

/**
 * Get all pages (admin view).
 * @returns Array of all pages
 */
export async function getPages(): Promise<Page[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Page[];
}

/**
 * Get a page by slug.
 * @param slug - The page slug
 * @returns Page or null
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Page;
}

/**
 * Get all published pages.
 * @returns Array of published pages
 */
export async function getPublishedPages(): Promise<Page[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Page[];
}
