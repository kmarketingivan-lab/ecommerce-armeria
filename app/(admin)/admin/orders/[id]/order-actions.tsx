"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { updateOrderStatus, addOrderNote } from "../actions";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
};

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  notes: string | null;
}

function OrderActions({ orderId, currentStatus, notes }: OrderActionsProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [noteText, setNoteText] = useState("");

  const allowedTransitions = VALID_TRANSITIONS[currentStatus] ?? [];

  const handleStatusChange = useCallback(async (newStatus: string) => {
    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setLoading(false);
    if ("error" in result) {
      addToast("error", result.error);
    } else {
      addToast("success", `Stato aggiornato a: ${newStatus}`);
      router.refresh();
    }
  }, [orderId, addToast, router]);

  const handleAddNote = useCallback(async () => {
    if (!noteText.trim()) return;
    setLoading(true);
    const result = await addOrderNote(orderId, noteText.trim());
    setLoading(false);
    if ("error" in result) {
      addToast("error", result.error);
    } else {
      addToast("success", "Nota aggiunta");
      setNoteText("");
      router.refresh();
    }
  }, [orderId, noteText, addToast, router]);

  return (
    <div className="space-y-6">
      {/* Status transitions */}
      {allowedTransitions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Cambia stato</h2>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => (
              <Button
                key={status}
                variant={status === "cancelled" ? "danger" : "secondary"}
                size="sm"
                loading={loading}
                onClick={() => void handleStatusChange(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Note</h2>
        {notes && (
          <pre className="mb-4 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm text-gray-700">
            {notes}
          </pre>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              label=""
              placeholder="Aggiungi una nota..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
          <Button onClick={() => void handleAddNote()} loading={loading} size="sm">
            Aggiungi
          </Button>
        </div>
      </div>
    </div>
  );
}

export { OrderActions };
