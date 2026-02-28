import { createClient } from "@/lib/supabase/server";
import type { Media } from "@/types/database";

/**
 * Get media files, optionally filtered by folder.
 * @param folder - Optional folder name to filter by
 * @returns Array of media files
 */
export async function getMedia(folder?: string): Promise<Media[]> {
  const supabase = await createClient();

  let query = supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (folder) {
    query = query.eq("folder", folder);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Media[];
}

/**
 * Get a single media file by ID.
 * @param id - Media UUID
 * @returns Media or null
 */
export async function getMediaById(id: string): Promise<Media | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Media;
}
