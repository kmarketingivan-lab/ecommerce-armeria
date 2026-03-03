"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/helpers";
import { mediaUploadSchema, mediaAltTextSchema, ALL_ALLOWED_MIMES } from "@/lib/validators/media";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";
import { nanoid } from "nanoid";

/**
 * Upload a media file.
 * Validates MIME type and size, generates safe filename, uploads to Storage, inserts DB record.
 * @param formData - FormData with file and metadata
 * @returns Success or error result
 */
export async function uploadMedia(
  formData: FormData
): Promise<{ success: boolean; id?: string } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const file = formData.get("file") as File | null;

    if (!file) {
      return { error: "Nessun file selezionato" };
    }

    // Server-side MIME validation
    if (!ALL_ALLOWED_MIMES.includes(file.type as typeof ALL_ALLOWED_MIMES[number])) {
      return { error: `Tipo file non supportato: ${file.type}` };
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const safeFilename = `${nanoid()}.${ext}`;
    const folder = String(formData.get("folder") ?? "general");

    const validationData = {
      filename: safeFilename,
      original_filename: file.name,
      mime_type: file.type as typeof ALL_ALLOWED_MIMES[number],
      size_bytes: file.size,
      alt_text: formData.get("alt_text") ? String(formData.get("alt_text")) : null,
      folder,
    };

    const parsed = mediaUploadSchema.safeParse(validationData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = createAdminClient();

    // Upload to Supabase Storage
    const storagePath = `${folder}/${safeFilename}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, file);

    if (uploadError) {
      logger.error("Storage upload failed", { error: uploadError.message });
      return { error: "Errore nel caricamento del file" };
    }

    const { data: urlData } = supabase.storage
      .from("media")
      .getPublicUrl(storagePath);

    // Insert DB record
    const { data, error: dbError } = await supabase
      .from("media")
      .insert({
        filename: safeFilename,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        url: urlData.publicUrl,
        alt_text: parsed.data.alt_text ?? null,
        folder,
        uploaded_by: admin.id,
      })
      .select("id")
      .single();

    if (dbError) {
      logger.error("Media DB insert failed", { error: dbError.message });
      return { error: "Errore nel salvataggio dei metadati" };
    }

    await logAuditEvent(admin.id, "upload", "media", data.id, undefined, { filename: safeFilename, mime_type: file.type });
    revalidatePath("/admin/media");
    return { success: true, id: data.id };
  } catch (err) {
    logger.error("uploadMedia error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Delete a media file from Storage and DB.
 * @param id - Media ID
 * @returns Success or error result
 */
export async function deleteMedia(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    // Get file info to delete from storage
    const { data: media } = await supabase
      .from("media")
      .select("filename, folder")
      .eq("id", id)
      .single();

    if (!media) return { error: "File non trovato" };

    const m = media as { filename: string; folder: string };

    // Delete from storage
    const storagePath = `${m.folder}/${m.filename}`;
    await supabase.storage.from("media").remove([storagePath]);

    // Delete from DB
    const { error } = await supabase.from("media").delete().eq("id", id);

    if (error) return { error: "Errore nell'eliminazione del file" };

    await logAuditEvent(admin.id, "delete", "media", id);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    logger.error("deleteMedia error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Update alt text for a media file.
 * @param id - Media ID
 * @param altText - New alt text
 * @returns Success or error result
 */
export async function updateMediaAlt(
  id: string,
  altText: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();

    const parsed = mediaAltTextSchema.safeParse({ alt_text: altText });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("media")
      .update({ alt_text: parsed.data.alt_text })
      .eq("id", id);

    if (error) return { error: "Errore nell'aggiornamento" };

    await logAuditEvent(admin.id, "update_alt", "media", id, undefined, { alt_text: parsed.data.alt_text });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    logger.error("updateMediaAlt error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
