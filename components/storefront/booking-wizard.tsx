"use client";

import { useState } from "react";
import { BookingCalendar } from "./booking-calendar";
import { BookingForm } from "./booking-form";

interface ServiceOption {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  priceFormatted: string;
}

interface BookingWizardProps {
  services: ServiceOption[];
}

/**
 * Multi-step booking wizard: select service -> select date/slot -> fill form.
 */
function BookingWizard({ services }: BookingWizardProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start_time: string; end_time: string } | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="mt-8 space-y-8">
      {/* Step 1: Select service */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. Scegli un servizio</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedServiceId(service.id);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              className={`rounded-lg border p-4 text-left transition-all ${
                selectedServiceId === service.id
                  ? "border-red-700 bg-red-50 ring-2 ring-red-700"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <h3 className="font-medium text-gray-900">{service.name}</h3>
              {service.description && (
                <p className="mt-1 text-sm text-gray-500">{service.description}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="font-semibold text-gray-900">{service.priceFormatted}</span>
                <span className="text-gray-500">{service.duration_minutes} min</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Select date and time */}
      {selectedServiceId && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Scegli data e orario</h2>
          <div className="mt-4">
            <BookingCalendar
              serviceId={selectedServiceId}
              onSelectSlot={(date, slot) => {
                setSelectedDate(date);
                setSelectedSlot(slot);
              }}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
            />
          </div>
        </section>
      )}

      {/* Step 3: Fill booking form */}
      {selectedServiceId && selectedDate && selectedSlot && selectedService && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Completa la prenotazione</h2>
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{selectedService.name}</span> &mdash;{" "}
              {selectedDate} dalle {selectedSlot.start_time} alle {selectedSlot.end_time}
            </p>
          </div>
          <div className="mt-4">
            <BookingForm
              serviceId={selectedServiceId}
              bookingDate={selectedDate}
              startTime={selectedSlot.start_time}
              endTime={selectedSlot.end_time}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export { BookingWizard };
