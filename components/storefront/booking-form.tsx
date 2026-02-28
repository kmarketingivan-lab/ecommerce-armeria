"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createBooking } from "@/app/(admin)/admin/bookings/actions";

interface BookingFormProps {
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

/**
 * Form for completing a booking with customer details.
 */
function BookingForm({ serviceId, bookingDate, startTime, endTime }: BookingFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("service_id", serviceId);
    formData.set("booking_date", bookingDate);
    formData.set("start_time", startTime);
    formData.set("end_time", endTime);

    const result = await createBooking(formData);
    setLoading(false);

    if ("error" in result) {
      addToast("error", result.error);
    } else {
      addToast("success", "Prenotazione confermata!");
      router.push("/bookings?success=true");
    }
  }, [serviceId, bookingDate, startTime, endTime, addToast, router]);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" name="customer_name" required />
        <Input label="Email" name="customer_email" type="email" required />
        <Input label="Telefono" name="customer_phone" type="tel" />
      </div>
      <Textarea label="Note (opzionale)" name="notes" placeholder="Richieste particolari..." />
      <Button type="submit" loading={loading}>
        Conferma prenotazione
      </Button>
    </form>
  );
}

export { BookingForm };
