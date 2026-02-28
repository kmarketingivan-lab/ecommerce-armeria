import { describe, it, expect, vi, beforeEach } from "vitest";

// Fluent mock helper — every proxy in the chain is thenable,
// resolving to terminalResult when awaited.
function createFluentMock(resolveValue: Record<string, unknown> = {}) {
  const mock: Record<string, ReturnType<typeof vi.fn>> = {};

  const terminalResult = {
    data: resolveValue.data ?? [],
    count: resolveValue.count ?? 0,
    error: resolveValue.error ?? null,
  };

  const handler: ProxyHandler<Record<string, ReturnType<typeof vi.fn>>> = {
    get(_target, prop: string) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve(terminalResult);
      }
      if (!mock[prop]) {
        mock[prop] = vi.fn(() => new Proxy({}, handler));
      }
      return mock[prop];
    },
  };

  const resolve = () => Promise.resolve(terminalResult);
  mock.range = vi.fn(() => resolve());
  mock.limit = vi.fn(() => resolve());
  mock.single = vi.fn(() => resolve());

  return { proxy: new Proxy({}, handler), mock };
}

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

// Must import after mock setup
import { getAvailableSlots } from "@/lib/dal/bookings";

describe("DAL Bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAvailableSlots", () => {
    it("should return slots when no conflicts exist", async () => {
      // First call: availability
      const availMock = createFluentMock({
        data: [{ id: "1", day_of_week: 1, start_time: "09:00", end_time: "12:00", is_active: true }],
      });

      // Second call: service
      const serviceMock = createFluentMock({
        data: { duration_minutes: 60 },
      });

      // Third call: existing bookings
      const bookingsMock = createFluentMock({ data: [] });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return availMock.proxy;
        if (callCount === 2) return serviceMock.proxy;
        return bookingsMock.proxy;
      });

      const slots = await getAvailableSlots("2025-06-16", "service-1");
      // 09:00-10:00, 10:00-11:00, 11:00-12:00
      expect(slots).toHaveLength(3);
      expect(slots[0]).toEqual({ start_time: "09:00", end_time: "10:00" });
      expect(slots[1]).toEqual({ start_time: "10:00", end_time: "11:00" });
      expect(slots[2]).toEqual({ start_time: "11:00", end_time: "12:00" });
    });

    it("should exclude conflicting slots", async () => {
      const availMock = createFluentMock({
        data: [{ id: "1", day_of_week: 1, start_time: "09:00", end_time: "12:00", is_active: true }],
      });

      const serviceMock = createFluentMock({
        data: { duration_minutes: 60 },
      });

      // One booking at 10:00-11:00
      const bookingsMock = createFluentMock({
        data: [{ start_time: "10:00", end_time: "11:00" }],
      });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return availMock.proxy;
        if (callCount === 2) return serviceMock.proxy;
        return bookingsMock.proxy;
      });

      const slots = await getAvailableSlots("2025-06-16", "service-1");
      // Only 09:00-10:00 and 11:00-12:00 (10:00-11:00 is booked)
      expect(slots).toHaveLength(2);
      expect(slots[0]).toEqual({ start_time: "09:00", end_time: "10:00" });
      expect(slots[1]).toEqual({ start_time: "11:00", end_time: "12:00" });
    });

    it("should return empty for day with no availability", async () => {
      const availMock = createFluentMock({ data: [] });

      mockFrom.mockReturnValue(availMock.proxy);

      const slots = await getAvailableSlots("2025-06-22", "service-1"); // Sunday
      expect(slots).toHaveLength(0);
    });

    it("should return empty when day is fully booked", async () => {
      const availMock = createFluentMock({
        data: [{ id: "1", day_of_week: 1, start_time: "09:00", end_time: "10:00", is_active: true }],
      });

      const serviceMock = createFluentMock({
        data: { duration_minutes: 60 },
      });

      const bookingsMock = createFluentMock({
        data: [{ start_time: "09:00", end_time: "10:00" }],
      });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return availMock.proxy;
        if (callCount === 2) return serviceMock.proxy;
        return bookingsMock.proxy;
      });

      const slots = await getAvailableSlots("2025-06-16", "service-1");
      expect(slots).toHaveLength(0);
    });
  });
});
