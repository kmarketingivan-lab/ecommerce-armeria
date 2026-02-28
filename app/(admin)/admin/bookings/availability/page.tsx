import { requireAdmin } from "@/lib/auth/helpers";
import { createClient } from "@/lib/supabase/server";
import type { BookingAvailability } from "@/types/database";
import { AvailabilityManager } from "./availability-manager";

const DAYS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

export default async function AvailabilityPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_availability")
    .select("*")
    .order("day_of_week", { ascending: true });

  const availability = (data ?? []) as BookingAvailability[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Disponibilità settimanale</h1>
      <AvailabilityManager availability={availability} dayNames={DAYS} />
    </div>
  );
}
