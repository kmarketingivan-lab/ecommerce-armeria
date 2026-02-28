import { requireAdmin } from "@/lib/auth/helpers";
import { getBookingById } from "@/lib/dal/bookings";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { BookingActions } from "./booking-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Prenotazione</h1>
        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Dettagli</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">Data:</dt><dd className="text-gray-900">{booking.booking_date}</dd></div>
            <div><dt className="text-gray-500">Orario:</dt><dd className="text-gray-900">{booking.start_time} - {booking.end_time}</dd></div>
            {booking.notes && <div><dt className="text-gray-500">Note:</dt><dd className="text-gray-900">{booking.notes}</dd></div>}
          </dl>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Cliente</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">Nome:</dt><dd className="text-gray-900">{booking.customer_name}</dd></div>
            <div><dt className="text-gray-500">Email:</dt><dd className="text-gray-900">{booking.customer_email}</dd></div>
            {booking.customer_phone && <div><dt className="text-gray-500">Telefono:</dt><dd className="text-gray-900">{booking.customer_phone}</dd></div>}
          </dl>
        </div>
      </div>

      <BookingActions bookingId={booking.id} currentStatus={booking.status} />
    </div>
  );
}
