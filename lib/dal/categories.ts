import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

/**
 * Get all categories.
 * @returns Array of categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

/**
 * Get a category by slug.
 * @param slug - The category slug
 * @returns Category or null
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Category;
}

/**
 * Get category tree with parent/children relationships.
 * @returns Array of top-level categories with children
 */
export async function getCategoryTree(): Promise<
  (Category & { children: Category[] })[]
> {
  const allCategories = await getCategories();
  const topLevel = allCategories.filter((c) => !c.parent_id);

  return topLevel.map((parent) => ({
    ...parent,
    children: allCategories.filter((c) => c.parent_id === parent.id),
  }));
}
