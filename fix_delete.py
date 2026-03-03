import sys

content = open('app/(admin)/admin/products/actions.ts', encoding='utf-8').read()

old = """export async function bulkDeleteProducts(
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
}"""

new = """export async function bulkDeleteProducts(
  ids: string[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    // Delete related images first
    await supabase.from("product_images").delete().in("product_id", ids);

    // Hard delete
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (error) return { error: "Errore nell'eliminazione massiva: " + error.message };
    await logAuditEvent(admin.id, "bulk_delete", "products", "bulk", undefined, { ids });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    logger.error("bulkDeleteProducts error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}"""

if old in content:
    content = content.replace(old, new)
    open('app/(admin)/admin/products/actions.ts', 'w', encoding='utf-8').write(content)
    print('Fixed bulk')
else:
    print('Pattern not found')
