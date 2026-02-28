import { getBookingServices } from "@/lib/dal/bookings";
import { BookingWizard } from "@/components/storefront/booking-wizard";

export default async function BookingsPage() {
  const services = await getBookingServices();

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Prenota un appuntamento</h1>
      <p className="mt-2 text-gray-600">Scegli un servizio, seleziona la data e prenota.</p>

      {services.length > 0 ? (
        <BookingWizard
          services={services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            duration_minutes: s.duration_minutes,
            priceFormatted: formatPrice(s.price),
          }))}
        />
      ) : (
        <div className="mt-12 text-center text-gray-500">
          <p className="text-lg">Nessun servizio disponibile al momento</p>
        </div>
      )}
    </div>
  );
}
