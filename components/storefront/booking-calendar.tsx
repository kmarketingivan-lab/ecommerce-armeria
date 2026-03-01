"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface BookingCalendarProps {
  serviceId: string;
  onSelectSlot: (date: string, slot: TimeSlot) => void;
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
}

/**
 * Calendar for selecting a booking date and time slot.
 * Fetches available slots from server when a date is clicked.
 */
function BookingCalendar({ serviceId, onSelectSlot, selectedDate, selectedSlot }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding days for start of week (Monday = 0)
  const startDayOfWeek = (getDay(monthStart) + 6) % 7; // Convert Sunday=0 to Monday=0
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const fetchSlots = useCallback(async (dateStr: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings/slots?date=${dateStr}&serviceId=${serviceId}`);
      if (res.ok) {
        const data = await res.json() as TimeSlot[];
        setSlots(data);
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    }
    setLoadingSlots(false);
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate) {
      void fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const handleDayClick = (day: Date) => {
    if (isBefore(day, today)) return;
    const dateStr = format(day, "yyyy-MM-dd");
    onSelectSlot(dateStr, { start_time: "", end_time: "" }); // Reset slot, keep date
    void fetchSlots(dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-sm font-semibold text-gray-900">
            {format(currentMonth, "MMMM yyyy", { locale: it })}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {dayNames.map((name) => (
            <div key={name} className="py-1 text-center text-xs font-medium text-gray-500">
              {name}
            </div>
          ))}
          {paddingDays.map((i) => (
            <div key={`pad-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isPast = isBefore(day, today);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={() => handleDayClick(day)}
                className={`rounded-lg py-2 text-center text-sm transition-colors ${
                  isSelected
                    ? "bg-red-700 font-semibold text-white"
                    : isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Orari disponibili per il {selectedDate}
          </h4>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Caricamento...
            </div>
          ) : slots.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => {
                const isSlotSelected =
                  selectedSlot?.start_time === slot.start_time &&
                  selectedSlot?.end_time === slot.end_time;

                return (
                  <button
                    key={`${slot.start_time}-${slot.end_time}`}
                    type="button"
                    onClick={() => onSelectSlot(selectedDate, slot)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      isSlotSelected
                        ? "border-red-500 bg-red-700 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50"
                    }`}
                  >
                    {slot.start_time} - {slot.end_time}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nessun orario disponibile per questa data</p>
          )}
        </div>
      )}
    </div>
  );
}

export { BookingCalendar };
