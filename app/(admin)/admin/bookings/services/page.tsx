import { requireAdmin } from "@/lib/auth/helpers";
import { getBookingServices } from "@/lib/dal/bookings";
import { ServicesManager } from "./services-manager";

export default async function BookingServicesPage() {
  await requireAdmin();
  const services = await getBookingServices();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Servizi prenotabili</h1>
      <ServicesManager services={services} />
    </div>
  );
}
