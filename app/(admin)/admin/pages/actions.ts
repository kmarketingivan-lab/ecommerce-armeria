"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { pageSchema } from "@/lib/validators/pages";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";
import { stripUndefined } from "@/lib/utils/supabase-helpers";

/**
 * Create a new page.
 * @param formData - Page form data
 * @returns Success or error result
 */
export async function createPage(
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content") || null,
      rich_content: formData.get("rich_content")
        ? sanitizeHtml(String(formData.get("rich_content")))
        : null,
      seo_title: formData.get("seo_title") || null,
      seo_description: formData.get("seo_description") || null,
      is_published: formData.get("is_published") === "true",
    };

    const parsed = pageSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = await createClient();
    const insertData = stripUndefined({
      ...parsed.data,
      published_at: parsed.data.is_published ? new Date().toISOString() : null,
    });

    const { data, error } = await supabase
      .from("pages")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      logger.error("Failed to create page", { error: error.message });
      return { error: "Errore nella creazione della pagina" };
    }

    await logAuditEvent(admin.id, "create", "page", data.id, undefined, insertData as Record<string, unknown>);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (err) {
    logger.error("createPage error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Update an existing page.
 * @param id - Page ID
 * @param formData - Updated page form data
 * @returns Success or error result
 */
export async function updatePage(
  id: string,
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content") || null,
      rich_content: formData.get("rich_content")
        ? sanitizeHtml(String(formData.get("rich_content")))
        : null,
      seo_title: formData.get("seo_title") || null,
      seo_description: formData.get("seo_description") || null,
      is_published: formData.get("is_published") === "true",
    };

    const parsed = pageSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("pages")
      .update(stripUndefined(parsed.data))
      .eq("id", id);

    if (error) {
      logger.error("Failed to update page", { error: error.message });
      return { error: "Errore nell'aggiornamento della pagina" };
    }

    await logAuditEvent(admin.id, "update", "page", id, undefined, parsed.data as Record<string, unknown>);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (err) {
    logger.error("updatePage error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Delete a page.
 * @param id - Page ID
 * @returns Success or error result
 */
export async function deletePage(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from("pages").delete().eq("id", id);

    if (error) {
      return { error: "Errore nell'eliminazione della pagina" };
    }

    await logAuditEvent(admin.id, "delete", "page", id);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (err) {
    logger.error("deletePage error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Toggle page published status.
 * @param id - Page ID
 * @returns Success or error result
 */
export async function togglePublished(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { data: page } = await supabase
      .from("pages")
      .select("is_published")
      .eq("id", id)
      .single();

    if (!page) return { error: "Pagina non trovata" };

    const newPublished = !page.is_published;
    const { error } = await supabase
      .from("pages")
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) return { error: "Errore nel cambio stato" };

    await logAuditEvent(admin.id, "toggle_published", "page", id, { is_published: page.is_published }, { is_published: newPublished });
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (err) {
    logger.error("togglePublished error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
