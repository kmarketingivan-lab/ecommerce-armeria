"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { categorySchema } from "@/lib/validators/categories";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";
import { stripUndefined } from "@/lib/utils/supabase-helpers";

/**
 * Create a new category.
 * @param formData - Category form data
 * @returns Success or error result
 */
export async function createCategory(
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || null,
      image_url: formData.get("image_url") || null,
      parent_id: formData.get("parent_id") || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") !== "false",
    };

    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert(stripUndefined(parsed.data))
      .select("id")
      .single();

    if (error) {
      logger.error("Failed to create category", { error: error.message });
      return { error: "Errore nella creazione della categoria" };
    }

    await logAuditEvent(admin.id, "create", "category", data.id, undefined, parsed.data as Record<string, unknown>);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    logger.error("createCategory error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Update an existing category.
 * @param id - Category ID
 * @param formData - Updated category form data
 * @returns Success or error result
 */
export async function updateCategory(
  id: string,
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || null,
      image_url: formData.get("image_url") || null,
      parent_id: formData.get("parent_id") || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") !== "false",
    };

    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("categories")
      .update(stripUndefined(parsed.data))
      .eq("id", id);

    if (error) {
      logger.error("Failed to update category", { error: error.message });
      return { error: "Errore nell'aggiornamento della categoria" };
    }

    await logAuditEvent(admin.id, "update", "category", id, undefined, parsed.data as Record<string, unknown>);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    logger.error("updateCategory error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Delete a category.
 * @param id - Category ID
 * @returns Success or error result
 */
export async function deleteCategory(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Failed to delete category", { error: error.message });
      return { error: "Errore nell'eliminazione della categoria" };
    }

    await logAuditEvent(admin.id, "delete", "category", id);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    logger.error("deleteCategory error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Reorder categories.
 * @param ids - Array of category IDs in desired order
 * @returns Success or error result
 */
export async function reorderCategories(
  ids: string[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const updates = ids.map((id, index) =>
      supabase
        .from("categories")
        .update({ sort_order: index })
        .eq("id", id)
    );

    const results = await Promise.all(updates);
    const hasError = results.find((r) => r.error);

    if (hasError) {
      return { error: "Errore nel riordinamento" };
    }

    await logAuditEvent(admin.id, "reorder", "categories", "bulk", undefined, { order: ids });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    logger.error("reorderCategories error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
