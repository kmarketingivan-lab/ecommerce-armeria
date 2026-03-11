"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";
import { blogPostSchema } from "@/lib/validators/blog-posts";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";
import { stripUndefined } from "@/lib/utils/supabase-helpers";

/**
 * Create a new blog post.
 * @param formData - Post form data
 * @returns Success or error result
 */
export async function createPost(
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const tagsRaw = formData.get("tags");
    const tags = tagsRaw ? String(tagsRaw).split(",").map((t) => t.trim()).filter(Boolean) : [];

    const contentRaw = formData.get("content") ? String(formData.get("content")) : null;
    const autoExcerpt = contentRaw ? contentRaw.slice(0, 160) : null;

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || autoExcerpt,
      content: contentRaw,
      rich_content: formData.get("rich_content")
        ? sanitizeHtml(String(formData.get("rich_content")))
        : null,
      cover_image_url: formData.get("cover_image_url") || null,
      is_published: formData.get("is_published") === "true",
      seo_title: formData.get("seo_title") || null,
      seo_description: formData.get("seo_description") || null,
      tags,
    };

    const parsed = blogPostSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = createAdminClient();
    const insertData = stripUndefined({
      ...parsed.data,
      author_id: admin.id,
      published_at: parsed.data.is_published ? new Date().toISOString() : null,
    });

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      logger.error("Failed to create post", { error: error.message });
      return { error: "Errore nella creazione del post" };
    }

    await logAuditEvent(admin.id, "create", "blog_post", data.id, undefined, insertData as Record<string, unknown>);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (err) {
    logger.error("createPost error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Update a blog post.
 * @param id - Post ID
 * @param formData - Updated post form data
 * @returns Success or error result
 */
export async function updatePost(
  id: string,
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const tagsRaw = formData.get("tags");
    const tags = tagsRaw ? String(tagsRaw).split(",").map((t) => t.trim()).filter(Boolean) : [];

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || null,
      content: formData.get("content") || null,
      rich_content: formData.get("rich_content")
        ? sanitizeHtml(String(formData.get("rich_content")))
        : null,
      cover_image_url: formData.get("cover_image_url") || null,
      is_published: formData.get("is_published") === "true",
      seo_title: formData.get("seo_title") || null,
      seo_description: formData.get("seo_description") || null,
      tags,
    };

    const parsed = blogPostSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("blog_posts")
      .update(stripUndefined(parsed.data))
      .eq("id", id);

    if (error) {
      return { error: "Errore nell'aggiornamento del post" };
    }

    await logAuditEvent(admin.id, "update", "blog_post", id, undefined, parsed.data as Record<string, unknown>);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (err) {
    logger.error("updatePost error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Delete a blog post.
 * @param id - Post ID
 * @returns Success or error result
 */
export async function deletePost(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) return { error: "Errore nell'eliminazione del post" };

    await logAuditEvent(admin.id, "delete", "blog_post", id);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (err) {
    logger.error("deletePost error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Toggle blog post published status.
 * @param id - Post ID
 * @returns Success or error result
 */
export async function togglePublished(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const { data: post } = await supabase
      .from("blog_posts")
      .select("is_published")
      .eq("id", id)
      .single();

    if (!post) return { error: "Post non trovato" };

    const newPublished = !post.is_published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) return { error: "Errore nel cambio stato" };

    await logAuditEvent(admin.id, "toggle_published", "blog_post", id);
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (err) {
    logger.error("togglePublished error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
