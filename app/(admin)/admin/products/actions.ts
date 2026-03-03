"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { productSchema, parseCategoryId } from "@/lib/validators/products";
import { slugify } from "@/lib/utils/slugify";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";
import { sanitizeHtml } from "@/lib/utils/sanitize";

/** Extract and normalize all product fields from FormData */
function extractProductFields(formData: FormData) {
  // Checkboxes: only present in FormData when checked
  const isActive = formData.get("is_active") === "true";
  const isFeatured = formData.get("is_featured") === "true";

  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: formData.get("description") ? String(formData.get("description")) : null,
    rich_description: formData.get("rich_description")
      ? sanitizeHtml(String(formData.get("rich_description")))
      : null,
    price: Number(formData.get("price") ?? 0),
    compare_at_price: formData.get("compare_at_price")
      ? Number(formData.get("compare_at_price"))
      : null,
    cost_price: formData.get("cost_price")
      ? Number(formData.get("cost_price"))
      : null,
    sku: formData.get("sku") ? String(formData.get("sku")) : null,
    barcode: formData.get("barcode") ? String(formData.get("barcode")) : null,
    stock_quantity: Number(formData.get("stock_quantity") ?? 0),
    low_stock_threshold: Number(formData.get("low_stock_threshold") ?? 5),
    weight_grams: formData.get("weight_grams")
      ? Number(formData.get("weight_grams"))
      : null,
    product_type: String(formData.get("product_type") ?? "standard"),
    is_active: isActive,
    is_featured: isFeatured,
    seo_title: formData.get("seo_title") ? String(formData.get("seo_title")) : null,
    seo_description: formData.get("seo_description")
      ? String(formData.get("seo_description"))
      : null,
  };

  // category_id: handled outside Zod to avoid v4 union issues
  const category_id = parseCategoryId(formData.get("category_id"));

  // Extra fields not in base schema
  let specifications: Record<string, unknown> | null = null;
  const specsStr = formData.get("specifications");
  if (specsStr) {
    try { specifications = JSON.parse(String(specsStr)) as Record<string, unknown>; } catch { /* skip */ }
  }

  const regulatory_info = formData.get("regulatory_info")
    ? String(formData.get("regulatory_info"))
    : null;

  const brand_id = formData.get("brand_id")
    ? String(formData.get("brand_id"))
    : null;

  return { raw, category_id, specifications, regulatory_info, brand_id };
}

export async function createProduct(
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const { raw, category_id, specifications, regulatory_info, brand_id } =
      extractProductFields(formData);

    // Auto-generate slug if empty
    if (!raw.slug) raw.slug = slugify(raw.name);

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Dati non validi";
      logger.error("createProduct validation failed", { issues: parsed.error.issues });
      return { error: msg };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({
        ...parsed.data,
        category_id,
        specifications,
        regulatory_info,
        brand_id,
      } as any)
      .select("id")
      .single();

    if (error) {
      logger.error("Failed to create product", { error: error.message });
      return { error: `Errore DB: ${error.message}` };
    }

    await logAuditEvent(admin.id, "create", "product", data.id, undefined, parsed.data as Record<string, unknown>);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("createProduct error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const { raw, category_id, specifications, regulatory_info, brand_id } =
      extractProductFields(formData);

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Dati non validi";
      logger.error("updateProduct validation failed", { issues: parsed.error.issues });
      return { error: msg };
    }

    const supabase = await createClient();

    const { data: oldProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("products")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({
        ...parsed.data,
        category_id,
        specifications,
        regulatory_info,
        brand_id,
      } as any)
      .eq("id", id);

    if (error) {
      logger.error("Failed to update product", { error: error.message });
      return { error: `Errore DB: ${error.message}` };
    }

    await logAuditEvent(
      admin.id,
      "update",
      "product",
      id,
      oldProduct as Record<string, unknown> | undefined,
      parsed.data as Record<string, unknown>
    );
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return { success: true };
  } catch (err) {
    logger.error("updateProduct error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) return { error: "Errore nell'eliminazione del prodotto" };

    await logAuditEvent(admin.id, "soft_delete", "product", id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("deleteProduct error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function toggleProductActive(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { data: product } = await supabase
      .from("products")
      .select("is_active")
      .eq("id", id)
      .single();

    if (!product) return { error: "Prodotto non trovato" };

    const newActive = !(product as { is_active: boolean }).is_active;
    const { error } = await supabase
      .from("products")
      .update({ is_active: newActive })
      .eq("id", id);

    if (error) return { error: "Errore nel cambio stato" };

    await logAuditEvent(admin.id, "toggle_active", "product", id, { is_active: !newActive }, { is_active: newActive });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("toggleProductActive error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function updateProductStock(
  id: string,
  quantity: number
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    if (!Number.isInteger(quantity) || quantity < 0)
      return { error: "La quantità deve essere un intero non negativo" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: quantity })
      .eq("id", id);

    if (error) return { error: "Errore nell'aggiornamento dello stock" };

    await logAuditEvent(admin.id, "update_stock", "product", id, undefined, { stock_quantity: quantity });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("updateProductStock error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function reorderProductImages(
  productId: string,
  imageIds: string[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const updates = imageIds.map((imageId, index) =>
      supabase
        .from("product_images")
        .update({ sort_order: index })
        .eq("id", imageId)
        .eq("product_id", productId)
    );

    const results = await Promise.all(updates);
    if (results.some((r) => r.error)) return { error: "Errore nel riordinamento delle immagini" };

    await logAuditEvent(admin.id, "reorder_images", "product", productId, undefined, { image_order: imageIds });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("reorderProductImages error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function bulkUpdateProducts(
  ids: string[],
  isActive: boolean
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .in("id", ids);

    if (error) return { error: "Errore nell'aggiornamento massivo" };
    await logAuditEvent(admin.id, "bulk_update", "products", "bulk", undefined, { ids, is_active: isActive });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("bulkUpdateProducts error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

export async function bulkDeleteProducts(
  ids: string[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .in("id", ids);

    if (error) return { error: "Errore nell'eliminazione massiva" };
    await logAuditEvent(admin.id, "bulk_delete", "products", "bulk", undefined, { ids });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("bulkDeleteProducts error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
