"use server";

import { revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";
import { settingUpdateSchema } from "@/lib/validators/site-settings";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";

/**
 * Update a single site setting.
 * @param key - Setting key
 * @param value - New value
 * @returns Success or error result
 */
export async function updateSetting(
  key: string,
  value: unknown
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const parsed = settingUpdateSchema.safeParse({ key, value });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .update({ value: parsed.data.value })
      .eq("key", parsed.data.key);

    if (error) {
      logger.error("Failed to update setting", { error: error.message });
      return { error: "Errore nell'aggiornamento dell'impostazione" };
    }

    await logAuditEvent(admin.id, "update", "site_setting", key, undefined, { value });
    revalidateTag("site-settings", { expire: 0 });
    return { success: true };
  } catch (err) {
    logger.error("updateSetting error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Update multiple site settings at once.
 * @param settings - Array of {key, value} pairs
 * @returns Success or error result
 */
export async function updateSettings(
  settings: { key: string; value: unknown }[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    for (const { key, value } of settings) {
      const parsed = settingUpdateSchema.safeParse({ key, value });
      if (!parsed.success) {
        return { error: `Impostazione "${key}" non valida: ${parsed.error.issues[0]?.message}` };
      }

      const { error } = await supabase
        .from("site_settings")
        .update({ value: parsed.data.value })
        .eq("key", parsed.data.key);

      if (error) {
        return { error: `Errore nell'aggiornamento di "${key}"` };
      }
    }

    await logAuditEvent(admin.id, "update_bulk", "site_settings", "bulk", undefined, { keys: settings.map((s) => s.key) });
    revalidateTag("site-settings", { expire: 0 });
    return { success: true };
  } catch (err) {
    logger.error("updateSettings error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
