"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { confirmBooking, cancelBooking, completeBooking, markNoShow } from "../actions";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = useCallback(
    async (action: (id: string) => Promise<{ success: boolean } | { error: string }>, label: string) => {
      setLoading(true);
      const result = await action(bookingId);
      setLoading(false);
      if ("error" in result) {
        addToast("error", result.error);
      } else {
        addToast("success", label);
        router.refresh();
      }
    },
    [bookingId, addToast, router]
  );

  if (currentStatus === "completed" || currentStatus === "cancelled" || currentStatus === "no_show") {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Azioni</h2>
      <div className="flex flex-wrap gap-2">
        {currentStatus === "pending" && (
          <Button size="sm" onClick={() => void handleAction(confirmBooking, "Prenotazione confermata")} loading={loading}>
            Conferma
          </Button>
        )}
        {(currentStatus === "pending" || currentStatus === "confirmed") && (
          <Button size="sm" variant="danger" onClick={() => void handleAction(cancelBooking, "Prenotazione annullata")} loading={loading}>
            Annulla
          </Button>
        )}
        {currentStatus === "confirmed" && (
          <>
            <Button size="sm" variant="secondary" onClick={() => void handleAction(completeBooking, "Prenotazione completata")} loading={loading}>
              Completa
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void handleAction(markNoShow, "Segnato come no-show")} loading={loading}>
              No-show
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export { BookingActions };
