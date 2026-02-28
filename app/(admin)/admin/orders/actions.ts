"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { logAuditEvent } from "@/lib/utils/audit";
import { logger } from "@/lib/utils/logger";

/** Valid order status transitions */
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
};

/**
 * Update order status with transition validation.
 * @param id - Order ID
 * @param newStatus - New status
 * @returns Success or error result
 */
export async function updateOrderStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    if (!order) {
      return { error: "Ordine non trovato" };
    }

    const currentStatus = order.status;
    const allowed = VALID_TRANSITIONS[currentStatus];

    if (!allowed || !allowed.includes(newStatus)) {
      return {
        error: `Transizione non valida: ${currentStatus} → ${newStatus}`,
      };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      logger.error("Failed to update order status", { error: error.message });
      return { error: "Errore nell'aggiornamento dello stato" };
    }

    await logAuditEvent(admin.id, "update_status", "order", id, { status: currentStatus }, { status: newStatus });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    logger.error("updateOrderStatus error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}

/**
 * Cancel an order.
 * @param id - Order ID
 * @returns Success or error result
 */
export async function cancelOrder(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  return updateOrderStatus(id, "cancelled");
}

/**
 * Add a note to an order.
 * @param id - Order ID
 * @param note - Note text
 * @returns Success or error result
 */
export async function addOrderNote(
  id: string,
  note: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { data: order } = await supabase
      .from("orders")
      .select("notes")
      .eq("id", id)
      .single();

    if (!order) {
      return { error: "Ordine non trovato" };
    }

    const existingNotes = order.notes ?? "";
    const timestamp = new Date().toISOString();
    const updatedNotes = existingNotes
      ? `${existingNotes}\n\n[${timestamp}] ${note}`
      : `[${timestamp}] ${note}`;

    const { error } = await supabase
      .from("orders")
      .update({ notes: updatedNotes })
      .eq("id", id);

    if (error) {
      return { error: "Errore nell'aggiunta della nota" };
    }

    await logAuditEvent(admin.id, "add_note", "order", id, undefined, { note });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    logger.error("addOrderNote error", { error: err instanceof Error ? err.message : "Unknown" });
    return { error: "Errore interno del server" };
  }
}
