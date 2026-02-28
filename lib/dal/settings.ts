import { createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/types/database";
import { unstable_cache } from "next/cache";

/**
 * Get all site settings.
 * @returns Array of all settings
 */
export async function getSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*");

  if (error) throw error;
  return (data ?? []) as SiteSetting[];
}

/**
 * Get a single setting by key.
 * @param key - Setting key
 * @returns Setting value or null
 */
export async function getSetting(key: string): Promise<unknown> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return (data as SiteSetting | null)?.value ?? null;
}

/**
 * Get public settings (cached).
 * Uses Next.js unstable_cache with tag-based revalidation.
 * @returns Map of setting key to value
 */
export const getPublicSettings = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) throw error;

    const settingsMap: Record<string, unknown> = {};
    for (const setting of (data ?? []) as SiteSetting[]) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  },
  ["public-settings"],
  { tags: ["site-settings"], revalidate: 3600 }
);
